-- Migration: Add support_email config
-- Description: Insert support_email for email templates
-- Created: 2026-03-25

INSERT INTO system_config (config_key, config_value, category, is_public, is_sensitive, value_type, description)
VALUES 
  ('support_email', '"soporte@daluzconsciente.com"', 'contact', true, false, 'string', 'Email de soporte técnico')
ON CONFLICT (config_key) DO NOTHING;
