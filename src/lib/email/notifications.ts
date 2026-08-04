import { sendEmail, SUPPORT_ADMIN_EMAIL } from './client'
import { 
  loadEmailTemplate, 
  incrementTemplateUsage
} from './template-loader'
import {
  replaceTemplateVariables,
  formatOrderItemsText,
  getDefaultVariables
} from './template-utils'
import {
  renderOrderItems,
  renderOrderTotals,
  renderShippingAddress,
  type EmailOrderItem
} from './blocks'
import { ARGENTINA_PAYMENT_LABELS } from '../mercadopago'
import { createServiceRoleClient } from '@/utils/supabase/server'

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(amount)
}

// Helper function to get payment method label
function getPaymentMethodLabel(paymentMethod: string): string {
  return ARGENTINA_PAYMENT_LABELS[paymentMethod as keyof typeof ARGENTINA_PAYMENT_LABELS] || paymentMethod
}

/**
 * Nombre del cliente para el saludo del mail.
 *
 * La tabla orders NO tiene columna customer_name: el nombre que carga el
 * cliente en el checkout se guarda en shipping_name. Leer solo customer_name
 * (undefined cuando la orden viene de la base) hacia que todos los mails
 * saludaran "Hola Cliente".
 */
function resolveCustomerName(order: Order): string {
  return (
    order.customer_name ||
    order.shipping_name ||
    order.profiles?.full_name ||
    'Cliente'
  )
}

// Types for order data from database
export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  variant_title?: string
}

export interface Order {
  id: string
  order_number: string
  user_email: string
  email?: string
  customer_name: string
  items?: OrderItem[]
  order_items?: Array<{
    product_name?: string
    name?: string
    quantity: number
    unit_price?: number
    price?: number
    variant_title?: string
    product_image?: string | null
  }>
  total_amount: number
  subtotal?: number
  shipping_amount?: number
  discount_amount?: number | null
  shipping_name?: string | null
  shipping_address?: string | null
  shipping_city?: string | null
  shipping_state?: string | null
  shipping_postal_code?: string | null
  payment_method: string
  status: string
  created_at: string
  payment_id?: string
  tracking_number?: string
  carrier?: string
  shipped_at?: string
  delivered_at?: string
  profiles?: {
    full_name?: string
    email?: string
  }
}

// Notification service class
export class EmailNotificationService {
  
