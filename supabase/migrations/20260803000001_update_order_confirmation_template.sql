-- Actualiza el template de confirmacion para usar los bloques nuevos.
--
-- {{order_items}} conserva el nombre a proposito: el template viejo no se
-- rompe, solo empieza a renderizar contenido mas rico (miniaturas incluidas).
-- {{order_totals}} y {{shipping_address}} son nuevos.
--
-- Todo el HTML usa tablas y estilos inline: Outlook ignora flex y Gmail
-- descarta buena parte de lo que va en un bloque <style>.
UPDATE public.system_email_templates
SET content = '<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#faf7f2;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#faf7f2;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;background-color:#ffffff;border-collapse:collapse;">
          <tr>
            <td style="padding:28px 32px 12px 32px;">
              <h1 style="margin:0;font-size:22px;color:#051341;">¡Gracias por tu compra, {{customer_name}}!</h1>
              <p style="margin:10px 0 0 0;font-size:15px;color:#4a4a4a;line-height:1.5;">
                Recibimos tu pedido <strong>{{order_number}}</strong> del {{order_date}}.
                Te avisamos por mail cuando lo despachemos.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0 32px;">
              <h2 style="margin:16px 0 4px 0;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#051341;">Productos</h2>
              {{order_items}}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 32px 0 32px;">
              {{order_totals}}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 0 32px;">
              {{shipping_address}}
            </td>
          </tr>
          <tr>
            <td style="padding:20px 32px 28px 32px;">
              <p style="margin:0;font-size:13px;color:#6b6b6b;line-height:1.5;">
                Método de pago: {{payment_method}}<br />
                Si tenés alguna duda respondé este mail y te contestamos.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>',
    updated_at = now()
WHERE type = 'order_confirmation';
