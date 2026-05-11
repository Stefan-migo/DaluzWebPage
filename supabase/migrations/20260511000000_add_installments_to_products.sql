-- Add per-product flags to enable interest-free installments at checkout.
-- Two independent booleans so a product can offer 3, 6, both, or neither.
-- The actual integration with the payment provider is wired separately.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS installments_3_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS installments_6_enabled BOOLEAN NOT NULL DEFAULT false;
