import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/public/config
 * Returns public system configuration values.
 *
 * Query params:
 *   - keys: comma-separated list of config keys to fetch (optional)
 *   - category: filter by category (optional)
 *
 * Example: GET /api/public/config?keys=contact_email,phone_number,address
 * Example: GET /api/public/config?category=contact
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keysParam = searchParams.get("keys");
    const category = searchParams.get("category");

    // Parse keys array if provided
    const keys = keysParam ? keysParam.split(",").map((k) => k.trim()) : null;

    const supabase = await createClient();

    // Build query - only public configs
    let query = supabase
      .from("system_config")
      .select("config_key, config_value, value_type, category")
      .eq("is_public", true);

    // Apply key filter if specified
    if (keys && keys.length > 0) {
      query = query.in("config_key", keys);
    }

    // Apply category filter if specified
    if (category) {
      query = query.eq("category", category);
    }

    const { data: configs, error } = await query;

    if (error) {
      console.error("Error fetching public config:", error);
      return NextResponse.json(
        { error: "Failed to fetch configuration" },
        { status: 500 },
      );
    }

    // Parse values and transform to key-value format
    const result: Record<string, string | number | boolean | object> = {};

    configs?.forEach((config) => {
      let parsedValue: any = config.config_value;

      // Try to parse JSON strings
      if (typeof config.config_value === "string") {
        try {
          parsedValue = JSON.parse(config.config_value);
        } catch {
          // Keep original string if not valid JSON
        }
      }

      result[config.config_key] = parsedValue;
    });

    return NextResponse.json({
      configs: result,
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
