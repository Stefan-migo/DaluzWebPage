-- Fix storage policies to allow service role uploads
-- Drop existing policies first
DROP POLICY IF EXISTS "Public read access for product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product-images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

DROP POLICY IF EXISTS "Public read access for uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete uploads" ON storage.objects;

-- Create new policies that allow both authenticated users and service role
CREATE POLICY "Public read access for product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow uploads to product-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow updates to product-images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow deletes to product-images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- Create policies for images bucket
CREATE POLICY "Public read access for images" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

CREATE POLICY "Allow uploads to images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow updates to images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow deletes to images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'images' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

-- Create policies for uploads bucket
CREATE POLICY "Public read access for uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "Allow uploads to uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'uploads' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow updates to uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'uploads' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

CREATE POLICY "Allow deletes to uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'uploads' 
  AND (auth.role() = 'authenticated' OR auth.role() = 'service_role')
);

