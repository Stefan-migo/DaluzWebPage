-- Expand orders.status check to cover the full set of values the webhook
-- service needs to write. The previous constraint blocked 'paid', 'failed',
-- and 'disputed', which caused MercadoPago webhooks to fail with check
-- constraint violations and left orders stuck in 'pending'.

ALTER TABLE orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',
    'paid',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
    'failed',
    'disputed'
  ));
