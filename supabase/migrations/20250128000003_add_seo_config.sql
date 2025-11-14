-- Add SEO configuration keys to system_config
INSERT INTO public.system_config (config_key, config_value, description, category, is_public, is_sensitive, value_type)
VALUES
  (
    'seo_default_title',
    '"DA LUZ CONSCIENTE - Productos Naturales y Conscientes"',
    'Título por defecto para SEO',
    'seo',
    true,
    false,
    'string'
  ),
  (
    'seo_default_description',
    '"Descubre productos naturales y conscientes para tu bienestar. DA LUZ CONSCIENTE ofrece una amplia gama de productos de calidad."',
    'Descripción por defecto para SEO',
    'seo',
    true,
    false,
    'string'
  ),
  (
    'seo_default_keywords',
    '["productos naturales", "bienestar", "consciente", "salud", "DA LUZ"]',
    'Palabras clave por defecto para SEO',
    'seo',
    true,
    false,
    'array'
  ),
  (
    'seo_og_image_url',
    '""',
    'URL de la imagen para Open Graph (redes sociales)',
    'seo',
    true,
    false,
    'string'
  ),
  (
    'seo_twitter_handle',
    '""',
    'Handle de Twitter (@usuario)',
    'seo',
    true,
    false,
    'string'
  ),
  (
    'seo_google_analytics_id',
    '""',
    'ID de Google Analytics (G-XXXXXXXXXX)',
    'seo',
    false,
    false,
    'string'
  ),
  (
    'seo_google_tag_manager_id',
    '""',
    'ID de Google Tag Manager (GTM-XXXXXXX)',
    'seo',
    false,
    false,
    'string'
  ),
  (
    'seo_facebook_pixel_id',
    '""',
    'ID de Facebook Pixel',
    'seo',
    false,
    false,
    'string'
  )
ON CONFLICT (config_key) DO NOTHING;

COMMENT ON TABLE public.system_config IS 'System configuration including SEO settings';

