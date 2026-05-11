-- Persist sensory descriptors already collected by the admin product form.
-- Texture, aroma, and color are short free-text fields rendered in the
-- "Características" tab. Nullable because they are optional metadata.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS texture TEXT,
  ADD COLUMN IF NOT EXISTS aroma   TEXT,
  ADD COLUMN IF NOT EXISTS color   TEXT;
