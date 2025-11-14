-- Create branding assets storage bucket and configuration
-- This migration creates the storage bucket and adds branding config keys

-- Create storage bucket for branding assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'branding-assets',
  'branding-assets',
  true,
  5242880, -- 5MB limit
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/x-icon']
)
ON CONFLICT (id) DO NOTHING;

-- Add branding configuration keys to system_config
INSERT INTO public.system_config (config_key, config_value, description, category, is_public, is_sensitive, value_type)
VALUES
  (
    'brand_logo_url',
    '""',
    'URL del logo de la marca',
    'branding',
    true,
    false,
    'string'
  ),
  (
    'brand_favicon_url',
    '""',
    'URL del favicon',
    'branding',
    true,
    false,
    'string'
  ),
  (
    'brand_primary_color',
    '"#AE0000"',
    'Color primario de la marca',
    'branding',
    true,
    false,
    'string'
  ),
  (
    'brand_secondary_color',
    '"#C70000"',
    'Color secundario de la marca',
    'branding',
    true,
    false,
    'string'
  ),
  (
    'brand_accent_color',
    '"#DB3600"',
    'Color de acento de la marca',
    'branding',
    true,
    false,
    'string'
  ),
  (
    'brand_highlight_color',
    '"#F8D794"',
    'Color de resaltado de la marca',
    'branding',
    true,
    false,
    'string'
  )
ON CONFLICT (config_key) DO NOTHING;

-- Storage policies for branding-assets bucket
CREATE POLICY "Public can view branding assets" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'branding-assets');

CREATE POLICY "Admin users can upload branding assets" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'branding-assets' AND
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can update branding assets" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'branding-assets' AND
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

CREATE POLICY "Admin users can delete branding assets" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'branding-assets' AND
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

COMMENT ON TABLE public.system_config IS 'System configuration including branding settings';

