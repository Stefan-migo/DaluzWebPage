import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        products: []
      });
    }

    // Search products by name or description
    const { data: products, error: searchError } = await supabase
      .from('products')
      .select('id, name, price, inventory_quantity, status, featured_image')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('status', 'active')
      .limit(limit);

    if (searchError) {
      console.error('❌ Error searching products:', searchError);
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || []
    });

  } catch (error) {
    console.error('❌ Product search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

