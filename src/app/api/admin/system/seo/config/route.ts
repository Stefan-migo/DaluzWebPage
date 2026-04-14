import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/helpers';

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;
    
    const { data: configs, error } = await supabase
      .from('system_config')
      .select('config_key, config_value')
      .eq('category', 'seo');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch SEO config' }, { status: 500 });
    }

    const seoConfig: Record<string, any> = {};
    configs?.forEach(config => {
      try {
        seoConfig[config.config_key] = JSON.parse(config.config_value);
      } catch {
        seoConfig[config.config_key] = config.config_value;
      }
    });

    return NextResponse.json({ config: seoConfig });

  } catch (error) {
    console.error('Error in SEO config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { user, supabase } = auth;

    const updates = [];
    for (const [key, value] of Object.entries(body)) {
      updates.push({
        config_key: key,
        config_value: typeof value === 'string' ? JSON.stringify(value) : JSON.stringify(value)
      });
    }

    for (const update of updates) {
      await supabase
        .from('system_config')
        .update({ 
          config_value: update.config_value,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', update.config_key);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error in update SEO config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
