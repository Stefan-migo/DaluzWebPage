import { NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServiceRoleClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/email/client'
import {
  TWO_FACTOR_CODE_TTL_MS,
  TWO_FACTOR_PENDING_COOKIE,
  generateNumericCode,
  hashCode,
  signPendingCookie,
} from '@/lib/auth/two-factor'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: 'Configuración inválida' }, { status: 500 })
    }

    // Verify credentials without persisting a session on the server.
    const verifier = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: signInData, error: signInError } =
      await verifier.auth.signInWithPassword({ email, password })

    if (signInError || !signInData.user) {
      return NextResponse.json(
        { error: 'Credenciales inválidas' },
        { status: 401 },
      )
    }

    const user = signInData.user
    // Best-effort sign out on the verifier client (no shared cookies, just cleanup).
    await verifier.auth.signOut().catch(() => {})

    const admin = createServiceRoleClient()

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('two_factor_enabled')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error reading profile for 2FA:', profileError)
      return NextResponse.json(
        { error: 'No se pudo verificar la configuración 2FA' },
        { status: 500 },
      )
    }

    if (!profile?.two_factor_enabled) {
      return NextResponse.json(
        { error: '2FA no está habilitado para este usuario' },
        { status: 400 },
      )
    }

    const code = generateNumericCode()
    const expiresAt = new Date(Date.now() + TWO_FACTOR_CODE_TTL_MS)

    // Invalidate previous unused codes for this user
    await admin
      .from('two_factor_codes')
      .update({ used_at: new Date().toISOString() })
      .is('used_at', null)
      .eq('user_id', user.id)

    const { error: insertError } = await admin
      .from('two_factor_codes')
      .insert({
        user_id: user.id,
        code_hash: hashCode(code),
        expires_at: expiresAt.toISOString(),
      })

    if (insertError) {
      console.error('Error storing 2FA code:', insertError)
      return NextResponse.json(
        { error: 'No se pudo generar el código' },
        { status: 500 },
      )
    }

    const userEmail = user.email!
    const emailResult = await sendEmail({
      to: userEmail,
      subject: '🔐 Tu código de verificación - DA LUZ CONSCIENTE',
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin:0;padding:0;background-color:#FDF3E3;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
          <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
            <div style="background:white;border-radius:0 15px;padding:40px;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
              <div style="text-align:center;margin-bottom:30px;">
                <h1 style="color:#1D3F6A;font-size:24px;margin:0;">🔐 Código de verificación</h1>
                <p style="color:#6A1111;font-size:14px;margin-top:8px;">DA LUZ CONSCIENTE</p>
              </div>
              <div style="color:#333;line-height:1.6;">
                <p style="font-size:16px;">Hola,</p>
                <p style="font-size:16px;">Recibimos un intento de inicio de sesión en tu cuenta. Ingresá este código para completar el acceso:</p>
                <div style="background:#FDF3E3;border:2px dashed #1D3F6A;padding:24px;margin:24px 0;border-radius:8px;text-align:center;">
                  <p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:#1D3F6A;margin:0;">${code}</p>
                </div>
                <p style="font-size:14px;color:#666;">El código expira en <strong>10 minutos</strong>. Si vos no intentaste iniciar sesión, cambiá tu contraseña inmediatamente y contactanos a <a href="mailto:contacto@daluzconsciente.com" style="color:#6A1111;">contacto@daluzconsciente.com</a>.</p>
              </div>
              <div style="margin-top:30px;padding-top:20px;border-top:1px solid #E5DFD3;text-align:center;">
                <p style="font-size:12px;color:#999;margin:0;">Este email fue enviado desde DA LUZ CONSCIENTE</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Tu código de verificación es: ${code}\n\nEl código expira en 10 minutos.\n\nSi no intentaste iniciar sesión, cambiá tu contraseña y contactanos a contacto@daluzconsciente.com`,
    })

    if (!emailResult.success) {
      console.error('Error sending 2FA login code:', emailResult.error)
      return NextResponse.json(
        { error: 'No se pudo enviar el código por email' },
        { status: 500 },
      )
    }

    const cookieValue = signPendingCookie({
      userId: user.id,
      email: userEmail,
      exp: Date.now() + TWO_FACTOR_CODE_TTL_MS,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(TWO_FACTOR_PENDING_COOKIE, cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(TWO_FACTOR_CODE_TTL_MS / 1000),
    })

    return response
  } catch (error) {
    console.error('Error in 2FA send-code endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 },
    )
  }
}
