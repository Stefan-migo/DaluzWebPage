import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { OrdersService } from "@/lib/services/orders.service";
import type { ManualOrderData } from "@/lib/services/orders.service";

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
    console.error("Admin orders API error:", error);
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
    const { action } = body;

    if (action === "get_stats") {
      console.log("📊 Getting order statistics...");
      const stats = await service.getStats();
      return NextResponse.json({ success: true, stats });
    }

    if (action === "create_manual_order") {
      console.log("📝 Creating manual order...");
      const { orderData } = body as { orderData: ManualOrderData };

      if (!orderData.email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
      }

      if (!orderData.total_amount || orderData.total_amount <= 0) {
        return NextResponse.json(
          { error: "Total amount must be greater than 0" },
          { status: 400 },
        );
      }

      const newOrder = await service.createManualOrder(orderData);
      return NextResponse.json({ success: true, order: newOrder });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("❌ Admin orders POST error:", error);
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
    console.error("Admin orders DELETE error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
