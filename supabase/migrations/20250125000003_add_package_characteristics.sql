-- Add package_characteristics field to products table
-- This field will store rich text information about product packaging characteristics

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS package_characteristics TEXT;

-- Add comment for clarity
COMMENT ON COLUMN public.products.package_characteristics IS 'Rich text description of product packaging characteristics, materials, design, etc.';
