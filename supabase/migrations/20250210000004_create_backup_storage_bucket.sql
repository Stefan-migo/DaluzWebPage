-- Create storage bucket for database backups
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('database-backups', 'database-backups', false, 1073741824, ARRAY['application/json', 'application/gzip', 'application/zip', 'text/plain'])
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for database-backups bucket
-- Only admins can upload/download backups

-- Policy for SELECT (admins can view backups)
CREATE POLICY "Admins can view backups"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'database-backups' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.is_active = true
  )
);

-- Policy for INSERT (admins can create backups)
CREATE POLICY "Admins can create backups"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'database-backups' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.is_active = true
  )
);

-- Policy for DELETE (admins can delete backups)
CREATE POLICY "Admins can delete backups"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'database-backups' AND
  EXISTS (
    SELECT 1 FROM public.admin_users au
    WHERE au.id = auth.uid() AND au.is_active = true
  )
);

-- Note: Storage bucket for database backups. Only accessible by active admin users.

