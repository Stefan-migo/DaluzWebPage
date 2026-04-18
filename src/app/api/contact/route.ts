import { NextRequest, NextResponse } from 'next/server'
import { EmailNotificationService } from '@/lib/email/notifications'
import { createServiceRoleClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Todos los campos son requeridos',
          details: 'Por favor completa nombre, email y mensaje'
        },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email inválido',
          details: 'Por favor ingresa un email válido'
        },
        { status: 400 }
      )
    }

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedMessage = message.trim()

    // Send email notification using Resend
    const result = await EmailNotificationService.sendContactFormNotification({
      name: trimmedName,
      email: trimmedEmail,
      subject: `Contacto desde la web: ${trimmedName}`,
      message: trimmedMessage
    })

    // Create admin notification in-app (non-blocking — do not fail the request
    // if this insert errors, email delivery is the primary success signal)
    try {
      const supabase = createServiceRoleClient()
      const preview = trimmedMessage.length > 140
        ? `${trimmedMessage.slice(0, 140)}…`
        : trimmedMessage
      const { error: notificationError } = await supabase
        .from('admin_notifications')
        .insert({
          type: 'custom',
          priority: 'medium',
          title: 'Nueva consulta de contacto',
          message: `${trimmedName} (${trimmedEmail}): ${preview}`,
          related_entity_type: 'contact_form',
          action_url: '/admin/support',
          action_label: 'Revisar',
          metadata: {
            source: 'contact_form',
            customer_name: trimmedName,
            customer_email: trimmedEmail,
            message: trimmedMessage
          },
          is_read: false
        })
      if (notificationError) {
        console.error('⚠️ Failed to create admin notification for contact form:', notificationError)
      }
    } catch (notificationError) {
      console.error('⚠️ admin_notifications insert threw:', notificationError)
    }

    if (!result.success) {
      console.error('Failed to send contact form email:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: 'Error al enviar el mensaje',
          details: result.error || 'Por favor intenta nuevamente más tarde'
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Mensaje enviado exitosamente. Te contactaremos pronto.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

