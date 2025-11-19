import { NextRequest, NextResponse } from 'next/server'
import { EmailNotificationService } from '@/lib/email/notifications'

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

    // Send email notification using Resend
    const result = await EmailNotificationService.sendContactFormNotification({
      name: name.trim(),
      email: email.trim(),
      subject: `Contacto desde la web: ${name.trim()}`,
      message: message.trim()
    })

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

