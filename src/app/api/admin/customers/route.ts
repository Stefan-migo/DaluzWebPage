import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Customers API GET called');
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const membership_tier = searchParams.get('membership_tier') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    console.log('📊 Query params:', { search, membership_tier, status, page, limit });

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

    // Build the query (simplified to use only existing tables)
    console.log('🗄️ Building database query...');
    let query = supabase
      .from('profiles')
      .select(`
        *
      `);

    // Apply filters
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    if (membership_tier && membership_tier !== 'all') {
      query = query.eq('membership_tier', membership_tier);
    }

    // Get total count for pagination
    console.log('📊 Getting customer count...');
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error getting customer count:', countError);
      return NextResponse.json({ error: 'Failed to count customers' }, { status: 500 });
    }
    console.log('✅ Customer count:', count);

    // Apply pagination and ordering
    console.log('📋 Executing main query with pagination...');
    const { data: customers, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching customers:', error);
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
    console.log('✅ Customers fetched successfully:', customers?.length || 0);

    // Calculate customer analytics (simplified without orders data)
    console.log('📊 Calculating customer analytics...');
    const customerStats = customers?.map(customer => {
      // For now, use basic customer data without order analytics
      // TODO: Add order analytics once orders table relationship is confirmed
      
      // Basic segment classification based on membership
      let segment = 'new';
      if (customer.is_member) {
        segment = customer.membership_tier === 'premium' ? 'vip' : 'regular';
      }

      return {
        ...customer,
        analytics: {
          totalSpent: 0, // TODO: Calculate from orders
          orderCount: 0, // TODO: Calculate from orders
          lastOrderDate: null, // TODO: Get from orders
          avgOrderValue: 0, // TODO: Calculate from orders
          segment,
          lifetimeValue: 0 // TODO: Calculate from orders
        }
      };
    });

    return NextResponse.json({
      customers: customerStats,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Error in customers API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Export the customer analytics summary
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Customers API POST called (analytics summary)');
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

    // Get customer analytics summary
    const { data: totalCustomers, count: totalCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    const { data: activeMembers, count: activeCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_member', true);

    const { data: recentCustomers, count: recentCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

    // Get membership tier distribution
    console.log('📊 Getting membership distribution...');
    const { data: membershipDistribution, error: membershipError } = await supabase
      .from('profiles')
      .select('membership_tier')
      .neq('membership_tier', 'none');

    if (membershipError) {
      console.error('❌ Error getting membership distribution:', membershipError);
      // Continue with empty distribution rather than failing
    }

    const tierCounts = membershipDistribution?.reduce((acc: any, profile: any) => {
      acc[profile.membership_tier] = (acc[profile.membership_tier] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      summary: {
        totalCustomers: totalCount || 0,
        activeMembers: activeCount || 0,
        newCustomersThisMonth: recentCount || 0,
        membershipDistribution: tierCounts || {}
      }
    });

  } catch (error) {
    console.error('Error in customer analytics API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
