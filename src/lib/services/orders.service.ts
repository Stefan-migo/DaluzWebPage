import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Types
// ============================================

export interface OrderFilters {
  status?: string | null;
  limit: number;
  offset: number;
}

export interface ManualOrderData {
  email: string;
  total_amount: number;
  status?: string;
  payment_status?: string;
  subtotal?: number;
  payment_method?: string;
  notes?: string;
  shipping?: {
    first_name?: string;
    last_name?: string;
    address_1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    phone?: string;
  };
  items?: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    product_name: string;
    variant_title?: string;
  }>;
}

interface TransformedOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
  mp_payment_id: string | null;
  mp_payment_method: string | null;
  mp_payment_type: string | null;
  order_items: unknown[];
}

// ============================================
// Service
// ============================================

export class OrdersService {
  constructor(private supabase: SupabaseClient) {}

  /**
   * List orders with pagination and optional status filter.
   */
  async listOrders(filters: OrderFilters): Promise<{
    orders: TransformedOrder[];
    total: number;
    offset: number;
    limit: number;
  }> {
    let query = this.supabase
      .from("orders")
      .select(
        `
        id,
        order_number,
        email,
        status,
        payment_status,
        total_amount,
        currency,
        created_at,
        updated_at,
        mp_payment_id,
        mp_payment_method,
        mp_payment_type,
        order_items (
          id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `,
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(filters.offset, filters.offset + filters.limit - 1);

    if (filters.status && filters.status !== "all") {
      query = query.eq("status", filters.status);
    }

    const { data: orders, error, count } = await query;

    if (error) {
      console.error("Error fetching admin orders:", error);
      throw new Error("Failed to fetch orders");
    }

    const transformedOrders: TransformedOrder[] = (orders || []).map((order: Record<string, unknown>) => ({
      id: order.id as string,
      order_number: order.order_number as string,
      customer_name: "Cliente",
      customer_email: order.email as string,
      total_amount: order.total_amount as number,
      status: order.status as string,
      payment_status: order.payment_status as string,
      created_at: order.created_at as string,
      updated_at: order.updated_at as string,
      mp_payment_id: (order.mp_payment_id as string) || null,
      mp_payment_method: (order.mp_payment_method as string) || null,
      mp_payment_type: (order.mp_payment_type as string) || null,
      order_items: (order.order_items as unknown[]) || [],
    }));

    return {
      orders: transformedOrders,
      total: count || 0,
      offset: filters.offset,
      limit: filters.limit,
    };
  }

  /**
   * Get order statistics: counts by status, monthly revenue, and recent orders.
   */
  async getStats(): Promise<{
    orderCounts: Record<string, number>;
    totalRevenue: number;
    recentOrders: Array<{
      id: string;
      order_number: string;
      customer_name: string;
      customer_email: string;
      status: string;
      total_amount: number;
      created_at: string;
    }>;
  }> {
    // Get order counts by status
    const { data: allOrders, error: statusError } = await this.supabase
      .from("orders")
      .select("status");

    if (statusError) {
      console.error("❌ Error getting order stats:", statusError);
      throw statusError;
    }

    const statusCounts: Record<string, number> =
      allOrders?.reduce((acc: Record<string, number>, order: { status: string }) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

    // Get total revenue for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: revenueData, error: revenueError } = await this.supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", startOfMonth.toISOString());

    if (revenueError) {
      console.error("❌ Error getting revenue stats:", revenueError);
      throw revenueError;
    }

    const totalRevenue =
      revenueData?.reduce((sum: number, order: { total_amount: number }) => sum + order.total_amount, 0) || 0;

    // Get recent orders
    const { data: recentOrders, error: recentError } = await this.supabase
      .from("orders")
      .select("id, order_number, email, status, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(10);

    if (recentError) {
      console.error("❌ Error getting recent orders:", recentError);
      throw recentError;
    }

    return {
      orderCounts: statusCounts,
      totalRevenue,
      recentOrders: (recentOrders || []).map((order: Record<string, unknown>) => ({
        id: order.id as string,
        order_number: order.order_number as string,
        customer_name: "Cliente",
        customer_email: order.email as string,
        status: order.status as string,
        total_amount: order.total_amount as number,
        created_at: order.created_at as string,
      })),
    };
  }

  /**
   * Create a manual order from the admin panel.
   */
  async createManualOrder(orderData: ManualOrderData): Promise<Record<string, unknown>> {
    // Map status values (frontend uses 'completed', DB uses 'delivered')
    let dbStatus = orderData.status || "pending";
    if (dbStatus === "completed") {
      dbStatus = "delivered";
    }

    const orderNumber = `DL-${Date.now()}`;

    const { data: newOrder, error: orderError } = await this.supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        email: orderData.email,
        status: dbStatus,
        payment_status: orderData.payment_status || "paid",
        subtotal: orderData.subtotal || orderData.total_amount,
        total_amount: orderData.total_amount,
        currency: "ARS",
        mp_payment_method: orderData.payment_method || "manual",
        customer_notes: orderData.notes,
        shipping_first_name: orderData.shipping?.first_name,
        shipping_last_name: orderData.shipping?.last_name,
        shipping_address_1: orderData.shipping?.address_1,
        shipping_city: orderData.shipping?.city,
        shipping_state: orderData.shipping?.state,
        shipping_postal_code: orderData.shipping?.postal_code,
        shipping_phone: orderData.shipping?.phone,
      })
      .select()
      .single();

    if (orderError) {
      console.error("❌ Error creating manual order:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Create order items if provided
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map((item) => ({
        order_id: newOrder.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.unit_price * item.quantity,
        product_name: item.product_name,
        variant_title: item.variant_title,
      }));

      const { error: itemsError } = await this.supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("❌ Error creating order items:", itemsError);
      }
    }

    console.log("✅ Manual order created successfully:", newOrder.id);
    return newOrder;
  }

  /**
   * Delete an order by ID (items first, then order).
   */
  async deleteOrder(orderId: string): Promise<string> {
    // Verify order exists
    const { data: existingOrder, error: orderCheckError } = await this.supabase
      .from("orders")
      .select("id, order_number")
      .eq("id", orderId)
      .single();

    if (orderCheckError || !existingOrder) {
      throw new Error("Order not found");
    }

    // Delete order items first
    const { error: itemsError } = await this.supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemsError) {
      console.error("Error deleting order items:", itemsError);
      throw new Error("Failed to delete order items");
    }

    // Delete the order
    const { error: deleteError } = await this.supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (deleteError) {
      console.error("Error deleting order:", deleteError);
      throw new Error("Failed to delete order");
    }

    return existingOrder.order_number;
  }
}
