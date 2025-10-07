import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

interface Params {
  id: string;
  reviewId: string;
}

// GET /api/products/[id]/reviews/[reviewId] - Get a specific review
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { reviewId } = params;

    const { data: review, error } = await supabase
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
      .eq('id', reviewId)
      .single();

    if (error) {
      console.error('Error fetching review:', error);
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ review });

  } catch (error) {
    console.error('Error in review GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]/reviews/[reviewId] - Update a review
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { reviewId } = params;
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

    // Check if review exists and belongs to user
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError || !existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Unauthorized to update this review' },
        { status: 403 }
      );
    }

    // Update the review
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        rating,
        title: title || null,
        comment: comment || null,
        is_approved: false // Reset approval status when updated
      })
      .eq('id', reviewId)
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return NextResponse.json(
        { error: 'Failed to update review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      review,
      message: 'Review updated successfully. It will be republished after approval.'
    });

  } catch (error) {
    console.error('Error in review PUT:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]/reviews/[reviewId] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { reviewId } = params;
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if review exists and belongs to user
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', reviewId)
      .single();

    if (fetchError || !existingReview) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (existingReview.user_id !== user_id) {
      return NextResponse.json(
        { error: 'Unauthorized to delete this review' },
        { status: 403 }
      );
    }

    // Delete the review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId);

    if (error) {
      console.error('Error deleting review:', error);
      return NextResponse.json(
        { error: 'Failed to delete review' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Error in review DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
