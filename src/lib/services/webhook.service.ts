import { MercadoPagoConfig, Payment } from "mercadopago";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago/config";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { ProductsRepository } from "@/lib/repositories/products.repository";
import { SystemRepository } from "@/lib/repositories/system.repository";
import { OrderPaymentService } from "./order-payment.service";

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
  approved: "paid",
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

export class WebhookService {
  constructor(
    private ordersRepo: OrdersRepository,
    private productsRepo: ProductsRepository,
    private systemRepo: SystemRepository,
  ) {}

  /**
   * Log webhook receipt in the database.
   */
  async logWebhook(
    body: WebhookPayload,
    status: "pending" | "success" | "failed",
    options?: { responseCode?: number; errorMessage?: string },
  ): Promise<void> {
    try {
      await this.systemRepo.insertWebhookLog({
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
      await this.systemRepo.updateLatestPendingWebhookLog({
        status,
        response_code: options?.responseCode || (status === "success" ? 200 : 500),
        error_message: options?.errorMessage,
        processed_at: new Date().toISOString(),
      });
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

    // Idempotency: if this payment was already processed for this order, skip
    // post-approval side-effects (email, inventory, treasures) to avoid duplicates
    const existingOrder = await this.ordersRepo.findById(orderId);
    const alreadyApproved =
      existingOrder &&
      String(existingOrder.mercadopago_payment_id) === String(paymentId) &&
      ["paid", "completed", "processing", "shipped", "delivered"].includes(existingOrder.status);

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
    try {
      await this.ordersRepo.update(orderId, updateData as unknown as Record<string, unknown>);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order");
    }

    // Post-approval actions — skip if already processed (idempotency)
    if (paymentInfo.status === "approved" && !alreadyApproved) {
      // Los efectos del cobro viven en OrderPaymentService porque tambien los
      // usa la confirmacion manual de transferencias desde el panel.
      const paymentService = new OrderPaymentService(
        this.ordersRepo,
        this.productsRepo,
      );
      await paymentService.confirmOrderPayment(orderId);
      await this.grantTreasures(orderId);
    }

    console.log(
      `Order ${orderId} updated to status: ${orderStatus} (MP status: ${paymentInfo.status})`,
    );
  }

  // sendConfirmationEmail y updateInventory se movieron a
  // OrderPaymentService.confirmOrderPayment: tener dos copias garantizaba que
  // el camino de MercadoPago y el de transferencia se desincronizaran.

  /**
   * Grant treasure access to user based on products purchased.
   */
  async grantTreasures(orderId: string): Promise<void> {
    try {
      const orderData = await this.ordersRepo.findById(orderId);

      if (!orderData?.user_id) return;

      const treasureResults = await this.systemRepo.grantTreasures(
        orderData.user_id,
        orderId,
      );

      console.log(
        `Treasures granted to user ${orderData.user_id}:`,
        treasureResults,
      );
    } catch (treasureError) {
      console.error("Error in tesoro grant process:", treasureError);
    }
  }

  /**
   * Get the webhook secret from database or env.
   */
  async getWebhookSecret(): Promise<string | undefined> {
    try {
      const configs = await this.systemRepo.getConfigs([
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
