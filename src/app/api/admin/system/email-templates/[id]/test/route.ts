import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/client';
import { requireAdmin } from '@/lib/auth/helpers';
import { replaceTemplateVariables, getDefaultVariables } from '@/lib/email/template-utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { testEmail, variables = {} } = body;

    if (!testEmail) {
      return NextResponse.json({
        success: false,
        error: 'Test email address is required'
      }, { status: 400 });
    }

    // Fail fast if Resend isn't configured — otherwise sendEmail returns a
    // harmless-looking { success: false } that gets lost in noise
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Resend no está configurado en el servidor',
        details: 'Falta la variable de entorno RESEND_API_KEY'
      }, { status: 500 });
    }

    const auth = await requireAdmin();
    if (!auth.ok) return auth.response;
    const { supabase } = auth;

    // Fetch the template
    const { data: template, error: templateError } = await supabase
      .from('system_email_templates')
      .select('*')
      .eq('id', params.id)
      .single();

    if (templateError || !template) {
      return NextResponse.json({
        success: false,
        error: 'Template not found'
      }, { status: 404 });
    }

    // Build preview variables (same contract the editor preview uses)
    const previewVariables: Record<string, string> = {
      ...getDefaultVariables(),
      customer_name: 'Cliente de Prueba',
      order_number: 'ORD-12345',
      order_total: '$15.000,00',
      order_date: new Date().toLocaleDateString('es-AR'),
      order_items:
        '<div>Producto 1 x 2 - $10.000</div><div>Producto 2 x 1 - $5.000</div>',
      tracking_number: 'ABC123456789',
      carrier: 'Correo Argentino',
      estimated_delivery: '22 de enero de 2025',
      delivery_date: '20 de enero de 2025',
      payment_method: 'Tarjeta de Crédito',
      transaction_id: 'MP-123456789',
      amount: '$15.000,00',
      membership_tier: 'Transformación Completa',
      membership_start_date: '15 de enero de 2025',
      access_url: 'https://daluzconsciente.com/mi-cuenta',
      reset_link: 'https://daluzconsciente.com/reset-password?token=preview',
      reset_url: 'https://daluzconsciente.com/reset-password?token=preview',
      account_url: 'https://daluzconsciente.com/mi-cuenta',
      renewal_url: 'https://daluzconsciente.com/membresias',
      days_remaining: '15',
      low_stock_products:
        '<div>Producto A - Stock: 3</div><div>Producto B - Stock: 2</div>',
      ...variables
    };

    const subject = replaceTemplateVariables(template.subject || '', previewVariables);
    const content = replaceTemplateVariables(template.content || '', previewVariables);

    // Plain-text fallback: strip tags + collapse whitespace
    const text = content
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\n\s*\n/g, '\n')
      .trim();

    // sendEmail returns { success, error } — never throws on API failure
    const result = await sendEmail({
      to: testEmail,
      subject: `[TEST] ${subject}`,
      html: content,
      text
    });

    if (!result.success) {
      console.error('Test email not delivered:', {
        template: template.type,
        to: testEmail,
        error: result.error
      });
      const detail = result.error || 'Error desconocido';
      const looksLikeDomainLimit = /testing emails|verify a domain|onboarding|403/i.test(detail);
      return NextResponse.json({
        success: false,
        error: looksLikeDomainLimit
          ? 'Resend rechazó el envío: en modo sandbox solo podés enviar al email registrado con Resend. Verificá el dominio para enviar a otros destinatarios.'
          : 'Resend rechazó el envío del email de prueba',
        details: detail
      }, { status: 502 });
    }

    console.log(`✅ Test email sent (id=${result.id}) to ${testEmail}`);
    return NextResponse.json({
      success: true,
      id: result.id,
      message: `Email de prueba enviado a ${testEmail}`
    });

  } catch (error) {
    console.error('Error in test email template API:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

