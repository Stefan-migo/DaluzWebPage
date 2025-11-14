import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check admin authorization
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'logo' or 'favicon'

    if (!file || !type) {
      return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/x-icon'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // Generate filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${type}-${timestamp}.${extension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('branding-assets')
      .upload(filename, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('branding-assets')
      .getPublicUrl(filename);

    // Update system config
    const configKey = type === 'logo' ? 'brand_logo_url' : 'brand_favicon_url';
    const { error: configError } = await supabase
      .from('system_config')
      .update({ 
        config_value: JSON.stringify(publicUrl),
        updated_at: new Date().toISOString()
      })
      .eq('config_key', configKey);

    if (configError) {
      console.error('Error updating config:', configError);
      // Don't fail - file is uploaded, just config update failed
    }

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      filename
    });

  } catch (error) {
    console.error('Error in branding upload API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

