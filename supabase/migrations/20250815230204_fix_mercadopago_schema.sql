-- Fix MercadoPago Database Schema Issues
-- This migration aligns database fields with API expectations

-- 1. The orders table already has total_amount, no need to add it
-- Just ensure it's not null by setting a default value for existing records
UPDATE public.orders 
SET total_amount = COALESCE(total_amount, subtotal + COALESCE(tax_amount, 0) + COALESCE(shipping_amount, 0) - COALESCE(discount_amount, 0))
WHERE total_amount IS NULL;

-- 3. Add missing fields for better MP integration
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS transaction_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS net_received_amount DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS fees DECIMAL(8,2);

-- 4. Fix products table inventory field reference
-- The inventory function expects 'stock_quantity' but table has 'inventory_quantity'
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER;

-- 5. Copy existing inventory to stock_quantity for compatibility
UPDATE public.products 
SET stock_quantity = inventory_quantity 
WHERE stock_quantity IS NULL;

-- 6. Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_total_amount ON public.orders(total_amount);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_amount ON public.orders(transaction_amount);

-- 7. Add comments for clarity
COMMENT ON COLUMN public.orders.total_amount IS 'Total order amount including shipping and taxes (for MP integration)';
COMMENT ON COLUMN public.orders.transaction_amount IS 'Actual transaction amount from MercadoPago';
COMMENT ON COLUMN public.orders.net_received_amount IS 'Net amount received after MP fees';
COMMENT ON COLUMN public.orders.fees IS 'MercadoPago fees charged';
COMMENT ON COLUMN public.products.stock_quantity IS 'Stock quantity (for inventory function compatibility)';

-- 8. Ensure all MercadoPago fields are properly configured
UPDATE public.orders 
SET currency = 'ARS' 
WHERE currency IS NULL OR currency = '';

-- 9. Update the inventory function to work with both field names
CREATE OR REPLACE FUNCTION decrease_product_stock(product_id UUID, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update both inventory fields for compatibility
  UPDATE products 
  SET 
    inventory_quantity = GREATEST(0, inventory_quantity - quantity),
    stock_quantity = GREATEST(0, COALESCE(stock_quantity, inventory_quantity) - quantity),
    updated_at = NOW()
  WHERE id = product_id;
  
  -- Log the stock change for audit purposes
  INSERT INTO stock_movements (
    product_id,
    movement_type,
    quantity,
    reason,
    created_at
  ) VALUES (
    product_id,
    'decrease',
    quantity,
    'order_completed',
    NOW()
  );
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the transaction
    RAISE WARNING 'Error updating stock for product %: %', product_id, SQLERRM;
END;
$$;
