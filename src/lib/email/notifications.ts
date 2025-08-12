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