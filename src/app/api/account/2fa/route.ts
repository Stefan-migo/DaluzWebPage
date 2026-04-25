import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { sendEmail } from '@/lib/email/client'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { enabled } = await request.json()

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Parámetro "enabled" requerido' },
        { status: 400 }
      )
    }

    const userEmail = user.email
    if (!userEmail) {
      return NextResponse.json(
        { error: 'No se encontró email del usuario' },
        { status: 400 }
      )
    }

    if (enabled) {
      // Send confirmation email when 2FA is activated
      const emailResult = await sendEmail({
        to: userEmail,
        subject: '🔐 Autenticación de dos factores activada - DA LUZ CONSCIENTE',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #FDF3E3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: white; border-radius: 0px 15px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1D3F6A; font-size: 24px; margin: 0;">🔐 Autenticación de Dos Factores</h1>
                  <p style="color: #6A1111; font-size: 14px; margin-top: 8px;">DA LUZ CONSCIENTE</p>
                </div>

                <!-- Content -->
                <div style="color: #333; line-height: 1.6;">
                  <p style="font-size: 16px;">Hola,</p>
                  <p style="font-size: 16px;">Te confirmamos que la <strong>autenticación de dos factores (2FA)</strong> ha sido <strong style="color: #285D30;">activada</strong> exitosamente en tu cuenta.</p>

                  <div style="background: #f0f7f0; border-left: 4px solid #285D30; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-size: 14px; color: #285D30;">
                      <strong>✅ Tu cuenta ahora tiene una capa extra de seguridad.</strong><br>
                      A partir de ahora, se te pedirá una verificación adicional al iniciar sesión.
                    </p>
                  </div>

                  <p style="font-size: 14px; color: #666;">
                    Si no realizaste este cambio, por favor contactanos inmediatamente a 
                    <a href="mailto:contacto@daluzconsciente.com" style="color: #6A1111;">contacto@daluzconsciente.com</a>
                  </p>
                </div>

                <!-- Footer -->
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5DFD3; text-align: center;">
                  <p style="font-size: 12px; color: #999; margin: 0;">
                    Este email fue enviado desde DA LUZ CONSCIENTE
                  </p>
                  <p style="font-size: 12px; color: #999; margin: 4px 0 0;">
                    ${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Autenticación de dos factores activada\n\nHola,\n\nTe confirmamos que la autenticación de dos factores (2FA) ha sido activada exitosamente en tu cuenta de DA LUZ CONSCIENTE.\n\nTu cuenta ahora tiene una capa extra de seguridad.\n\nSi no realizaste este cambio, por favor contactanos inmediatamente a contacto@daluzconsciente.com`,
      })

      if (!emailResult.success) {
        console.error('Error sending 2FA email:', emailResult.error)
        // Still return success for the 2FA toggle even if email fails
        return NextResponse.json({
          success: true,
          enabled: true,
          emailSent: false,
          emailError: emailResult.error,
        })
      }

      return NextResponse.json({
        success: true,
        enabled: true,
        emailSent: true,
      })
    } else {
      // 2FA deactivated - send notification email
      const userEmail = user.email!
      await sendEmail({
        to: userEmail,
        subject: '⚠️ Autenticación de dos factores desactivada - DA LUZ CONSCIENTE',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #FDF3E3; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="background: white; border-radius: 0px 15px; padding: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #1D3F6A; font-size: 24px; margin: 0;">⚠️ Autenticación de Dos Factores</h1>
                  <p style="color: #6A1111; font-size: 14px; margin-top: 8px;">DA LUZ CONSCIENTE</p>
                </div>
                <div style="color: #333; line-height: 1.6;">
                  <p style="font-size: 16px;">Hola,</p>
                  <p style="font-size: 16px;">Te informamos que la <strong>autenticación de dos factores (2FA)</strong> ha sido <strong style="color: #8B0000;">desactivada</strong> en tu cuenta.</p>
                  <div style="background: #fef2f2; border-left: 4px solid #8B0000; padding: 16px; margin: 24px 0; border-radius: 0 8px 8px 0;">
                    <p style="margin: 0; font-size: 14px; color: #8B0000;">
                      <strong>⚠️ Tu cuenta ya no tiene la capa extra de seguridad.</strong><br>
                      Te recomendamos volver a activarla para proteger tu cuenta.
                    </p>
                  </div>
                  <p style="font-size: 14px; color: #666;">
                    Si no realizaste este cambio, por favor contactanos inmediatamente a 
                    <a href="mailto:contacto@daluzconsciente.com" style="color: #6A1111;">contacto@daluzconsciente.com</a>
                  </p>
                </div>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5DFD3; text-align: center;">
                  <p style="font-size: 12px; color: #999; margin: 0;">Este email fue enviado desde DA LUZ CONSCIENTE</p>
                  <p style="font-size: 12px; color: #999; margin: 4px 0 0;">${new Date().toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `Autenticación de dos factores desactivada\n\nHola,\n\nTe informamos que la autenticación de dos factores (2FA) ha sido desactivada en tu cuenta de DA LUZ CONSCIENTE.\n\nTe recomendamos volver a activarla para proteger tu cuenta.\n\nSi no realizaste este cambio, por favor contactanos inmediatamente a contacto@daluzconsciente.com`,
      })

      return NextResponse.json({
        success: true,
        enabled: false,
        emailSent: true,
      })
    }
  } catch (error) {
    console.error('Error in 2FA endpoint:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
