import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhook_type } = body;

    if (!webhook_type || !['mercadopago', 'sanity'].includes(webhook_type)) {
      return NextResponse.json({ error: 'Invalid webhook type' }, { status: 400 });
    }

    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    // Check admin authorization
    
    

    // Log test webhook
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        webhook_type,
        event_type: 'test',
        payload: { test: true, timestamp: new Date().toISOString() },
        status: 'success',
        response_code: 200,
        processed_at: new Date().toISOString()
      });

    if (logError) {
      console.error('Error logging test webhook:', logError);
    }

    return NextResponse.json({ 
      success: true,
      message: `Test webhook logged for ${webhook_type}`
    });

  } catch (error) {
    console.error('Error in test webhook API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

