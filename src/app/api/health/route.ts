import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase'
import { createSuccessResponse } from '@/lib/api/errors'

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Check database connectivity
    const supabase = createServiceRoleClient()
    const { error: dbError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    const dbStatus = dbError ? 'error' : 'healthy'
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