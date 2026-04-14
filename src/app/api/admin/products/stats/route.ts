import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from '@/lib/auth/helpers';

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  lowStockCount: number;
  totalValue: number;
}

export async function GET(_request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

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