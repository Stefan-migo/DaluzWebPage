import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const offset = (page - 1) * limit;

    // Filters
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const skinType = searchParams.get('skin_type');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const featured = searchParams.get('featured');
    const inStock = searchParams.get('in_stock');

    // Sort
    const sortBy = searchParams.get('sort_by') || 'created_at';
    const sortOrder = searchParams.get('sort_order') || 'desc';

    // Build query
    let query = supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug
        ),
        product_variants (
          id,
          title,
          price,
          inventory_quantity,
          option1,
          option2,
          option3,
          is_default
        )
      `)
      .eq('status', 'active');

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    if (skinType) {
      query = query.contains('skin_type', [skinType]);
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true);
    }

    if (inStock === 'true') {
      query = query.gt('inventory_quantity', 0);
    }

    // Apply sorting
    const sortColumn = getSortColumn(sortBy);
    const order = getSortOrder(sortBy);
    query = query.order(sortColumn, { ascending: order === 'asc' });

    // Execute query with pagination
    const { data: products, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = Math.ceil((count || 0) / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasMore,
      },
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST method for creating products
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const productData = await request.json();

    // Validate required fields
    if (!productData.name || !productData.price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!productData.slug) {
      productData.slug = productData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }

    // Set default values
    const product = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description || '',
      short_description: productData.short_description || '',
      price: parseFloat(productData.price),
      compare_at_price: productData.compare_at_price ? parseFloat(productData.compare_at_price) : null,
      category_id: productData.category_id || null,
      featured_image: productData.featured_image || '',
      gallery: productData.gallery || [],
      skin_type: productData.skin_type || [],
      benefits: productData.benefits || [],
      usage_instructions: productData.usage_instructions || '',
      precautions: productData.precautions || '',
      certifications: productData.certifications || [],
      ingredients: productData.ingredients || [],
      inventory_quantity: parseInt(productData.inventory_quantity) || 0,
      status: productData.status || 'active',
      is_featured: productData.is_featured || false,
      published_at: productData.published_at || new Date().toISOString(),
      vendor: 'ALKIMYA DA LUZ',
      currency: 'ARS',
      requires_shipping: true,
      track_inventory: true,
      inventory_policy: 'deny',
      low_stock_threshold: 5,
    };

    // Insert product
    const { data, error } = await supabase
      .from('products')
      .insert([product])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      
      // Handle unique constraint violations
      if (error.code === '23505') {
        if (error.message.includes('slug')) {
          return NextResponse.json(
            { error: 'A product with this URL already exists' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: 'Product already exists' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Product created successfully',
      product: data,
    }, { status: 201 });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getSortColumn(sortBy: string): string {
  switch (sortBy) {
    case 'price_asc':
    case 'price_desc':
      return 'price';
    case 'name':
      return 'name';
    case 'newest':
      return 'created_at';
    case 'featured':
      return 'is_featured';
    default:
      return 'created_at';
  }
}

function getSortOrder(sort: string) {
  switch (sort) {
    case 'price_asc': return 'asc';
    case 'price_desc': return 'desc';
    case 'name': return 'asc';
    case 'newest': return 'desc';
    case 'featured': return 'desc';
    default: return 'desc';
  }
} 