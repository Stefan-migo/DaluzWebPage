import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

interface Params {
  reviewId: string;
}

// POST /api/admin/reviews/[reviewId]/approve - Approve a review
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { reviewId } = params;

    // Check if review exists
    const { data: review, error: fetchError } = await supabase
      .from('reviews')
      .select('id, is_approved')
      .eq('id', reviewId)
      .single();

    if (fetchError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    if (review.is_approved) {
      return NextResponse.json(
        { error: 'Review is already approved' },
        { status: 400 }
      );
    }

    // Approve the review
    const { error } = await supabase
      .from('reviews')
      .update({ is_approved: true })
      .eq('id', reviewId);

    if (error) {
      console.error('Error approving review:', error);
      return NextResponse.json(
        { error: 'Failed to approve review' },
        { status: 500 }
      );
    }

    // TODO: Send email notification to user when email system is implemented
    // await sendReviewApprovalEmail(review.user_id, review.product_id);

    return NextResponse.json({
      message: 'Review approved successfully'
    });

  } catch (error) {
    console.error('Error in approve review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
