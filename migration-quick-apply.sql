-- Quick Apply: Copy this entire block to Supabase SQL Editor
-- Function to safely decrease product stock
CREATE OR REPLACE FUNCTION decrease_product_stock(product_id UUID, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE products 
  SET 
    stock_quantity = GREATEST(0, stock_quantity - quantity),
    updated_at = NOW()
  WHERE id = product_id;
  
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
    RAISE WARNING 'Error updating stock for product %: %', product_id, SQLERRM;
END;
$$;

-- Create stock_movements table
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('increase', 'decrease', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all stock movements" ON stock_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

GRANT EXECUTE ON FUNCTION decrease_product_stock TO service_role;
GRANT EXECUTE ON FUNCTION decrease_product_stock TO authenticated;

CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);
