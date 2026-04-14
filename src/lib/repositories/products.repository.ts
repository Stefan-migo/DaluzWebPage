import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Repository
// ============================================

export class ProductsRepository {
  constructor(private supabase: SupabaseClient) {}

  async findById(id: string) {
    const { data, error } = await this.supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async update(id: string, data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("products")
      .update(data)
      .eq("id", id);

    if (error) throw error;
  }

  async decreaseStock(productId: string, quantity: number): Promise<void> {
    const { error } = await this.supabase.rpc("decrease_product_stock", {
      product_id: productId,
      quantity,
    });

    if (error) throw error;
  }
}