  // Send order confirmation email using DB template
  static async sendOrderConfirmation(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('order_confirmation', true);
      
      if (!template) {
        console.warn('⚠️ No active order_confirmation template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const customerEmail = order.user_email || order.email;
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' };
      }

      const customerName = resolveCustomerName(order);

      const orderDate = new Date(order.created_at).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const rawItems = (order.order_items ?? order.items ?? []) as Array<{
        name?: string;
        product_name?: string;
        quantity: number;
        price?: number;
        unit_price?: number;
        variant_title?: string;
        product_image?: string | null;
      }>;
      const normalisedItems: EmailOrderItem[] = rawItems.map((item) => ({
        name: item.name ?? item.product_name ?? "Producto",
        quantity: item.quantity,
        price: item.price ?? item.unit_price ?? 0,
        variant_title: item.variant_title,
        product_image: item.product_image,
      }));

      const orderItemsHTML = renderOrderItems(normalisedItems);
      const orderItemsText = formatOrderItemsText(normalisedItems);

      // Si la orden no trae subtotal, se reconstruye desde los items.
      const subtotal =
        order.subtotal ??
        normalisedItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

      const orderTotalsHTML = renderOrderTotals({
        subtotal,
        shipping_amount: order.shipping_amount ?? 0,
        discount_amount: order.discount_amount ?? 0,
        total_amount: order.total_amount,
      });

      const shippingAddressHTML = renderShippingAddress({
        shipping_name: order.shipping_name,
        shipping_address: order.shipping_address,
        shipping_city: order.shipping_city,
        shipping_state: order.shipping_state,
        shipping_postal_code: order.shipping_postal_code,
      });

      const variables = {
        ...getDefaultVariables(),
        customer_name: customerName,
        order_number: order.order_number,
        order_date: orderDate,
        order_total: formatCurrency(order.total_amount),
        order_items: orderItemsHTML,
        order_totals: orderTotalsHTML,
        shipping_address: shippingAddressHTML,
        payment_method: getPaymentMethodLabel(order.payment_method),
        order_items_text: orderItemsText
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);

      // La version de texto se construye desde los datos, NO arrancando
      // etiquetas del HTML: con tablas ese metodo produce un choclo ilegible,
      // y una parte de texto pobre empeora el puntaje anti-spam.
      const addressText = order.shipping_address
        ? [
            order.shipping_name,
            order.shipping_address,
            [order.shipping_city, order.shipping_state].filter(Boolean).join(", "),
            order.shipping_postal_code ? `CP ${order.shipping_postal_code}` : null,
          ]
            .filter(Boolean)
            .join("\n")
        : "";

      const text = [
        `Hola ${customerName},`,
        ``,
        `Recibimos tu pedido ${order.order_number} del ${orderDate}.`,
        ``,
        `PRODUCTOS`,
        orderItemsText,
        ``,
        `Subtotal: ${formatCurrency(subtotal)}`,
        `Envío: ${(order.shipping_amount ?? 0) > 0 ? formatCurrency(order.shipping_amount!) : "Gratis"}`,
        (order.discount_amount ?? 0) > 0
          ? `Descuento: - ${formatCurrency(order.discount_amount!)}`
          : null,
        `Total: ${formatCurrency(order.total_amount)}`,
        addressText ? `` : null,
        addressText ? `ENVÍO A` : null,
        addressText || null,
        ``,
        `Gracias por tu compra.`,
      ]
        .filter((line) => line !== null)
        .join("\n");

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending order confirmation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send shipping notification using DB template
  static async sendShippingNotification(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('order_shipped', true);
      
      if (!template) {
        console.warn('⚠️ No active order_shipped template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const customerEmail = order.user_email || order.email || order.profiles?.email;

      if (!customerEmail) {
        return { success: false, error: 'No customer email found' };
      }

      // Calculate estimated delivery (7 days from shipped date or now)
      const shippedDate = order.shipped_at ? new Date(order.shipped_at) : new Date();
      const estimatedDelivery = new Date(shippedDate);
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

      const variables = {
        ...getDefaultVariables(),
        customer_name: resolveCustomerName(order),
        order_number: order.order_number,
        carrier: order.carrier || 'Transporte',
        tracking_number: order.tracking_number || 'Pendiente',
        estimated_delivery: estimatedDelivery.toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending shipping notification:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send delivery confirmation using DB template
  static async sendDeliveryConfirmation(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('order_delivered', true);
      
      if (!template) {
        console.warn('⚠️ No active order_delivered template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const customerEmail = order.user_email || order.email || order.profiles?.email;

      if (!customerEmail) {
        return { success: false, error: 'No customer email found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: resolveCustomerName(order),
        order_number: order.order_number,
        delivery_date: order.delivered_at 
          ? new Date(order.delivered_at).toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : new Date().toLocaleDateString('es-AR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending delivery confirmation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send payment success notification (using custom template or fallback)
  static async sendPaymentSuccess(order: Order, transactionId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Try to use custom template first, fallback to order_confirmation if not found
      let template = await loadEmailTemplate('payment_success', true);
      
      if (!template) {
        // Fallback to order confirmation
        template = await loadEmailTemplate('order_confirmation', true);
      }

      if (!template) {
        console.warn('⚠️ No active payment template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const customerEmail = order.user_email || order.email;
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: resolveCustomerName(order),
        order_number: order.order_number,
        amount: formatCurrency(order.total_amount),
        payment_method: getPaymentMethodLabel(order.payment_method),
        transaction_id: transactionId || order.payment_id || 'N/A'
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success && template) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending payment success email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send payment failed notification
  static async sendPaymentFailed(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('payment_failed', true);
      
      if (!template) {
        console.warn('⚠️ No active payment_failed template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const customerEmail = order.user_email || order.email;
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: resolveCustomerName(order),
        order_number: order.order_number,
        amount: formatCurrency(order.total_amount),
        payment_method: getPaymentMethodLabel(order.payment_method)
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending payment failed email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send account welcome email using DB template
  static async sendAccountWelcome(
    customerName: string, 
    customerEmail: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('account_welcome', true);
      
      if (!template) {
        console.warn('⚠️ No active account_welcome template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: customerName,
        account_url: `${getDefaultVariables().website_url}/mi-cuenta`
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending account welcome email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send membership welcome email using DB template
  static async sendMembershipWelcome(
    customerName: string, 
    customerEmail: string, 
    membershipType: string,
    accessUrl: string,
    startDate?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('membership_welcome', true);
      
      if (!template) {
        console.warn('⚠️ No active membership_welcome template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: customerName,
        membership_tier: membershipType,
        membership_start_date: startDate || new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        access_url: accessUrl,
        duration: '7 meses'
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending membership welcome email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send membership reminder email using DB template
  static async sendMembershipReminder(
    customerName: string,
    customerEmail: string,
    membershipType: string,
    daysRemaining: number
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('membership_reminder', true);
      
      if (!template) {
        console.warn('⚠️ No active membership_reminder template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: customerName,
        membership_tier: membershipType,
        days_remaining: daysRemaining.toString(),
        renewal_url: `${getDefaultVariables().website_url}/membresias`
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending membership reminder email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send low stock alert to admins using DB template
  static async sendLowStockAlert(
    adminEmails: string[],
    products: Array<{ name: string; current_stock: number; min_stock: number }>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('low_stock_alert', true);
      
      if (!template) {
        console.warn('⚠️ No active low_stock_alert template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const productsHTML = products.map(p => `
        <div style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${p.name}</strong><br>
          Stock actual: ${p.current_stock} | Stock mínimo: ${p.min_stock}
        </div>
      `).join('');

      const productsText = products.map(p => 
        `${p.name} - Stock actual: ${p.current_stock} | Stock mínimo: ${p.min_stock}`
      ).join('\n');

      const variables = {
        ...getDefaultVariables(),
        low_stock_products: productsHTML,
        low_stock_products_text: productsText,
        product_count: products.length.toString()
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      // Send to all admin emails
      const results = await Promise.all(
        adminEmails.map(email => sendEmail({
          to: email,
          subject,
          html,
          text
        }))
      );

      if (results.some(r => r.success)) {
        await incrementTemplateUsage(template.id);
      }

      return {
        success: results.some(r => r.success),
        error: results.every(r => !r.success) ? 'Failed to send to all recipients' : undefined
      };
      
    } catch (error) {
      console.error('Error sending low stock alert:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send password reset email using DB template
  static async sendPasswordReset(
    customerEmail: string,
    resetLink: string,
    customerName?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const template = await loadEmailTemplate('password_reset', true);
      
      if (!template) {
        console.warn('⚠️ No active password_reset template found, skipping email');
        return { success: false, error: 'No active template found' };
      }

      const variables = {
        ...getDefaultVariables(),
        customer_name: customerName || 'Usuario',
        reset_link: resetLink,
        reset_url: resetLink
      };

      const subject = replaceTemplateVariables(template.subject, variables);
      const html = replaceTemplateVariables(template.content, variables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const result = await sendEmail({
        to: customerEmail,
        subject,
        html,
        text
      });

      if (result.success) {
        await incrementTemplateUsage(template.id);
      }

      return result;
      
    } catch (error) {
      console.error('Error sending password reset email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send marketing email using DB template
  static async sendMarketingEmail(
    recipients: string[],
    templateId: string,
    variables: Record<string, string>
  ): Promise<{ success: boolean; results: Array<{ email: string; success: boolean; id?: string; error?: string }>; errors: Array<{ email: string; error: string }> }> {
    try {
      const supabase = createServiceRoleClient();
      const { data: template, error } = await supabase
        .from('system_email_templates')
        .select('*')
        .eq('id', templateId)
        .eq('is_active', true)
        .single();

      if (error || !template) {
        return {
          success: false,
          results: [],
          errors: recipients.map(email => ({ email, error: 'Template not found' }))
        };
      }

      const allVariables = {
        ...getDefaultVariables(),
        ...variables
      };

      const subject = replaceTemplateVariables(template.subject, allVariables);
      const html = replaceTemplateVariables(template.content, allVariables);
      
      const text = html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\n\s*\n/g, '\n')
        .trim();

      const results: Array<{ email: string; success: boolean; id?: string; error?: string }> = [];
      const errors: Array<{ email: string; error: string }> = [];

      // Send emails in batches
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (email) => {
          try {
            const result = await sendEmail({
              to: email,
              subject,
              html,
              text
            });
            results.push({ email, ...result });
            
            await new Promise(resolve => setTimeout(resolve, 50));
            
          } catch (error) {
            errors.push({ 
              email, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        });

        await Promise.all(batchPromises);
        
        if (i + batchSize < recipients.length) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      if (results.some(r => r.success)) {
        await incrementTemplateUsage(template.id);
      }

      return {
        success: errors.length === 0,
        results,
        errors
      };
      
    } catch (error) {
      console.error('Error sending marketing email:', error)
      return {
        success: false,
        results: [],
        errors: recipients.map(email => ({ 
          email, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }))
      };
    }
  }

  // Send contact form notification
  static async sendContactFormNotification(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      // Route contact form notifications to the admin inbox.
      // If Resend's onboarding domain is still in use (resend.dev), fall back
      // to the address registered with Resend — it's the only one allowed to receive.
      const recipientEmail = process.env.RESEND_FROM_EMAIL?.includes('resend.dev')
        ? process.env.RESEND_FROM_EMAIL
        : SUPPORT_ADMIN_EMAIL
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #AE0000;">Nuevo mensaje de contacto</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <div style="margin-top: 20px;">
              <strong>Mensaje:</strong>
              <p style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
                ${data.message}
              </p>
            </div>
          </div>
          <p style="color: #666; font-size: 12px;">
            Este mensaje fue enviado desde el formulario de contacto de la web.
          </p>
        </div>
      `;

      const text = `
Nuevo mensaje de contacto

Nombre: ${data.name}
Email: ${data.email}
Asunto: ${data.subject}

Mensaje:
${data.message}

---
Este mensaje fue enviado desde el formulario de contacto de la web.
      `;

      return await sendEmail({
        to: recipientEmail,
        subject: `Contacto: ${data.subject}`,
        html,
        text,
        replyTo: data.email
      });
      
    } catch (error) {
      console.error('Error sending contact form notification:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Helper method to calculate estimated delivery
  private static calculateEstimatedDelivery(): string {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 7) // 7 days from now
    
    return deliveryDate.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}
