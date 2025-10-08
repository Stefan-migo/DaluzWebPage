import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const period = parseInt(searchParams.get('period') || '30');

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - period);

    // Fetch basic data from database
    const productsResult = await supabase
      .from('products')
      .select('id, name, price, category_id, created_at')
      .eq('status', 'active');

    const products = productsResult.data || [];
    const categories: any[] = []; // Categories will be fetched separately if needed

    // Generate mock analytics data based on real products
    const analytics = {
      kpis: {
        totalRevenue: products.length * 15000, // Mock revenue calculation
        totalOrders: Math.floor(products.length * 2.5), // Mock orders
        totalCustomers: Math.floor(products.length * 3.2), // Mock customers
        totalProducts: products.length,
        avgOrderValue: 15000,
        revenueGrowth: 12.5, // Mock growth percentage
        conversionRate: 3.2 // Mock conversion rate
      },
      trends: {
        sales: generateTrendData(period, 'sales'),
        customers: generateTrendData(period, 'customers')
      },
      products: {
        topProducts: products.slice(0, 5).map(product => ({
          id: product.id,
          name: product.name,
          category: categories.find(c => c.id === product.category_id)?.name || 'Sin categoría',
          revenue: Math.floor(Math.random() * 50000) + 10000,
          quantity: Math.floor(Math.random() * 20) + 1,
          orders: Math.floor(Math.random() * 15) + 1
        })),
        categoryRevenue: categories.slice(0, 6).map(category => ({
          category: category.name,
          revenue: Math.floor(Math.random() * 100000) + 20000
        }))
      },
      customers: {
        segmentation: {
          new: Math.floor(products.length * 0.3),
          basic: Math.floor(products.length * 0.4),
          premium: Math.floor(products.length * 0.2),
          members: Math.floor(products.length * 0.6),
          nonMembers: Math.floor(products.length * 0.4)
        }
      },
      orders: {
        statusDistribution: {
          'pendiente': Math.floor(products.length * 0.2),
          'procesando': Math.floor(products.length * 0.3),
          'enviado': Math.floor(products.length * 0.4),
          'entregado': Math.floor(products.length * 0.1)
        }
      },
      period: {
        from: startDate.toISOString().split('T')[0],
        to: endDate.toISOString().split('T')[0],
        days: period
      }
    };

    return NextResponse.json({ analytics });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

// Helper function to generate trend data
function generateTrendData(days: number, type: 'sales' | 'customers') {
  const data = [];
  const baseValue = type === 'sales' ? 5000 : 2;
  const variance = type === 'sales' ? 2000 : 1;
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.floor(baseValue + (Math.random() - 0.5) * variance),
      count: Math.floor(Math.random() * 10) + 1
    });
  }
  
  return data;
}