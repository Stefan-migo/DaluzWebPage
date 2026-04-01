-- Migration: Add social media configuration
-- Description: Insert public social media configs
-- Created: 2026-03-25

-- Insert public social media configs if they don't exist
INSERT INTO system_config (config_key, config_value, category, is_public, is_sensitive, value_type, description)
VALUES 
  ('social_instagram', '"https://instagram.com/daluzconsciente"', 'social', true, false, 'string', 'URL de Instagram'),
  ('social_facebook', '"https://facebook.com/daluzconsciente"', 'social', true, false, 'string', 'URL de Facebook'),
  ('social_whatsapp', '"5493511234567"', 'social', true, false, 'string', 'Número de WhatsApp (solo números)')
ON CONFLICT (config_key) DO NOTHING;
