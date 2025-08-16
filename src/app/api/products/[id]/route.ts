import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          slug,
          description
        ),
        product_variants (
          id,
          title,
          price,
          compare_at_price,
          inventory_quantity,
          weight,
          barcode,
          image_url,
          option1,
          option2,
          option3,
          position,
          is_default
        )
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { id } = params;
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.price || !body.category_id || !body.inventory_quantity) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category_id, inventory_quantity' },
        { status: 400 }
      );
    }

    // Update the product
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        compare_at_price: body.compare_at_price,
        category_id: body.category_id,
        sku: body.sku,
        inventory_quantity: body.inventory_quantity,
        weight: body.weight,
        dimensions: body.dimensions,
        image_url: body.image_url,
        skin_types: body.skin_types,
        benefits: body.benefits,
        certifications: body.certifications,
        ingredients: body.ingredients,
        usage_instructions: body.usage_instructions,
        featured: body.featured,
        status: body.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating product:', error);
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: 'Product updated successfully',
      product 
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 