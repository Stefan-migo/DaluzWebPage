-- System Logs table for centralized error/event persistence
CREATE TABLE IF NOT EXISTS system_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  level text NOT NULL DEFAULT 'info',          -- debug | info | warn | error | critical
  message text NOT NULL,
  context jsonb DEFAULT '{}',                   -- requestId, userId, route, etc.
  source text,                                  -- service/handler that generated the log
  error_stack text,                             -- stack trace for errors
  created_at timestamptz DEFAULT now()
);

-- Fast lookups by severity and recency
CREATE INDEX idx_system_logs_level_created ON system_logs (level, created_at DESC);

-- Enable RLS (service role bypasses for writes; admin policy for reads)
ALTER TABLE system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read system logs"
  ON system_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users WHERE user_id = auth.uid()
    )
  );
