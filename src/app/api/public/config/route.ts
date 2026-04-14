import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { createClient } from "@/utils/supabase/server";

// Cached config fetch — revalidates every 5 min or on 'config' tag
// Arguments (keys, category) are included in the cache key automatically
const getPublicConfigCached = unstable_cache(
  async (keys: string | null, category: string | null) => {
    const supabase = await createClient();

    let query = supabase
      .from("system_config")
      .select("config_key, config_value, value_type, category")
      .eq("is_public", true);

    if (keys) {
      const keyList = keys.split(",").map((k) => k.trim());
      query = query.in("config_key", keyList);
    }

    if (category) {
      query = query.eq("category", category);
    }

    const { data: configs, error } = await query;
    if (error) throw error;

    const result: Record<string, string | number | boolean | object> = {};
    configs?.forEach((config) => {
      let parsedValue: any = config.config_value;
      if (typeof config.config_value === "string") {
        try {
          parsedValue = JSON.parse(config.config_value);
        } catch {
          // keep original
        }
      }
      result[config.config_key] = parsedValue;
    });

    return result;
  },
  ["public-config"],
  { revalidate: 300, tags: ["config"] },
);

/**
 * GET /api/public/config
 * Returns public system configuration values (cached).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get("keys");
    const category = searchParams.get("category");

    const configs = await getPublicConfigCached(keys, category);

    return NextResponse.json({
      configs,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in public config API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
