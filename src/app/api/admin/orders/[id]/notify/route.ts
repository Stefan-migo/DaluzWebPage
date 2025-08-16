import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireRole } from '@/lib/api/middleware';
import { EmailNotificationService } from '@/lib/email/notifications';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication and admin role
    const { userId } = await requireAuth(request);
    await requireRole(userId, 'admin');

    const { type = 'status_update', message } = await request.json();

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
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

    if (orderError || !order) {
      console.error('Error fetching order for notification:', orderError);
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    const emailService = new EmailNotificationService();
    
    try {
      switch (type) {
        case 'status_update':
          await emailService.sendOrderStatusUpdate(order, message);
          break;
          
        case 'shipping_notification':
          await emailService.sendShippingNotification(order);
          break;
          
        case 'delivery_confirmation':
          await emailService.sendDeliveryConfirmation(order);
          break;
          
        case 'custom_message':
          await emailService.sendCustomMessage(order, message);
          break;
          
        default:
          // Default to order confirmation
          await EmailNotificationService.sendOrderConfirmation(order);
      }

      // Log the notification in the database (optional)
      await supabaseAdmin
        .from('admin_activity_log')
        .insert({
          admin_user_id: userId,
          action: 'send_email_notification',
          resource_type: 'order',
          resource_id: order.id,
          details: {
            notification_type: type,
            recipient: order.email,
            message: message || null
          }
        });

      return NextResponse.json({
        success: true,
        message: 'Notification sent successfully'
      });

    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      return NextResponse.json(
        { error: 'Failed to send notification' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin order notification API error:', error);
    
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
