"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/contexts/CartContext";

interface PurchaseEventData {
  orderId: string;
  total: number;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}

/**
 * Hook to track purchase events for GA4 and FB Pixel
 * Should be used on the checkout success page
 */
export function usePurchaseTracking(
  orderId: string,
  total: number,
  items: PurchaseEventData["items"],
) {
  const { clearCart } = useCart();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    // Prevent double tracking
    if (hasTrackedRef.current || !orderId) return;
    hasTrackedRef.current = true;

    // Track purchase event to Supabase
    trackPurchaseToSupabase(orderId, total, items);

    // Track to GA4
    trackToGA4(orderId, total, items);

    // Track to Facebook Pixel
    trackToFBPixel(orderId, total, items);

    // Clear the cart after successful tracking
    setTimeout(() => {
      clearCart();
    }, 1000);
  }, [orderId, total, items, clearCart]);

  // Also track when component unmounts (safety net)
  useEffect(() => {
    return () => {
      if (!hasTrackedRef.current && orderId) {
        trackPurchaseToSupabase(orderId, total, items);
      }
    };
  }, [orderId, total, items]);
}

async function trackPurchaseToSupabase(
  orderId: string,
  total: number,
  items: PurchaseEventData["items"],
) {
  try {
    const { supabase } = await import("@/lib/supabase");

    // Get session and UTM data
    const sessionId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("daluz_session_id")
        : null;
    const utmParams =
      typeof window !== "undefined"
        ? JSON.parse(sessionStorage.getItem("daluz_utm_params") || "{}")
        : {};

    await supabase.rpc("track_event", {
      p_event_name: "purchase",
      p_event_category: "conversion",
      p_event_data: {
        order_id: orderId,
        total_amount: total,
        item_count: items.length,
        items: items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        currency: "ARS",
        ...utmParams,
        timestamp: new Date().toISOString(),
      },
      p_session_id: sessionId,
    });

    console.log("[Analytics] Purchase tracked to Supabase:", orderId);
  } catch (error) {
    console.error("[Analytics] Failed to track purchase to Supabase:", error);
  }
}

function trackToGA4(
  orderId: string,
  total: number,
  items: PurchaseEventData["items"],
) {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: Function }).gtag;
  if (!gtag) {
    console.warn("[Analytics] GA4 not loaded");
    return;
  }

  gtag("event", "purchase", {
    transaction_id: orderId,
    value: total,
    currency: "ARS",
    tax: 0,
    shipping: 0,
    items: items.map((item, index) => ({
      item_id: item.id,
      item_name: item.name,
      item_category: "", // Could be enriched from product data
      price: item.price,
      quantity: item.quantity,
      index: index,
    })),
  });

  console.log("[Analytics] Purchase tracked to GA4:", orderId);
}

function trackToFBPixel(
  orderId: string,
  total: number,
  items: PurchaseEventData["items"],
) {
  if (typeof window === "undefined") return;

  const fbq = (window as unknown as { fbq?: Function }).fbq;
  if (!fbq) {
    console.warn("[Analytics] FB Pixel not loaded");
    return;
  }

  fbq("track", "Purchase", {
    content_ids: items.map((i) => i.id),
    content_name: items.map((i) => i.name).join(", "),
    content_type: "product",
    value: total,
    currency: "ARS",
    num_items: items.length,
  });

  console.log("[Analytics] Purchase tracked to FB Pixel:", orderId);
}

/**
 * Hook to track checkout start event
 * Should be called when user begins checkout process
 */
export function useCheckoutTracking(cartTotal: number, itemCount: number) {
  useEffect(() => {
    if (cartTotal <= 0 || itemCount <= 0) return;

    trackCheckoutStart(cartTotal, itemCount);
  }, [cartTotal, itemCount]);
}

function trackCheckoutStart(cartTotal: number, itemCount: number) {
  // Track to Supabase
  import("@/lib/supabase").then(({ supabase }) => {
    supabase.rpc("track_event", {
      p_event_name: "checkout_start",
      p_event_category: "conversion",
      p_event_data: {
        cart_total: cartTotal,
        item_count: itemCount,
      },
    });
  });

  // Track to GA4
  if (typeof window !== "undefined") {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    gtag?.("event", "begin_checkout", {
      currency: "ARS",
      value: cartTotal,
      items: [],
    });
  }

  // Track to FB Pixel
  if (typeof window !== "undefined") {
    const fbq = (window as unknown as { fbq?: Function }).fbq;
    fbq?.("track", "InitiateCheckout", {
      value: cartTotal,
      currency: "ARS",
      num_items: itemCount,
    });
  }
}

/**
 * Hook to track view_cart event
 * Should be called when user views their cart
 */
export function useCartViewTracking(
  cartTotal: number,
  items: Array<{ id: string; name: string }>,
) {
  useEffect(() => {
    if (cartTotal <= 0) return;

    trackCartView(cartTotal, items);
  }, [cartTotal, items]);
}

function trackCartView(
  cartTotal: number,
  items: Array<{ id: string; name: string }>,
) {
  // Track to Supabase
  import("@/lib/supabase").then(({ supabase }) => {
    supabase.rpc("track_event", {
      p_event_name: "view_cart",
      p_event_category: "commerce",
      p_event_data: {
        cart_total: cartTotal,
        item_count: items.length,
        items: items,
      },
    });
  });

  // Track to GA4
  if (typeof window !== "undefined") {
    const gtag = (window as unknown as { gtag?: Function }).gtag;
    gtag?.("event", "view_cart", {
      currency: "ARS",
      value: cartTotal,
      items: items.map((item, index) => ({
        item_id: item.id,
        item_name: item.name,
        index: index,
      })),
    });
  }
}
