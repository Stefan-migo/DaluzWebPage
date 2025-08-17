import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const search = searchParams.get('search') || '';

    const supabase = await createClient();
    
    // Check admin authorization (only super admin can manage admin users)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRole } = await supabase.rpc('get_admin_role', { user_id: user.id });
    if (adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Build the query - simplified without profiles join for now
    let query = supabase
      .from('admin_users')
      .select(`
        id,
        email,
        role,
        permissions,
        is_active,
        last_login,
        created_at,
        updated_at
      `);

    // Apply filters
    if (role && role !== 'all') {
      query = query.eq('role', role);
    }

    if (status && status !== 'all') {
      const isActive = status === 'active';
      query = query.eq('is_active', isActive);
    }

    if (search) {
      query = query.ilike('email', `%${search}%`);
    }

    const { data: adminUsers, error } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admin users:', error);
      return NextResponse.json({ error: 'Failed to fetch admin users' }, { status: 500 });
    }

    // Get activity stats for each admin user
    const { data: activityStats } = await supabase
      .from('admin_activity_log')
      .select('admin_user_id, created_at')
      .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    const activityMap = activityStats?.reduce((acc: any, activity) => {
      if (!acc[activity.admin_user_id]) {
        acc[activity.admin_user_id] = 0;
      }
      acc[activity.admin_user_id]++;
      return acc;
    }, {}) || {};

    // Enhance admin users with analytics
    const adminUsersWithStats = adminUsers?.map(admin => ({
      ...admin,
      analytics: {
        activityCount30Days: activityMap[admin.id] || 0,
        lastActivity: admin.last_login,
        fullName: null // TODO: Get from profiles table when needed
      }
    })) || [];

    return NextResponse.json({ adminUsers: adminUsersWithStats });

  } catch (error) {
    console.error('Error in admin users API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, permissions, is_active = true } = body;

    const supabase = await createClient();
    
    // Check admin authorization (only super admin can create admin users)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRole } = await supabase.rpc('get_admin_role', { user_id: user.id });
    if (adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Validate input
    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const validRoles = ['super_admin', 'store_manager', 'customer_support', 'content_manager'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }

    // Check if user exists in auth.users
    const { data: existingUser } = await supabase
      .from('auth.users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (!existingUser) {
      return NextResponse.json({ 
        error: 'User must be registered first. The user needs to sign up before being granted admin access.' 
      }, { status: 400 });
    }

    // Check if user is already an admin
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id, email')
      .eq('email', email)
      .single();

    if (existingAdmin) {
      return NextResponse.json({ error: 'User is already an admin' }, { status: 400 });
    }

    // Default permissions based on role
    const defaultPermissions = getDefaultPermissions(role);
    const finalPermissions = permissions || defaultPermissions;

    // Create admin user
    const { data: newAdmin, error: createError } = await supabase
      .from('admin_users')
      .insert({
        id: existingUser.id,
        email: existingUser.email,
        role,
        permissions: finalPermissions,
        is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select(`
        id,
        email,
        role,
        permissions,
        is_active,
        created_at
      `)
      .single();

    if (createError) {
      console.error('Error creating admin user:', createError);
      return NextResponse.json({ error: 'Failed to create admin user' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'create_admin_user',
      resource_type: 'admin_user',
      resource_id: newAdmin.id,
      details: { 
        new_admin_email: email,
        role,
        created_by: user.email
      }
    });

    return NextResponse.json({ adminUser: newAdmin });

  } catch (error) {
    console.error('Error in create admin user API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to get default permissions based on role
function getDefaultPermissions(role: string) {
  const permissions: Record<string, any> = {
    super_admin: {
      orders: ['read', 'create', 'update', 'delete'],
      products: ['read', 'create', 'update', 'delete'],
      customers: ['read', 'create', 'update', 'delete'],
      analytics: ['read'],
      settings: ['read', 'create', 'update', 'delete'],
      admin_users: ['read', 'create', 'update', 'delete'],
      support: ['read', 'create', 'update', 'delete'],
      bulk_operations: ['read', 'create', 'update', 'delete']
    },
    store_manager: {
      orders: ['read', 'create', 'update', 'delete'],
      products: ['read', 'create', 'update', 'delete'],
      customers: ['read', 'update'],
      analytics: ['read'],
      settings: ['read'],
      support: ['read', 'create', 'update'],
      bulk_operations: ['read', 'create', 'update']
    },
    customer_support: {
      orders: ['read', 'update'],
      products: ['read'],
      customers: ['read', 'create', 'update'],
      analytics: ['read'],
      support: ['read', 'create', 'update', 'delete']
    },
    content_manager: {
      products: ['read', 'create', 'update'],
      customers: ['read'],
      analytics: ['read'],
      settings: ['read']
    }
  };

  return permissions[role] || {};
}
