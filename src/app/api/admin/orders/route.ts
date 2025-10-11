import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Admin Orders API GET called');
    const supabase = await createClient();
    
    // Check admin authorization
    console.log('🔐 Checking user authentication...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('❌ User authentication failed:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('✅ User authenticated:', user.email);

    console.log('🔒 Checking admin privileges...');
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
    if (adminError) {
      console.error('❌ Admin check error:', adminError);
      return NextResponse.json({ error: 'Admin verification failed' }, { status: 500 });
    }
    if (!isAdmin) {
      console.log('❌ User is not admin:', user.email);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    console.log('✅ Admin access confirmed for:', user.email);

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    console.log('📊 Query params:', { status, limit, offset });

    // Build query
    let query = supabase
      .from('orders')
      .select(`
        id,
        order_number,
        email,
        status,
        payment_status,
        total_amount,
        currency,
        created_at,
        updated_at,
        mp_payment_id,
        mp_payment_method,
        mp_payment_type,
        order_items (
          id,
          product_name,
          variant_title,
          quantity,
          unit_price,
          total_price
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    console.log('🗄️ Executing orders query...');
    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('❌ Error fetching admin orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    console.log('✅ Orders fetched successfully:', orders?.length || 0);

    // Transform data to include customer names
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: 'Cliente', // For now, we'll use a generic name since we don't have the profiles join
      customer_email: order.email,
      total_amount: order.total_amount,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      updated_at: order.updated_at,
      mp_payment_id: order.mp_payment_id,
      mp_payment_method: order.mp_payment_method,
      mp_payment_type: order.mp_payment_type,
      order_items: order.order_items || []
    }));

    return NextResponse.json({
      success: true,
      orders: transformedOrders || [],
      total: count || 0,
      offset,
      limit
    });

  } catch (error) {
    console.error('❌ Admin orders API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create manual order or get statistics
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Admin Orders API POST called');
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
    const { action } = body;

    if (action === 'get_stats') {
      console.log('📊 Getting order statistics...');
      
      // Get order counts by status
      const { data: allOrders, error: statusError } = await supabase
        .from('orders')
        .select('status');

      if (statusError) {
        console.error('❌ Error getting order stats:', statusError);
        throw statusError;
      }

      // Count by status manually
      const statusCounts = allOrders?.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

      // Get total revenue for current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', startOfMonth.toISOString());

      if (revenueError) {
        console.error('❌ Error getting revenue stats:', revenueError);
        throw revenueError;
      }

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Get recent orders
      const { data: recentOrders, error: recentError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          email,
          status,
          total_amount,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) {
        console.error('❌ Error getting recent orders:', recentError);
        throw recentError;
      }

      return NextResponse.json({
        success: true,
        stats: {
          orderCounts: statusCounts || [],
          totalRevenue,
          recentOrders: recentOrders?.map(order => ({
            id: order.id,
            order_number: order.order_number,
            customer_name: 'Cliente', // Generic name for now
            customer_email: order.email,
            status: order.status,
            total_amount: order.total_amount,
            created_at: order.created_at
          })) || []
        }
      });
    }

    if (action === 'create_manual_order') {
      console.log('📝 Creating manual order...');
      const { orderData } = body;

      // Generate order number
      const orderNumber = `DL-${Date.now()}`;

      // Create the order
      const { data: newOrder, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          email: orderData.email,
          status: orderData.status || 'pending',
          payment_status: orderData.payment_status || 'paid',
          subtotal: orderData.subtotal,
          total_amount: orderData.total_amount,
          currency: 'ARS',
          mp_payment_method: orderData.payment_method || 'manual',
          customer_notes: orderData.notes,
          shipping_first_name: orderData.shipping?.first_name,
          shipping_last_name: orderData.shipping?.last_name,
          shipping_address_1: orderData.shipping?.address_1,
          shipping_city: orderData.shipping?.city,
          shipping_state: orderData.shipping?.state,
          shipping_postal_code: orderData.shipping?.postal_code,
          shipping_phone: orderData.shipping?.phone
        })
        .select()
        .single();

      if (orderError) {
        console.error('❌ Error creating manual order:', orderError);
        return NextResponse.json(
          { error: 'Failed to create order' },
          { status: 500 }
        );
      }

      // Create order items if provided
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          order_id: newOrder.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
          product_name: item.product_name,
          variant_title: item.variant_title
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error('❌ Error creating order items:', itemsError);
          // Don't fail the whole operation, just log the error
        }
      }

      console.log('✅ Manual order created successfully:', newOrder.id);

      return NextResponse.json({
        success: true,
        order: newOrder
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Admin orders POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
