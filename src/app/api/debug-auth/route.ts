import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Debug: Show all cookies
    const allCookies = cookieStore.getAll();
    console.log('All cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            // API routes don't set cookies
          },
          remove(name: string, options: any) {
            // API routes don't remove cookies  
          },
        },
      }
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    return NextResponse.json({
      success: true,
      authenticated: !!user,
      user: user ? { id: user.id, email: user.email } : null,
      error: error?.message,
      cookies: allCookies.map(c => ({ 
        name: c.name, 
        hasValue: !!c.value,
        isSupabase: c.name.startsWith('sb-')
      })),
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Debug auth error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
