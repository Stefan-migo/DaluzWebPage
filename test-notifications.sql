-- ============================================
-- ADMIN NOTIFICATION SYSTEM - TEST SCRIPT
-- ============================================
-- This script tests all notification triggers
-- Run each section separately to test each trigger

-- ============================================
-- 1. TEST: New Order Notification
-- ============================================
-- Creates a test order to trigger order notification

-- First, insert a test order (replace user_id with a real one from your auth.users table)
INSERT INTO public.orders (
  user_id,
  email,
  order_number,
  status,
  payment_status,
  total_amount,
  currency,
  customer_name,
  shipping_address
) VALUES (
  (SELECT id FROM auth.users LIMIT 1), -- Use first available user
  'test@example.com',
  'TEST-' || EXTRACT(EPOCH FROM NOW())::TEXT,
  'pending',
  'pending',
  150.00,
  'ARS',
  'Test Customer',
  jsonb_build_object(
    'street', 'Calle Test 123',
    'city', 'Buenos Aires',
    'province', 'Buenos Aires',
    'postal_code', '1000',
    'country', 'Argentina'
  )
);

-- Check if notification was created
SELECT 
  type,
  priority,
  title,
  message,
  action_url,
  is_read,
  created_at
FROM public.admin_notifications
WHERE type = 'order_new'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- 2. TEST: Low Stock Notification
-- ============================================
-- Updates a product to trigger low stock notification

-- First, find a product to test with
SELECT id, name, inventory_quantity 
FROM public.products 
WHERE status = 'active' 
LIMIT 1;

-- Update product inventory to 5 (triggers low_stock)
UPDATE public.products
SET inventory_quantity = 5
WHERE id = (SELECT id FROM public.products WHERE status = 'active' LIMIT 1);

-- Check if notification was created
SELECT 
  type,
  priority,
  title,
  message,
  action_url,
  metadata,
  is_read,
  created_at
FROM public.admin_notifications
WHERE type = 'low_stock'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- 3. TEST: Out of Stock Notification
-- ============================================
-- Updates a product to 0 inventory

-- Update product inventory to 0 (triggers out_of_stock)
UPDATE public.products
SET inventory_quantity = 0
WHERE id = (SELECT id FROM public.products WHERE status = 'active' LIMIT 1);

-- Check if notification was created
SELECT 
  type,
  priority,
  title,
  message,
  action_url,
  metadata,
  is_read,
  created_at
FROM public.admin_notifications
WHERE type = 'out_of_stock'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- 4. TEST: New Review Notification
-- ============================================
-- Creates a test review to trigger review notification

-- First, get a product ID and user ID
SELECT 
  p.id as product_id,
  u.id as user_id
FROM public.products p
CROSS JOIN auth.users u
WHERE p.status = 'active'
LIMIT 1;

-- Insert a test review (is_approved = false triggers notification)
INSERT INTO public.reviews (
  product_id,
  user_id,
  rating,
  title,
  comment,
  is_approved,
  is_verified_purchase
) VALUES (
  (SELECT id FROM public.products WHERE status = 'active' LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1),
  5,
  'Excelente producto!',
  'Me encantó este producto, lo recomiendo totalmente.',
  false, -- NOT approved = pending review
  true
)
ON CONFLICT (product_id, user_id) DO NOTHING; -- Skip if already reviewed

-- Check if notification was created
SELECT 
  type,
  priority,
  title,
  message,
  action_url,
  metadata,
  is_read,
  created_at
FROM public.admin_notifications
WHERE type = 'review_pending'
ORDER BY created_at DESC
LIMIT 1;

-- ============================================
-- 5. VIEW ALL NOTIFICATIONS
-- ============================================
-- Shows all notifications in the system

SELECT 
  id,
  type,
  priority,
  title,
  message,
  action_url,
  action_label,
  is_read,
  read_at,
  created_at,
  metadata
FROM public.admin_notifications
ORDER BY created_at DESC
LIMIT 20;

-- ============================================
-- 6. GET UNREAD COUNT
-- ============================================
-- Test the unread count function

SELECT public.get_unread_notification_count(
  (SELECT id FROM auth.users LIMIT 1)
) as unread_count;

-- ============================================
-- 7. CHECK TRIGGERS STATUS
-- ============================================
-- Verify all triggers are installed correctly

SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE 'trigger_notify%'
ORDER BY trigger_name;

-- ============================================
-- 8. CLEANUP TEST DATA (Optional)
-- ============================================
-- Run this to clean up test notifications

-- Delete test notifications
DELETE FROM public.admin_notifications
WHERE message LIKE '%Test%' OR title LIKE '%Test%';

-- Delete test orders
DELETE FROM public.orders
WHERE order_number LIKE 'TEST-%';

-- Delete test reviews
DELETE FROM public.reviews
WHERE title = 'Excelente producto!' AND comment LIKE '%lo recomiendo totalmente%';

-- ============================================
-- 9. VERIFY DATABASE STRUCTURE
-- ============================================
-- Check that all notification types are available

SELECT 
  enumlabel as notification_type
FROM pg_enum
WHERE enumtypid = 'admin_notification_type'::regtype
ORDER BY enumlabel;

-- Check priorities
SELECT 
  enumlabel as priority_level
FROM pg_enum
WHERE enumtypid = 'admin_notification_priority'::regtype
ORDER BY enumlabel;

-- ============================================
-- 10. TEST RLS POLICIES
-- ============================================
-- Verify Row Level Security policies are working

-- Check RLS is enabled
SELECT 
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'admin_notifications';

-- View active policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'admin_notifications';

