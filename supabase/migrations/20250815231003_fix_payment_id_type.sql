-- Fix MercadoPago payment ID field type
-- MercadoPago payment IDs are strings, not numbers

-- Change mercadopago_payment_id from BIGINT to TEXT
ALTER TABLE public.orders 
ALTER COLUMN mercadopago_payment_id TYPE TEXT USING mercadopago_payment_id::TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.orders.mercadopago_payment_id IS 'MercadoPago payment ID (string format)';
