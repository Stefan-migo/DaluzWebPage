import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/utils/supabase/server';

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

    // Build the query to get customers from profiles table
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

    // Calculate customer analytics
    console.log('📊 Calculating customer analytics...');
    const customerStats = customers?.map(customer => {
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

// Handle both analytics and customer creation
export async function POST(request: NextRequest) {
  try {
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

    // Get request body to determine action
    const body = await request.json();
    
    // Check if this is a customer creation request (has email field)
    if (body.email) {
      console.log('🔍 Customers API POST called (create new customer)');
      console.log('📝 Create customer data received:', body);

      // Validate required fields
      if (!body.email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
      }

      if (!body.first_name && !body.last_name) {
        return NextResponse.json({ error: 'At least first name or last name is required' }, { status: 400 });
      }

      // Check if customer already exists
      const { data: existingCustomer, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', body.email)
        .single();

      if (existingCustomer) {
        return NextResponse.json({ error: 'Customer with this email already exists' }, { status: 400 });
      }

      // Prepare customer data
      const customerData = {
        first_name: body.first_name || null,
        last_name: body.last_name || null,
        email: body.email,
        phone: body.phone || null,
        address_line_1: body.address_line_1 || null,
        address_line_2: body.address_line_2 || null,
        city: body.city || null,
        state: body.state || null,
        postal_code: body.postal_code || null,
        country: body.country || 'Argentina',
        membership_tier: body.membership_tier || 'none',
        is_member: body.is_member || false,
        membership_start_date: body.membership_start_date ? new Date(body.membership_start_date).toISOString() : null,
        membership_end_date: body.membership_end_date ? new Date(body.membership_end_date).toISOString() : null,
        newsletter_subscribed: body.newsletter_subscribed || false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('🔄 Creating new customer profile...');
      const { data: newCustomer, error: createError } = await supabase
        .from('profiles')
        .insert(customerData)
        .select()
        .single();

      if (createError) {
        console.error('❌ Error creating customer:', createError);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
      }

      console.log('✅ Customer created successfully:', newCustomer.email);

      return NextResponse.json({
        success: true,
        customer: newCustomer
      });
    } else {
      // This is an analytics request
      console.log('🔍 Customers API POST called (analytics summary)');

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
    }

  } catch (error) {
    console.error('Error in customers API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
