-- Create function to optimize database (VACUUM ANALYZE)
-- This function runs with SECURITY DEFINER to have elevated privileges

CREATE OR REPLACE FUNCTION public.optimize_database()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
  tables_optimized text[];
  start_time timestamp;
  end_time timestamp;
  duration_seconds numeric;
BEGIN
  start_time := clock_timestamp();
  
  -- Run ANALYZE on key tables
  -- ANALYZE updates table statistics for query planner (can run in transactions)
  -- Note: VACUUM requires autocommit mode, so we use ANALYZE instead
  ANALYZE public.products;
  ANALYZE public.orders;
  ANALYZE public.order_items;
  ANALYZE public.profiles;
  ANALYZE public.admin_users;
  ANALYZE public.admin_activity_log;
  ANALYZE public.system_health_metrics;
  ANALYZE public.system_config;
  
  -- Get list of optimized tables
  SELECT array_agg(tablename::text) INTO tables_optimized
  FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename IN ('products', 'orders', 'order_items', 'profiles', 'admin_users', 'admin_activity_log', 'system_health_metrics', 'system_config');
  
  end_time := clock_timestamp();
  duration_seconds := EXTRACT(EPOCH FROM (end_time - start_time));
  
  -- Return result
  result := jsonb_build_object(
    'success', true,
    'tables_optimized', tables_optimized,
    'duration_seconds', duration_seconds,
    'started_at', start_time,
    'completed_at', end_time,
    'note', 'ANALYZE ejecutado para actualizar estadísticas. Para VACUUM completo, ejecutar manualmente.'
  );
  
  RETURN result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

-- Grant execute permission to authenticated users (admins will be checked in the API)
GRANT EXECUTE ON FUNCTION public.optimize_database() TO authenticated;

COMMENT ON FUNCTION public.optimize_database() IS 'Optimizes database by running ANALYZE on key tables to update statistics. Requires admin privileges (checked in API).';

