-- Fix review notifications to use correct table name and fields
-- The reviews table is called 'reviews' not 'product_reviews'
-- And it uses 'is_approved' BOOLEAN not 'status' TEXT

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.notify_admin_new_review() CASCADE;

-- Recreate function with correct field names
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
    'review_pending',
    'medium',
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

-- Drop old trigger if exists
DROP TRIGGER IF EXISTS trigger_notify_admin_new_review ON public.reviews;

-- Create trigger for new reviews on the correct table
CREATE TRIGGER trigger_notify_admin_new_review
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  WHEN (NEW.is_approved = false)
  EXECUTE FUNCTION public.notify_admin_new_review();

-- Also create trigger for when review is submitted without approval
-- (in case reviews are auto-approved initially but then flagged)
DROP TRIGGER IF EXISTS trigger_notify_admin_review_flagged ON public.reviews;

CREATE TRIGGER trigger_notify_admin_review_flagged
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  WHEN (OLD.is_approved = true AND NEW.is_approved = false)
  EXECUTE FUNCTION public.notify_admin_new_review();

-- Add comment
COMMENT ON FUNCTION public.notify_admin_new_review() IS 'Creates admin notification when a new review is submitted for approval';
COMMENT ON TRIGGER trigger_notify_admin_new_review ON public.reviews IS 'Notifies admins when a new review needs approval';

