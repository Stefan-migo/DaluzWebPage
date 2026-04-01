---
name: daluz-notificaciones-email
description: Guía para el módulo Notificaciones & Email de DA LUZ. Usar al modificar AdminNotificationDropdown, plantillas email, Resend, system_email_templates, admin_notifications, triggers DB, API email-templates, EmailNotificationService, templates de soporte.
---

# Notificaciones & Email - Guía de Desarrollo

## Alcance

Este skill aplica al módulo **Notificaciones & Email**: notificaciones admin en tiempo real, plantillas de email editables, integración Resend, triggers DB que generan notificaciones, y APIs de plantillas y notificaciones.

**Incluye:** AdminNotificationDropdown, EmailTemplatesManager, EmailTemplateEditor, `src/lib/email/` (client, template-loader, template-utils, notifications, templates, templates/support), APIs `/api/admin/notifications` y `/api/admin/system/email-templates/*`, tablas `admin_notifications` y `system_email_templates`.

---

## Reglas de Código

### Convenciones

- **Componentes:** PascalCase (`AdminNotificationDropdown.tsx`, `EmailTemplateEditor.tsx`)
- **Servicios:** Clase estática `EmailNotificationService` o funciones puras (`sendEmail`, `loadEmailTemplate`)
- **Límites:** Componentes < 200 líneas, servicios < 250 líneas (EmailNotificationService excede; refactorizar cuando se modifique)

### Patrones obligatorios

1. **Emails transaccionales:** Usar `EmailNotificationService` y `loadEmailTemplate(type)` en lugar de HTML hardcodeado cuando el tipo exista en `system_email_templates`:
   ```typescript
   const template = await loadEmailTemplate('order_confirmation', true);
   if (!template) return { success: false, error: 'No active template found' };
   const html = replaceTemplateVariables(template.content, variables);
   await sendEmail({ to, subject, html, text });
   await incrementTemplateUsage(template.id);
   ```

2. **Variables de plantilla:** Sintaxis `{{variable_name}}`; usar `replaceTemplateVariables(template, variables)` y `getDefaultVariables()`.

3. **Fallback Resend:** Siempre comprobar si Resend está configurado; no fallar el flujo principal:
   ```typescript
   if (!resend) {
     console.warn('⚠️ Resend not configured, skipping email');
     return { success: false, error: 'Resend not configured' };
   }
   ```

4. **APIs admin:** Verificación `is_admin` en todas las rutas de notifications y email-templates:
   ```typescript
   const { data: isAdmin } = await supabase.rpc('is_admin', { user_id: user.id });
   if (!isAdmin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
   ```

### Anti-patrones a evitar

- ❌ Crear HTML de email hardcodeado cuando existe tipo en `system_email_templates`
- ❌ Usar `templates.ts` (createOrderConfirmationEmail, etc.) — legacy, no usado por EmailNotificationService
- ❌ Exponer `RESEND_API_KEY` o credenciales en cliente
- ❌ Usar `dangerouslySetInnerHTML` sin sanitización en contenido editable por usuario
- ❌ Enviar emails sin validar que el destinatario existe y es válido
- ❌ Usar `any` en TypeScript; definir tipos para Order, EmailTemplate, AdminNotification

---

## Arquitectura

### Estructura esperada

```
src/lib/email/
├── client.ts          # Resend, sendEmail, emailConfig
├── template-loader.ts # loadEmailTemplate, incrementTemplateUsage
├── template-utils.ts  # replaceTemplateVariables, getDefaultVariables, formatOrderItems*
├── notifications.ts   # EmailNotificationService (orders, auth, membership, low_stock, etc.)
└── templates/
    └── support.ts     # sendTicketCreatedEmail, sendNewResponseEmail, sendStatusChangeEmail
```

### Separación de responsabilidades

