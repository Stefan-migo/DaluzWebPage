import { NextResponse } from 'next/server';
import { getMercadoPagoConfig } from '@/lib/mercadopago/config';

/**
 * Public API endpoint to get the current MercadoPago public key
 * This allows the frontend to dynamically use the correct key based on test_mode
 */
export async function GET() {
  try {
    const config = await getMercadoPagoConfig();
    
    if (!config.publicKey) {
      return NextResponse.json({ 
        error: 'Public key not configured' 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      publicKey: config.publicKey,
      testMode: config.testMode
    });
  } catch (error) {
    console.error('Error getting MercadoPago public key:', error);
    return NextResponse.json({ 
      error: 'Failed to get public key',
      publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || null
    }, { status: 500 });
  }
}

