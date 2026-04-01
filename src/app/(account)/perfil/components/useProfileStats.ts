"use client";

import { useState, useEffect } from "react";

interface ProfileStats {
  orderCount: number;
  membershipActive: boolean;
  membershipTier: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useProfileStats(userId?: string) {
  const [stats, setStats] = useState<ProfileStats>({
    orderCount: 0,
    membershipActive: false,
    membershipTier: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    if (!userId) {
      setStats((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const fetchStats = async () => {
      try {
        // Fetch orders count
        const ordersRes = await fetch("/api/orders");
        const ordersData = await ordersRes.json();

        if (!ordersRes.ok) {
          throw new Error(ordersData.error || "Error fetching orders");
        }

        setStats((prev) => ({
          ...prev,
          orderCount: ordersData.orders?.length || 0,
          isLoading: false,
        }));
      } catch (err) {
        setStats((prev) => ({
          ...prev,
          error: err instanceof Error ? err.message : "Error loading stats",
          isLoading: false,
        }));
      }
    };

    fetchStats();
  }, [userId]);

  return stats;
}
