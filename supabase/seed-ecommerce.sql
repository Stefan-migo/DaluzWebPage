-- Sample data for DA LUZ CONSCIENTE e-commerce system
-- This script populates the database with test products and categories

-- Insert sample categories
INSERT INTO public.categories (name, slug, description, sort_order, is_active) VALUES
('Cremas Faciales', 'cremas-faciales', 'Cremas hidratantes y nutritivas para el rostro', 1, true),
('Aceites Corporales', 'aceites-corporales', 'Aceites esenciales y nutritivos para el cuerpo', 2, true),
('Hidrolatos', 'hidrolatos', 'Aguas florales purificadoras y tonificantes', 3, true),
('Jabones Artesanales', 'jabones-artesanales', 'Jabones naturales hechos a mano', 4, true),
('Sets y Kits', 'sets-kits', 'Combinaciones especiales de productos', 5, true);

-- Insert sample products
WITH category_ids AS (
  SELECT 
    'cremas-faciales' as slug,
    id as cat_id
  FROM public.categories WHERE slug = 'cremas-faciales'
  UNION ALL
  SELECT 
    'aceites-corporales' as slug,
    id as cat_id
  FROM public.categories WHERE slug = 'aceites-corporales'
  UNION ALL
  SELECT 
    'hidrolatos' as slug,
    id as cat_id
  FROM public.categories WHERE slug = 'hidrolatos'
  UNION ALL
  SELECT 
    'jabones-artesanales' as slug,
    id as cat_id
  FROM public.categories WHERE slug = 'jabones-artesanales'
)

INSERT INTO public.products (
  name, 
  slug, 
  description, 
  short_description,
  price, 
  compare_at_price,
  category_id,
  featured_image,
  gallery,
  skin_type,
  benefits,
  usage_instructions,
  precautions,
  certifications,
  ingredients,
  inventory_quantity,
  status,
  is_featured,
  published_at
) VALUES
-- Cremas Faciales
(
  'Crema Hidratante de Rosa Mosqueta',
  'crema-hidratante-rosa-mosqueta',
  'Crema facial profundamente hidratante elaborada con aceite puro de rosa mosqueta patagónica. Rica en vitaminas A, C y E, ayuda a regenerar la piel y reducir las líneas de expresión. Su textura suave se absorbe rápidamente sin dejar sensación grasa.',
  'Hidratación profunda con rosa mosqueta patagónica',
  12500.00,
  15000.00,
  (SELECT cat_id FROM category_ids WHERE slug = 'cremas-faciales'),
  'https://via.placeholder.com/400x400/E8B4CB/FFFFFF?text=Rosa+Mosqueta',
  '["https://via.placeholder.com/400x400/E8B4CB/FFFFFF?text=Rosa+Mosqueta", "https://via.placeholder.com/400x400/F4C2C2/FFFFFF?text=Textura"]',
  '["dry", "normal", "sensitive"]',
  '["Hidratación profunda", "Regeneración celular", "Antienvejecimiento", "Reducción de cicatrices"]',
  'Aplicar sobre rostro limpio con movimientos circulares suaves. Usar por la mañana y/o noche. Evitar el contorno de ojos.',
  'Solo para uso externo. Evitar contacto con los ojos. Suspender uso si hay irritación.',
  '["organic", "cruelty-free", "vegan"]',
  '[{"name": "Rosa Mosqueta", "percentage": 25}, {"name": "Aloe Vera", "percentage": 20}, {"name": "Manteca de Karité", "percentage": 15}]',
  45,
  'active',
  true,
  NOW()
),

(
  'Crema Nutritiva de Caléndula',
  'crema-nutritiva-calendula',
  'Crema facial especialmente formulada para pieles sensibles y delicadas. La caléndula tiene propiedades calmantes y cicatrizantes, mientras que el aceite de jojoba proporciona nutrición sin obstruir los poros.',
  'Cuidado suave para pieles sensibles',
  10800.00,
  NULL,
  (SELECT cat_id FROM category_ids WHERE slug = 'cremas-faciales'),
  'https://via.placeholder.com/400x400/FFD700/FFFFFF?text=Calendula',
  '["https://via.placeholder.com/400x400/FFD700/FFFFFF?text=Calendula"]',
  '["sensitive", "dry", "combination"]',
  '["Acción calmante", "Cicatrizante", "Nutritiva", "Antinflamatoria"]',
  'Aplicar sobre piel limpia 2 veces al día. Ideal para pieles irritadas o con rojeces.',
  'Solo para uso externo. Realizar prueba de sensibilidad antes del primer uso.',
  '["organic", "cruelty-free"]',
  '[{"name": "Caléndula", "percentage": 30}, {"name": "Aceite de Jojoba", "percentage": 20}, {"name": "Cera de Abeja", "percentage": 10}]',
  38,
  'active',
  false,
  NOW()
),

