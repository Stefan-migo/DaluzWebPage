import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { createClient } from '@/utils/supabase/server'; // Correct import
import { createClient as createAdminClient } from '@supabase/supabase-js';

const mpClient = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

// Admin client for database operations that require elevated privileges
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  // 1. Create a Supabase client that can read cookies
  const supabase = await createClient(); // Use the correct, existing function

  // 2. Get the current user from the session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 3. Get cart items and customer info from the request body
  const { items, customerInfo } = await req.json();
  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
  }

  // 4. Validate address number server-side
  const streetNumber = parseInt(customerInfo.addressNumber, 10);
  if (isNaN(streetNumber) || streetNumber <= 0) {
    return NextResponse.json({ error: 'Invalid address number' }, { status: 400 });
  }

  // 5. Create a new order record in the database first
  const totalAmount = items.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0);
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      total: totalAmount,
      currency: 'ARS',
      // You can add more customer info here if your table supports it
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }

  // 6. Prepare the preference for Mercado Pago
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

  try {
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
        external_reference: order.id.toString(), // Link the payment to our order ID
        notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
      },
    });

    // 7. Update our order with the preference ID from Mercado Pago
    await supabaseAdmin
      .from('orders')
      .update({ mercadopago_preference_id: result.id })
      .eq('id', order.id);

    return NextResponse.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error('Error creating Mercado Pago preference:', error);
    return NextResponse.json({ error: 'Failed to create payment preference' }, { status: 500 });
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

    const supabase = createClient();

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
      total_amount: order.total_amount,
      currency: order.currency,
      preference_id: order.mp_preference_id,
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