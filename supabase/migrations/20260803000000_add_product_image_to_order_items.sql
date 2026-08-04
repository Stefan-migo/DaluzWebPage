-- Congela la imagen del producto al momento de la compra, con el mismo
-- criterio que ya se usa para product_name, variant_title y unit_price:
-- el pedido es un registro historico y no debe cambiar si despues se
-- edita la foto del producto o se lo da de baja.
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image text;

-- Backfill best-effort para pedidos existentes: toma la imagen ACTUAL del
-- producto. No es la del momento de compra, pero es lo mejor disponible;
-- de aca en adelante el dato es fiel.
UPDATE order_items oi
SET product_image = p.featured_image
FROM products p
WHERE oi.product_id = p.id
  AND oi.product_image IS NULL;
