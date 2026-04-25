-- Add 2FA support: column in profiles and table for one-time login codes

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN NOT NULL DEFAULT FALSE;

CREATE TABLE IF NOT EXISTS public.two_factor_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_two_factor_codes_user_id
  ON public.two_factor_codes(user_id);

CREATE INDEX IF NOT EXISTS idx_two_factor_codes_expires_at
  ON public.two_factor_codes(expires_at);

ALTER TABLE public.two_factor_codes ENABLE ROW LEVEL SECURITY;

-- No client-side access: only service role (server endpoints) reads/writes these.
-- RLS is enabled with no policies so anon/authenticated roles cannot touch the table.
