import { NextRequest, NextResponse } from 'next/server'
import { EmailNotificationService } from '@/lib/email/notifications'

// SECURITY: Simple in-process rate limiter for contact form (3 requests per IP per hour)
const contactRateLimit = new Map<string, { count: number; resetAt: number }>();
const CONTACT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const CONTACT_MAX_REQUESTS = 3;

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = contactRateLimit.get(ip);

  // Cleanup stale entries periodically
  if (contactRateLimit.size > 1000) {
    for (const [key, val] of contactRateLimit.entries()) {
      if (val.resetAt < now) contactRateLimit.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    contactRateLimit.set(ip, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return true;
  }
  if (entry.count >= CONTACT_MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';
    if (!checkContactRateLimit(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Demasiados mensajes enviados',
          details: 'Por favor esperá un momento antes de enviar otro mensaje'
        },
        { status: 429 }
      )
    }

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
        details: 'Por favor intenta nuevamente más tarde'
      },
      { status: 500 }
    )
  }
}

