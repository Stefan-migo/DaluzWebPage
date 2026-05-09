-- Add hair_type array column to products, mirroring skin_type. Allows the
-- public store filter and admin form to assign one or more hair types per
-- product. Values: 'oily', 'dry', 'normal', 'combination', 'curly', 'straight'.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS hair_type TEXT[];

CREATE INDEX IF NOT EXISTS idx_products_hair_type
  ON public.products USING gin(hair_type);
