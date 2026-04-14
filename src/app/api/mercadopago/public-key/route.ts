import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getMercadoPagoConfig } from '@/lib/mercadopago/config';

// Cached fetch — revalidates every 10 min or on 'mp-config' tag
const getMPPublicKeyCached = unstable_cache(
  async () => {
    const config = await getMercadoPagoConfig();
    return {
      publicKey: config.publicKey || null,
      testMode: config.testMode,
    };
  },
  ['mp-public-key'],
  { revalidate: 600, tags: ['mp-config'] },
);

/**
 * Public API endpoint to get the current MercadoPago public key (cached).
 */
export async function GET() {
  try {
    const result = await getMPPublicKeyCached();

    if (!result.publicKey) {
      return NextResponse.json({
        error: 'Public key not configured'
      }, { status: 500 });
    }

    return NextResponse.json({
      publicKey: result.publicKey,
      testMode: result.testMode,
    });
  } catch (error) {
    console.error('Error getting MercadoPago public key:', error);
    return NextResponse.json({
      error: 'Failed to get public key',
      publicKey: process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || null
    }, { status: 500 });
  }
}
