-- Add MercadoPago configuration keys to system_config
-- This migration adds all necessary configuration keys for MercadoPago payment integration

-- Insert MercadoPago configuration keys
INSERT INTO public.system_config (config_key, config_value, description, category, is_public, is_sensitive, value_type)
VALUES
  (
    'mercadopago_access_token',
    '"PROD_ACCESS_TOKEN_HERE"',
    'MercadoPago Access Token (Production) - Token de acceso de MercadoPago para producción',
    'payments',
    false,
    true,
    'string'
  ),
  (
    'mercadopago_public_key',
    '"PUBLIC_KEY_HERE"',
    'MercadoPago Public Key - Clave pública de MercadoPago',
    'payments',
    false,
    true,
    'string'
  ),
  (
    'mercadopago_webhook_secret',
    '"WEBHOOK_SECRET_HERE"',
    'MercadoPago Webhook Secret - Secreto para verificar webhooks de MercadoPago',
    'payments',
    false,
    true,
    'string'
  ),
  (
    'mercadopago_test_mode',
    'false',
    'MercadoPago Test Mode - Modo de prueba de MercadoPago',
    'payments',
    false,
    false,
    'boolean'
  ),
  (
    'mercadopago_payment_methods',
    '["credit_card", "debit_card", "cash", "bank_transfer"]',
    'MercadoPago Payment Methods - Métodos de pago habilitados en MercadoPago',
    'payments',
    false,
    false,
    'array'
  ),
  (
    'mercadopago_max_installments',
    '12',
    'MercadoPago Max Installments - Número máximo de cuotas permitidas',
    'payments',
    false,
    false,
    'number'
  ),
  (
    'mercadopago_auto_return',
    'true',
    'MercadoPago Auto Return - Retorno automático después del pago',
    'payments',
    false,
    false,
    'boolean'
  ),
  (
    'mercadopago_binary_mode',
    'false',
    'MercadoPago Binary Mode - Modo binario (aprobado/rechazado sin estados intermedios)',
    'payments',
    false,
    false,
    'boolean'
  )
ON CONFLICT (config_key) DO NOTHING;

-- Add comment
COMMENT ON TABLE public.system_config IS 'System configuration table - includes payment, email, shipping, and other system settings';

