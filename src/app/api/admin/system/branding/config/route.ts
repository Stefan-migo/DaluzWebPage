import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: configs, error } = await supabase
      .from('system_config')
      .select('config_key, config_value')
      .eq('category', 'branding');

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch branding config' }, { status: 500 });
    }

    const brandingConfig: Record<string, any> = {};
    configs?.forEach(config => {
      try {
        brandingConfig[config.config_key] = JSON.parse(config.config_value);
      } catch {
        brandingConfig[config.config_key] = config.config_value;
      }
    });

    return NextResponse.json({ config: brandingConfig });

  } catch (error) {
    console.error('Error in branding config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = [];
    for (const [key, value] of Object.entries(body)) {
      updates.push({
        config_key: key,
        config_value: JSON.stringify(value)
      });
    }

    // Update all configs
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
    console.error('Error in update branding config API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

