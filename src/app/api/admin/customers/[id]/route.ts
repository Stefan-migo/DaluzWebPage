import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

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

    // Get customer profile with detailed information
    const { data: customer, error: customerError } = await supabase
      .from('profiles')
      .select(`
        *,
        memberships:memberships(
          id,
          status,
          start_date,
          end_date,
          current_week,
          progress_percentage,
          completed_lessons,
          total_lessons,
          coach_notes,
          member_goals,
          member_notes,
          membership_plans:plan_id(
            id,
            name,
            type,
            price,
            duration_months
          )
        )
      `)
      .eq('id', customerId)
      .single();

    if (customerError || !customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Get customer orders with detailed information
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items:order_items(
          id,
          quantity,
          price,
          product:product_id(
            id,
            name,
            featured_image
          )
        )
      `)
      .eq('user_id', customerId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching customer orders:', ordersError);
    }

    // Calculate customer analytics
    const customerOrders = orders || [];
    const totalSpent = customerOrders.reduce((sum, order) => sum + order.total_amount, 0);
    const orderCount = customerOrders.length;
    const lastOrderDate = customerOrders.length > 0 ? customerOrders[0].created_at : null;
    const avgOrderValue = orderCount > 0 ? totalSpent / orderCount : 0;
    
    // Get order status distribution
    const orderStatusCounts = customerOrders.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    // Calculate customer lifetime value and segment
    let segment = 'new';
    if (orderCount === 0) segment = 'new';
    else if (orderCount === 1) segment = 'first-time';
    else if (orderCount >= 2 && orderCount <= 5) segment = 'regular';
    else if (orderCount > 5) segment = 'vip';
    
    // Check if at risk (no orders in last 3 months)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    if (lastOrderDate && new Date(lastOrderDate) < threeMonthsAgo && orderCount > 0) {
      segment = 'at-risk';
    }

    // Get favorite products (most purchased)
    const productPurchases: any = {};
    customerOrders.forEach(order => {
      order.order_items?.forEach((item: any) => {
        const productId = item.product?.id;
        if (productId) {
          productPurchases[productId] = {
            product: item.product,
            quantity: (productPurchases[productId]?.quantity || 0) + item.quantity,
            totalSpent: (productPurchases[productId]?.totalSpent || 0) + (item.price * item.quantity)
          };
        }
      });
    });

    const favoriteProducts = Object.values(productPurchases)
      .sort((a: any, b: any) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate monthly spending trend (last 12 months)
    const monthlySpending = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthOrders = customerOrders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= monthStart && orderDate <= monthEnd;
      });
      
      const monthSpending = monthOrders.reduce((sum, order) => sum + order.total_amount, 0);
      
      monthlySpending.push({
        month: date.toLocaleDateString('es-AR', { year: 'numeric', month: 'short' }),
        amount: monthSpending,
        orders: monthOrders.length
      });
    }

    const customerWithAnalytics = {
      ...customer,
      orders: customerOrders,
      analytics: {
        totalSpent,
        orderCount,
        lastOrderDate,
        avgOrderValue,
        segment,
        lifetimeValue: totalSpent,
        orderStatusCounts,
        favoriteProducts,
        monthlySpending
      }
    };

    return NextResponse.json({ customer: customerWithAnalytics });

  } catch (error) {
    console.error('Error in customer detail API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;
    const body = await request.json();

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

    // Update customer profile
    const { data: updatedCustomer, error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        address_line_1: body.address_line_1,
        address_line_2: body.address_line_2,
        city: body.city,
        state: body.state,
        postal_code: body.postal_code,
        country: body.country,
        membership_tier: body.membership_tier,
        newsletter_subscribed: body.newsletter_subscribed,
        updated_at: new Date().toISOString()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating customer:', updateError);
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'update_customer',
      resource_type: 'customer',
      resource_id: customerId,
      details: { updated_fields: Object.keys(body) }
    });

    return NextResponse.json({ customer: updatedCustomer });

  } catch (error) {
    console.error('Error in customer update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
