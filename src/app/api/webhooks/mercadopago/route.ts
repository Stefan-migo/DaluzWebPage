import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServiceClient } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { ProductsRepository } from "@/lib/repositories/products.repository";
import { SystemRepository } from "@/lib/repositories/system.repository";
import { WebhookService } from "@/lib/services/webhook.service";
import { webhookPayloadSchema } from "@/lib/validations/webhook.schema";
import { logger } from "@/lib/logger";

// ============================================
// Signature Verification
// ============================================

const verifySignature = async (
  req: NextRequest,
  webhookService: WebhookService,
): Promise<boolean> => {
  const signature = req.headers.get("x-signature");
  const timestamp = req.headers.get("x-request-id");

  if (!signature || !timestamp) return false;

  const webhookSecret = await webhookService.getWebhookSecret();
  if (!webhookSecret) return false;

  const [ts, hash] = signature.split(",");
  const signedTemplate = `id:${timestamp};ts:${ts.split("=")[1]};`;

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(signedTemplate);
  const calculatedSignature = hmac.digest("hex");

  return calculatedSignature === hash.split("=")[1];
};

// ============================================
// POST Handler — Webhook Receiver
// ============================================

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Parse + validate with Zod
  let body;
  try {
    const raw = JSON.parse(rawBody);
    const parsed = webhookPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      logger.warn("Invalid webhook payload", { source: "webhook/mp", issues: parsed.error.issues });
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
    }
    body = parsed.data;
  } catch {
    logger.warn("Error parsing webhook body", { source: "webhook/mp" });
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Instantiate service chain (service client bypasses RLS)
  const supabaseService = getServiceClient();
  const ordersRepo = new OrdersRepository(supabaseService);
  const productsRepo = new ProductsRepository(supabaseService);
  const systemRepo = new SystemRepository(supabaseService);
  const webhookService = new WebhookService(ordersRepo, productsRepo, systemRepo);

  // Verify signature in production
  if (process.env.NODE_ENV === "production") {
    const isValid = await verifySignature(req, webhookService);
    if (!isValid) {
      logger.warn("Invalid webhook signature detected", { source: "webhook/mp" });
      await webhookService.logWebhook(body, "failed", {
        responseCode: 401,
        errorMessage: "Invalid webhook signature",
      });
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  // Log receipt
  await webhookService.logWebhook(body, "pending");

  // Process payment events
  if (body.type === "payment") {
    try {
      await webhookService.processPayment(body.data.id);
      await webhookService.updateWebhookLog("success", { responseCode: 200 });
    } catch (error) {
      logger.error("Error processing payment webhook", error instanceof Error ? error : undefined, { source: "webhook/mp" });
      await webhookService.updateWebhookLog("failed", {
        responseCode: 500,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      });
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
