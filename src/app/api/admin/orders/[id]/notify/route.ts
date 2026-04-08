import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';
import { EmailNotificationService } from '@/lib/email/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

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

    if (orderError || !order) {
      console.error('❌ Error fetching order:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Get customer name from order or use default
    const customerName = order.shipping_first_name && order.shipping_last_name
      ? `${order.shipping_first_name} ${order.shipping_last_name}`
      : 'Cliente';

    // Prepare order data for email
    const emailOrder = {
      id: order.id,
      order_number: order.order_number,
      user_email: order.email,
      customer_name: customerName,
      items: order.order_items?.map((item: any) => ({
        name: item.product_name,
        quantity: item.quantity,
        price: item.unit_price
      })) || [],
      total_amount: order.total_amount,
      payment_method: order.mp_payment_method || 'MercadoPago',
      created_at: order.created_at,
      payment_id: order.mp_payment_id,
      status: order.status
    };

    // Send email notification
    const result = await EmailNotificationService.sendOrderConfirmation(emailOrder);

    if (!result.success) {
      console.error('❌ Error sending email:', result.error);
      return NextResponse.json(
        { error: 'Failed to send notification', details: result.error },
        { status: 500 }
      );
    }

    console.log('✅ Notification sent successfully');

    return NextResponse.json({
      success: true,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('❌ Notification API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
