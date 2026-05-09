-- Add a generated column `is_on_sale` to products that flips to true when
-- compare_at_price is set and strictly greater than price. This allows
-- server-side filtering and accurate pagination for the "Solo ofertas" filter
-- without column-to-column comparisons (which PostgREST does not support).

ALTER TABLE products
  ADD COLUMN is_on_sale BOOLEAN
  GENERATED ALWAYS AS (
    compare_at_price IS NOT NULL AND compare_at_price > price
  ) STORED;

CREATE INDEX IF NOT EXISTS products_is_on_sale_idx
  ON products (is_on_sale)
  WHERE is_on_sale = true;
