import { createClient } from "@supabase/supabase-js";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago/config";
import { EmailNotificationService } from "@/lib/email/notifications";

// ============================================
// Types
// ============================================

export interface WebhookPayload {
  type: string;
  data: {
    id: string | number;
  };
  action?: string;
  api_version?: string;
  date_created?: string;
  id?: string | number;
  live_mode?: boolean;
  user_id?: string | number;
}

interface FeeDetail {
  type: string;
  amount: number;
  fee_payer: string;
}

type MercadoPagoStatus =
  | "approved"
  | "pending"
  | "rejected"
  | "cancelled"
  | "refunded"
  | "in_process"
  | "in_mediation";

interface OrderUpdateData {
  status: string;
  mercadopago_payment_id: string | number;
  payment_method: string | undefined;
  installments: number;
  updated_at: string;
  transaction_amount?: number;
  net_received_amount?: number;
  fees?: number;
  total_amount?: number;
}

// ============================================
// Constants
// ============================================

const STATUS_MAPPING: Record<MercadoPagoStatus, string> = {
  approved: "completed",
  pending: "pending",
  rejected: "failed",
  cancelled: "cancelled",
  refunded: "refunded",
  in_process: "processing",
  in_mediation: "disputed",
};

// ============================================
// Service
// ============================================

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export class WebhookService {
  /**
   * Log webhook receipt in the database.
   */
  async logWebhook(
    body: WebhookPayload,
    status: "pending" | "success" | "failed",
    options?: { responseCode?: number; errorMessage?: string },
  ): Promise<void> {
    try {
      await supabaseAdmin.from("webhook_logs").insert({
        webhook_type: "mercadopago",
        event_type: body?.type || "unknown",
        payload: status === "failed" && options?.errorMessage
          ? { error: options.errorMessage }
          : body,
        status,
        response_code: options?.responseCode,
        error_message: options?.errorMessage,
        processed_at: status !== "pending" ? new Date().toISOString() : null,
      });
    } catch (logError) {
      console.error("Error logging webhook:", logError);
    }
  }

  /**
   * Update the latest pending webhook log to a final status.
   */
  async updateWebhookLog(
    status: "success" | "failed",
    options?: { responseCode?: number; errorMessage?: string },
  ): Promise<void> {
    try {
      await supabaseAdmin
        .from("webhook_logs")
        .update({
          status,
          response_code: options?.responseCode || (status === "success" ? 200 : 500),
          error_message: options?.errorMessage,
          processed_at: new Date().toISOString(),
        })
        .eq("webhook_type", "mercadopago")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(1);
    } catch (logError) {
      console.error("Error updating webhook log:", logError);
    }
  }

  /**
   * Process a payment notification from MercadoPago.
   * Fetches payment info, updates the order, sends emails, updates inventory, and grants treasures.
   */
  async processPayment(paymentId: string | number): Promise<void> {
    const accessToken = await getMercadoPagoAccessToken();
    const mpClient = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
    const payment = new Payment(mpClient);

    const paymentInfo = await payment.get({ id: paymentId as number });

    if (!paymentInfo || !paymentInfo.external_reference) {
      console.warn("Payment info missing or no external_reference");
      return;
    }

    const orderId = paymentInfo.external_reference;
    const mpStatus = (paymentInfo.status || "pending") as MercadoPagoStatus;
    const orderStatus = STATUS_MAPPING[mpStatus] || "pending";

    // Build update data
    const updateData: OrderUpdateData = {
      status: orderStatus,
      mercadopago_payment_id: paymentId,
      payment_method: paymentInfo.payment_method_id,
      installments: paymentInfo.installments || 1,
      updated_at: new Date().toISOString(),
    };

    if (paymentInfo.status === "approved" && paymentInfo.transaction_amount) {
      updateData.transaction_amount = paymentInfo.transaction_amount;
      const paymentData = paymentInfo as unknown as Record<string, unknown>;
      updateData.net_received_amount =
        (paymentData.net_received_amount as number) || paymentInfo.transaction_amount;

      const feeDetails = paymentInfo.fee_details as FeeDetail[] | undefined;
      updateData.fees = feeDetails
        ? feeDetails.reduce((sum: number, fee: FeeDetail) => sum + fee.amount, 0)
        : 0;

      if (!updateData.total_amount) {
        updateData.total_amount = paymentInfo.transaction_amount;
      }
    }

    // Update order
    const { error } = await supabaseAdmin
      .from("orders")
      .update(updateData)
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order");
    }

    // Post-approval actions
    if (paymentInfo.status === "approved") {
      await this.sendConfirmationEmail(orderId);
      await this.updateInventory(orderId);
      await this.grantTreasures(orderId);
    }

    console.log(
      `Order ${orderId} updated to status: ${orderStatus} (MP status: ${paymentInfo.status})`,
    );
  }

  /**
   * Send order confirmation email.
   */
  private async sendConfirmationEmail(orderId: string): Promise<void> {
    try {
      const { data: order } = await supabaseAdmin
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            product_name,
            variant_title
          )
        `)
        .eq("id", orderId)
        .single();

      if (order && order.email) {
        await EmailNotificationService.sendOrderConfirmation(order);
        console.log(`📧 Order confirmation email sent to ${order.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send order confirmation email:", emailError);
    }
  }

  /**
   * Decrease product inventory after a successful payment.
   */
  async updateInventory(orderId: string): Promise<void> {
    try {
      const { data: orderItems } = await supabaseAdmin
        .from("order_items")
        .select("product_id, quantity")
        .eq("order_id", orderId);

      if (!orderItems || orderItems.length === 0) return;

      for (const item of orderItems) {
        try {
          const { error: stockError } = await supabaseAdmin.rpc(
            "decrease_product_stock",
            {
              product_id: item.product_id,
              quantity: item.quantity,
            },
          );

          if (stockError) {
            console.warn("RPC function failed, updating inventory directly:", stockError);
            const { data: product } = await supabaseAdmin
              .from("products")
              .select("inventory_quantity, stock_quantity")
              .eq("id", item.product_id)
              .single();

            if (product) {
              const newInventory = Math.max(0, (product.inventory_quantity ?? 0) - item.quantity);
              const newStock = Math.max(
                0,
                (product.stock_quantity ?? product.inventory_quantity ?? 0) - item.quantity,
              );
              await supabaseAdmin
                .from("products")
                .update({
                  inventory_quantity: newInventory,
                  stock_quantity: newStock,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", item.product_id);
            }
          }
        } catch (err) {
          console.error(`Failed to update inventory for product ${item.product_id}:`, err);
        }
      }
    } catch (inventoryError) {
      console.error("Error updating inventory:", inventoryError);
    }
  }

  /**
   * Grant treasure access to user based on products purchased.
   */
  async grantTreasures(orderId: string): Promise<void> {
    try {
      const { data: orderData } = await supabaseAdmin
        .from("orders")
        .select("user_id")
        .eq("id", orderId)
        .single();

      if (!orderData?.user_id) return;

      const { data: treasureResults, error: treasureError } =
        await supabaseAdmin.rpc("grant_treasures_from_order", {
          p_user_id: orderData.user_id,
          p_order_id: orderId,
          p_access_ids: [] as string[],
        });

      if (treasureError) {
        console.error("Error granting treasures:", treasureError);
      } else {
        console.log(
          `Treasures granted to user ${orderData.user_id}:`,
          treasureResults,
        );
      }
    } catch (treasureError) {
      console.error("Error in tesoro grant process:", treasureError);
    }
  }

  /**
   * Get the webhook secret from database or env.
   */
  async getWebhookSecret(): Promise<string | undefined> {
    try {
      const { data: configs } = await supabaseAdmin
        .from("system_config")
        .select("config_key, config_value")
        .in("config_key", [
          "mercadopago_test_mode",
          "mercadopago_webhook_secret",
          "mercadopago_test_webhook_secret",
        ]);

      if (configs && configs.length > 0) {
        const configMap: Record<string, string | boolean> = {};
        configs.forEach((config: { config_key: string; config_value: string }) => {
          try {
            configMap[config.config_key] = JSON.parse(config.config_value);
          } catch {
            configMap[config.config_key] = config.config_value;
          }
        });

        const testMode =
          configMap["mercadopago_test_mode"] === true ||
          configMap["mercadopago_test_mode"] === "true";
        const webhookSecret = testMode
          ? configMap["mercadopago_test_webhook_secret"]
          : configMap["mercadopago_webhook_secret"];

        if (
          webhookSecret &&
          typeof webhookSecret === "string" &&
          webhookSecret !== "WEBHOOK_SECRET_HERE" &&
          webhookSecret !== "TEST_WEBHOOK_SECRET_HERE"
        ) {
          return webhookSecret;
        }
      }
    } catch {
      console.warn("Failed to load webhook secret from database, using env fallback");
    }

    return process.env.MERCADOPAGO_WEBHOOK_SECRET;
  }
}