- **client.ts:** Solo envío (Resend API); sin lógica de plantillas
- **template-loader.ts:** Carga desde DB; sin lógica de negocio
- **template-utils.ts:** Utilidades puras (variables, formateo); sin I/O
- **notifications.ts:** Orquestación: cargar plantilla → variables → enviar → incrementar uso
- **templates/support.ts:** Emails de soporte (actualmente hardcodeados; migrar a DB cuando se añadan tipos)

### Integración con el sistema

| Consumidor | Uso |
|------------|-----|
| Webhook MercadoPago | sendOrderConfirmation |
| Admin orders PATCH | sendShippingNotification, sendDeliveryConfirmation |
| Admin customers POST | sendAccountWelcome |
| Admin support tickets | sendTicketCreatedEmail + insert admin_notification |
| Admin support messages | sendNewResponseEmail |
| Contact form | sendContactFormNotification |

---

## Mejores Prácticas

### Performance

- Polling de notificaciones: 30s es razonable; evitar < 10s
- `loadEmailTemplate` usa `.single()`; si hay múltiples activas por tipo, toma la más reciente
- Envío batch: `sendBatchEmails` con delay entre emails para evitar rate limiting

### Seguridad

- **RLS** en `admin_notifications` y `system_email_templates`; políticas para admins
- **Sanitización:** Si el contenido de plantillas viene de usuario, sanitizar HTML antes de render/preview
- **Validación:** Validar `to` (email), `subject`, `content` antes de enviar
- **Variables:** No permitir ejecución de código en `{{variable}}`; solo reemplazo de texto

### Mantenibilidad

- **DRY:** Reutilizar `getDefaultVariables`, `replaceTemplateVariables` en todos los métodos de EmailNotificationService
- **KISS:** Un método por tipo de email; no combinar lógicas distintas
- **Single Responsibility:** template-loader solo carga; notifications solo orquesta

### Accesibilidad

- AdminNotificationDropdown: botón con `aria-label`, contador de no leídas visible
- EmailTemplateEditor: labels en inputs, variables con descripción en tooltip

---

## Refactorización

### Cuándo refactorizar

- EmailNotificationService > 250 líneas (actualmente ~600)
- EmailTemplateEditor > 200 líneas (actualmente ~430)
- Duplicación de lógica de variables entre métodos
- Nuevos tipos de email que repiten el mismo patrón

### Cómo refactorizar sin romper

1. **Extraer métodos por dominio:** `EmailNotificationService.sendOrderConfirmation` → `OrderEmailService.sendConfirmation` (mantener wrapper en EmailNotificationService si hay dependencias)
2. **Plantillas soporte a DB:** Añadir tipos en migración, crear plantillas seed, cambiar `templates/support.ts` para usar `loadEmailTemplate`
3. **Eliminar templates.ts legacy:** Verificar que ningún import lo use; deprecar y eliminar en commit separado

---

## Checklist Pre-Commit

Antes de dar por terminado un cambio en Notificaciones & Email:

- [ ] APIs de notifications y email-templates verifican `is_admin`
- [ ] Nuevos tipos de email usan `loadEmailTemplate` si existen en DB
- [ ] Variables nuevas añadidas a `getDefaultVariables` o documentadas en MODULE.md
- [ ] No se usa `templates.ts` legacy para emails transaccionales
- [ ] Contenido HTML de plantillas editables sanitizado si viene de usuario
- [ ] Componentes < 200 líneas (o plan de extracción documentado)
- [ ] Tipos explícitos, sin `any`
- [ ] `npm run lint` y `npm run type-check` pasan
- [ ] Si se modifican triggers: probar `npx supabase db reset` localmente

---

## Referencias

- **Docs del módulo:** `Docs/modules/12-notificaciones-email/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Resend:** `Docs/RESEND_SETUP_GUIDE.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **Admin Core:** `Docs/modules/10-admin-core/MODULE.md`
- **Admin Sistema:** `Docs/modules/11-admin-sistema/MODULE.md`
- **Soporte:** `Docs/modules/09-soporte/MODULE.md`
