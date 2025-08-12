-- Add INSERT policies for categories and products
-- This allows authenticated users to create categories and products through the admin interface

-- Allow authenticated users to insert categories
CREATE POLICY "Authenticated users can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update categories  
CREATE POLICY "Authenticated users can update categories" ON public.categories
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert products
CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update products
CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Allow authenticated users to insert product variants
CREATE POLICY "Authenticated users can insert product variants" ON public.product_variants
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Allow authenticated users to update product variants
CREATE POLICY "Authenticated users can update product variants" ON public.product_variants
  FOR UPDATE USING (auth.uid() IS NOT NULL); 