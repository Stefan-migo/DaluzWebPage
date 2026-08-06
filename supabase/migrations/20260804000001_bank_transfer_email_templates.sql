-- Templates de los dos mails del flujo de transferencia bancaria.
-- Reusan los bloques {{order_items}} y {{order_totals}} que genera
-- src/lib/email/blocks.ts, igual que el mail de confirmacion.
INSERT INTO system_email_templates (name, type, subject, content, variables, is_active, is_system)
VALUES
(
  'Instrucciones de transferencia',
  'bank_transfer_instructions',
  'Transferí para completar tu pedido {{order_number}} - DA LUZ CONSCIENTE',
  '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
        <tr><td style="padding:28px 32px 12px 32px;">
          <h1 style="margin:0;font-size:22px;color:#051341;">Hola {{customer_name}}, falta un paso</h1>
          <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            Reservamos tu pedido <strong>{{order_number}}</strong>. Para confirmarlo, transferí
            <strong>{{order_total}}</strong> antes del {{transfer_deadline}}.
          </p>
        </td></tr>
        <tr><td style="padding:8px 32px 0 32px;">{{bank_details}}</td></tr>
        <tr><td style="padding:16px 32px 0 32px;">
          <h2 style="margin:16px 0 4px 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#051341;">Tu pedido</h2>
          {{order_items}}
        </td></tr>
        <tr><td style="padding:16px 32px 0 32px;">{{order_totals}}</td></tr>
        <tr><td style="padding:20px 32px 28px 32px;">
          <p style="margin:0;padding:12px;background-color:#FFF2E9;font-size:13px;color:#860119;line-height:1.5;">
            <strong>Cuidado con el fraude.</strong> Nuestro alias es siempre el que figura arriba
            y nunca lo cambiamos. Si recibís un mensaje diciendo que cambió, no transfieras y escribinos.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>',
  '["customer_name","order_number","order_total","transfer_deadline","bank_details","order_items","order_totals"]'::jsonb,
  true,
  true
),
(
  'Pedido vencido por falta de transferencia',
  'bank_transfer_expired',
  'Tu pedido {{order_number}} se canceló - DA LUZ CONSCIENTE',
  '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
        <tr><td style="padding:28px 32px;">
          <h1 style="margin:0;font-size:22px;color:#051341;">Hola {{customer_name}}</h1>
          <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            No recibimos la transferencia de tu pedido <strong>{{order_number}}</strong>, así que lo cancelamos
            y liberamos los productos.
          </p>
          <p style="margin:14px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
            Si todavía los querés, podés armar el pedido de nuevo cuando quieras.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>',
  '["customer_name","order_number"]'::jsonb,
  true,
  true
)
ON CONFLICT (name, type) DO NOTHING;
