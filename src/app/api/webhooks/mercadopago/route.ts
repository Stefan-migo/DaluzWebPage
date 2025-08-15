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
  
  // Verify webhook signature for security
  if (process.env.NODE_ENV === 'production') {
    const isValidSignature = verifySignature(req, rawBody);
    if (!isValidSignature) {
      console.error('Invalid webhook signature detected');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }
  
  const body = JSON.parse(rawBody);

  if (body.type === 'payment') {
    const paymentId = body.data.id;
    const payment = new Payment(client);

    try {
      const paymentInfo = await payment.get({ id: paymentId });
      
      if (paymentInfo && paymentInfo.external_reference) {
        const orderId = paymentInfo.external_reference;

        // Map Mercado Pago status to our order status
        const statusMapping: Record<string, string> = {
          'approved': 'completed',
          'pending': 'pending',
          'rejected': 'failed',
          'cancelled': 'cancelled',
          'refunded': 'refunded',
          'in_process': 'processing',
          'in_mediation': 'disputed'
        };

        const orderStatus = statusMapping[paymentInfo.status] || 'pending';

        const updateData: any = {
          status: orderStatus,
          mercadopago_payment_id: paymentId,
          payment_method: paymentInfo.payment_method_id,
          installments: paymentInfo.installments || 1,
          updated_at: new Date().toISOString(),
        };

        // Add transaction details for completed payments
        if (paymentInfo.status === 'approved' && paymentInfo.transaction_amount) {
          updateData.transaction_amount = paymentInfo.transaction_amount;
          updateData.net_received_amount = paymentInfo.net_received_amount || paymentInfo.transaction_amount;
          updateData.fees = paymentInfo.fee_details ? paymentInfo.fee_details.reduce((sum: number, fee: any) => sum + fee.amount, 0) : 0;
        }

        const { error } = await supabaseAdmin
          .from('orders')
          .update(updateData)
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order status:', error);
          return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
        }

        // If payment is approved, update product inventory
        if (paymentInfo.status === 'approved') {
          try {
            const { data: orderItems } = await supabaseAdmin
              .from('order_items')
              .select('product_id, quantity')
              .eq('order_id', orderId);

            if (orderItems && orderItems.length > 0) {
              for (const item of orderItems) {
                await supabaseAdmin.rpc('decrease_product_stock', {
                  product_id: item.product_id,
                  quantity: item.quantity
                });
              }
            }
          } catch (inventoryError) {
            console.error('Error updating inventory:', inventoryError);
            // Don't fail the webhook for inventory errors
          }
        }

        console.log(`Order ${orderId} updated to status: ${orderStatus} (MP status: ${paymentInfo.status})`);
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