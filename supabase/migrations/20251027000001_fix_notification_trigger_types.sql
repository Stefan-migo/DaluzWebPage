-- Fix notification trigger type casting issues
-- The trigger functions are using string literals instead of proper enum casting

-- Fix the low stock notification function
CREATE OR REPLACE FUNCTION public.notify_admin_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if product went from above threshold to below
  IF (OLD.inventory_quantity > 5 AND NEW.inventory_quantity <= 5) 
     OR (OLD.inventory_quantity > 0 AND NEW.inventory_quantity = 0) THEN
    
    INSERT INTO public.admin_notifications (
      type,
      priority,
      title,
      message,
      related_entity_type,
      related_entity_id,
      action_url,
      action_label,
      metadata,
      created_by_system
    ) VALUES (
      CASE 
        WHEN NEW.inventory_quantity = 0 THEN 'out_of_stock'::admin_notification_type
        ELSE 'low_stock'::admin_notification_type
      END,
      CASE 
        WHEN NEW.inventory_quantity = 0 THEN 'urgent'::admin_notification_priority
        ELSE 'high'::admin_notification_priority
      END,
      CASE 
        WHEN NEW.inventory_quantity = 0 THEN 'Producto Agotado'
        ELSE 'Stock Bajo'
      END,
      NEW.name || ' - ' || CASE 
        WHEN NEW.inventory_quantity = 0 THEN 'Sin Stock'
        ELSE NEW.inventory_quantity::TEXT || ' unidades restantes'
      END,
      'product',
      NEW.id,
      '/admin/products',
      'Ver Producto',
      jsonb_build_object(
        'product_name', NEW.name,
        'current_stock', NEW.inventory_quantity,
        'product_slug', NEW.slug
      ),
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix the new order notification function
CREATE OR REPLACE FUNCTION public.notify_admin_new_order()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification for non-draft orders
  IF NEW.status != 'draft' THEN
    INSERT INTO public.admin_notifications (
      type,
      priority,
      title,
      message,
      related_entity_type,
      related_entity_id,
      action_url,
      action_label,
      metadata,
      created_by_system
    ) VALUES (
      'order_new'::admin_notification_type,
      'high'::admin_notification_priority,
      'Nuevo Pedido Recibido',
      'Pedido #' || NEW.order_number || ' - $' || NEW.total_amount::TEXT,
      'order',
      NEW.id,
      '/admin/orders',
      'Ver Pedido',
      jsonb_build_object(
        'order_number', NEW.order_number,
        'customer_email', NEW.email,
        'total_amount', NEW.total_amount,
        'status', NEW.status
      ),
      true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix the new review notification function
CREATE OR REPLACE FUNCTION public.notify_admin_new_review()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
BEGIN
  -- Get user's name if available
  SELECT COALESCE(first_name || ' ' || last_name, email, 'Cliente Anónimo')
  INTO v_user_name
  FROM profiles
  WHERE id = NEW.user_id
  LIMIT 1;

  -- Create notification for pending review (is_approved = false)
  INSERT INTO public.admin_notifications (
    type,
    priority,
    title,
    message,
    related_entity_type,
    related_entity_id,
    action_url,
    action_label,
    metadata,
    created_by_system
  ) VALUES (
    'review_pending'::admin_notification_type,
    'medium'::admin_notification_priority,
    'Nueva Reseña Pendiente',
    'Reseña de ' || COALESCE(v_user_name, 'Cliente') || ' - ' || NEW.rating::TEXT || ' estrellas',
    'review',
    NEW.id,
    '/admin/reviews',
    'Moderar Reseña',
    jsonb_build_object(
      'product_id', NEW.product_id,
      'user_id', NEW.user_id,
      'rating', NEW.rating,
      'has_comment', (NEW.comment IS NOT NULL AND NEW.comment != ''),
      'is_verified_purchase', NEW.is_verified_purchase
    ),
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON FUNCTION public.notify_admin_low_stock() IS 'Fixed: Properly cast enum types for admin notifications';
COMMENT ON FUNCTION public.notify_admin_new_order() IS 'Fixed: Properly cast enum types for admin notifications';
COMMENT ON FUNCTION public.notify_admin_new_review() IS 'Fixed: Properly cast enum types for admin notifications';
