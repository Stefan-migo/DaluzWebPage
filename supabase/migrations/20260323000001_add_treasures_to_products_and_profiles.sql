-- =====================================================
-- Migration: Add treasures system fields to products and profiles
-- Purpose: Support Tesoros Da Luz access control
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Add access_id to products table
-- =====================================================

-- Add access_id column to products (nullable, defaults based on category/kit)
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS access_id TEXT;

-- Add index for fast lookups
CREATE INDEX IF NOT EXISTS idx_products_access_id ON public.products(access_id);

-- Add comment
COMMENT ON COLUMN public.products.access_id IS 'Access identifier for Tesoros: linea-NAME (e.g., linea-umbral), kit-NAME (e.g., kit-alkimya), or NULL for non-tesoro products';

-- =====================================================
-- 2. Add treasures array to profiles table (denormalized for fast queries)
-- =====================================================

-- Add treasures column to profiles (array of access_ids user has access to)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS treasures TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create GIN index for array queries
CREATE INDEX IF NOT EXISTS idx_profiles_treasures ON public.profiles USING gin(treasures);

-- Add comment
COMMENT ON COLUMN public.profiles.treasures IS 'Denormalized array of access IDs for fast queries. Sync from user_treasures table.';

-- =====================================================
-- 3. Create function to sync user_treasures to profiles
-- Create the trigger function FIRST (trigger functions don't take arguments)
-- =====================================================

CREATE OR REPLACE FUNCTION public.sync_profile_treasures_sync()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Determine which user_id to use based on the operation
    IF TG_OP = 'DELETE' THEN
        v_user_id := OLD.user_id;
    ELSE
        v_user_id := NEW.user_id;
    END IF;
    
    IF v_user_id IS NOT NULL THEN
        UPDATE public.profiles
        SET treasures = (
            SELECT COALESCE(ARRAY_AGG(access_id), ARRAY[]::TEXT[])
            FROM public.user_treasures
            WHERE user_id = v_user_id
        ),
        updated_at = NOW()
        WHERE id = v_user_id;
    END IF;
    
    RETURN NULL;
END;
$$;

-- Create trigger to auto-sync when user_treasures changes
DROP TRIGGER IF EXISTS sync_profile_on_treasure_change ON public.user_treasures;
CREATE TRIGGER sync_profile_on_treasure_change
    AFTER INSERT OR UPDATE OR DELETE ON public.user_treasures
    FOR EACH ROW EXECUTE FUNCTION public.sync_profile_treasures_sync();

-- Also keep the helper function for manual syncs
CREATE OR REPLACE FUNCTION public.sync_profile_treasures(p_user_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET treasures = (
        SELECT COALESCE(ARRAY_AGG(access_id), ARRAY[]::TEXT[])
        FROM public.user_treasures
        WHERE user_id = p_user_id
    ),
    updated_at = NOW()
    WHERE id = p_user_id;
END;
$$;

-- =====================================================
-- 4. Add trigger to update profile treasures on product purchase
-- (handled in webhook, but we create the RPC wrapper here)
-- =====================================================

-- Create RPC function to grant treasures from order items
CREATE OR REPLACE FUNCTION public.grant_treasures_from_order_items(
    p_user_id UUID,
    p_order_id UUID
)
RETURNS TABLE(access_id TEXT, granted BOOLEAN) LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_product_access_ids TEXT[];
BEGIN
    -- Get all access_ids from order items
    SELECT ARRAY_AGG(DISTINCT p.access_id)
    INTO v_product_access_ids
    FROM public.order_items oi
    JOIN public.products p ON p.id = oi.product_id
    WHERE oi.order_id = p_order_id
    AND p.access_id IS NOT NULL
    AND p.access_id != '';
    
    -- Grant treasures (including tesoro-gral always)
    RETURN QUERY
    SELECT * FROM public.grant_treasures_from_order(
        p_user_id,
        p_order_id,
        COALESCE(v_product_access_ids, ARRAY[]::TEXT[])
    );
END;
$$;

-- =====================================================
-- 5. Backfill existing data (optional - for existing customers)
-- Run manually if needed:
-- SELECT sync_all_profiles_treasures();
-- =====================================================

CREATE OR REPLACE FUNCTION public.sync_all_profiles_treasures()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count INTEGER := 0;
BEGIN
    UPDATE public.profiles p
    SET treasures = (
        SELECT COALESCE(ARRAY_AGG(access_id), ARRAY[]::TEXT[])
        FROM public.user_treasures
        WHERE user_id = p.id
    ),
    updated_at = NOW();
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;