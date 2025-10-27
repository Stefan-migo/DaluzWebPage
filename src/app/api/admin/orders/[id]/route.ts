import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Admin Orders PATCH called for order:', params.id);
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { status, payment_status } = body;

    console.log('📝 Updating order with:', { status, payment_status });

    // Build update object dynamically to only update provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (status !== undefined) {
      updateData.status = status;
    }

    if (payment_status !== undefined) {
      updateData.payment_status = payment_status;
    }

    // Update the order
    const { data: updatedOrder, error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) {
      console.error('❌ Error updating order:', updateError);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    console.log('✅ Order updated successfully');

    return NextResponse.json({
      success: true,
      order: updatedOrder
    });

  } catch (error) {
    console.error('❌ Admin order update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Admin Orders GET single order:', params.id);
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get order details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `)
      .eq('id', params.id)
      .single();

    if (orderError) {
      console.error('❌ Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Failed to fetch order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Admin order fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🗑️ Admin Orders DELETE called for order:', params.id);
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // First, delete all order items for this order
    console.log('🗑️ Deleting order items for order:', params.id);
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', params.id);

    if (itemsError) {
      console.error('❌ Error deleting order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to delete order items', details: itemsError.message },
        { status: 500 }
      );
    }

    // Then, delete the order
    console.log('🗑️ Deleting order:', params.id);
    const { error: orderError } = await supabase
      .from('orders')
      .delete()
      .eq('id', params.id);

    if (orderError) {
      console.error('❌ Error deleting order:', orderError);
      return NextResponse.json(
        { error: 'Failed to delete order', details: orderError.message },
        { status: 500 }
      );
    }

    console.log('✅ Order deleted successfully:', params.id);
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('❌ Admin order delete error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}