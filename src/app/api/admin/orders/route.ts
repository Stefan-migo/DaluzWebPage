import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { OrdersService } from "@/lib/services/orders.service";
import { adminOrderActionSchema } from "@/lib/validations/orders.schema";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const ordersRepo = new OrdersRepository(auth.supabase);
    const service = new OrdersService(ordersRepo);
    const url = new URL(request.url);

    const result = await service.listOrders({
      status: url.searchParams.get("status"),
      limit: parseInt(url.searchParams.get("limit") || "50"),
      offset: parseInt(url.searchParams.get("offset") || "0"),
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    logger.error("Admin orders GET error", error instanceof Error ? error : undefined, { source: "admin/orders" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const ordersRepo = new OrdersRepository(auth.supabase);
    const service = new OrdersService(ordersRepo);
    const body = await request.json();

    // Validate with Zod
    const parsed = adminOrderActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 },
      );
    }

    if (parsed.data.action === "get_stats") {
      const stats = await service.getStats();
      return NextResponse.json({ success: true, stats });
    }

    if (parsed.data.action === "create_manual_order") {
      const newOrder = await service.createManualOrder(parsed.data.orderData);
      return NextResponse.json({ success: true, order: newOrder });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    logger.error("Admin orders POST error", error instanceof Error ? error : undefined, { source: "admin/orders" });
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;

    const ordersRepo = new OrdersRepository(auth.supabase);
    const service = new OrdersService(ordersRepo);
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("id");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    try {
      const orderNumber = await service.deleteOrder(orderId);
      return NextResponse.json({
        success: true,
        message: `Order ${orderNumber} deleted successfully`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      const status = message === "Order not found" ? 404 : 500;
      return NextResponse.json({ error: message }, { status });
    }
  } catch (error) {
    logger.error("Admin orders DELETE error", error instanceof Error ? error : undefined, { source: "admin/orders" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
