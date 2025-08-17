import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Support Categories API GET called');
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

    // Get all support categories (using mock data until tables are created)
    console.log('🗄️ Returning mock support categories...');
    
    // TODO: Replace with actual database query once support_categories table is created
    const categories = [
      {
        id: '1',
        name: 'Productos',
        description: 'Consultas sobre productos biocosmética',
        is_active: true,
        sort_order: 1,
        color: '#10B981'
      },
      {
        id: '2', 
        name: 'Pedidos',
        description: 'Problemas con pedidos y entregas',
        is_active: true,
        sort_order: 2,
        color: '#3B82F6'
      },
      {
        id: '3',
        name: 'Membresía',
        description: 'Consultas sobre programa de transformación',
        is_active: true,
        sort_order: 3,
        color: '#8B5CF6'
      },
      {
        id: '4',
        name: 'Técnico',
        description: 'Problemas técnicos del sitio web',
        is_active: true,
        sort_order: 4,
        color: '#F59E0B'
      }
    ];
    
    console.log('✅ Support categories provided:', categories.length);
    return NextResponse.json({ categories });

  } catch (error) {
    console.error('Error in support categories API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      sort_order = 0
    } = body;

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

    // Create the category
    const { data: category, error: categoryError } = await supabase
      .from('support_categories')
      .insert({
        name,
        description,
        sort_order,
        is_active: true
      })
      .select()
      .single();

    if (categoryError) {
      console.error('Error creating support category:', categoryError);
      return NextResponse.json({ error: 'Failed to create support category' }, { status: 500 });
    }

    // Log admin activity
    await supabase.rpc('log_admin_activity', {
      action: 'create_support_category',
      resource_type: 'support_category',
      resource_id: category.id,
      details: { category_name: name }
    });

    return NextResponse.json({ category });

  } catch (error) {
    console.error('Error in create support category API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
