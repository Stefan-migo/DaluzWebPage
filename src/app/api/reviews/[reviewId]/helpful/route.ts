import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/server';

interface Params {
  reviewId: string;
}

// POST /api/reviews/[reviewId]/helpful - Vote on review helpfulness
export async function POST(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = createServiceRoleClient();
    const { reviewId } = params;
    const body = await request.json();
    
    const { user_id, is_helpful } = body;

    // Validate required fields
    if (!user_id || typeof is_helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'User ID and helpfulness vote are required' },
        { status: 400 }
      );
    }

    // Check if review exists
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .select('id')
      .eq('id', reviewId)
      .single();

    if (reviewError || !review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('review_helpfulness')
      .select('id, is_helpful')
      .eq('review_id', reviewId)
      .eq('user_id', user_id)
      .single();

    if (existingVote) {
      // Update existing vote if different
      if (existingVote.is_helpful !== is_helpful) {
        const { error: updateError } = await supabase
          .from('review_helpfulness')
          .update({ is_helpful })
          .eq('id', existingVote.id);

        if (updateError) {
          console.error('Error updating helpfulness vote:', updateError);
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          );
        }
      }
    } else {
      // Create new vote
      const { error: insertError } = await supabase
        .from('review_helpfulness')
        .insert({
          review_id: reviewId,
          user_id,
          is_helpful
        });

      if (insertError) {
        console.error('Error creating helpfulness vote:', insertError);
        return NextResponse.json(
          { error: 'Failed to create vote' },
          { status: 500 }
        );
      }
    }

    // Get updated helpfulness counts
    const { data: helpfulnessData } = await supabase
      .from('review_helpfulness')
      .select('is_helpful')
      .eq('review_id', reviewId);

    const helpfulCount = helpfulnessData?.filter(vote => vote.is_helpful).length || 0;
    const notHelpfulCount = helpfulnessData?.filter(vote => !vote.is_helpful).length || 0;

    return NextResponse.json({
      message: 'Vote recorded successfully',
      helpfulness: {
        helpful: helpfulCount,
        not_helpful: notHelpfulCount,
        total: helpfulCount + notHelpfulCount
      }
    });

  } catch (error) {
    console.error('Error in helpfulness POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/reviews/[reviewId]/helpful - Remove helpfulness vote
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

    // Remove the vote
    const { error } = await supabase
      .from('review_helpfulness')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', user_id);

    if (error) {
      console.error('Error removing helpfulness vote:', error);
      return NextResponse.json(
        { error: 'Failed to remove vote' },
        { status: 500 }
      );
    }

    // Get updated helpfulness counts
    const { data: helpfulnessData } = await supabase
      .from('review_helpfulness')
      .select('is_helpful')
      .eq('review_id', reviewId);

    const helpfulCount = helpfulnessData?.filter(vote => vote.is_helpful).length || 0;
    const notHelpfulCount = helpfulnessData?.filter(vote => !vote.is_helpful).length || 0;

    return NextResponse.json({
      message: 'Vote removed successfully',
      helpfulness: {
        helpful: helpfulCount,
        not_helpful: notHelpfulCount,
        total: helpfulCount + notHelpfulCount
      }
    });

  } catch (error) {
    console.error('Error in helpfulness DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
