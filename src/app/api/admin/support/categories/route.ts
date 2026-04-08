import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    // Get all support categories from database
    console.log('🗄️ Fetching support categories from database...');
    
    const { data: categories, error: fetchError } = await supabase
      .from('support_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching categories:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch categories',
        details: fetchError.message 
      }, { status: 500 });
    }

    // If no categories exist, return empty array
    if (!categories || categories.length === 0) {
      console.log('⚠️ No categories found in database');
      return NextResponse.json({ 
        categories: [],
        message: 'No categories found. Please create some categories first.' 
      });
    }
    
    console.log('✅ Support categories fetched:', categories.length);
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

    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

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
