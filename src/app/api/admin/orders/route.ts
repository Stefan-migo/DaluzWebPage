import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { requireAuth, requireRole } from '@/lib/api/middleware';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const { userId } = await requireAuth(request);
    await requireRole(userId, 'admin'); // This will be enhanced later

    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
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
        ),
        profiles!orders_user_id_fkey (
          first_name,
          last_name
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply status filter
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Error fetching admin orders:', ordersError);
      return NextResponse.json(
        { error: 'Failed to fetch orders' },
        { status: 500 }
      );
    }

    // Transform data to include customer names
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      order_number: order.order_number,
      customer_name: order.profiles?.[0] ? `${order.profiles[0].first_name || ''} ${order.profiles[0].last_name || ''}`.trim() || 'Cliente' : 'Cliente',
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
    console.error('Admin orders API error:', error);
    
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

// Get order statistics for dashboard
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'get_stats') {
      // Check authentication and admin role
      const { userId } = await requireAuth(request);
      await requireRole(userId, 'admin');

      // Get order counts by status - using simpler approach
      const { data: allOrders, error: statusError } = await supabaseAdmin
        .from('orders')
        .select('status');

      if (statusError) {
        console.error('Error getting order stats:', statusError);
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

      const { data: revenueData, error: revenueError } = await supabaseAdmin
        .from('orders')
        .select('total_amount')
        .eq('payment_status', 'paid')
        .gte('created_at', startOfMonth.toISOString());

      if (revenueError) {
        console.error('Error getting revenue stats:', revenueError);
        throw revenueError;
      }

      const totalRevenue = revenueData?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

      // Get recent orders
      const { data: recentOrders, error: recentError } = await supabaseAdmin
        .from('orders')
        .select(`
          id,
          order_number,
          email,
          status,
          total_amount,
          created_at,
          profiles!orders_user_id_fkey (
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (recentError) {
        console.error('Error getting recent orders:', recentError);
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
            customer_name: order.profiles?.[0] ? `${order.profiles[0].first_name || ''} ${order.profiles[0].last_name || ''}`.trim() || 'Cliente' : 'Cliente',
            customer_email: order.email,
            status: order.status,
            total_amount: order.total_amount,
            created_at: order.created_at
          })) || []
        }
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Admin orders stats API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
