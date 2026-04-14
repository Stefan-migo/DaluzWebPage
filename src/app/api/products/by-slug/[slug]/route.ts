import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createClient } from '@/utils/supabase/server';

interface Params {
  slug: string;
}

// Cached product+reviews fetch — revalidates every 2 min or on 'products' tag
const getProductBySlugCached = unstable_cache(
  async (slug: string) => {
    const supabase = await createClient();

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description
        ),
        product_variants (
          id,
          title,
          price,
          compare_at_price,
          inventory_quantity,
          weight,
          barcode,
          image_url,
          option1,
          option2,
          option3,
          position,
          is_default
        )
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // not found
      throw error;
    }

    // Fetch review data
    const { data: reviews } = await supabase
      .from('reviews' as any)
      .select('rating')
      .eq('product_id', product.id)
      .eq('is_approved', true);

    const reviewCount = reviews?.length || 0;
    const averageRating = reviewCount > 0 && reviews
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviewCount
      : 0;

    return {
      ...product,
      reviewCount,
      averageRating: Math.round(averageRating * 10) / 10,
    };
  },
  ['product-by-slug'],
  { revalidate: 120, tags: ['products'] },
);

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const { slug } = params;
    const product = await getProductBySlugCached(slug);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
