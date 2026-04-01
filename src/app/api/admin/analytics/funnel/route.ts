import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: adminData } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (!adminData || !["admin", "super_admin"].includes(adminData.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get funnel data from analytics_events
    const { data: events, error: eventsError } = await supabase
      .from("analytics_events")
      .select("event_name, event_category, created_at, user_id")
      .gte(
        "created_at",
        new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      )
      .order("created_at", { ascending: false });

    if (eventsError) {
      console.error("Error fetching analytics events:", eventsError);
      return NextResponse.json(
        { error: "Failed to fetch funnel data" },
        { status: 500 },
      );
    }

    // Calculate funnel metrics
    const eventCounts =
      events?.reduce(
        (acc, event) => {
          acc[event.event_name] = (acc[event.event_name] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) || {};

    const uniqueUsersByEvent =
      events?.reduce(
        (acc, event) => {
          if (event.user_id) {
            if (!acc[event.event_name]) {
              acc[event.event_name] = new Set();
            }
            acc[event.event_name].add(event.user_id);
          }
          return acc;
        },
        {} as Record<string, Set<string>>,
      ) || {};

    // Calculate conversion rates
    const pageViews = eventCounts["page_view"] || 0;
    const productViews = eventCounts["product_view"] || 0;
    const addToCart = eventCounts["add_to_cart"] || 0;
    const viewCart = eventCounts["view_cart"] || 0;
    const checkoutStart = eventCounts["checkout_start"] || 0;
    const purchase =
      eventCounts["purchase"] || eventCounts["checkout_complete"] || 0;

    // Daily funnel for the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyFunnel = events
      ?.filter((e) => new Date(e.created_at) >= thirtyDaysAgo)
      .reduce(
        (acc, event) => {
          const date = new Date(event.created_at).toISOString().split("T")[0];
          if (!acc[date]) {
            acc[date] = {};
          }
          acc[date][event.event_name] = (acc[date][event.event_name] || 0) + 1;
          return acc;
        },
        {} as Record<string, Record<string, number>>,
      );

    const funnelData = {
      summary: {
        total_page_views: pageViews,
        total_product_views: productViews,
        total_add_to_cart: addToCart,
        total_view_cart: viewCart,
        total_checkout_start: checkoutStart,
        total_purchase: purchase,
      },
      rates: {
        view_to_product:
          pageViews > 0
            ? ((productViews / pageViews) * 100).toFixed(2)
            : "0.00",
        product_to_cart:
          productViews > 0
            ? ((addToCart / productViews) * 100).toFixed(2)
            : "0.00",
        cart_to_checkout:
          addToCart > 0
            ? ((checkoutStart / addToCart) * 100).toFixed(2)
            : "0.00",
        checkout_to_purchase:
          checkoutStart > 0
            ? ((purchase / checkoutStart) * 100).toFixed(2)
            : "0.00",
        overall_conversion:
          pageViews > 0 ? ((purchase / pageViews) * 100).toFixed(4) : "0.00",
      },
      unique_users: {
        page_views: uniqueUsersByEvent["page_view"]?.size || 0,
        product_views: uniqueUsersByEvent["product_view"]?.size || 0,
        add_to_cart: uniqueUsersByEvent["add_to_cart"]?.size || 0,
        checkout_start: uniqueUsersByEvent["checkout_start"]?.size || 0,
        purchase: uniqueUsersByEvent["purchase"]?.size || 0,
      },
      daily: Object.entries(dailyFunnel || {})
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, counts]) => ({
          date,
          ...counts,
        })),
      benchmarks: {
        industry_avg_conversion: "2.5",
        industry_cart_abandonment: "65-75",
        industry_checkout_abandonment: "20-30",
      },
    };

    return NextResponse.json({ funnel: funnelData });
  } catch (error) {
    console.error("Error in funnel analytics API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
