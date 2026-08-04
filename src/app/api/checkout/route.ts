import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getServiceClient } from "@/lib/auth/helpers";
import { OrdersRepository } from "@/lib/repositories/orders.repository";
import { CheckoutService } from "@/lib/services/checkout.service";
import { checkoutPayloadSchema } from "@/lib/validations/checkout.schema";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const authHeader = req.headers.get("authorization");
    const bearerToken = authHeader?.replace("Bearer ", "");

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {},
          remove(name: string, options: any) {},
        },
      },
    );

    let user = null;

    if (bearerToken) {
      const { data: { user: tokenUser } } = await supabase.auth.getUser(bearerToken);
      user = tokenUser;
    }

    if (!user) {
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      user = cookieUser;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please log in and try again." },
        { status: 401 },
      );
    }

    // Validate request body with Zod
    const body = await req.json();
    const parsed = checkoutPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation error" },
        { status: 400 },
      );
    }

    const { items, customerInfo } = parsed.data;

    logger.info("Checkout request received", {
      source: "checkout",
      itemsCount: items.length,
    });

    // === Instantiate service chain (service client bypasses RLS) ===
    const ordersRepo = new OrdersRepository(getServiceClient());
    const checkoutService = new CheckoutService(ordersRepo);

    // === Business Logic via Service ===
    const order = await checkoutService.createOrder(user.id, customerInfo, items);
    await checkoutService.createOrderItems(order.id, items);

    try {
      const result = await checkoutService.createMercadoPagoPreference(order, items, customerInfo);
      return NextResponse.json({
        id: result.preferenceId,
        init_point: result.initPoint,
      });
    } catch (mpError: unknown) {
      const error = mpError as Error & { status?: number; response?: unknown };
      logger.error("MercadoPago preference creation error", error, { source: "checkout" });

      const errorMessage = error?.message || "Error creating MercadoPago preference";

      // Rollback: mark order as failed
      await checkoutService.markOrderFailed(order.id, errorMessage);

      const errorStatus = error?.status || 500;
      return NextResponse.json(
        {
          error: "Failed to create payment preference",
          details: errorMessage,
        },
        { status: errorStatus >= 400 && errorStatus < 600 ? errorStatus : 500 },
      );
    }
  } catch (error) {
    logger.error("Checkout API error", error instanceof Error ? error : undefined, { source: "checkout" });
    return NextResponse.json(
      {
        error: "Failed to process checkout",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// GET method to retrieve existing order/preference
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");

    if (!orderId) {
      return NextResponse.json(
        { success: true, message: "Endpoint de checkout activo. Podes enviar ?order_id=... para ver detalles de una orden." },
      );
    }

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {},
          remove(name: string, options: any) {},
        },
      },
    );

    // User-scoped repo respects RLS
    const ordersRepo = new OrdersRepository(supabase);
    const checkoutService = new CheckoutService(ordersRepo);

    const orderData = await checkoutService.getOrder(orderId);

    if (!orderData) {
      return NextResponse.json(
        { error: "Orden no encontrada." },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, ...orderData });
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 },
    );
  }
}
