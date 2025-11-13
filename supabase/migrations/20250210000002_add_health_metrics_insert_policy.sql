-- Add INSERT policy for system_health_metrics
-- This allows admin users to insert health metrics when collecting system data

CREATE POLICY "Admin users can insert health metrics"
ON public.system_health_metrics
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users au 
    WHERE au.id = auth.uid() 
    AND au.is_active = true
  )
);

