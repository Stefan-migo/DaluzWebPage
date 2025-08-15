import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    // Get Authorization header as fallback for cookie-based auth
    const authHeader = req.headers.get('authorization');
    const bearerToken = authHeader?.replace('Bearer ', '');
    
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // For API routes, we don't set cookies
          },
          remove(name: string, options: any) {
            // For API routes, we don't remove cookies
          },
        },
      }
    );

    // Simplified authentication - try token first, then cookies
    let user = null;

    if (bearerToken) {
      const { data: { user: tokenUser } } = await supabase.auth.getUser(bearerToken);
      user = tokenUser;
    }

    if (!user) {
      const { data: { user: cookieUser } } = await supabase.auth.getUser();
      user = cookieUser;
    }
    
    if (!user) {
      return NextResponse.json({ 
        error: 'Authentication required. Please log in and try again.'
      }, { status: 401 });
    }

    const { items, customerInfo } = await req.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
  }

  const streetNumber = parseInt(customerInfo.addressNumber, 10);
  if (isNaN(streetNumber) || streetNumber <= 0) {
    return NextResponse.json({ error: 'Invalid address number' }, { status: 400 });
  }

  const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: `DL-${Date.now()}`,
      user_id: user.id,
      email: customerInfo.email,
      status: 'pending',
      subtotal: totalAmount,
      total_amount: totalAmount,
      currency: 'ARS',
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    variant_id: item.variantId || null,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
    product_name: item.name,
    variant_title: item.size || null,
    sku: item.sku || null,
  }));

  const { error: orderItemsError } = await supabaseAdmin
    .from('order_items')
    .insert(orderItems);

  if (orderItemsError) {
    console.error('Error creating order items:', orderItemsError);
    // Don't fail the whole process, but log the error
    console.warn('Order created but order items failed:', order.id);
  }

  const preferenceItems = items.map((item: any) => ({
    id: item.productId,
    title: item.name,
    description: item.size,
    picture_url: item.image,
    quantity: item.quantity,
    unit_price: item.price,
    currency_id: 'ARS',
  }));

  const preference = new Preference(mpClient);

    const result = await preference.create({
      body: {
        items: preferenceItems,
        payer: {
          name: customerInfo.firstName,
          surname: customerInfo.lastName,
          email: customerInfo.email,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
          failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/failure`,
        },
        auto_return: 'approved',
        external_reference: order.id.toString(),
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      },
    });

    await supabaseAdmin
      .from('orders')
      .update({ mercadopago_preference_id: result.id })
      .eq('id', order.id);

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Checkout API error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace',
      name: error instanceof Error ? error.name : 'Unknown error type'
    });
    return NextResponse.json({ 
      error: 'Failed to process checkout',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : 'No stack') : undefined
    }, { status: 500 });
  }
}

// GET method to retrieve existing preference
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'ID de orden es requerido.' },
        { status: 400 }
      );
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookies().get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // For API routes, we don't set cookies
          },
          remove(name: string, options: any) {
            // For API routes, we don't remove cookies
          },
        },
      }
    );

    // Get order from database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Orden no encontrada.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      status: order.status,
      total_amount: order.total_amount || order.total,
      currency: order.currency,
      preference_id: order.mercadopago_preference_id,
      created_at: order.created_at
    });

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
} 