import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

/**
 * Unified auth callback:
 *   - OAuth (Google, etc.): ?code=...
 *   - Email confirmation / magic link: ?token_hash=...&type=signup|recovery|invite|email_change
 */
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const next = requestUrl.searchParams.get('next') || '/'

  const supabase = await createClient()

  // --- Flow 1: PKCE (OAuth Google + Supabase email recovery/confirmation) ---
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('OAuth/PKCE callback error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin),
      )
    }

    // Password recovery comes through the same PKCE flow now (Supabase moved
    // away from raw token_hash links). Send the user to the reset page with
    // the flag so the page renders the new-password form.
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password?recovery=1', requestUrl.origin))
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // --- Flow 2: Email confirmation / recovery / magic link ---
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    })
    if (error) {
      console.error('Email verification error:', error)
      return NextResponse.redirect(
        new URL(
          `/login?error=${encodeURIComponent('No pudimos confirmar tu cuenta. El enlace puede haber expirado.')}`,
          requestUrl.origin,
        ),
      )
    }

    // For password recovery, send the user to the reset page with a flag
    // so the page knows to render the "update password" form instead of the
    // "request reset email" form. We can't rely on the PASSWORD_RECOVERY
    // event here because verifyOtp ran on the server, not the client.
    if (type === 'recovery') {
      return NextResponse.redirect(new URL('/reset-password?recovery=1', requestUrl.origin))
    }

    // For signup/invite/email_change, send to the next param or profile
    return NextResponse.redirect(new URL(next, requestUrl.origin))
  }

  // No recognized params — bounce to login
  return NextResponse.redirect(
    new URL('/login?error=' + encodeURIComponent('Enlace de autenticación inválido'), requestUrl.origin),
  )
}
