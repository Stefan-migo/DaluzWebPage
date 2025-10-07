import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

interface Params {
  id: string;
}

// GET /api/products/[id]/reviews - Get all approved reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sort_by') || 'newest';
    const rating = searchParams.get('rating');
    
    const offset = (page - 1) * limit;

    // Build query
    let query = supabase
      .from('reviews')
      .select(`
        *,
        user:user_id (
          id,
          email,
          user_metadata (
            full_name,
            avatar_url
          )
        ),
        helpfulness:review_helpfulness (
          id,
          is_helpful,
          user_id
        )
      `)
      .eq('product_id', id)
      .eq('is_approved', true);

    // Filter by rating if specified
    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'highest_rating':
        query = query.order('rating', { ascending: false });
        break;
      case 'lowest_rating':
        query = query.order('rating', { ascending: true });
        break;
      default:
        query = query.order('created_at', { ascending: false });
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
      .select('*', { count: 'exact', head: true })
      .eq('product_id', id)
      .eq('is_approved', true);

    // Get rating distribution
    const { data: ratingDistribution } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', id)
      .eq('is_approved', true);

    const distribution = ratingDistribution?.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>) || {};

    // Get average rating
    const { data: avgRating } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', id)
      .eq('is_approved', true);

    const averageRating = avgRating?.length 
      ? avgRating.reduce((sum, review) => sum + review.rating, 0) / avgRating.length
      : 0;

    return NextResponse.json({
      reviews: reviews || [],
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit),
        hasMore: (totalCount || 0) > offset + limit
      },
      summary: {
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: totalCount || 0,
        ratingDistribution: {
          5: distribution[5] || 0,
          4: distribution[4] || 0,
          3: distribution[3] || 0,
          2: distribution[2] || 0,
          1: distribution[1] || 0
        }
      }
    });

  } catch (error) {
    console.error('Error in reviews GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Create a new review
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { id } = params;
    const body = await request.json();
    
    const { rating, title, comment, user_id } = body;

    // Validate required fields
    if (!rating || !user_id) {
      return NextResponse.json(
        { error: 'Rating and user_id are required' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user already has a review for this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('product_id', id)
      .eq('user_id', user_id)
      .single();

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      );
    }

    // Create the review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: id,
        user_id,
        rating,
        title: title || null,
        comment: comment || null,
        is_verified_purchase: false, // TODO: Implement purchase verification
        is_approved: false // Reviews need approval
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return NextResponse.json(
        { error: 'Failed to create review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      review,
      message: 'Review submitted successfully. It will be published after approval.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error in reviews POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
