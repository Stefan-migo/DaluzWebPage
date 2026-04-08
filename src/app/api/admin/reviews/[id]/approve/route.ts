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

    // Approve the review
    const { data: updatedReview, error: updateError } = await supabase
      .from('reviews')
      .update({
        is_approved: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error approving review:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve review' },
        { status: 500 }
      );
    }

    console.log('✅ Review approved successfully');

    return NextResponse.json({
      success: true,
      review: updatedReview
    });

  } catch (error) {
    console.error('❌ Admin review approval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
