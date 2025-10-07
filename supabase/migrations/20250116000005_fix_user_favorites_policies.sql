-- Fix RLS policies for user_favorites table
-- This migration fixes the Row Level Security policies to allow proper access

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can add own favorites" ON public.user_favorites;
DROP POLICY IF EXISTS "Users can remove own favorites" ON public.user_favorites;

-- Create new, more permissive policies
CREATE POLICY "Enable read access for users based on user_id" ON public.user_favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Enable insert for users based on user_id" ON public.user_favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON public.user_favorites
  FOR DELETE USING (auth.uid() = user_id);

-- Also allow service role to access (for admin operations)
CREATE POLICY "Enable all access for service role" ON public.user_favorites
  FOR ALL USING (auth.role() = 'service_role');
