-- Fix Security Linter Issues
-- This migration addresses critical security errors and warnings from Supabase database linter

-- ============================================================================
-- FIX ERRORS: Remove SECURITY DEFINER from views
-- ============================================================================

-- Fix 1: support_ticket_stats view
-- Remove SECURITY DEFINER and use regular view with proper RLS
DROP VIEW IF EXISTS public.support_ticket_stats CASCADE;

CREATE VIEW public.support_ticket_stats AS
SELECT 
  COUNT(*) as total_tickets,
  COUNT(*) FILTER (WHERE status = 'open') as open_tickets,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tickets,
  COUNT(*) FILTER (WHERE status = 'pending_customer') as pending_customer_tickets,
  COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
  COUNT(*) FILTER (WHERE status = 'closed') as closed_tickets,
  COUNT(*) FILTER (WHERE priority = 'urgent') as urgent_tickets,
  COUNT(*) FILTER (WHERE priority = 'high') as high_priority_tickets,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as tickets_this_week,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as tickets_this_month,
  AVG(EXTRACT(EPOCH FROM (resolved_at - created_at))/3600) FILTER (WHERE resolved_at IS NOT NULL) as avg_resolution_time_hours
FROM public.support_tickets;

-- Add RLS policy for the view (views inherit RLS from underlying tables)
-- Admin users can view stats
CREATE POLICY "Admin users can view ticket stats" ON public.support_tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.id = auth.uid() 
      AND au.is_active = true
    )
  );

COMMENT ON VIEW public.support_ticket_stats IS 'Real-time statistics for support ticket dashboard (no SECURITY DEFINER)';

-- Fix 2: admin_users_view view
-- Remove SECURITY DEFINER and use regular view with proper RLS
DROP VIEW IF EXISTS public.admin_users_view CASCADE;

CREATE VIEW public.admin_users_view AS
SELECT 
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.created_at,
  au.last_login,
  CONCAT(COALESCE(p.first_name, ''), ' ', COALESCE(p.last_name, '')) as full_name,
  p.membership_tier as profile_tier
FROM public.admin_users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.is_active = true;

-- RLS is already handled by the underlying admin_users table policies
COMMENT ON VIEW public.admin_users_view IS 'Convenient view for admin user management (no SECURITY DEFINER)';

-- ============================================================================
-- FIX WARNINGS: Set search_path for security-critical functions
-- ============================================================================

-- Fix handle_new_user (CRITICAL - we just modified this)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_email TEXT;
  user_first_name TEXT;
  user_last_name TEXT;
  user_avatar_url TEXT;
  user_full_name TEXT;
BEGIN
  -- Get email (required field)
  user_email := COALESCE(NEW.email, '');
  
  -- Extract metadata from raw_user_meta_data
  -- Google OAuth provides: full_name, avatar_url (or picture), email
  -- Also check for first_name and last_name if available (for email/password signups)
  user_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );
  
  -- Extract first name: prefer explicit first_name, fallback to splitting full_name
  user_first_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'first_name', ''),
    -- Try to extract from full_name if available
    CASE 
      WHEN user_full_name != '' THEN 
        NULLIF(TRIM(SPLIT_PART(user_full_name, ' ', 1)), '')
      ELSE NULL
    END
  );
  
  -- Extract last name: prefer explicit last_name, fallback to splitting full_name
  user_last_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'last_name', ''),
    -- Try to extract from full_name if available (everything after first word)
    CASE 
      WHEN user_full_name != '' AND array_length(string_to_array(user_full_name, ' '), 1) > 1 THEN
        NULLIF(TRIM(array_to_string((string_to_array(user_full_name, ' '))[2:], ' ')), '')
      ELSE NULL
    END
  );
  
  -- Get avatar URL (Google uses 'picture' or 'avatar_url')
  user_avatar_url := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    NULL
  );
  
  -- Insert or update profile
  -- ON CONFLICT ensures this works even if profile already exists (idempotent)
  INSERT INTO public.profiles (
    id, 
    email, 
    first_name, 
    last_name,
    avatar_url
  )
  VALUES (
    NEW.id,
    user_email,
    user_first_name,
    user_last_name,
    user_avatar_url
  )
  ON CONFLICT (id) DO UPDATE SET
    -- Only update email if it's not already set (preserve existing)
    email = COALESCE(NULLIF(EXCLUDED.email, ''), profiles.email),
    -- Only update names if they're not already set (preserve existing data)
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    -- Update avatar if provided (can be updated)
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    updated_at = NOW();
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the user creation
    -- This ensures auth.users is still created even if profile creation fails
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$;

