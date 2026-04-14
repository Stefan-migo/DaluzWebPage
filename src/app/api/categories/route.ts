import { NextRequest, NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { createServiceRoleClient } from '@/lib/supabase';

// Cached fetch — revalidates every 5 min or on 'categories' tag
const getCategoriesCached = unstable_cache(
  async () => {
    const supabase = createServiceRoleClient();

    const { data: categories, error } = await supabase
      .from('categories' as any)
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return categories;
  },
  ['all-categories'],
  { revalidate: 300, tags: ['categories'] },
);

// GET - Fetch all categories (cached)
export async function GET() {
  try {
    const categories = await getCategoriesCached();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
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
      description: categoryData.description || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert category
    const { data, error } = await supabase
      .from('categories' as any)
      .insert([category])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);

      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.message.includes('slug')) {
          return NextResponse.json(
            { error: 'A category with this slug already exists' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Category already exists' },
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
