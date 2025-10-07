import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

// GET /api/admin/reviews - Get all reviews for admin management
export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const rating = searchParams.get('rating');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('reviews')
      .select(`
        *,
        product:product_id (
          id,
          name,
          slug
        ),
        user:user_id (
          id,
          email,
          user_metadata (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`title.ilike.%${search}%,comment.ilike.%${search}%,product.name.ilike.%${search}%,user.email.ilike.%${search}%`);
    }

    if (status) {
      switch (status) {
        case 'pending':
          query = query.eq('is_approved', false);
          break;
        case 'approved':
          query = query.eq('is_approved', true);
          break;
        case 'rejected':
          // For now, we'll consider rejected as not approved
          // You might want to add a separate 'is_rejected' field
          query = query.eq('is_approved', false);
          break;
      }
    }

    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: reviews, error, count } = await query;

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasMore: (totalCount || 0) > offset + limit
      }
    });

  } catch (error) {
    console.error('Error in admin reviews GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
