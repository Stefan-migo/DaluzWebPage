-- Add review notifications to admin system
-- This migration adds notifications for new reviews submitted by users

-- Update the new review notification function to create admin notifications
CREATE OR REPLACE FUNCTION public.notify_admin_new_review()
RETURNS TRIGGER AS $$
DECLARE
  v_user_name TEXT;
  v_product_name TEXT;
  v_product_slug TEXT;
BEGIN
  -- Get user's name if available
  SELECT COALESCE(first_name || ' ' || last_name, email, 'Cliente Anónimo')
  INTO v_user_name
  FROM profiles
  WHERE id = NEW.user_id
  LIMIT 1;

  -- Get product information
  SELECT name, slug
  INTO v_product_name, v_product_slug
  FROM products
  WHERE id = NEW.product_id
  LIMIT 1;

  -- Create notification for new review (since reviews are now auto-approved)
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
    'new_review'::admin_notification_type,
    'medium'::admin_notification_priority,
    'Nueva Reseña Publicada',
    COALESCE(v_user_name, 'Cliente') || ' dejó una reseña de ' || NEW.rating::TEXT || ' estrellas para ' || COALESCE(v_product_name, 'un producto'),
    'review',
    NEW.id,
    '/admin/reviews',
    'Ver Reseñas',
    jsonb_build_object(
      'product_id', NEW.product_id,
      'product_name', v_product_name,
      'product_slug', v_product_slug,
      'user_id', NEW.user_id,
      'rating', NEW.rating,
      'title', NEW.title,
      'has_comment', (NEW.comment IS NOT NULL AND NEW.comment != ''),
      'is_verified_purchase', NEW.is_verified_purchase
    ),
    true
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trigger_notify_admin_new_review ON public.reviews;

-- Create trigger for new reviews (now triggers on all new reviews since they're auto-approved)
CREATE TRIGGER trigger_notify_admin_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_admin_new_review();

-- Add comments for documentation
COMMENT ON FUNCTION public.notify_admin_new_review() IS 'Creates admin notifications for new reviews (auto-approved)';
COMMENT ON TRIGGER trigger_notify_admin_new_review ON public.reviews IS 'Triggers notification when new review is created';
