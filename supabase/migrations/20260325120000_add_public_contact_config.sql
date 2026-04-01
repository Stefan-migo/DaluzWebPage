-- Migration: Add public contact configuration
-- Description: Insert default public contact configs (email, phone, whatsapp, address)
-- Created: 2026-03-25

-- Insert public contact configs if they don't exist
INSERT INTO system_config (config_key, config_value, category, is_public, is_sensitive, value_type, description)
VALUES 
  ('contact_email', '"contacto@daluzconsciente.com"', 'contact', true, false, 'string', 'Email de contacto principal de la empresa'),
  ('phone_number', '"+54 9 11 1234-5678"', 'contact', true, false, 'string', 'Número de teléfono de contacto'),
  ('whatsapp_phone', '"5493511234567"', 'contact', true, false, 'string', 'Número de WhatsApp (solo números, sin + ni espacios)'),
  ('address', '"Córdoba, Argentina"', 'contact', true, false, 'string', 'Dirección física de la empresa'),
  ('city', '"Córdoba"', 'contact', true, false, 'string', 'Ciudad de la empresa'),
  ('country', '"Argentina"', 'contact', true, false, 'string', 'País de la empresa')
ON CONFLICT (config_key) DO NOTHING;

-- Add RLS policy for public read access to public configs
DROP POLICY IF EXISTS "Public configs are viewable by everyone" ON system_config;
CREATE POLICY "Public configs are viewable by everyone"
ON system_config FOR SELECT
USING (is_public = true);

COMMENT ON POLICY "Public configs are viewable by everyone" ON system_config 
IS 'Allows public access to configs marked as is_public=true';
