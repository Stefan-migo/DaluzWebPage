import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get webhook statistics
    const { data: stats } = await supabase
      .from('webhook_logs')
      .select('webhook_type, status, created_at')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

    const status = {
      mercadopago: {
        total: 0,
        success: 0,
        failed: 0,
        last_delivery: null as string | null
      },
      sanity: {
        total: 0,
        success: 0,
        failed: 0,
        last_delivery: null as string | null
      }
    };

    stats?.forEach(log => {
      const type = log.webhook_type as 'mercadopago' | 'sanity';
      if (type in status) {
        status[type].total++;
        if (log.status === 'success') status[type].success++;
        if (log.status === 'failed') status[type].failed++;
        if (!status[type].last_delivery || log.created_at > status[type].last_delivery) {
          status[type].last_delivery = log.created_at;
        }
      }
    });

    // Get webhook URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      process.env.NEXT_PUBLIC_APP_URL || 
      'https://daluzconsciente.com';

    return NextResponse.json({
      status,
      urls: {
        mercadopago: `${baseUrl}/api/webhooks/mercadopago`,
        sanity: `${baseUrl}/api/revalidate`
      }
    });

  } catch (error) {
    console.error('Error in webhook status API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

