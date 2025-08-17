import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

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

    // Calculate date range
    let fromDate: string;
    let toDate: string = new Date().toISOString();

    if (startDate && endDate) {
      fromDate = new Date(startDate).toISOString();
      toDate = new Date(endDate).toISOString();
    } else {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(period));
      fromDate = daysAgo.toISOString();
    }

    // Get sales analytics
    const { data: salesData } = await supabase
      .from('orders')
      .select('total_amount, created_at, status, payment_status')
      .gte('created_at', fromDate)
      .lte('created_at', toDate)
      .order('created_at', { ascending: true });

    // Get customer analytics
    const { data: customersData } = await supabase
      .from('profiles')
      .select('created_at, membership_tier, is_member')
      .gte('created_at', fromDate)
      .lte('created_at', toDate);

    // Get product analytics
    const { data: orderItemsData } = await supabase
      .from('order_items')
      .select(`
        quantity,
        price,
        product:product_id(
          id,
          name,
          category:category_id(name)
        ),
        order:order_id(
          created_at,
          status
        )
      `)
      .gte('order.created_at', fromDate)
      .lte('order.created_at', toDate);

    // Get total counts
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Calculate KPIs
    const paidOrders = salesData?.filter(order => order.payment_status === 'paid') || [];
    const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    const avgOrderValue = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

    // Calculate period comparison (previous period)
    const periodDays = parseInt(period);
    const previousFromDate = new Date(fromDate);
    previousFromDate.setDate(previousFromDate.getDate() - periodDays);
    
    const { data: previousPeriodOrders } = await supabase
      .from('orders')
      .select('total_amount, payment_status')
      .gte('created_at', previousFromDate.toISOString())
      .lt('created_at', fromDate);

    const previousRevenue = previousPeriodOrders
      ?.filter(order => order.payment_status === 'paid')
      .reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;

    const revenueGrowth = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Sales trend by day
    const salesTrend = generateDailyTrend(paidOrders, fromDate, toDate);

    // Customer acquisition trend
    const customerTrend = generateDailyTrend(customersData || [], fromDate, toDate, 'acquisition');

    // Top products
    const productSales = groupProductSales(orderItemsData || []);
    const topProducts = Object.entries(productSales)
      .map(([productId, data]: [string, any]) => ({
        id: productId,
        name: data.name,
        category: data.category,
        revenue: data.revenue,
        quantity: data.quantity,
        orders: data.orders
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Customer segmentation
    const customerSegmentation = calculateCustomerSegmentation(customersData || []);

    // Revenue by category
    const categoryRevenue = calculateCategoryRevenue(orderItemsData || []);

    // Order status distribution
    const orderStatusDistribution = salesData?.reduce((acc: any, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {}) || {};

    const analytics = {
      kpis: {
        totalRevenue,
        totalOrders: paidOrders.length,
        totalCustomers: totalCustomers || 0,
        totalProducts: totalProducts || 0,
        avgOrderValue,
        revenueGrowth,
        conversionRate: totalOrders && totalCustomers 
          ? (paidOrders.length / (totalCustomers || 1)) * 100 
          : 0
      },
      trends: {
        sales: salesTrend,
        customers: customerTrend
      },
      products: {
        topProducts,
        categoryRevenue
      },
      customers: {
        segmentation: customerSegmentation,
        acquisition: customerTrend
      },
      orders: {
        statusDistribution: orderStatusDistribution
      },
      period: {
        from: fromDate,
        to: toDate,
        days: periodDays
      }
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Error in analytics dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper functions
function generateDailyTrend(data: any[], fromDate: string, toDate: string, type = 'sales') {
  const trend: any[] = [];
  const startDate = new Date(fromDate);
  const endDate = new Date(toDate);
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayStr = d.toISOString().split('T')[0];
    const dayData = data.filter(item => {
      const itemDate = new Date(item.created_at).toISOString().split('T')[0];
      return itemDate === dayStr;
    });

    if (type === 'sales') {
      const revenue = dayData.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      trend.push({
        date: dayStr,
        value: revenue,
        count: dayData.length
      });
    } else if (type === 'acquisition') {
      trend.push({
        date: dayStr,
        value: dayData.length,
        count: dayData.length
      });
    }
  }
  
  return trend;
}

function groupProductSales(orderItems: any[]) {
  const productSales: any = {};
  
  orderItems.forEach(item => {
    if (!item.product?.id) return;
    
    const productId = item.product.id;
    if (!productSales[productId]) {
      productSales[productId] = {
        name: item.product.name,
        category: item.product.category?.name || 'Sin categoría',
        revenue: 0,
        quantity: 0,
        orders: new Set()
      };
    }
    
    productSales[productId].revenue += (item.price || 0) * (item.quantity || 0);
    productSales[productId].quantity += item.quantity || 0;
    productSales[productId].orders.add(item.order?.id);
  });

  // Convert Set to count
  Object.keys(productSales).forEach(productId => {
    productSales[productId].orders = productSales[productId].orders.size;
  });

  return productSales;
}

function calculateCustomerSegmentation(customers: any[]) {
  const segmentation = {
    new: 0,
    basic: 0,
    premium: 0,
    members: 0,
    nonMembers: 0
  };

  customers.forEach(customer => {
    if (customer.is_member) {
      segmentation.members++;
      if (customer.membership_tier === 'basic') {
        segmentation.basic++;
      } else if (customer.membership_tier === 'premium') {
        segmentation.premium++;
      }
    } else {
      segmentation.nonMembers++;
      segmentation.new++;
    }
  });

  return segmentation;
}

function calculateCategoryRevenue(orderItems: any[]) {
  const categoryRevenue: any = {};
  
  orderItems.forEach(item => {
    const category = item.product?.category?.name || 'Sin categoría';
    const revenue = (item.price || 0) * (item.quantity || 0);
    
    if (!categoryRevenue[category]) {
      categoryRevenue[category] = 0;
    }
    categoryRevenue[category] += revenue;
  });

  return Object.entries(categoryRevenue)
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a: any, b: any) => b.revenue - a.revenue);
}
