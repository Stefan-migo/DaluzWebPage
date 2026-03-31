import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  totalValue: number;
}

async function verifyAdminUser(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authorized: false, user: null, error: "Unauthorized" };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin", {
    user_id: user.id,
  });

  if (adminError || !isAdmin) {
    return {
      authorized: false,
      user,
      error: "Forbidden: Admin access required",
    };
  }

  return { authorized: true, user, error: null };
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify admin user
    const auth = await verifyAdminUser(supabase);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Query for product stats
    const { data, error } = await supabase.from("products").select(`
        id,
        status,
        price,
        inventory_quantity
      `);

    if (error) {
      console.error("Error fetching product stats:", error);
      return NextResponse.json(
        { error: "Error al obtener estadísticas de productos" },
        { status: 500 },
      );
    }

    // Calculate stats
    const stats: ProductStats = {
      totalProducts: data?.length || 0,
      activeProducts: data?.filter((p) => p.status === "active").length || 0,
      lowStockCount:
        data?.filter((p) => (p.inventory_quantity || 0) <= 5).length || 0,
      totalValue:
        data?.reduce((sum, p) => {
          return sum + (p.price || 0) * (p.inventory_quantity || 0);
        }, 0) || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Unexpected error in product stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
