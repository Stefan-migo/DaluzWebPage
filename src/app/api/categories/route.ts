import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    
    const includeProducts = searchParams.get('include_products') === 'true';
    const parentId = searchParams.get('parent_id');

    let query = supabase
      .from('categories')
      .select(includeProducts ? `
        *,
        products!inner (
          id,
          name,
          slug,
          price,
          featured_image,
          is_featured
        )
      ` : '*')
      .eq('is_active', true)
      .order('sort_order');

    // Filter by parent category if specified
    if (parentId) {
      query = query.eq('parent_id', parentId);
    } else if (parentId === null) {
      query = query.is('parent_id', null);
    }

    const { data: categories, error } = await query;

    if (error) {
      console.error('Error fetching categories:', error);
      return NextResponse.json(
        { error: 'Failed to fetch categories' },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories: categories || [] });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method for creating categories
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const categoryData = await request.json();

    // Validate required fields
    if (!categoryData.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!categoryData.slug) {
      categoryData.slug = categoryData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Set default values
    const category = {
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || '',
      image_url: categoryData.image_url || '',
      parent_id: categoryData.parent_id || null,
      sort_order: categoryData.sort_order || 0,
      is_active: categoryData.is_active !== false,
    };

    // Insert category
    const { data, error } = await supabase
      .from('categories')
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A category with this URL already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Category created successfully',
      category: data,
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 