import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { createServiceRoleClient } from '@/utils/supabase/server'
import {
  TWO_FACTOR_MAX_ATTEMPTS,
  TWO_FACTOR_PENDING_COOKIE,
  hashCode,
  verifyPendingCookie,
} from '@/lib/auth/two-factor'

export async function POST(request: Request) {
  try {
    const { code, password } = await request.json()

    if (typeof code !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Código y contraseña son requeridos' },
        { status: 400 },
      )
    }

    const cookieStore = await cookies()
    const pendingCookie = cookieStore.get(TWO_FACTOR_PENDING_COOKIE)?.value
    if (!pendingCookie) {
      return NextResponse.json(
        { error: 'Sesión de verificación expirada. Iniciá sesión de nuevo.' },
        { status: 401 },
      )
    }

    const pending = verifyPendingCookie(pendingCookie)
    if (!pending) {
      return NextResponse.json(
        { error: 'Sesión de verificación inválida o expirada.' },
        { status: 401 },
      )
    }

    const admin = createServiceRoleClient()

    const { data: codeRow, error: codeError } = await admin
      .from('two_factor_codes')
      .select('*')
      .eq('user_id', pending.userId)
      .is('used_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (codeError) {
      console.error('Error reading 2FA code:', codeError)
      return NextResponse.json(
        { error: 'Error al verificar el código' },
        { status: 500 },
      )
    }

    if (!codeRow) {
      return NextResponse.json(
        { error: 'No hay un código activo. Solicitá uno nuevo.' },
        { status: 400 },
      )
    }

    if (new Date(codeRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json(
        { error: 'El código expiró. Solicitá uno nuevo.' },
        { status: 400 },
      )
    }

    if (codeRow.attempts >= TWO_FACTOR_MAX_ATTEMPTS) {
      await admin
        .from('two_factor_codes')
        .update({ used_at: new Date().toISOString() })
        .eq('id', codeRow.id)
      return NextResponse.json(
        { error: 'Demasiados intentos. Solicitá un código nuevo.' },
        { status: 429 },
      )
    }

    const incomingHash = hashCode(code.trim())
    if (incomingHash !== codeRow.code_hash) {
      await admin
        .from('two_factor_codes')
        .update({ attempts: codeRow.attempts + 1 })
        .eq('id', codeRow.id)
      return NextResponse.json(
        { error: 'Código incorrecto' },
        { status: 400 },
      )
    }

    // Mark code as used before establishing session
    await admin
      .from('two_factor_codes')
      .update({ used_at: new Date().toISOString() })
      .eq('id', codeRow.id)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Configuración inválida' }, { status: 500 })
    }

    // Use a server client that writes auth cookies into the response
    const response = NextResponse.json({ success: true })
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    })

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: pending.email,
      password,
    })

    if (signInError) {
      console.error('2FA verify: sign-in failed after code OK:', signInError)
      return NextResponse.json(
        { error: 'No se pudo completar el inicio de sesión. Volvé a intentarlo.' },
        { status: 401 },
      )
    }

    response.cookies.set(TWO_FACTOR_PENDING_COOKIE, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })

    return response
  } catch (error) {
    console.error('Error in 2FA verify-code endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