-- Aceites Corporales
(
  'Aceite Corporal de Lavanda',
  'aceite-corporal-lavanda',
  'Aceite corporal relajante elaborado con aceite esencial puro de lavanda francesa. Ideal para masajes y cuidado de la piel. Sus propiedades aromáticas ayudan a reducir el estrés y promover la relajación.',
  'Relajación profunda con lavanda francesa',
  8900.00,
  NULL,
  (SELECT cat_id FROM category_ids WHERE slug = 'aceites-corporales'),
  'https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Lavanda',
  '["https://via.placeholder.com/400x400/9370DB/FFFFFF?text=Lavanda"]',
  '["normal", "dry", "sensitive"]',
  '["Relajante", "Hidratante", "Aromaterápico", "Antiestrés"]',
  'Aplicar sobre piel húmeda con movimientos circulares. Ideal después del baño o para masajes.',
  'Solo para uso externo. No aplicar sobre heridas abiertas.',
  '["organic", "cruelty-free", "vegan"]',
  '[{"name": "Aceite de Lavanda", "percentage": 15}, {"name": "Aceite de Almendras", "percentage": 40}, {"name": "Aceite de Coco", "percentage": 25}]',
  52,
  'active',
  true,
  NOW()
),

-- Hidrolatos
(
  'Hidrolato de Romero',
  'hidrolato-romero',
  'Agua floral de romero purificadora y estimulante. Ideal como tónico facial matutino para despertar la piel y darle vitalidad. También excelente para el cabello, aportando brillo y fortaleza.',
  'Tónico purificador y estimulante',
  6500.00,
  NULL,
  (SELECT cat_id FROM category_ids WHERE slug = 'hidrolatos'),
  'https://via.placeholder.com/400x400/228B22/FFFFFF?text=Romero',
  '["https://via.placeholder.com/400x400/228B22/FFFFFF?text=Romero"]',
  '["oily", "combination", "normal"]',
  '["Purificante", "Estimulante", "Tonificante", "Revitalizante"]',
  'Vaporizar sobre rostro limpio o aplicar con algodón. Usar como primer paso de la rutina facial.',
  'Solo para uso externo. Mantener en lugar fresco.',
  '["organic", "vegan"]',
  '[{"name": "Hidrolato de Romero", "percentage": 100}]',
  73,
  'active',
  false,
  NOW()
),

-- Jabones Artesanales
(
  'Jabón de Avena y Miel',
  'jabon-avena-miel',
  'Jabón artesanal elaborado con avena coloidal y miel pura de abejas. La avena actúa como exfoliante suave mientras que la miel proporciona hidratación y propiedades antibacterianas naturales.',
  'Limpieza suave con avena y miel',
  4200.00,
  NULL,
  (SELECT cat_id FROM category_ids WHERE slug = 'jabones-artesanales'),
  'https://via.placeholder.com/400x400/DEB887/FFFFFF?text=Avena+Miel',
  '["https://via.placeholder.com/400x400/DEB887/FFFFFF?text=Avena+Miel"]',
  '["dry", "sensitive", "normal"]',
  '["Exfoliación suave", "Hidratante", "Antibacteriano", "Nutritivo"]',
  'Humedecer y frotar suavemente sobre la piel. Enjuagar con agua tibia. Usar diariamente.',
  'Solo para uso externo. Evitar contacto con los ojos.',
  '["organic", "cruelty-free"]',
  '[{"name": "Avena Coloidal", "percentage": 20}, {"name": "Miel", "percentage": 15}, {"name": "Aceite de Oliva", "percentage": 30}]',
  89,
  'active',
  false,
  NOW()
);

-- Insert product variants
WITH product_data AS (
  SELECT id, name FROM public.products WHERE slug IN ('crema-hidratante-rosa-mosqueta', 'aceite-corporal-lavanda')
)

INSERT INTO public.product_variants (
  product_id,
  title,
  price,
  inventory_quantity,
  option1,
  is_default,
  position
) VALUES
-- Rosa Mosqueta variants
(
  (SELECT id FROM product_data WHERE name = 'Crema Hidratante de Rosa Mosqueta'),
  '50ml - Tamaño Estándar',
  12500.00,
  45,
  '50ml',
  true,
  1
),
(
  (SELECT id FROM product_data WHERE name = 'Crema Hidratante de Rosa Mosqueta'),
  '100ml - Tamaño Grande',
  22000.00,
  25,
  '100ml',
  false,
  2
),

-- Aceite de Lavanda variants
(
  (SELECT id FROM product_data WHERE name = 'Aceite Corporal de Lavanda'),
  '100ml - Tamaño Estándar',
  8900.00,
  52,
  '100ml',
  true,
  1
),
(
  (SELECT id FROM product_data WHERE name = 'Aceite Corporal de Lavanda'),
  '250ml - Tamaño Familiar',
  18500.00,
  18,
  '250ml',
  false,
  2
);

-- Update inventory quantities to match variants
UPDATE public.products 
SET inventory_quantity = (
  SELECT SUM(inventory_quantity) 
  FROM public.product_variants 
  WHERE product_variants.product_id = products.id
)
WHERE id IN (
  SELECT DISTINCT product_id 
  FROM public.product_variants
);

COMMIT; 