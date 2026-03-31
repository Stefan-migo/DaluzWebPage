"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { createClient } from "@/utils/supabase/client";

interface UseTreasuresOptions {
  /** Auto-fetch treasures on mount (default: true) */
  autoFetch?: boolean;
  /** Include general access always (default: true) */
  includeGeneral?: boolean;
}

interface UseTreasuresReturn {
  /** Array of treasure access IDs */
  treasures: string[];
  /** Loading state */
  loading: boolean;
  /** Error if any */
  error: Error | null;
  /** Check if user has access to a specific treasure */
  hasAccess: (requiredId: string) => boolean;
  /** Refetch treasures from server */
  refetch: () => Promise<void>;
  /** Grant a treasure access manually (admin only) */
  grantAccess?: (
    accessId: string,
    sourceType?: string,
  ) => Promise<{ granted: boolean; message: string }>;
}

/**
 * Hook to manage user treasures (access to exclusive content)
 */
export function useTreasures(
  options: UseTreasuresOptions = {},
): UseTreasuresReturn {
  const { autoFetch = true, includeGeneral = true } = options;

  const [treasures, setTreasures] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref for supabase client to avoid recreation on every render
  const supabaseRef = useRef(createClient());

  // Check if user has access to a specific treasure
  const hasAccess = useCallback(
    (requiredId: string): boolean => {
      if (requiredId === "tesoro-gral") {
        return treasures.includes("tesoro-gral");
      }
      return treasures.includes(requiredId);
    },
    [treasures],
  );

  // Fetch treasures from server
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseRef.current;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setTreasures([]);
        setLoading(false);
        return;
      }

      // Get treasures from profile (denormalized for speed)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("treasures")
        .eq("id", user.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      const userTreasures = profile?.treasures || [];

      // Ensure general access is included if user has any treasures
      const treasuresWithGeneral =
        includeGeneral && userTreasures.length > 0
          ? [
              "tesoro-gral",
              ...userTreasures.filter((t: string) => t !== "tesoro-gral"),
            ]
          : userTreasures;

      setTreasures(treasuresWithGeneral);
    } catch (err) {
      console.error("Error fetching treasures:", err);
      setError(
        err instanceof Error ? err : new Error("Failed to fetch treasures"),
      );
      setTreasures([]);
    } finally {
      setLoading(false);
    }
  }, [includeGeneral]);

  // Grant treasure access (admin function)
  const grantAccess = useCallback(
    async (
      accessId: string,
      sourceType: string = "manual",
    ): Promise<{ granted: boolean; message: string }> => {
      const supabase = supabaseRef.current;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { granted: false, message: "User not authenticated" };
      }

      const { data, error } = await supabase.rpc("grant_treasure_access", {
        p_user_id: user.id,
        p_access_id: accessId,
        p_access_type: accessId.startsWith("linea-")
          ? "linea"
          : accessId.startsWith("kit-")
            ? "kit"
            : "general",
        p_source_type: sourceType,
      });

      if (error) {
        console.error("Error granting treasure:", error);
        return { granted: false, message: error.message };
      }

      // Refetch to update state
      await refetch();

      return data?.[0] || { granted: false, message: "No result returned" };
    },
    [refetch],
  );

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      refetch();
    } else {
      setLoading(false);
    }
  }, [autoFetch, refetch]);

  return {
    treasures,
    loading,
    error,
    hasAccess,
    refetch,
    grantAccess,
  };
}

/**
 * Hook to check if user has access to specific content
 * More efficient than useTreasures when you only need one check
 *
 * @example
 * ```tsx
 * const { hasAccess, loading } = useHasAccess('linea-umbral');
 * ```
 */
export function useHasAccess(accessId: string): {
  hasAccess: boolean;
  loading: boolean;
} {
  const { treasures, loading } = useTreasures();

  return {
    hasAccess: treasures.includes(accessId),
    loading,
  };
}
