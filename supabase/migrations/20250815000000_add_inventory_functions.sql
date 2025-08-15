-- Function to safely decrease product stock
CREATE OR REPLACE FUNCTION decrease_product_stock(product_id UUID, quantity INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update product stock, ensuring it doesn't go below 0
  UPDATE products 
  SET 
    stock_quantity = GREATEST(0, stock_quantity - quantity),
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

-- Create stock_movements table for audit trail
CREATE TABLE IF NOT EXISTS stock_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  movement_type VARCHAR(20) NOT NULL CHECK (movement_type IN ('increase', 'decrease', 'adjustment')),
  quantity INTEGER NOT NULL,
  reason VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on stock_movements
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- Policy for admins to view all stock movements
CREATE POLICY "Admins can view all stock movements" ON stock_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for admins to insert stock movements
CREATE POLICY "Admins can insert stock movements" ON stock_movements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Grant permissions
GRANT EXECUTE ON FUNCTION decrease_product_stock TO service_role;
GRANT EXECUTE ON FUNCTION decrease_product_stock TO authenticated;

-- Add some helpful indexes
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_created_at ON stock_movements(created_at DESC);

-- Comment the function
COMMENT ON FUNCTION decrease_product_stock IS 'Safely decreases product stock and logs the movement for audit purposes';
COMMENT ON TABLE stock_movements IS 'Audit trail for all product stock changes';
