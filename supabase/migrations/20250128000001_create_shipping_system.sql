-- Create shipping management system
-- This migration creates tables for shipping zones, rates, and carriers

-- Shipping Zones Table
CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  countries TEXT[] DEFAULT ARRAY['Argentina'],
  states TEXT[],
  cities TEXT[],
  postal_codes TEXT[],
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Shipping Rates Table
CREATE TABLE IF NOT EXISTS public.shipping_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id UUID REFERENCES public.shipping_zones(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat', 'weight', 'price', 'free')),
  flat_rate DECIMAL(10,2),
  weight_rate_per_kg DECIMAL(10,2),
  price_rate_percentage DECIMAL(5,2),
  min_weight DECIMAL(8,2),
  max_weight DECIMAL(8,2),
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  free_shipping_threshold DECIMAL(10,2),
  estimated_days_min INTEGER,
  estimated_days_max INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Carriers Table
CREATE TABLE IF NOT EXISTS public.shipping_carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  tracking_url_template TEXT,
  api_key TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_carriers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shipping_zones
CREATE POLICY "Admin users can manage shipping zones" ON public.shipping_zones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

-- RLS Policies for shipping_rates
CREATE POLICY "Admin users can manage shipping rates" ON public.shipping_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

-- RLS Policies for shipping_carriers
CREATE POLICY "Admin users can manage shipping carriers" ON public.shipping_carriers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

-- Public read access for active zones and rates (for checkout)
CREATE POLICY "Public can read active shipping zones" ON public.shipping_zones
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active shipping rates" ON public.shipping_rates
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read active shipping carriers" ON public.shipping_carriers
  FOR SELECT USING (is_active = true);

-- Create indexes
CREATE INDEX idx_shipping_zones_active ON public.shipping_zones(is_active);
CREATE INDEX idx_shipping_rates_zone_id ON public.shipping_rates(zone_id);
CREATE INDEX idx_shipping_rates_active ON public.shipping_rates(is_active);
CREATE INDEX idx_shipping_carriers_code ON public.shipping_carriers(code);
CREATE INDEX idx_shipping_carriers_active ON public.shipping_carriers(is_active);

-- Create updated_at triggers
CREATE TRIGGER update_shipping_zones_updated_at
  BEFORE UPDATE ON public.shipping_zones
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_rates_updated_at
  BEFORE UPDATE ON public.shipping_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_carriers_updated_at
  BEFORE UPDATE ON public.shipping_carriers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default shipping zone (Argentina)
INSERT INTO public.shipping_zones (name, description, countries, is_active)
VALUES (
  'Argentina',
  'Zona de envío para toda Argentina',
  ARRAY['Argentina'],
  true
) ON CONFLICT DO NOTHING;

-- Insert default carriers
INSERT INTO public.shipping_carriers (name, code, tracking_url_template, is_active)
VALUES
  (
    'OCA',
    'oca',
    'https://www.oca.com.ar/Envios/ConsultaEnvio.aspx?codigo={tracking_number}',
    true
  ),
  (
    'Andreani',
    'andreani',
    'https://www.andreani.com/#!/personas/consultar-envio/{tracking_number}',
    true
  ),
  (
    'Correo Argentino',
    'correo_argentino',
    'https://www.correoargentino.com.ar/formularios/consultar-envios',
    true
  )
ON CONFLICT (code) DO NOTHING;

-- Add comments
COMMENT ON TABLE public.shipping_zones IS 'Geographic zones for shipping configuration';
COMMENT ON TABLE public.shipping_rates IS 'Shipping rate configurations per zone';
COMMENT ON TABLE public.shipping_carriers IS 'Shipping carrier information and tracking';

