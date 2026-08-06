-- ============================================================
-- Soporte de pago por transferencia bancaria (A1)
-- ============================================================

-- 1. payment_status admite los estados del flujo de transferencia.
--    'proof_submitted' se agrega ahora aunque A1 no lo use: expandir el
--    CHECK dos veces es trabajo repetido.
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN (
    'pending', 'paid', 'failed', 'refunded', 'partially_refunded',
    'awaiting_transfer',
    'proof_submitted'
  ));

-- 2. Vencimiento del pedido por transferencia. Null para MercadoPago.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS transfer_expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_transfer_expires
  ON orders (transfer_expires_at)
  WHERE payment_status = 'awaiting_transfer';

-- 3. Datos bancarios editables desde el panel.
INSERT INTO system_config (config_key, config_value, category, is_public, is_sensitive, value_type, description)
VALUES
  ('bank_transfer_cbu',    '""', 'payments', true, false, 'string', 'CBU para pagos por transferencia'),
  ('bank_transfer_alias',  '""', 'payments', true, false, 'string', 'Alias para pagos por transferencia'),
  ('bank_transfer_holder', '""', 'payments', true, false, 'string', 'Titular de la cuenta bancaria'),
  ('bank_transfer_bank',   '""', 'payments', true, false, 'string', 'Nombre del banco')
ON CONFLICT (config_key) DO NOTHING;

-- 4. Tipos de template nuevos.
--
-- El CHECK se reconstruye a partir de los tipos que YA existen en la tabla,
-- mas los dos nuevos. No se escribe una lista fija a proposito: el CHECK
-- original de 20250116210000 quedo incompleto (no incluia payment_success ni
-- payment_failed, que el codigo carga en notifications.ts), asi que una lista
-- fija falla con "is violated by some row" en cuanto la base tiene un tipo
-- que el autor de la migracion no conocia.
DO $$
DECLARE
  allowed text;
BEGIN
  SELECT string_agg(quote_literal(t), ', ' ORDER BY t)
  INTO allowed
  FROM (
    SELECT DISTINCT type AS t FROM system_email_templates
    UNION SELECT 'bank_transfer_instructions'
    UNION SELECT 'bank_transfer_expired'
    -- Los tipos de la migracion original se listan igual para que la
    -- restriccion no dependa de que exista al menos una fila de cada uno.
    UNION SELECT 'order_confirmation'
    UNION SELECT 'order_shipped'
    UNION SELECT 'order_delivered'
    UNION SELECT 'password_reset'
    UNION SELECT 'account_welcome'
    UNION SELECT 'membership_welcome'
    UNION SELECT 'membership_reminder'
    UNION SELECT 'low_stock_alert'
    UNION SELECT 'marketing'
    UNION SELECT 'custom'
    UNION SELECT 'payment_success'
    UNION SELECT 'payment_failed'
  ) s;

  EXECUTE 'ALTER TABLE system_email_templates DROP CONSTRAINT IF EXISTS system_email_templates_type_check';
  EXECUTE format(
    'ALTER TABLE system_email_templates ADD CONSTRAINT system_email_templates_type_check CHECK (type IN (%s))',
    allowed
  );
END $$;
