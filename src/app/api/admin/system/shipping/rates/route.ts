import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    const { searchParams } = new URL(request.url);
    const zoneId = searchParams.get('zone_id');

    let query = supabase
      .from('shipping_rates')
      .select('*')
      .order('sort_order', { ascending: true });

    if (zoneId) {
      query = query.eq('zone_id', zoneId);
    }

    const { data: rates, error } = await query;

    if (error) {
      console.error('Error fetching shipping rates:', error);
      return NextResponse.json({ error: 'Failed to fetch shipping rates' }, { status: 500 });
    }

    return NextResponse.json({ rates: rates || [] });

  } catch (error) {
    console.error('Error in shipping rates API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    if (!body.zone_id || !body.name || !body.rate_type) {
      return NextResponse.json({ error: 'zone_id, name, and rate_type are required' }, { status: 400 });
    }

    const { data: rate, error } = await supabase
      .from('shipping_rates')
      .insert({
        ...body,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shipping rate:', error);
      return NextResponse.json({ error: 'Failed to create shipping rate' }, { status: 500 });
    }

    return NextResponse.json({ rate });

  } catch (error) {
    console.error('Error in create shipping rate API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
