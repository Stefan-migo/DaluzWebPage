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
  dataId: string | undefined,
  webhookService: WebhookService,
): Promise<boolean> => {
  const signatureHeader = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");

  if (!signatureHeader || !requestId || !dataId) return false;

  const webhookSecret = await webhookService.getWebhookSecret();
  if (!webhookSecret) return false;

  // x-signature has the shape: "ts=<unix>,v1=<hash>"
  const parts = signatureHeader.split(",").reduce<Record<string, string>>(
    (acc, segment) => {
      const [key, value] = segment.split("=");
      if (key && value) acc[key.trim()] = value.trim();
      return acc;
    },
    {},
  );

  const ts = parts.ts;
  const receivedHash = parts.v1;
  if (!ts || !receivedHash) return false;

  // MP signs: "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
  const signedTemplate = `id:${dataId};request-id:${requestId};ts:${ts};`;

  const hmac = crypto.createHmac("sha256", webhookSecret);
  hmac.update(signedTemplate);
  const calculatedSignature = hmac.digest("hex");

  return calculatedSignature === receivedHash;
};

// ============================================
// POST Handler — Webhook Receiver
// ============================================

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // MP delivers webhooks in two shapes:
  //   1) Modern JSON body: { type: 'payment', data: { id: '...' }, ... }
  //   2) Legacy IPN with query string: ?topic=payment&id=123  (body may be empty or unrelated)
  // We normalise both into the body shape the rest of the handler expects.
  const url = new URL(req.url);
  const queryTopic = url.searchParams.get("topic") || url.searchParams.get("type");
  const queryId = url.searchParams.get("id") || url.searchParams.get("data.id");

  let parsedJson: unknown = null;
  if (rawBody) {
    try {
      parsedJson = JSON.parse(rawBody);
    } catch {
      // Body is not JSON — fall back to query params below.
    }
  }

  const normalised: Record<string, unknown> = {};
  if (parsedJson && typeof parsedJson === "object") {
    Object.assign(normalised, parsedJson);
  }
  if (!normalised.type && queryTopic) {
    normalised.type = queryTopic === "merchant_order" ? "merchant_order" : "payment";
  }
  if ((!normalised.data ||
        typeof normalised.data !== "object" ||
        (normalised.data as { id?: unknown }).id === undefined) && queryId) {
    normalised.data = { id: queryId };
  }

  const parsed = webhookPayloadSchema.safeParse(normalised);
  if (!parsed.success) {
    logger.warn("Invalid webhook payload", {
      source: "webhook/mp",
      issues: parsed.error.issues,
      receivedKeys: Object.keys(normalised),
      hadJsonBody: parsedJson !== null,
      queryTopic,
      queryId,
    });
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 },
    );
  }
  const body = parsed.data;

  // Instantiate service chain (service client bypasses RLS)
  const supabaseService = getServiceClient();
  const ordersRepo = new OrdersRepository(supabaseService);
  const productsRepo = new ProductsRepository(supabaseService);
  const systemRepo = new SystemRepository(supabaseService);
  const webhookService = new WebhookService(ordersRepo, productsRepo, systemRepo);

  // Verify signature in production
  if (process.env.NODE_ENV === "production") {
    const isValid = await verifySignature(
      req,
      body.data?.id !== undefined ? String(body.data.id) : undefined,
      webhookService,
    );
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
