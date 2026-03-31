/**
 * Email template utilities - Server side only
 * These functions require access to cookies/headers and can only be used in Server Components or API routes
 */

import { createClient } from "@/utils/supabase/server";

// Cache for server-side config (1 minute TTL)
let configCache: {
  data: Record<string, string> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 60 * 1000; // 1 minute

/**
 * Get public configuration from database (server-side only)
 * Uses in-memory cache with 1-minute TTL
 */
export async function getServerPublicConfig(
  keys: string[] = ["contact_email", "support_email", "social_whatsapp"],
): Promise<Record<string, string>> {
  const now = Date.now();

  // Return cached data if still valid
  if (configCache.data && now - configCache.timestamp < CACHE_TTL_MS) {
    return configCache.data;
  }

  try {
    const supabase = await createClient();

    const { data: configs, error } = await supabase
      .from("system_config")
      .select("config_key, config_value")
      .eq("is_public", true)
      .in("config_key", keys);

    if (error) {
      console.error("Error fetching server config:", error);
      throw error;
    }

    // Parse config values and build result object
    const result: Record<string, string> = {};
    configs?.forEach((config) => {
      let value = config.config_value;
      // Try to parse JSON strings
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          // Keep original string
        }
      }
      result[config.config_key] = String(value);
    });

    // Update cache
    configCache = {
      data: result,
      timestamp: now,
    };

    return result;
  } catch (error) {
    console.error("Failed to fetch server config:", error);
    // Return empty object on error - caller should use fallback
    return {};
  }
}

/**
 * Invalidate the config cache (call after updating config in admin)
 */
export function invalidateConfigCache(): void {
  configCache = {
    data: null,
    timestamp: 0,
  };
}

/**
 * Get default variables for email templates (async - fetches from DB)
 * Use this in API routes and server components for dynamic values
 */
export async function getDefaultVariablesAsync(): Promise<
  Record<string, string>
> {
  try {
    const config = await getServerPublicConfig([
      "contact_email",
      "support_email",
      "social_whatsapp",
    ]);

    return {
      company_name: "DA LUZ CONSCIENTE",
      support_email: config.support_email || "soporte@daluzconsciente.com",
      contact_email: config.contact_email || "contacto@daluzconsciente.com",
      website_url:
        process.env.NEXT_PUBLIC_APP_URL || "https://daluzconsciente.com",
    };
  } catch {
    // Fallback to hardcoded values on error
    return getDefaultVariables();
  }
}

/**
 * Get default variables for email templates (synchronous fallback)
 * Uses hardcoded defaults - use getDefaultVariablesAsync() when possible
 */
export function getDefaultVariables(): Record<string, string> {
  return {
    company_name: "DA LUZ CONSCIENTE",
    support_email: "soporte@daluzconsciente.com",
    contact_email: "contacto@daluzconsciente.com",
    website_url:
      process.env.NEXT_PUBLIC_APP_URL || "https://daluzconsciente.com",
  };
}
