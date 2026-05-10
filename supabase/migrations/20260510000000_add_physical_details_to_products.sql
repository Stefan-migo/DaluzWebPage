-- Add new physical detail columns to the products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS texture text,
ADD COLUMN IF NOT EXISTS aroma text,
ADD COLUMN IF NOT EXISTS color text;
