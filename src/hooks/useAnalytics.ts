"use client";

import { useCallback, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

/**
 * Analytics event types for the funnel
 */
export type EventName =
  | "page_view"
  | "product_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "checkout_start"
  | "checkout_complete"
  | "purchase"
  | "signup"
  | "login"
  | "search"
  | "filter"
  | "subscribe_membership"
  | "review_submit";

export type EventCategory =
  | "navigation"
  | "commerce"
  | "engagement"
  | "conversion"
  | "account";

interface TrackEventOptions {
  event_data?: Record<string, unknown>;
  session_id?: string;
  page_url?: string;
  referrer_url?: string;
  // Allow additional properties for specific events
  [key: string]: unknown;
}

interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

/**
 * Hook for tracking analytics events
 *
 * @example
 * ```tsx
 * const { trackEvent, trackPageView, trackProductView } = useAnalytics();
 *
 * // Track a page view
 * trackPageView('/productos/aceite-argan');
 *
 * // Track a product view with data
 * trackProductView('prod_123', 'Aceite de Argán', 4990);
 *
 * // Track custom event
 * trackEvent('checkout_start', 'commerce', { cart_total: 15000 });
 * ```
 */
export function useAnalytics() {
  const { user } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const utmParamsRef = useRef<UTMParams>({});

  // Initialize or get session ID
  const getSessionId = useCallback(() => {
    if (sessionIdRef.current) return sessionIdRef.current;

    if (typeof window === "undefined") return "";

    let sessionId = sessionStorage.getItem("daluz_session_id");
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem("daluz_session_id", sessionId);
    }
    sessionIdRef.current = sessionId;
    return sessionId;
  }, []);

  // Capture UTM params from URL
  const captureUTMParams = useCallback(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    utmParamsRef.current = {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_term: params.get("utm_term") || undefined,
      utm_content: params.get("utm_content") || undefined,
    };

    // Store UTM params in session for persistence during checkout
    if (
      Object.keys(utmParamsRef.current).some(
        (k) => utmParamsRef.current[k as keyof UTMParams],
      )
    ) {
      sessionStorage.setItem(
        "daluz_utm_params",
        JSON.stringify(utmParamsRef.current),
      );
    }
  }, []);

  // Load UTM params from session storage
  const loadUTMParams = useCallback(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem("daluz_utm_params");
    if (stored) {
      try {
        utmParamsRef.current = JSON.parse(stored);
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    captureUTMParams();
    loadUTMParams();
    getSessionId();
  }, [captureUTMParams, loadUTMParams, getSessionId]);

  /**
   * Track a generic analytics event
   */
  const trackEvent = useCallback(
    async (
      eventName: EventName,
      eventCategory: EventCategory,
      options: TrackEventOptions = {},
    ): Promise<void> => {
      try {
        const eventData = {
          ...options.event_data,
          timestamp: new Date().toISOString(),
        };

        await supabase.rpc("track_event", {
          p_event_name: eventName,
          p_event_category: eventCategory,
          p_event_data: eventData,
          p_user_id: user?.id || null,
          p_session_id: options.session_id || getSessionId(),
        });

        // Also fire to global analytics handlers (GA4, FB Pixel)
        if (typeof window !== "undefined") {
          fireGlobalAnalytics(eventName, eventData);
        }
      } catch (error) {
        // Silent fail - analytics should never break the app
        console.error("[Analytics] Failed to track event:", error);
      }
    },
    [user?.id, getSessionId],
  );

  /**
   * Track a page view
   */
  const trackPageView = useCallback(
    (pageUrl?: string) => {
      const url =
        pageUrl ||
        (typeof window !== "undefined" ? window.location.pathname : "");
      trackEvent("page_view", "navigation", {
        page_url: url,
        referrer_url:
          typeof document !== "undefined" ? document.referrer : undefined,
      });
    },
    [trackEvent],
  );

  /**
   * Track a product view
   */
  const trackProductView = useCallback(
    (
      productId: string,
      productName: string,
      price: number,
      category?: string,
    ) => {
      trackEvent("product_view", "commerce", {
        product_id: productId,
        product_name: productName,
        price,
        category,
      });
    },
    [trackEvent],
  );

  /**
   * Track add to cart
   */
  const trackAddToCart = useCallback(
    (
      productId: string,
      productName: string,
      price: number,
      quantity: number = 1,
      category?: string,
    ) => {
      trackEvent("add_to_cart", "commerce", {
        product_id: productId,
        product_name: productName,
        price,
        quantity,
        category,
      });
    },
    [trackEvent],
  );

  /**
   * Track remove from cart
   */
  const trackRemoveFromCart = useCallback(
    (
      productId: string,
      productName: string,
      price: number,
      quantity: number = 1,
    ) => {
      trackEvent("remove_from_cart", "commerce", {
        product_id: productId,
        product_name: productName,
        price,
        quantity,
      });
    },
    [trackEvent],
  );

  /**
   * Track cart view
   */
  const trackViewCart = useCallback(
    (
      cartTotal: number,
      itemCount: number,
      items: Array<{
        id: string;
        name: string;
        price: number;
        quantity: number;
      }>,
    ) => {
      trackEvent("view_cart", "commerce", {
        cart_total: cartTotal,
        item_count: itemCount,
        items,
      });
    },
    [trackEvent],
  );

  /**
   * Track checkout start
   */
  const trackCheckoutStart = useCallback(
    (cartTotal: number, itemCount: number) => {
      trackEvent("checkout_start", "conversion", {
        cart_total: cartTotal,
        item_count: itemCount,
      });
    },
    [trackEvent],
  );

  /**
   * Track checkout complete (purchase)
   */
  const trackPurchase = useCallback(
    (
      orderId: string,
      totalAmount: number,
      itemCount: number,
      paymentMethod?: string,
    ) => {
      trackEvent("purchase", "conversion", {
        order_id: orderId,
        total_amount: totalAmount,
        item_count: itemCount,
        payment_method: paymentMethod,
        ...utmParamsRef.current,
      });
    },
    [trackEvent],
  );

  /**
   * Track signup
   */
  const trackSignup = useCallback(
    (method: "email" | "google") => {
      trackEvent("signup", "account", {
        method,
      });
    },
    [trackEvent],
  );

  /**
   * Track login
   */
  const trackLogin = useCallback(
    (method: "email" | "google") => {
      trackEvent("login", "account", {
        method,
      });
    },
    [trackEvent],
  );

  /**
   * Track search
   */
  const trackSearch = useCallback(
    (searchTerm: string, resultCount: number) => {
      trackEvent("search", "engagement", {
        search_term: searchTerm,
        result_count: resultCount,
      });
    },
    [trackEvent],
  );

  /**
   * Track filter usage
   */
  const trackFilter = useCallback(
    (filterType: string, filterValue: string) => {
      trackEvent("filter", "engagement", {
        filter_type: filterType,
        filter_value: filterValue,
      });
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackViewCart,
    trackCheckoutStart,
    trackPurchase,
    trackSignup,
    trackLogin,
    trackSearch,
    trackFilter,
    getSessionId,
  };
}

/**
 * Fire events to global analytics providers (GA4, FB Pixel)
 */
function fireGlobalAnalytics(
  eventName: EventName,
  eventData: Record<string, unknown>,
) {
  // Google Analytics 4
  if (
    typeof window !== "undefined" &&
    (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  ) {
    (window as unknown as { gtag: (...args: unknown[]) => void }).gtag(
      "event",
      eventName,
      eventData,
    );
  }

  // Facebook Pixel
  if (
    typeof window !== "undefined" &&
    (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  ) {
    (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
      "track",
      eventName,
      eventData,
    );
  }
}

// Extend Window interface for global analytics
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}
