import { OrdersRepository } from "@/lib/repositories/orders.repository";
import type { OrderListFilters } from "@/lib/repositories/orders.repository";

// ============================================
// Types
// ============================================

export type { OrderListFilters as OrderFilters };

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
  constructor(private ordersRepo: OrdersRepository) {}

  /**
   * List orders with pagination and optional status filter.
   */
  async listOrders(filters: OrderListFilters): Promise<{
    orders: TransformedOrder[];
    total: number;
    offset: number;
    limit: number;
  }> {
    const { data: orders, count } = await this.ordersRepo.list(filters);

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
    const allOrders = await this.ordersRepo.getAllStatuses();

    const statusCounts: Record<string, number> =
      allOrders?.reduce((acc: Record<string, number>, order: { status: string }) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

    // Get total revenue for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenueData = await this.ordersRepo.getPaidRevenueSince(
      startOfMonth.toISOString(),
    );

    const totalRevenue =
      revenueData?.reduce((sum: number, order: { total_amount: number }) => sum + order.total_amount, 0) || 0;

    // Get recent orders
    const recentOrdersRaw = await this.ordersRepo.getRecent(10);

    return {
      orderCounts: statusCounts,
      totalRevenue,
      recentOrders: (recentOrdersRaw || []).map((order: Record<string, unknown>) => ({
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

    let newOrder: Record<string, unknown>;
    try {
      newOrder = await this.ordersRepo.insert({
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
      });
    } catch (error: any) {
      console.error("❌ Error creating manual order:", error);
      throw new Error(`Failed to create order: ${error.message}`);
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

      try {
        await this.ordersRepo.insertItems(orderItems);
      } catch (itemsError) {
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
    const existingOrder = await this.ordersRepo.findById(orderId);

    if (!existingOrder) {
      throw new Error("Order not found");
    }

    // Delete order items first
    try {
      await this.ordersRepo.removeItemsByOrderId(orderId);
    } catch (error) {
      console.error("Error deleting order items:", error);
      throw new Error("Failed to delete order items");
    }

    // Delete the order
    try {
      await this.ordersRepo.remove(orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw new Error("Failed to delete order");
    }

    return existingOrder.order_number;
  }
}
