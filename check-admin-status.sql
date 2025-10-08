-- Check admin users in the database
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM public.admin_users
ORDER BY created_at DESC;

-- Check if is_admin function works
SELECT 
  email,
  public.is_admin(id) as is_admin_check
FROM auth.users
LIMIT 10;

