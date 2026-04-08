import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // Reject the review (set is_approved to false)
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        is_approved: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error rejecting review:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject review' },
        { status: 500 }
      );
    }

    console.log('✅ Review rejected successfully');

    return NextResponse.json({
      success: true,
      review: updatedReview
    });

  } catch (error) {
    console.error('❌ Admin review rejection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
