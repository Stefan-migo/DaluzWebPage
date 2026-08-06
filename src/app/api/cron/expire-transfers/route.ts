import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/auth/helpers";
import { EmailNotificationService } from "@/lib/email/notifications";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Sin el secreto, cualquiera podria cancelar pedidos ajenos llamando la URL.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const service = getServiceClient();

  const { data: expired, error } = await service
    .from("orders")
    .select(
      "id, order_number, email, shipping_first_name, shipping_last_name, total_amount",
    )
    .eq("payment_status", "awaiting_transfer")
    .lt("transfer_expires_at", new Date().toISOString());

  if (error) {
    console.error("Error buscando pedidos vencidos:", error);
    return NextResponse.json({ error: "Error de consulta" }, { status: 500 });
  }

  let cancelled = 0;

  for (const order of expired ?? []) {
    const { error: updateError } = await service
      .from("orders")
      .update({
        status: "cancelled",
        payment_status: "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)
      // Relee la condicion para no pisar un pedido que se confirmo entre la
      // consulta y este update.
      .eq("payment_status", "awaiting_transfer");

    if (updateError) {
      console.error(`No se pudo cancelar ${order.order_number}:`, updateError);
      continue;
    }

    cancelled++;

    try {
      await EmailNotificationService.sendBankTransferExpired(order as never);
    } catch (mailError) {
      console.error(
        `Fallo el mail de vencido para ${order.order_number}:`,
        mailError,
      );
    }
  }

  return NextResponse.json({ checked: expired?.length ?? 0, cancelled });
}
