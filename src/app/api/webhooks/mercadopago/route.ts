// @ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import { getMercadoPagoAccessToken } from "@/lib/mercadopago/config";
import { EmailNotificationService } from "@/lib/email/notifications";

// Client will be created dynamically with database config

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Function to get webhook secret from database or env
async function getWebhookSecret() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Get test_mode and webhook secrets
    const { data: configs } = await supabase
      .from("system_config")
      .select("config_key, config_value")
      .in("config_key", [
        "mercadopago_test_mode",
        "mercadopago_webhook_secret",
        "mercadopago_test_webhook_secret",
      ]);

    if (configs && configs.length > 0) {
      const configMap: Record<string, any> = {};
      configs.forEach((config) => {
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
        webhookSecret !== "WEBHOOK_SECRET_HERE" &&
        webhookSecret !== "TEST_WEBHOOK_SECRET_HERE"
      ) {
        return webhookSecret;
      }
    }
  } catch (error) {
    console.warn(
      "Failed to load webhook secret from database, using env fallback",
    );
  }

  return process.env.MERCADOPAGO_WEBHOOK_SECRET!;
}

// Function to verify the Mercado Pago webhook signature
const verifySignature = async (req: NextRequest, rawBody: string) => {
  const signature = req.headers.get("x-signature");
  const timestamp = req.headers.get("x-request-id");

  if (!signature || !timestamp) {
    return false;
  }

  const webhookSecret = await getWebhookSecret();
  if (!webhookSecret) {
    return false;
  }

  const [ts, hash] = signature.split(",");
  const signedTemplate = `id:${timestamp};ts:${ts.split("=")[1]};`;

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(signedTemplate);
  const calculatedSignature = hmac.digest("hex");

  return calculatedSignature === hash.split("=")[1];
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Verify webhook signature for security
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch (parseError) {
    console.error("Error parsing webhook body:", parseError);
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "production") {
    const isValidSignature = await verifySignature(req, rawBody);
    if (!isValidSignature) {
      console.error("Invalid webhook signature detected");
      // Log failed webhook
      try {
        await supabaseAdmin.from("webhook_logs").insert({
          webhook_type: "mercadopago",
          event_type: body?.type || "unknown",
          payload: { error: "Invalid signature" },
          status: "failed",
          response_code: 401,
          error_message: "Invalid webhook signature",
          processed_at: new Date().toISOString(),
        });
      } catch (logError) {
        console.error("Error logging webhook:", logError);
      }
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Log webhook receipt
  try {
    await supabaseAdmin.from("webhook_logs").insert({
      webhook_type: "mercadopago",
      event_type: body?.type || "unknown",
      payload: body,
      status: "pending",
      processed_at: null,
    });
  } catch (logError) {
    console.error("Error logging webhook:", logError);
  }

  if (body.type === "payment") {
    const paymentId = body.data.id;

    // Get MercadoPago config from database (with env fallback)
    const accessToken = await getMercadoPagoAccessToken();
    const mpClient = new MercadoPagoConfig({
      accessToken,
      options: {
        timeout: 5000,
      },
    });
    const payment = new Payment(mpClient);

    try {
      const paymentInfo = await payment.get({ id: paymentId });

      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;

        // Map Mercado Pago status to our order status
        const statusMapping: Record<string, string> = {
          approved: "completed",
          pending: "pending",
          rejected: "failed",
          cancelled: "cancelled",
          refunded: "refunded",
          in_process: "processing",
          in_mediation: "disputed",
        };

        const orderStatus = statusMapping[paymentInfo.status] || "pending";

        const updateData: any = {
          status: orderStatus,
          mercadopago_payment_id: paymentId,
          payment_method: paymentInfo.payment_method_id,
          installments: paymentInfo.installments || 1,
          updated_at: new Date().toISOString(),
        };

        // Add transaction details for completed payments
        if (
          paymentInfo.status === "approved" &&
          paymentInfo.transaction_amount
        ) {
          updateData.transaction_amount = paymentInfo.transaction_amount;
          updateData.net_received_amount =
            paymentInfo.net_received_amount || paymentInfo.transaction_amount;
          updateData.fees = paymentInfo.fee_details
            ? paymentInfo.fee_details.reduce(
              (sum: number, fee: any) => sum + fee.amount,
              0,
            )
            : 0;
          // Update total_amount if not set
          if (!updateData.total_amount) {
            updateData.total_amount = paymentInfo.transaction_amount;
          }
        }

        const { error } = await supabaseAdmin
          .from("orders")
          .update(updateData)
          .eq("id", orderId);

        if (error) {
          console.error("Error updating order status:", error);
          return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 },
          );
        }

        // Send email notification for successful payment
        if (paymentInfo.status === "approved") {
          try {
            // Get order details for email
            const { data: order } = await supabaseAdmin
              .from("orders")
              .select(
                `
                *,
                order_items (
                  *,
                  product_name,
                  variant_title
                )
              `,
              )
              .eq("id", orderId)
              .single();

            if (order && order.email) {
              await EmailNotificationService.sendOrderConfirmation(order);
              console.log(`📧 Order confirmation email sent to ${order.email}`);
            }
          } catch (emailError) {
            console.error(
              "Failed to send order confirmation email:",
              emailError,
            );
            // Don't fail the webhook for email errors
          }
        }

        // If payment is approved, update product inventory AND grant tesoro access
        if (paymentInfo.status === "approved") {
          try {
            // 1. Update product inventory
            const { data: orderItems } = await supabaseAdmin
              .from("order_items")
              .select("product_id, quantity")
              .eq("order_id", orderId);

            if (orderItems && orderItems.length > 0) {
              for (const item of orderItems) {
                try {
                  // Use the inventory function or direct update if function fails
                  const { error: stockError } = await supabaseAdmin.rpc(
                    "decrease_product_stock",
                    {
                      product_id: item.product_id,
                      quantity: item.quantity,
                    },
                  );

                  if (stockError) {
                    console.warn(
                      "RPC function failed, updating inventory directly:",
                      stockError,
                    );
                    // Fallback: fetch product, decrement, and update
                    const { data: product } = await supabaseAdmin
                      .from("products")
                      .select("inventory_quantity, stock_quantity")
                      .eq("id", item.product_id)
                      .single();
                    if (product) {
                      const newInventory = Math.max(
                        0,
                        (product.inventory_quantity ?? 0) - item.quantity,
                      );
                      const newStock = Math.max(
                        0,
                        (product.stock_quantity ??
                          product.inventory_quantity ??
                          0) - item.quantity,
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
                  console.error(
                    `Failed to update inventory for product ${item.product_id}:`,
                    err,
                  );
                }
              }
            }
          } catch (inventoryError) {
            console.error("Error updating inventory:", inventoryError);
            // Don't fail the webhook for inventory errors
          }

          // 2. Grant tesoro access to user based on products purchased
          try {
            // Get order to find user_id
            const { data: orderData } = await supabaseAdmin
              .from("orders")
              .select("user_id")
              .eq("id", orderId)
              .single();

            if (orderData?.user_id) {
              // Grant treasures from order items using the RPC function
              // Note: We pass empty array since grant_treasures_from_order auto-grants tesoro-gral
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
            }
          } catch (treasureError) {
            console.error("Error in tesoro grant process:", treasureError);
            // Don't fail the webhook for tesoro errors
          }
        }

        console.log(
          `Order ${orderId} updated to status: ${orderStatus} (MP status: ${paymentInfo.status})`,
        );

        // Update webhook log to success
        try {
          await supabaseAdmin
            .from("webhook_logs")
            .update({
              status: "success",
              response_code: 200,
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
    } catch (error) {
      console.error("Error fetching payment info from Mercado Pago:", error);

      // Update webhook log to failed
      try {
        await supabaseAdmin
          .from("webhook_logs")
          .update({
            status: "failed",
            response_code: 500,
            error_message:
              error instanceof Error ? error.message : "Unknown error",
            processed_at: new Date().toISOString(),
          })
          .eq("webhook_type", "mercadopago")
          .eq("status", "pending")
          .order("created_at", { ascending: false })
          .limit(1);
      } catch (logError) {
        console.error("Error updating webhook log:", logError);
      }

      return NextResponse.json(
        { error: "Failed to process webhook" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

// GET endpoint for webhook testing
export async function GET() {
  return NextResponse.json({
    message: "Mercado Pago webhook endpoint is active",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
}
