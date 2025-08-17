import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUserId = params.id;

    const supabase = await createClient();
    
    // Check admin authorization (only super admin can view admin user details)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRole } = await supabase.rpc('get_admin_role', { user_id: user.id });
    if (adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Get admin user details - simplified without profiles join for now
    const { data: adminUser, error: adminError } = await supabase
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
      `)
      .eq('id', adminUserId)
      .single();

    if (adminError || !adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Get activity history
    const { data: activityHistory, error: activityError } = await supabase
      .from('admin_activity_log')
      .select('action, resource_type, resource_id, details, created_at')
      .eq('admin_user_id', adminUserId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (activityError) {
      console.error('Error fetching activity history:', activityError);
    }

    // Calculate activity stats
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentActivity = activityHistory?.filter(activity => 
      new Date(activity.created_at) >= last30Days
    ) || [];

    const weeklyActivity = activityHistory?.filter(activity => 
      new Date(activity.created_at) >= last7Days
    ) || [];

    // Group activity by day for the last 30 days
    const activityByDay = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dayActivity = recentActivity.filter(activity => {
        const activityDate = new Date(activity.created_at);
        return activityDate >= dayStart && activityDate < dayEnd;
      });

      activityByDay.push({
        date: dayStart.toISOString().split('T')[0],
        count: dayActivity.length
      });
    }

    const adminUserWithAnalytics = {
      ...adminUser,
      activityHistory: activityHistory || [],
      analytics: {
        totalActions: activityHistory?.length || 0,
        actionsLast30Days: recentActivity.length,
        actionsLast7Days: weeklyActivity.length,
        lastActivity: adminUser.last_login,
        activityByDay,
        mostFrequentActions: getMostFrequentActions(recentActivity)
      }
    };

    return NextResponse.json({ adminUser: adminUserWithAnalytics });

  } catch (error) {
    console.error('Error in admin user detail API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUserId = params.id;
    const body = await request.json();
    const { role, permissions, is_active } = body;

    const supabase = await createClient();
    
    // Check admin authorization (only super admin can update admin users)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRole } = await supabase.rpc('get_admin_role', { user_id: user.id });
    if (adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Prevent self-demotion from super admin
    if (user.id === adminUserId && role && role !== 'super_admin') {
      return NextResponse.json({ 
        error: 'Cannot change your own super admin role' 
      }, { status: 400 });
    }

    // Prevent self-deactivation
    if (user.id === adminUserId && is_active === false) {
      return NextResponse.json({ 
        error: 'Cannot deactivate your own account' 
      }, { status: 400 });
    }

    // Validate role if provided
    if (role) {
      const validRoles = ['super_admin', 'store_manager', 'customer_support', 'content_manager'];
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
      }
    }

    // Get current admin user
    const { data: currentAdmin } = await supabase
      .from('admin_users')
      .select('email, role')
      .eq('id', adminUserId)
      .single();

    if (!currentAdmin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (is_active !== undefined) updateData.is_active = is_active;

    // Update admin user - simplified without profiles join for now
    const { data: updatedAdmin, error: updateError } = await supabase
      .from('admin_users')
      .update(updateData)
      .eq('id', adminUserId)
      .select(`
        id,
        email,
        role,
        permissions,
        is_active,
        last_login,
        created_at,
        updated_at
      `)
      .single();

    if (updateError) {
      console.error('Error updating admin user:', updateError);
      return NextResponse.json({ error: 'Failed to update admin user' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'update_admin_user',
      resource_type: 'admin_user',
      resource_id: adminUserId,
      details: { 
        target_admin_email: currentAdmin.email,
        changes: Object.keys(updateData).filter(key => key !== 'updated_at'),
        previous_role: currentAdmin.role,
        new_role: role,
        updated_by: user.email
      }
    });

    return NextResponse.json({ adminUser: updatedAdmin });

  } catch (error) {
    console.error('Error in admin user update API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUserId = params.id;

    const supabase = await createClient();
    
    // Check admin authorization (only super admin can delete admin users)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminRole } = await supabase.rpc('get_admin_role', { user_id: user.id });
    if (adminRole !== 'super_admin') {
      return NextResponse.json({ error: 'Super admin access required' }, { status: 403 });
    }

    // Prevent self-deletion
    if (user.id === adminUserId) {
      return NextResponse.json({ 
        error: 'Cannot delete your own admin account' 
      }, { status: 400 });
    }

    // Get admin user info before deletion
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('email, role')
      .eq('id', adminUserId)
      .single();

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Check if this is the last super admin
    if (adminUser.role === 'super_admin') {
      const { count: superAdminCount } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'super_admin')
        .eq('is_active', true);

      if ((superAdminCount || 0) <= 1) {
        return NextResponse.json({ 
          error: 'Cannot delete the last super admin. At least one super admin must remain.' 
        }, { status: 400 });
      }
    }

    // Delete admin user (this will cascade to activity logs due to ON DELETE SET NULL)
    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', adminUserId);

    if (deleteError) {
      console.error('Error deleting admin user:', deleteError);
      return NextResponse.json({ error: 'Failed to delete admin user' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'delete_admin_user',
      resource_type: 'admin_user',
      resource_id: adminUserId,
      details: { 
        deleted_admin_email: adminUser.email,
        deleted_role: adminUser.role,
        deleted_by: user.email
      }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in admin user delete API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to calculate most frequent actions
function getMostFrequentActions(activities: any[]) {
  const actionCounts = activities.reduce((acc: any, activity) => {
    acc[activity.action] = (acc[activity.action] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(actionCounts)
    .map(([action, count]) => ({ action, count }))
    .sort((a: any, b: any) => b.count - a.count)
    .slice(0, 5);
}
