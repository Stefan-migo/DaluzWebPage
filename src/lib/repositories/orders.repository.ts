import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Types
// ============================================

export interface OrderListFilters {
  status?: string | null;
  limit: number;
  offset: number;
}

// ============================================
// Repository
// ============================================

export class OrdersRepository {
  constructor(private supabase: SupabaseClient) {}

  // ---- Orders ----

  async insert(data: Record<string, unknown>) {
    const { data: order, error } = await this.supabase
      .from("orders")
      .insert(data)
      .select()
      .single();

    if (error) throw error;
    return order;
  }

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async findByIdWithItems(id: string) {
    const { data, error } = await this.supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          product_name,
          variant_title
        )
      `)
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async update(id: string, data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  async remove(id: string): Promise<void> {
    const { error } = await this.supabase
      .from("orders")
      .delete()
      .eq("id", id);

    if (error) throw error;
  }

  async list(filters: OrderListFilters): Promise<{
    data: any[];
    count: number | null;
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

    const { data, error, count } = await query;
    if (error) throw error;
    return { data: data || [], count };
  }

  async getAllStatuses(): Promise<{ status: string }[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("status");

    if (error) throw error;
    return data || [];
  }

  async getPaidRevenueSince(since: string): Promise<{ total_amount: number }[]> {
    const { data, error } = await this.supabase
      .from("orders")
      .select("total_amount")
      .eq("payment_status", "paid")
      .gte("created_at", since);

    if (error) throw error;
    return data || [];
  }

  async getRecent(limit: number) {
    const { data, error } = await this.supabase
      .from("orders")
      .select("id, order_number, email, status, total_amount, created_at")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  }

  // ---- Order Items ----

  async insertItems(items: Record<string, unknown>[]): Promise<void> {
    const { error } = await this.supabase
      .from("order_items")
      .insert(items);

    if (error) throw error;
  }

  async getItemsByOrderId(orderId: string) {
    const { data, error } = await this.supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (error) throw error;
    return data || [];
  }

  async removeItemsByOrderId(orderId: string): Promise<void> {
    const { error } = await this.supabase
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (error) throw error;
  }
}
