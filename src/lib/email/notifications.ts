import { sendEmail } from './client'
import {
  createOrderConfirmationEmail,
  createPaymentSuccessEmail,
  createPaymentFailedEmail,
  createMembershipWelcomeEmail,
  type OrderConfirmationData,
  type PaymentNotificationData,
  type MembershipWelcomeData
} from './templates'
import { ARGENTINA_PAYMENT_LABELS } from '../mercadopago'

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

// Types for order data from database
export interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  order_number: string
  user_email: string
  customer_name: string
  items: OrderItem[]
  total_amount: number
  payment_method: string
  status: string
  created_at: string
  payment_id?: string
}

// Notification service class
export class EmailNotificationService {
  
  // Send order confirmation email
  static async sendOrderConfirmation(order: Order): Promise<{ success: boolean; error?: string }> {
    try {
      const emailData: OrderConfirmationData = {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        customerEmail: order.user_email,
        items: order.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal: order.total_amount,
        total: order.total_amount,
        paymentMethod: getPaymentMethodLabel(order.payment_method),
        orderDate: new Date(order.created_at).toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        estimatedDelivery: this.calculateEstimatedDelivery()
      }

      const emailTemplate = createOrderConfirmationEmail(emailData)
      
      return await sendEmail({
        to: order.user_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
    } catch (error) {
      console.error('Error sending order confirmation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send payment success notification
  static async sendPaymentSuccess(order: Order, transactionId?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const emailData: PaymentNotificationData = {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        amount: order.total_amount,
        status: 'success',
        paymentMethod: getPaymentMethodLabel(order.payment_method),
        transactionId
      }

      const emailTemplate = createPaymentSuccessEmail(emailData)
      
      return await sendEmail({
        to: order.user_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
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
      const emailData: PaymentNotificationData = {
        orderNumber: order.order_number,
        customerName: order.customer_name,
        amount: order.total_amount,
        status: 'failed',
        paymentMethod: getPaymentMethodLabel(order.payment_method)
      }

      const emailTemplate = createPaymentFailedEmail(emailData)
      
      return await sendEmail({
        to: order.user_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
    } catch (error) {
      console.error('Error sending payment failed email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send membership welcome email
  static async sendMembershipWelcome(
    customerName: string, 
    customerEmail: string, 
    membershipType: string,
    accessUrl: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const emailData: MembershipWelcomeData = {
        customerName,
        membershipType,
        accessUrl,
        duration: '7 meses',
        startDate: new Date().toLocaleDateString('es-AR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      }

      const emailTemplate = createMembershipWelcomeEmail(emailData)
      
      return await sendEmail({
        to: customerEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text
      })
      
    } catch (error) {
      console.error('Error sending membership welcome email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send newsletter subscription confirmation
  static async sendNewsletterConfirmation(email: string, name?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const customerName = name || 'Querida suscriptora'
      
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #8B5A2B 0%, #D4A574 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DA LUZ CONSCIENTE</h1>
            <p style="margin: 10px 0 0 0;">Biocosmética & Bienestar Holístico</p>
          </div>
          <div style="padding: 30px;">
            <h2>¡Bienvenida a nuestra comunidad, ${customerName}!</h2>
            <p>Gracias por suscribirte a nuestro newsletter. Recibirás contenido exclusivo sobre:</p>
            <ul>
              <li>Consejos de bienestar holístico</li>
              <li>Nuevos productos y lanzamientos</li>
              <li>Ejercicios de mindfulness</li>
              <li>Ofertas especiales para suscriptoras</li>
            </ul>
            <p>Tu viaje hacia una vida más consciente comienza aquí.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p><strong>DA LUZ CONSCIENTE</strong><br>Argentina | contacto@daluzconsciente.com</p>
          </div>
        </div>
      `

      const text = `
¡Bienvenida a nuestra comunidad, ${customerName}!

Gracias por suscribirte a nuestro newsletter. Recibirás contenido exclusivo sobre:
- Consejos de bienestar holístico
- Nuevos productos y lanzamientos
- Ejercicios de mindfulness
- Ofertas especiales para suscriptoras

Tu viaje hacia una vida más consciente comienza aquí.

DA LUZ CONSCIENTE
Argentina | contacto@daluzconsciente.com
      `
      
      return await sendEmail({
        to: email,
        subject: '¡Bienvenida a DA LUZ CONSCIENTE!',
        html,
        text
      })
      
    } catch (error) {
      console.error('Error sending newsletter confirmation:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send contact form notification (to admin)
  static async sendContactFormNotification(data: {
    name: string
    email: string
    subject: string
    message: string
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #8B5A2B; color: white; padding: 20px;">
            <h2 style="margin: 0;">Nuevo mensaje de contacto</h2>
          </div>
          <div style="padding: 20px; background: white;">
            <p><strong>Nombre:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Asunto:</strong> ${data.subject}</p>
            <div style="margin-top: 20px;">
              <strong>Mensaje:</strong>
              <div style="background: #f8f9fa; padding: 15px; border-left: 4px solid #8B5A2B; margin-top: 10px;">
                ${data.message.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
        </div>
      `

      const text = `
Nuevo mensaje de contacto

Nombre: ${data.name}
Email: ${data.email}
Asunto: ${data.subject}

Mensaje:
${data.message}
      `
      
      return await sendEmail({
        to: 'contacto@daluzconsciente.com',
        subject: `Contacto: ${data.subject}`,
        html,
        text,
        replyTo: data.email
      })
      
    } catch (error) {
      console.error('Error sending contact form notification:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
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

  // Send order status update notification (Admin function)
  async sendOrderStatusUpdate(order: any, customMessage?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const customerName = order.profiles?.full_name || 'Cliente'
      const customerEmail = order.email || order.profiles?.email
      
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' }
      }

      const statusLabels = {
        pending: 'Pendiente',
        processing: 'En Procesamiento',
        shipped: 'Enviado',
        completed: 'Completado',
        cancelled: 'Cancelado',
        failed: 'Fallido'
      }

      const statusLabel = statusLabels[order.status as keyof typeof statusLabels] || order.status

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #AE0000 0%, #D4A574 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DA LUZ CONSCIENTE</h1>
            <p style="margin: 10px 0 0 0;">Actualización de tu pedido</p>
          </div>
          <div style="padding: 30px;">
            <h2>Hola ${customerName},</h2>
            <p>Tu pedido <strong>${order.order_number}</strong> ha sido actualizado.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin: 0 0 10px 0; color: #AE0000;">Estado Actual</h3>
              <p style="font-size: 18px; font-weight: bold; color: #AE0000; margin: 0;">
                ${statusLabel}
              </p>
            </div>

            ${customMessage ? `
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #28a745;">Mensaje de nuestro equipo:</h4>
                <p style="margin: 0;">${customMessage}</p>
              </div>
            ` : ''}

            <div style="margin: 30px 0;">
              <h4>Resumen de tu pedido:</h4>
              <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                ${order.order_items?.map((item: any) => `
                  <div style="padding: 15px; border-bottom: 1px solid #eee;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <div>
                        <strong>${item.product_name}</strong>
                        ${item.variant_title ? `<br><small style="color: #666;">Variante: ${item.variant_title}</small>` : ''}
                        <br><small>Cantidad: ${item.quantity}</small>
                      </div>
                      <strong>${formatCurrency(item.unit_price)}</strong>
                    </div>
                  </div>
                `).join('') || ''}
                <div style="padding: 15px; background: #f8f9fa;">
                  <div style="display: flex; justify-content: space-between; align-items: center; font-size: 18px;">
                    <strong>Total:</strong>
                    <strong style="color: #28a745;">${formatCurrency(order.total_amount)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <p>Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.</p>
            <p>¡Gracias por elegir DA LUZ CONSCIENTE!</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p><strong>DA LUZ CONSCIENTE</strong><br>Argentina | contacto@daluzconsciente.com</p>
          </div>
        </div>
      `

      const text = `
DA LUZ CONSCIENTE - Actualización de pedido

Hola ${customerName},

Tu pedido ${order.order_number} ha sido actualizado.

Estado actual: ${statusLabel}

${customMessage ? `Mensaje de nuestro equipo: ${customMessage}\n` : ''}

Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.

¡Gracias por elegir DA LUZ CONSCIENTE!

DA LUZ CONSCIENTE
Argentina | contacto@daluzconsciente.com
      `
      
      return await sendEmail({
        to: customerEmail,
        subject: `DA LUZ CONSCIENTE - Actualización de tu pedido ${order.order_number}`,
        html,
        text
      })
      
    } catch (error) {
      console.error('Error sending order status update email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send shipping notification (Admin function)
  async sendShippingNotification(order: any): Promise<{ success: boolean; error?: string }> {
    try {
      const customerName = order.profiles?.full_name || 'Cliente'
      const customerEmail = order.email || order.profiles?.email
      
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' }
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #AE0000 0%, #D4A574 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DA LUZ CONSCIENTE</h1>
            <p style="margin: 10px 0 0 0;">¡Tu pedido está en camino!</p>
          </div>
          <div style="padding: 30px;">
            <h2>¡Buenas noticias, ${customerName}!</h2>
            <p>Tu pedido <strong>${order.order_number}</strong> ha sido enviado y está en camino.</p>
            
            ${order.tracking_number ? `
              <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #28a745;">Información de envío:</h4>
                <p><strong>Número de seguimiento:</strong> ${order.tracking_number}</p>
                ${order.carrier ? `<p><strong>Transportista:</strong> ${order.carrier}</p>` : ''}
              </div>
            ` : ''}

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 15px 0;">¿Qué sigue?</h4>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Tu pedido será entregado en la dirección que proporcionaste</li>
                <li>Recibirás una notificación cuando sea entregado</li>
                <li>El tiempo estimado de entrega es de 3-7 días hábiles</li>
              </ul>
            </div>

            <p>¡Estamos emocionadas de que pronto puedas disfrutar de tus productos DA LUZ CONSCIENTE!</p>
            <p>Si tienes alguna pregunta sobre tu envío, no dudes en contactarnos.</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p><strong>DA LUZ CONSCIENTE</strong><br>Argentina | contacto@daluzconsciente.com</p>
          </div>
        </div>
      `

      const text = `
DA LUZ CONSCIENTE - ¡Tu pedido está en camino!

¡Buenas noticias, ${customerName}!

Tu pedido ${order.order_number} ha sido enviado y está en camino.

${order.tracking_number ? `Número de seguimiento: ${order.tracking_number}` : ''}
${order.carrier ? `Transportista: ${order.carrier}` : ''}

¿Qué sigue?
- Tu pedido será entregado en la dirección que proporcionaste
- Recibirás una notificación cuando sea entregado  
- El tiempo estimado de entrega es de 3-7 días hábiles

¡Estamos emocionadas de que pronto puedas disfrutar de tus productos DA LUZ CONSCIENTE!

DA LUZ CONSCIENTE
Argentina | contacto@daluzconsciente.com
      `
      
      return await sendEmail({
        to: customerEmail,
        subject: `DA LUZ CONSCIENTE - ¡Tu pedido ${order.order_number} está en camino!`,
        html,
        text
      })
      
    } catch (error) {
      console.error('Error sending shipping notification email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send delivery confirmation (Admin function)
  async sendDeliveryConfirmation(order: any): Promise<{ success: boolean; error?: string }> {
    try {
      const customerName = order.profiles?.full_name || 'Cliente'
      const customerEmail = order.email || order.profiles?.email
      
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' }
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #D4A574 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DA LUZ CONSCIENTE</h1>
            <p style="margin: 10px 0 0 0;">¡Pedido entregado!</p>
          </div>
          <div style="padding: 30px;">
            <h2>¡Perfecto, ${customerName}!</h2>
            <p>Tu pedido <strong>${order.order_number}</strong> ha sido entregado exitosamente.</p>
            
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0; text-align: center;">
              <h3 style="margin: 0 0 10px 0; color: #28a745;">✨ ¡Disfruta tu experiencia DA LUZ! ✨</h3>
              <p style="margin: 0;">Esperamos que ames tus productos tanto como nosotras amamos crearlos para ti.</p>
            </div>

            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="margin: 0 0 15px 0;">¿Te encantaron tus productos?</h4>
              <p style="margin: 0;">¡Nos encantaría conocer tu experiencia! Comparte tus fotos y testimonios en nuestras redes sociales o envíanos un mensaje.</p>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h4 style="margin: 0 0 10px 0; color: #856404;">Únete a nuestro programa de membresía</h4>
              <p style="margin: 0; color: #856404;">Descubre nuestro programa de transformación de 7 meses y profundiza en tu camino de bienestar consciente.</p>
            </div>

            <p>¡Gracias por ser parte de la comunidad DA LUZ CONSCIENTE!</p>
            <p>Con amor y luz,<br><em>El equipo de DA LUZ</em></p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p><strong>DA LUZ CONSCIENTE</strong><br>Argentina | contacto@daluzconsciente.com</p>
          </div>
        </div>
      `

      const text = `
DA LUZ CONSCIENTE - ¡Pedido entregado!

¡Perfecto, ${customerName}!

Tu pedido ${order.order_number} ha sido entregado exitosamente.

✨ ¡Disfruta tu experiencia DA LUZ! ✨

Esperamos que ames tus productos tanto como nosotras amamos crearlos para ti.

¿Te encantaron tus productos?
¡Nos encantaría conocer tu experiencia! Comparte tus fotos y testimonios en nuestras redes sociales o envíanos un mensaje.

Únete a nuestro programa de membresía
Descubre nuestro programa de transformación de 7 meses y profundiza en tu camino de bienestar consciente.

¡Gracias por ser parte de la comunidad DA LUZ CONSCIENTE!

Con amor y luz,
El equipo de DA LUZ

DA LUZ CONSCIENTE
Argentina | contacto@daluzconsciente.com
      `
      
      return await sendEmail({
        to: customerEmail,
        subject: `DA LUZ CONSCIENTE - ¡Tu pedido ${order.order_number} ha sido entregado! ✨`,
        html,
        text
      })
      
    } catch (error) {
      console.error('Error sending delivery confirmation email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send custom message to customer (Admin function)
  async sendCustomMessage(order: any, message: string): Promise<{ success: boolean; error?: string }> {
    try {
      const customerName = order.profiles?.full_name || 'Cliente'
      const customerEmail = order.email || order.profiles?.email
      
      if (!customerEmail) {
        return { success: false, error: 'No customer email found' }
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #AE0000 0%, #D4A574 100%); color: white; padding: 30px; text-align: center;">
            <h1 style="margin: 0;">DA LUZ CONSCIENTE</h1>
            <p style="margin: 10px 0 0 0;">Mensaje personalizado</p>
          </div>
          <div style="padding: 30px;">
            <h2>Hola ${customerName},</h2>
            <p>Nuestro equipo tiene un mensaje especial para ti en relación a tu pedido <strong>${order.order_number}</strong>:</p>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid #AE0000; margin: 20px 0;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            </div>

            <p>Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.</p>
            <p>Con cariño,<br><em>El equipo de DA LUZ CONSCIENTE</em></p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666;">
            <p><strong>DA LUZ CONSCIENTE</strong><br>Argentina | contacto@daluzconsciente.com</p>
          </div>
        </div>
      `

      const text = `
DA LUZ CONSCIENTE - Mensaje personalizado

Hola ${customerName},

Nuestro equipo tiene un mensaje especial para ti en relación a tu pedido ${order.order_number}:

${message}

Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.

Con cariño,
El equipo de DA LUZ CONSCIENTE

DA LUZ CONSCIENTE
Argentina | contacto@daluzconsciente.com
      `
      
      return await sendEmail({
        to: customerEmail,
        subject: `DA LUZ CONSCIENTE - Mensaje sobre tu pedido ${order.order_number}`,
        html,
        text
      })
      
    } catch (error) {
      console.error('Error sending custom message email:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  // Send bulk emails (for marketing)
  static async sendBulkEmail(
    recipients: string[], 
    subject: string, 
    html: string, 
    text?: string
  ): Promise<{ success: boolean; results: Array<{ email: string; success: boolean; id?: string; error?: string }>; errors: Array<{ email: string; error: string }> }> {
    const results: Array<{ email: string; success: boolean; id?: string; error?: string }> = []
    const errors: Array<{ email: string; error: string }> = []

    // Send emails in batches to avoid rate limiting
    const batchSize = 10
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize)
      
      const batchPromises = batch.map(async (email) => {
        try {
          const result = await sendEmail({
            to: email,
            subject,
            html,
            text
          })
          results.push({ email, ...result })
          
          // Small delay between emails
          await new Promise(resolve => setTimeout(resolve, 50))
          
        } catch (error) {
          errors.push({ 
            email, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          })
        }
      })

      await Promise.all(batchPromises)
      
      // Delay between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    return {
      success: errors.length === 0,
      results,
      errors
    }
  }
} 