-- Fix other critical SECURITY DEFINER functions
CREATE OR REPLACE FUNCTION public.handle_new_admin_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Check if this is the designated admin email
  IF NEW.email = 'daluzalkimya@gmail.com' THEN
    INSERT INTO public.admin_users (
      id,
      email,
      role,
      permissions,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      NEW.id,
      NEW.email,
      'admin',
      '{
        "orders": ["read", "create", "update", "delete"],
        "products": ["read", "create", "update", "delete"],
        "customers": ["read", "create", "update", "delete"],
        "analytics": ["read"],
        "settings": ["read", "create", "update", "delete"],
        "admin_users": ["read", "create", "update", "delete"],
        "support": ["read", "create", "update", "delete"],
        "bulk_operations": ["read", "create", "update", "delete"]
      }'::jsonb,
      true,
      NOW(),
      NOW()
    ) ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      is_active = true,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_admin_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  admin_role TEXT;
BEGIN
  SELECT role INTO admin_role
  FROM public.admin_users 
  WHERE id = user_id 
  AND is_active = true;
  
  RETURN admin_role;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_admin_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix other functions (add search_path for security)
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
DECLARE
  new_number TEXT;
BEGIN
  -- Generate ticket number: TICKET-YYYYMMDD-XXXXX
  new_number := 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                LPAD((COALESCE((SELECT MAX(CAST(SUBSTRING(ticket_number FROM 18) AS INTEGER)) 
                                FROM public.support_tickets 
                                WHERE ticket_number LIKE 'TICKET-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-%'), 0) + 1)::TEXT, 5, '0');
  RETURN new_number;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
    NEW.ticket_number := public.generate_ticket_number();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_ticket_timestamps()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Update status_changed_at when status changes
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    NEW.status_changed_at := NOW();
  END IF;
  
  -- Set resolved_at when status becomes resolved
  IF NEW.status = 'resolved' AND OLD.status != 'resolved' THEN
    NEW.resolved_at := NOW();
  END IF;
  
  -- Clear resolved_at if status changes from resolved
  IF NEW.status != 'resolved' AND OLD.status = 'resolved' THEN
    NEW.resolved_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.decrease_product_stock(
  p_product_id UUID,
  p_variant_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Get current stock
  SELECT stock INTO current_stock
  FROM public.product_variants
  WHERE id = p_variant_id AND product_id = p_product_id;
  
  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Product variant not found';
  END IF;
  
  IF current_stock < p_quantity THEN
    RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', current_stock, p_quantity;
  END IF;
  
  -- Decrease stock
  UPDATE public.product_variants
  SET stock = stock - p_quantity,
      updated_at = NOW()
  WHERE id = p_variant_id;
  
  -- Log stock movement
  INSERT INTO public.stock_movements (
    product_id,
    variant_id,
    movement_type,
    quantity,
    reason,
    created_by
  ) VALUES (
    p_product_id,
    p_variant_id,
    'sale',
    -p_quantity,
    'Order placed',
    auth.uid()
  );
  
  -- Check if stock is low and notify admin
  IF (current_stock - p_quantity) <= 10 THEN
    PERFORM public.notify_admin_low_stock(p_product_id, p_variant_id, current_stock - p_quantity);
  END IF;
  
  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admin_low_stock(
  p_product_id UUID,
  p_variant_id UUID,
  p_current_stock INTEGER
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  notification_id UUID;
  product_name TEXT;
BEGIN
  -- Get product name
  SELECT name INTO product_name
  FROM public.products
  WHERE id = p_product_id;
  
  -- Create notification for all active admins
  INSERT INTO public.admin_notifications (
    target_admin_id,
    type,
    title,
    message,
    metadata,
    priority
  )
  SELECT 
    NULL, -- NULL means all admins
    'low_stock',
    'Stock Bajo: ' || COALESCE(product_name, 'Producto'),
    'El producto tiene solo ' || p_current_stock || ' unidades en stock.',
    jsonb_build_object(
      'product_id', p_product_id,
      'variant_id', p_variant_id,
      'current_stock', p_current_stock
    ),
    'high'
  FROM public.admin_users
  WHERE is_active = true
  LIMIT 1
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admin_new_order(p_order_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  notification_id UUID;
  order_total NUMERIC;
BEGIN
  -- Get order total
  SELECT total INTO order_total
  FROM public.orders
  WHERE id = p_order_id;
  
  -- Create notification
  INSERT INTO public.admin_notifications (
    target_admin_id,
    type,
    title,
    message,
    metadata,
    priority
  ) VALUES (
    NULL, -- All admins
    'new_order',
    'Nueva Orden Recibida',
    'Se ha recibido una nueva orden por $' || COALESCE(order_total::TEXT, '0'),
    jsonb_build_object('order_id', p_order_id),
    'medium'
  )
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.notify_admin_new_review(p_review_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  notification_id UUID;
  review_rating INTEGER;
  product_name TEXT;
BEGIN
  -- Get review details
  SELECT pr.rating, p.name INTO review_rating, product_name
  FROM public.product_reviews pr
  JOIN public.products p ON pr.product_id = p.id
  WHERE pr.id = p_review_id;
  
  -- Create notification (only for low ratings or if needed)
  IF review_rating <= 3 THEN
    INSERT INTO public.admin_notifications (
      target_admin_id,
      type,
      title,
      message,
      metadata,
      priority
    ) VALUES (
      NULL,
      'new_review',
      'Nueva Reseña: ' || COALESCE(product_name, 'Producto'),
      'Se recibió una reseña de ' || review_rating || ' estrellas',
      jsonb_build_object('review_id', p_review_id, 'rating', review_rating),
      'medium'
    )
    RETURNING id INTO notification_id;
  END IF;
  
  RETURN notification_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.collect_system_health_metrics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Clear old metrics (keep last 30 days)
  DELETE FROM public.system_health_metrics 
  WHERE collected_at < NOW() - INTERVAL '30 days';
  
  -- Collect database metrics
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'database_size_mb',
    pg_database_size(current_database()) / 1024.0 / 1024.0,
    'megabytes',
    'database';
    
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'active_connections',
    count(*),
    'count',
    'database'
  FROM pg_stat_activity 
  WHERE state = 'active';
  
  -- Collect business metrics
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'total_products',
    count(*),
    'count',
    'business'
  FROM public.products 
  WHERE status = 'active';
  
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'total_orders_today',
    count(*),
    'count',
    'business'
  FROM public.orders 
  WHERE created_at >= CURRENT_DATE;
  
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'total_customers',
    count(*),
    'count',
    'business'
  FROM public.profiles;
  
  INSERT INTO public.system_health_metrics (metric_name, metric_value, metric_unit, category)
  SELECT 
    'low_stock_products',
    count(*),
    'count',
    'inventory'
  FROM public.products 
  WHERE inventory_quantity <= 5 AND track_inventory = true;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_old_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Delete notifications older than 90 days
  DELETE FROM public.admin_notifications
  WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_notification_read(notification_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.admin_notifications
  SET 
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE id = notification_id
    AND (target_admin_id = auth.uid() OR target_admin_id IS NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.admin_notifications
  SET 
    is_read = true,
    read_at = NOW(),
    updated_at = NOW()
  WHERE is_read = false
    AND (target_admin_id = auth.uid() OR target_admin_id IS NULL);
END;
$$;

CREATE OR REPLACE FUNCTION public.get_unread_notification_count(admin_user_id UUID DEFAULT auth.uid())
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)::INTEGER
    FROM public.admin_notifications
    WHERE is_read = false
      AND is_archived = false
      AND (target_admin_id = admin_user_id OR target_admin_id IS NULL)
      AND (expires_at IS NULL OR expires_at > NOW())
  );
END;
$$;

-- Update comments
COMMENT ON FUNCTION public.handle_new_user() IS 
'Automatically creates or updates user profile when a new auth user is created. 
Supports both email/password signup and OAuth providers (Google, etc.).
Extracts user metadata from raw_user_meta_data including name, avatar, etc.
FIXED: Added SET search_path for security.';
