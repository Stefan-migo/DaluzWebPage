-- Alter the existing 'orders' table to add Mercado Pago specific fields

-- Add a column to store the Mercado Pago preference ID
-- This ID is generated before the customer is sent to pay and is used to identify the payment attempt.
ALTER TABLE public.orders
ADD COLUMN mercadopago_preference_id VARCHAR(255);

-- Add a column to store the final Mercado Pago payment ID
-- This ID is received after a payment is successfully processed.
ALTER TABLE public.orders
ADD COLUMN mercadopago_payment_id BIGINT;

-- Add a column to store the payment method used (e.g., 'credit_card', 'ticket')
ALTER TABLE public.orders
ADD COLUMN payment_method VARCHAR(100);

-- Add a column to store the number of installments, if applicable
ALTER TABLE public.orders
ADD COLUMN installments INTEGER DEFAULT 1;

-- Add a column to store the currency of the transaction (e.g., 'ARS', 'USD')
ALTER TABLE public.orders
ADD COLUMN currency VARCHAR(3) DEFAULT 'ARS';

-- Add comments to the new columns for better documentation
COMMENT ON COLUMN public.orders.mercadopago_preference_id IS 'Mercado Pago preference ID generated at the start of the checkout process.';
COMMENT ON COLUMN public.orders.mercadopago_payment_id IS 'Mercado Pago payment ID received after a successful payment.';
COMMENT ON COLUMN public.orders.payment_method IS 'The payment method chosen by the customer (e.g., credit_card, rapipago).';
COMMENT ON COLUMN public.orders.installments IS 'Number of installments for credit card payments.';
COMMENT ON COLUMN public.orders.currency IS 'Currency used for the transaction (e.g., ARS).';
