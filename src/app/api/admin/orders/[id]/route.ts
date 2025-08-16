import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireRole, logAdminActivity } from '@/lib/api/middleware';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const { userId } = await requireAuth(request);
    await requireRole(userId, 'admin');

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          *
        ),
        profiles!orders_user_id_fkey (
          full_name,
          email
        )
      `)
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Error fetching order:', error);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        ...order,
        customer_name: order.profiles?.full_name || 'Cliente',
        customer_email: order.profiles?.email || order.email
      }
    });

  } catch (error) {
    console.error('Admin order detail API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const { userId } = await requireAuth(request);
    await requireRole(userId, 'admin');

    const updates = await request.json();
    
    // Validate allowed fields
    const allowedFields = [
      'status',
      'payment_status',
      'fulfillment_status',
      'tracking_number',
      'carrier',
      'shipped_at',
      'delivered_at',
      'customer_notes'
    ];
    
    const updateData: any = {
      updated_at: new Date().toISOString()
    };
    
    // Filter and validate updates
    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = updates[key];
      }
    });

    // Set timestamps for status changes
    if (updates.status === 'shipped' && !updateData.shipped_at) {
      updateData.shipped_at = new Date().toISOString();
      updateData.fulfillment_status = 'fulfilled';
    }
    
    if (updates.status === 'completed' && !updateData.delivered_at) {
      updateData.delivered_at = new Date().toISOString();
      updateData.fulfillment_status = 'fulfilled';
      updateData.payment_status = 'paid'; // Assume payment is confirmed when order is completed
    }

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating order:', error);
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      );
    }

    // Log admin activity
    await logAdminActivity(
      userId,
      'update_order_status',
      'order',
      params.id,
      {
        old_status: order.status,
        new_updates: updateData,
        order_number: order.order_number
      }
    );

    // TODO: Send email notification to customer about status change
    // This can be implemented later using the existing email service

    return NextResponse.json({
      success: true,
      order,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Admin order update API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

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
    // Check authentication and admin role
    const { userId } = await requireAuth(request);
    await requireRole(userId, 'admin');

    // Note: Instead of actually deleting, we should mark as cancelled
    // to preserve data integrity and for audit purposes
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error cancelling order:', error);
      return NextResponse.json(
        { error: 'Failed to cancel order' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Admin order cancel API error:', error);
    
    if (error instanceof Error && error.message.includes('Authentication required')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error instanceof Error && error.message.includes('Insufficient permissions')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
