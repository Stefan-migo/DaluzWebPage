import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createSuccessResponse } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connectivity safely
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
    
    // Test connectivity using a basic request. If it fails with PGRST116 (No rows), it's still healthy.
    const { error: dbError } = await supabase
      .from('categories')
      .select('id')
      .limit(1)
    
    const isDbError = dbError ? (dbError.code !== 'PGRST116' && dbError.code !== '42P01') : false;
    const dbStatus = isDbError ? 'error' : 'healthy'
    const responseTime = Date.now() - startTime
    
    // System health data
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus,
          responseTime: `${responseTime}ms`
        },
        api: {
          status: 'healthy',
          version: process.env.npm_package_version || '1.0.0'
        }
      },
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime()
    }
    
    // If database is down, return 503
    if (dbError) {
      return NextResponse.json(
        { 
          ...healthData, 
          status: 'unhealthy',
          error: 'Database connectivity issue'
        }, 
        { status: 503 }
      )
    }
    
    return createSuccessResponse(healthData)
    
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'System error during health check'
      },
      { status: 503 }
    )
  }
} 