import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

interface Params {
  reviewId: string;
}

// POST /api/admin/reviews/[reviewId]/reject - Reject a review
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
        { error: 'Cannot reject an already approved review' },
        { status: 400 }
      );
    }

    // For now, we'll just keep the review as not approved
    // In the future, you might want to add an 'is_rejected' field
    // or delete the review entirely
    
    // TODO: Send email notification to user when email system is implemented
    // await sendReviewRejectionEmail(review.user_id, review.product_id);

    return NextResponse.json({
      message: 'Review rejected successfully'
    });

  } catch (error) {
    console.error('Error in reject review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
