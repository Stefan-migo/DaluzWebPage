import { NextRequest, NextResponse } from "next/server";
import { getServiceClient, requireAdmin } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { ProductsRepository } from "@/lib/repositories/products.repository";
import { OrderPaymentService } from "@/lib/services/order-payment.service";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  // requireAdmin devuelve { ok: false, response } cuando rechaza, no null.
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const service = getServiceClient();
  const ordersRepo = new OrdersRepository(service);

  const order = await ordersRepo.findById(params.id);
  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  if (order.payment_method !== "bank_transfer") {
    return NextResponse.json(
      { error: "Este pedido no es por transferencia" },
      { status: 400 },
    );
  }

  if (order.payment_status !== "awaiting_transfer") {
    return NextResponse.json(
      { error: "Este pedido no esta esperando transferencia" },
      { status: 409 },
    );
  }

  const paymentService = new OrderPaymentService(
    ordersRepo,
    new ProductsRepository(service),
  );
  await paymentService.confirmOrderPayment(params.id);

  return NextResponse.json({ success: true });
}
