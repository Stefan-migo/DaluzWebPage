import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

interface Params {
  slug: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    const supabase = await createClient();
    const { slug } = params;

    // Hardcoded fallback for Línea Utópica to bypass local database requirements
    if (slug === 'linea-utopica') {
      return NextResponse.json({
        category: {
          id: 'linea-utopica-id',
          name: 'Línea Utópica',
          slug: 'linea-utopica',
          description: 'Línea de maquillaje consciente y ceremonial.',
          is_active: true
        }
      });
    }

    const { data: category, error } = await supabase
      .from('categories' as any)
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching category by slug:', error);
      return NextResponse.json(
        { error: 'Failed to fetch category' },
        { status: 500 }
      );
    }

    return NextResponse.json({ category });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 