// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN! 
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET!;

// Function to verify the Mercado Pago webhook signature
const verifySignature = (req: NextRequest, rawBody: string) => {
  const signature = req.headers.get('x-signature');
  const timestamp = req.headers.get('x-request-id');
  
  if (!signature || !timestamp) {
    return false;
  }

  const [ts, hash] = signature.split(',');
  const signedTemplate = `id:${timestamp};ts:${ts.split('=')[1]};`;
  
  const hmac = crypto.createHmac('sha256', webhookSecret);
  hmac.update(signedTemplate);
  const calculatedSignature = hmac.digest('hex');
  
  return calculatedSignature === hash.split('=')[1];
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  
  // Signature verification should be implemented here
  
  const body = JSON.parse(rawBody);

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    const payment = new Payment(client);

    try {
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;

        const { error } = await supabaseAdmin
          .from('orders')
          .update({
            status: paymentInfo.status,
            mercadopago_payment_id: paymentId,
            payment_method: paymentInfo.payment_method_id,
            installments: paymentInfo.installments,
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        console.log(`Order ${orderId} updated to status: ${paymentInfo.status}`);
      }
    } catch (error) {
      console.error('Error fetching payment info from Mercado Pago:', error);
      return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

// GET endpoint for webhook testing
export async function GET() {
  return NextResponse.json({
    message: 'Mercado Pago webhook endpoint is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
} 