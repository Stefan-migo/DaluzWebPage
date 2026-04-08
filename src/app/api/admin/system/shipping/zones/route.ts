import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    const { data: zones, error } = await supabase
      .from('shipping_zones')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching shipping zones:', error);
      return NextResponse.json({ error: 'Failed to fetch shipping zones' }, { status: 500 });
    }

    return NextResponse.json({ zones: zones || [] });

  } catch (error) {
    console.error('Error in shipping zones API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      countries = ['Argentina'],
      states = [],
      cities = [],
      postal_codes = [],
      is_active = true,
      sort_order = 0
    } = body;

    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const { data: zone, error } = await supabase
      .from('shipping_zones')
      .insert({
        name,
        description,
        countries: Array.isArray(countries) ? countries : [countries],
        states: Array.isArray(states) ? states : (states ? [states] : []),
        cities: Array.isArray(cities) ? cities : (cities ? [cities] : []),
        postal_codes: Array.isArray(postal_codes) ? postal_codes : (postal_codes ? [postal_codes] : []),
        is_active,
        sort_order
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating shipping zone:', error);
      return NextResponse.json({ error: 'Failed to create shipping zone' }, { status: 500 });
    }

    return NextResponse.json({ zone });

  } catch (error) {
    console.error('Error in create shipping zone API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

