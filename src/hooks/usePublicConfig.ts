"use client";

import { useState, useEffect, useCallback } from "react";

export interface PublicConfig {
  contact_email?: string;
  phone_number?: string;
  whatsapp_phone?: string;
  address?: string;
  city?: string;
  country?: string;
  site_name?: string;
  site_description?: string;
  [key: string]: string | undefined;
}

interface UsePublicConfigOptions {
  /** Keys to fetch (defaults to contact-related keys) */
  keys?: string[];
  /** Auto-refresh interval in milliseconds (default: 60000 = 1 minute) */
  revalidateInterval?: number;
  /** Skip initial fetch */
  skip?: boolean;
}

interface UsePublicConfigReturn {
  config: PublicConfig | null;
  loading: boolean;
  error: Error | null;
  /** Force refresh the config */
  refresh: () => Promise<void>;
}

const DEFAULT_CONTACT_KEYS = [
  "contact_email",
  "phone_number",
  "whatsapp_phone",
  "address",
  "city",
  "country",
];

/**
 * Hook to fetch and cache public system configuration.
 *
 * @example
 * ```tsx
 * // Basic usage - fetches all contact info
 * const { config } = usePublicConfig();
 *
 * // Specific keys
 * const { config } = usePublicConfig({
 *   keys: ["contact_email", "whatsapp_phone"]
 * });
 *
 * // With auto-refresh
 * const { config, refresh } = usePublicConfig({
 *   revalidateInterval: 30000
 * });
 * ```
 */
export function usePublicConfig(
  options: UsePublicConfigOptions = {},
): UsePublicConfigReturn {
  const {
    keys = DEFAULT_CONTACT_KEYS,
    revalidateInterval = 60000,
    skip = false,
  } = options;

  const [config, setConfig] = useState<PublicConfig | null>(null);
  const [loading, setLoading] = useState(!skip);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const keysParam = keys.join(",");
      const response = await fetch(`/api/public/config?keys=${keysParam}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setConfig(data.configs || null);
    } catch (err) {
      console.error("Error fetching public config:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch config"),
      );
    } finally {
      setLoading(false);
    }
  }, [keys.join(",")]);

  // Initial fetch
  useEffect(() => {
    if (skip) return;
    fetchConfig();
  }, [fetchConfig, skip]);

  // Auto-refresh interval
  useEffect(() => {
    if (revalidateInterval <= 0 || skip) return;

    const intervalId = setInterval(fetchConfig, revalidateInterval);
    return () => clearInterval(intervalId);
  }, [fetchConfig, revalidateInterval, skip]);

  return {
    config,
    loading,
    error,
    refresh: fetchConfig,
  };
}

/**
 * Hook to get a single config value.
 *
 * @example
 * ```tsx
 * const email = useConfigValue("contact_email", "fallback@example.com");
 * ```
 */
export function useConfigValue(key: string, fallback: string = ""): string {
  const { config } = usePublicConfig({ keys: [key] });
  return config?.[key] || fallback;
}
