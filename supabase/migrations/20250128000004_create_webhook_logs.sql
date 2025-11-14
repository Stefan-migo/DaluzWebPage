-- Create webhook logs table for monitoring webhook deliveries
CREATE TABLE IF NOT EXISTS public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_type TEXT NOT NULL CHECK (webhook_type IN ('mercadopago', 'sanity')),
  event_type TEXT,
  payload JSONB,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  response_code INTEGER,
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Admin users can view all webhook logs
CREATE POLICY "Admin users can view webhook logs" ON public.webhook_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

-- RLS Policy: Service role can insert webhook logs (for webhook handlers)
CREATE POLICY "Service role can insert webhook logs" ON public.webhook_logs
  FOR INSERT WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_webhook_logs_type ON public.webhook_logs(webhook_type);
CREATE INDEX idx_webhook_logs_status ON public.webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs(created_at DESC);

-- Add retention policy (optional - can be cleaned up by maintenance job)
COMMENT ON TABLE public.webhook_logs IS 'Log of webhook deliveries for monitoring and debugging';

