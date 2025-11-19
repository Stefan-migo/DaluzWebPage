-- First, update the CHECK constraint to include payment types
ALTER TABLE public.system_email_templates 
DROP CONSTRAINT IF EXISTS system_email_templates_type_check;

ALTER TABLE public.system_email_templates 
ADD CONSTRAINT system_email_templates_type_check 
CHECK (type IN (
  'order_confirmation',
  'order_shipped', 
  'order_delivered',
  'password_reset',
  'account_welcome',
  'membership_welcome',
  'membership_reminder',
  'low_stock_alert',
  'payment_success',
  'payment_failed',
  'marketing',
  'custom'
));

-- Add missing email templates
INSERT INTO public.system_email_templates (name, type, subject, content, variables, is_system) VALUES
  (
    'Pedido Entregado',
    'order_delivered',
    '¡Tu pedido {{order_number}} ha sido entregado! ✨',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #8B4513;">¡Pedido entregado!</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>¡Perfecto! Tu pedido #{{order_number}} ha sido entregado exitosamente el {{delivery_date}}.</p>
    
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
</body>
</html>',
    '["customer_name", "order_number", "delivery_date"]'::jsonb,
    true
  ),
  (
    'Bienvenida a tu Cuenta',
    'account_welcome',
    '¡Bienvenida a DA LUZ CONSCIENTE! 🌟',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #8B4513;">¡Bienvenida a DA LUZ CONSCIENTE!</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>¡Estamos emocionadas de tenerte en nuestra comunidad! Tu cuenta ha sido creada exitosamente.</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3>¿Qué puedes hacer ahora?</h3>
      <ul>
        <li>Explorar nuestros productos de biocosmética consciente</li>
        <li>Realizar tu primer pedido</li>
        <li>Acceder a contenido exclusivo en tu área personal</li>
        <li>Unirte a nuestro programa de transformación de 7 meses</li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{account_url}}" style="display: inline-block; background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Acceder a mi cuenta</a>
    </div>
    
    <p>Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para acompañarte en tu viaje hacia una vida más consciente.</p>
    
    <p>Con amor y luz,<br>Equipo DA LUZ CONSCIENTE</p>
  </div>
</body>
</html>',
    '["customer_name", "account_url"]'::jsonb,
    true
  ),
  (
    'Restablecimiento de Contraseña',
    'password_reset',
    'Restablece tu contraseña - DA LUZ CONSCIENTE',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #8B4513;">Restablecer Contraseña</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en DA LUZ CONSCIENTE.</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
      <p style="margin: 0 0 15px 0;">Haz clic en el botón siguiente para crear una nueva contraseña:</p>
      <a href="{{reset_link}}" style="display: inline-block; background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Restablecer Contraseña</a>
    </div>
    
    <p style="color: #666; font-size: 14px;">O copia y pega este enlace en tu navegador:</p>
    <p style="color: #666; font-size: 12px; word-break: break-all;">{{reset_url}}</p>
    
    <div style="background: #fff3cd; padding: 15px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0;">
      <p style="margin: 0; color: #856404; font-size: 14px;">
        <strong>⚠️ Importante:</strong> Este enlace expirará en 24 horas. Si no solicitaste este cambio, puedes ignorar este email.
      </p>
    </div>
    
    <p>Si tienes problemas, contáctanos en {{support_email}}.</p>
    
    <p>Saludos,<br>Equipo DA LUZ CONSCIENTE</p>
  </div>
</body>
</html>',
    '["customer_name", "reset_link", "reset_url"]'::jsonb,
    true
  ),
  (
    'Recordatorio de Membresía',
    'membership_reminder',
    'Recordatorio: Tu membresía vence pronto - DA LUZ CONSCIENTE',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #8B4513;">Recordatorio de Membresía</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>Queremos recordarte que tu membresía {{membership_tier}} vence en {{days_remaining}} días.</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3>¿Qué incluye tu membresía?</h3>
      <ul>
        <li>7 módulos de transformación personal</li>
        <li>Ejercicios y meditaciones guiadas</li>
        <li>Recursos descargables exclusivos</li>
        <li>Acceso a la comunidad privada</li>
        <li>Sesiones de preguntas y respuestas</li>
      </ul>
    </div>
    
    <p>No pierdas el acceso a todos estos beneficios. Renueva tu membresía ahora para continuar tu viaje de transformación.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{renewal_url}}" style="display: inline-block; background: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Renovar Membresía</a>
    </div>
    
    <p>Con amor y luz,<br>Equipo DA LUZ CONSCIENTE</p>
  </div>
</body>
</html>',
    '["customer_name", "membership_tier", "days_remaining", "renewal_url"]'::jsonb,
    true
  ),
  (
    'Pago Exitoso',
    'payment_success',
    'Pago confirmado - Pedido #{{order_number}}',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #28a745;">¡Pago confirmado!</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>Tu pago ha sido procesado exitosamente.</p>
    
    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <h3>Detalles del pago</h3>
      <p><strong>Pedido:</strong> #{{order_number}}</p>
      <p><strong>Monto:</strong> {{amount}}</p>
      <p><strong>Método de pago:</strong> {{payment_method}}</p>
      <p><strong>ID de transacción:</strong> {{transaction_id}}</p>
    </div>
    
    <p>Tu pedido está siendo preparado y te notificaremos cuando esté listo para el envío.</p>
    
    <p>Gracias por tu compra,<br>Equipo DA LUZ CONSCIENTE</p>
  </div>
</body>
</html>',
    '["customer_name", "order_number", "amount", "payment_method", "transaction_id"]'::jsonb,
    true
  ),
  (
    'Pago Fallido',
    'payment_failed',
    'Problema con el pago - Pedido #{{order_number}}',
    '<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #DC2626;">Problema con el pago</h1>
    
    <p>Hola {{customer_name}},</p>
    
    <p>No pudimos procesar el pago para tu pedido #{{order_number}}.</p>
    
    <div style="background: #FEF2F2; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #DC2626;">
      <h3>Detalles</h3>
      <p><strong>Pedido:</strong> #{{order_number}}</p>
      <p><strong>Monto:</strong> {{amount}}</p>
      <p><strong>Método de pago:</strong> {{payment_method}}</p>
    </div>
    
    <p><strong>¿Qué puedes hacer?</strong></p>
    <ul>
      <li>Verificar que tu tarjeta tenga fondos suficientes</li>
      <li>Intentar con otro método de pago</li>
      <li>Contactarnos si necesitas ayuda</li>
    </ul>
    
    <p>Tu pedido se mantendrá reservado por 24 horas. Si necesitas ayuda, contáctanos en {{support_email}}.</p>
    
    <p>Saludos,<br>Equipo DA LUZ CONSCIENTE</p>
  </div>
</body>
</html>',
    '["customer_name", "order_number", "amount", "payment_method"]'::jsonb,
    true
  )
ON CONFLICT (name, type) DO NOTHING;

