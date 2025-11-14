-- Add MercadoPago test credentials configuration keys
-- These are separate from production credentials and are used when test_mode is enabled

INSERT INTO public.system_config (config_key, config_value, description, category, is_public, is_sensitive, value_type)
VALUES
  (
    'mercadopago_test_access_token',
    '"TEST_ACCESS_TOKEN_HERE"',
    'MercadoPago Test Access Token (Sandbox) - Token de acceso de prueba de MercadoPago',
    'payments',
    false,
    true,
    'string'
  ),
  (
    'mercadopago_test_public_key',
    '"TEST_PUBLIC_KEY_HERE"',
    'MercadoPago Test Public Key (Sandbox) - Clave pública de prueba de MercadoPago',
    'payments',
    false,
    true,
    'string'
  ),
  (
    'mercadopago_test_webhook_secret',
    '"TEST_WEBHOOK_SECRET_HERE"',
    'MercadoPago Test Webhook Secret (Sandbox) - Secreto de webhook de prueba de MercadoPago',
    'payments',
    false,
    true,
    'string'
  )
ON CONFLICT (config_key) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.system_config IS 'System configuration table - includes payment, email, shipping, and other system settings. Test credentials are used when test_mode is enabled.';

