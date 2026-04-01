-- =====================================================
-- Migration: 20260325000000_add_promotional_tags_and_discounts.sql
-- Purpose: Add promotional tags, discount percentages, and global reviews control
-- Source: Notion - Panel de administracion Tienda (32c5bdb7-fce3-80a9-81b8-c678e70349c6)
-- =====================================================

-- =====================================================
-- 1. PROMOTIONAL TAG SYSTEM
-- Replaces legacy is_natural, is_new, is_on_sale booleans with unified promotional_tag
-- =====================================================

-- Create enum type for promotional tags (idempotent)
DO $$ BEGIN
    CREATE TYPE promotional_tag_type AS ENUM ('none', 'lanzamiento', 'descuento', 'ultimas_unidades');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add promotional_tag column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS promotional_tag promotional_tag_type DEFAULT 'none';

-- Add comment for documentation
COMMENT ON COLUMN public.products.promotional_tag IS 'Promotional tag for product display: none, lanzamiento, descuento, ultimas_unidades';

-- Create index for filtering products by promotional tag
CREATE INDEX IF NOT EXISTS idx_products_promotional_tag ON public.products(promotional_tag);

-- =====================================================
-- 2. DISCOUNT PERCENTAGES FOR PAYMENT METHODS
-- =====================================================

-- Add discount percentage for bank transfer payments
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount_transfer_percent DECIMAL(5,2) DEFAULT 0;

-- Add discount percentage for cash payments
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS discount_cash_percent DECIMAL(5,2) DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN public.products.discount_transfer_percent IS 'Discount percentage for bank transfer payment method (0-100)';
COMMENT ON COLUMN public.products.discount_cash_percent IS 'Discount percentage for cash payment method (0-100)';

-- =====================================================
-- 3. GLOBAL REVIEWS CONTROL (system_config)
-- =====================================================

-- Insert global reviews toggle into system_config
-- This allows admin to show/hide reviews globally across the store
INSERT INTO public.system_config (config_key, config_value, category, description, is_public, is_sensitive, value_type, created_at, updated_at)
VALUES (
    'reviews_enabled',
    'true'::jsonb,
    'ecommerce',
    'Global toggle to show or hide product reviews and ratings across the entire store',
    true,
    false,
    'boolean',
    NOW(),
    NOW()
)
ON CONFLICT (config_key) DO NOTHING;

-- =====================================================
-- 4. INSTALLMENT CONFIGURATION (optional global setting)
-- =====================================================

-- Insert default installment configuration
INSERT INTO public.system_config (config_key, config_value, category, description, is_public, is_sensitive, value_type, created_at, updated_at)
VALUES (
    'default_installments',
    '3'::jsonb,
    'ecommerce',
    'Default number of installments for products without specific configuration',
    true,
    false,
    'number',
    NOW(),
    NOW()
)
ON CONFLICT (config_key) DO NOTHING;

-- =====================================================
-- 5. DATA MIGRATION (Optional - for existing products)
-- Maps legacy boolean fields to new promotional_tag if they exist
-- =====================================================

-- NOTE: Since is_natural, is_new, is_on_sale don't exist in DB schema,
-- this migration assumes products start with promotional_tag = 'none'
-- If those fields were added manually, uncomment below:

/*
-- Migrate is_new = true to lanzamiento
UPDATE public.products
SET promotional_tag = 'lanzamiento'
WHERE is_new = true AND promotional_tag = 'none';

-- Migrate is_on_sale = true to descuento
UPDATE public.products
SET promotional_tag = 'descuento'
WHERE is_on_sale = true AND promotional_tag = 'none';

-- Migrate is_natural = true to none (Natural tag is deprecated by client request)
-- No action needed, just documenting that Natural is now removed
*/

-- =====================================================
-- 6. VERIFICATION QUERIES (for manual check)
-- =====================================================

-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'products'
-- AND column_name IN ('promotional_tag', 'discount_transfer_percent', 'discount_cash_percent', 'access_id');

-- SELECT config_key, config_value, value_type
-- FROM public.system_config
-- WHERE config_key IN ('reviews_enabled', 'default_installments');
