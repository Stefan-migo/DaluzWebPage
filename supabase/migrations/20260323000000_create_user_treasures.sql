-- =====================================================
-- Migration: Create user_treasures table for Tesoros Da Luz
-- Purpose: Store user's access IDs to exclusive content
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for treasure access types
DO $$ BEGIN
    CREATE TYPE treasure_access_type AS ENUM (
        'general',    -- Access with any purchase
        'linea',      -- Access by product line (e.g., linea-umbral)
        'kit'         -- Access by kit (e.g., kit-alkimya)
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create user_treasures table
-- This table prevents duplicate access grants and tracks all treasures
CREATE TABLE IF NOT EXISTS public.user_treasures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    access_id TEXT NOT NULL, -- e.g., 'tesoro-gral', 'linea-umbral', 'kit-alkimya'
    access_type treasure_access_type DEFAULT 'general',
    granted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    -- Source of the grant (for auditing)
    source_type TEXT DEFAULT 'purchase' CHECK (source_type IN ('purchase', 'manual', 'membership', 'promotion')),
    source_id UUID, -- order_id or manual grant id
    -- Make combination unique to prevent duplicates
    CONSTRAINT unique_user_treasure UNIQUE (user_id, access_id)
);

-- Create index for fast lookups by user
CREATE INDEX idx_user_treasures_user_id ON public.user_treasures(user_id);
CREATE INDEX idx_user_treasures_access_id ON public.user_treasures(access_id);
CREATE INDEX idx_user_treasures_user_access ON public.user_treasures(user_id, access_id);

-- Enable RLS
ALTER TABLE public.user_treasures ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own treasures
CREATE POLICY "Users can view own treasures" ON public.user_treasures
    FOR SELECT USING (auth.uid() = user_id);

-- Only service role can insert/update/delete (webhook/admin)
CREATE POLICY "Service role can manage treasures" ON public.user_treasures
    FOR ALL USING (auth.jwt()->>'role' = 'service_role');

-- Create function to grant treasure access (handles duplicates gracefully)
CREATE OR REPLACE FUNCTION public.grant_treasure_access(
    p_user_id UUID,
    p_access_id TEXT,
    p_access_type treasure_access_type DEFAULT 'general',
    p_source_type TEXT DEFAULT 'purchase',
    p_source_id UUID DEFAULT NULL
)
RETURNS TABLE (
    granted BOOLEAN,
    access_id TEXT,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing_count INTEGER;
    v_result RECORD;
BEGIN
    -- Check if access already exists
    SELECT COUNT(*) INTO v_existing_count
    FROM public.user_treasures
    WHERE user_id = p_user_id AND access_id = p_access_id;
    
    IF v_existing_count > 0 THEN
        -- Access already granted
        RETURN QUERY SELECT 
            FALSE AS granted,
            p_access_id AS access_id,
            'Access already exists'::TEXT AS message;
        RETURN;
    END IF;
    
    -- Grant access
    BEGIN
        INSERT INTO public.user_treasures (user_id, access_id, access_type, source_type, source_id)
        VALUES (p_user_id, p_access_id, p_access_type, p_source_type, p_source_id);
        
        RETURN QUERY SELECT 
            TRUE AS granted,
            p_access_id AS access_id,
            'Access granted successfully'::TEXT AS message;
    EXCEPTION WHEN OTHERS THEN
        -- Handle race condition (unique constraint violation)
        IF SQLERRM LIKE '%unique_user_treasure%' THEN
            RETURN QUERY SELECT 
                FALSE AS granted,
                p_access_id AS access_id,
                'Access already granted (concurrent)'::TEXT AS message;
        ELSE
            RETURN QUERY SELECT 
                FALSE AS granted,
                p_access_id AS access_id,
                ('Failed: ' || SQLERRM)::TEXT AS message;
        END IF;
    END;
END;
$$;

-- Create function to grant multiple treasures at once (for orders with multiple products)
CREATE OR REPLACE FUNCTION public.grant_treasures_from_order(
    p_user_id UUID,
    p_order_id UUID,
    p_access_ids TEXT[] -- Array of access_ids to grant
)
RETURNS TABLE (
    access_id TEXT,
    granted BOOLEAN,
    message TEXT
) LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Always include general access first
    RETURN QUERY SELECT * FROM public.grant_treasure_access(
        p_user_id, 
        'tesoro-gral', 
        'general'::treasure_access_type, 
        'purchase',
        p_order_id
    );
    
    -- Grant each specific access
    FOREACH access_id IN ARRAY p_access_ids
    LOOP
        RETURN QUERY SELECT * FROM public.grant_treasure_access(
            p_user_id, 
            access_id, 
            CASE 
                WHEN access_id LIKE 'linea-%' THEN 'linea'::treasure_access_type
                WHEN access_id LIKE 'kit-%' THEN 'kit'::treasure_access_type
                ELSE 'general'::treasure_access_type
            END,
            'purchase',
            p_order_id
        );
    END LOOP;
END;
$$;

-- Create function to get all treasures for a user (returns array for convenience)
CREATE OR REPLACE FUNCTION public.get_user_treasures(p_user_id UUID)
RETURNS TEXT[] LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_treasures TEXT[];
BEGIN
    SELECT ARRAY_AGG(access_id) INTO v_treasures
    FROM public.user_treasures
    WHERE user_id = p_user_id;
    
    RETURN COALESCE(v_treasures, ARRAY[]::TEXT[]);
END;
$$;

-- Create trigger to sync treasures to profiles table (denormalization)
CREATE OR REPLACE FUNCTION public.sync_treasures_to_profile()
RETURNS TRIGGER LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.profiles
        SET treasures = array_cat(
            COALESCE(treasures, ARRAY[]::TEXT[]),
            ARRAY[TG_ARGV[0]]
        )
        WHERE id = NEW.user_id
        AND NOT EXISTS (
            SELECT 1 FROM unnest(COALESCE(treasures, ARRAY[]::TEXT[])) AS t WHERE t = TG_ARGV[0]
        );
    END IF;
    RETURN NULL;
END;
$$;

-- Comment on table
COMMENT ON TABLE public.user_treasures IS 'Stores user access to Tesoros Da Luz content. Each row represents a unique access_id granted to a user, preventing duplicates.';

COMMENT ON COLUMN public.user_treasures.access_id IS 'The access identifier: tesoro-gral (any purchase), linea-NAME (line access), kit-NAME (kit access)';
COMMENT ON COLUMN public.user_treasures.access_type IS 'Type of access: general (tesoro-gral), linea (product line), kit (kit)';
COMMENT ON COLUMN public.user_treasures.source_type IS 'How the access was granted: purchase, manual (admin), membership, promotion';