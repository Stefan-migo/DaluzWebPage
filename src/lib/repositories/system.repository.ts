import { SupabaseClient } from "@supabase/supabase-js";

// ============================================
// Repository
// ============================================

export class SystemRepository {
  constructor(private supabase: SupabaseClient) {}

  async getConfigs(keys: string[]) {
    const { data, error } = await this.supabase
      .from("system_config")
      .select("config_key, config_value")
      .in("config_key", keys);

    if (error) throw error;
    return (data || []) as { config_key: string; config_value: string }[];
  }

  async insertWebhookLog(data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("webhook_logs")
      .insert(data);

    if (error) throw error;
  }

  async updateLatestPendingWebhookLog(data: Record<string, unknown>): Promise<void> {
    const { error } = await this.supabase
      .from("webhook_logs")
      .update(data)
      .eq("webhook_type", "mercadopago")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;
  }

  async grantTreasures(userId: string, orderId: string) {
    const { data, error } = await this.supabase.rpc(
      "grant_treasures_from_order",
      {
        p_user_id: userId,
        p_order_id: orderId,
        p_access_ids: [] as string[],
      },
    );

    if (error) throw error;
    return data;
  }
}
