# Notificaciones & Email - Documentación del Módulo

**Módulo:** 12 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo **Notificaciones & Email** cubre dos flujos principales:

1. **Notificaciones admin en tiempo real:** Alertas en el panel de administración sobre pedidos nuevos, stock bajo, reseñas pendientes y tickets de soporte. Se muestran en el `AdminNotificationDropdown` del layout admin.

2. **Emails transaccionales:** Envío de comunicaciones automatizadas a clientes (confirmación de pedido, envío, entrega, bienvenida, restablecimiento de contraseña, etc.) mediante Resend.

3. **Plantillas de email editables:** Gestión de plantillas en `system_email_templates` desde `/admin/system` (tab Email), permitiendo personalizar contenido sin tocar código.

### 1.2 Objetivos de negocio

- Mantener al equipo admin informado de eventos críticos (pedidos, stock, reseñas, soporte).
- Comunicar a los clientes de forma profesional y personalizada en cada etapa del ciclo de compra.
- Permitir que el equipo operativo edite textos de email sin intervención técnica.

### 1.3 Objetivos técnicos

- Centralizar el envío de emails en Resend con fallback graceful si no está configurado.
- Usar plantillas de base de datos cuando existan; evitar duplicación entre código y DB.
- Triggers DB para notificaciones admin en eventos críticos; APIs para casos que requieren lógica adicional.

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin` | `src/app/admin/page.tsx` | Dashboard; `AdminNotificationDropdown` en layout |
| `/admin/system` | `src/app/admin/system/page.tsx` | Tab **Email** con `EmailTemplatesManager` |
| `/admin/notifications` | **No existe** | Referenciada en AdminNotificationDropdown ("Ver todas las notificaciones") pero la página no está implementada |

### 2.2 APIs (endpoints)

| Método | Endpoint | Verificación admin | Descripción |
|--------|----------|--------------------|-------------|
| GET | `/api/admin/notifications` | ✅ is_admin | Listar notificaciones (limit, offset, unread_only, type) |
| PATCH | `/api/admin/notifications` | ✅ is_admin | Marcar como leída (notificationId) o marcar todas (markAllRead) |
| GET | `/api/admin/system/email-templates` | ✅ is_admin | Listar plantillas (type, active_only) |
| POST | `/api/admin/system/email-templates` | ✅ is_admin | Crear plantilla |
| GET | `/api/admin/system/email-templates/[id]` | ⚠️ Sin is_admin explícito | Obtener plantilla por ID (RLS protege) |
| PUT | `/api/admin/system/email-templates/[id]` | ✅ is_admin | Actualizar plantilla |
| DELETE | `/api/admin/system/email-templates/[id]` | ✅ is_admin | Eliminar plantilla (no system) |
| POST | `/api/admin/system/email-templates/[id]/test` | ✅ is_admin | Enviar email de prueba |

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `admin_notifications` | Notificaciones del panel admin (type, priority, title, message, action_url, is_read, target_admin_id, etc.) |
| `system_email_templates` | Plantillas editables (name, type, subject, content, variables, is_active, is_system, usage_count) |

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| AdminNotificationDropdown | `src/components/admin/AdminNotificationDropdown.tsx` | Dropdown de notificaciones en layout admin; polling 30s |
| EmailTemplatesManager | `src/components/admin/EmailTemplatesManager.tsx` | Lista, filtros, preview, test de plantillas |
| EmailTemplateEditor | `src/components/admin/EmailTemplateEditor.tsx` | Crear/editar plantillas con variables y plantillas base |

### 2.5 Librería de email (`src/lib/email/`)

| Archivo | Propósito |
|---------|-----------|
| `client.ts` | Cliente Resend, `sendEmail`, `sendBatchEmails`, `emailConfig` |
| `template-loader.ts` | `loadEmailTemplate(type, useServiceRole)`, `incrementTemplateUsage` |
| `template-utils.ts` | `replaceTemplateVariables`, `getDefaultVariables`, `formatOrderItemsHTML/Text` |
| `notifications.ts` | `EmailNotificationService` — métodos estáticos para cada tipo de email |
| `templates.ts` | Plantillas hardcodeadas (createOrderConfirmationEmail, etc.) — **legacy, no usadas por EmailNotificationService** |
| `templates/support.ts` | `sendTicketCreatedEmail`, `sendNewResponseEmail`, `sendStatusChangeEmail` — **hardcodeadas, no usan system_email_templates** |

### 2.6 Triggers y funciones DB

| Trigger / Función | Tabla | Evento | Tipo de notificación |
|-------------------|-------|--------|----------------------|
| `trigger_notify_admin_new_order` | `orders` | AFTER INSERT | `order_new` |
| `trigger_notify_admin_low_stock` | `products` | AFTER UPDATE OF inventory_quantity | `low_stock` / `out_of_stock` |
| `trigger_notify_admin_new_review` | `reviews` | AFTER INSERT | `new_review` / `review_pending` |
| **API insert** | `admin_notifications` | POST ticket en `/api/admin/support/tickets` | `support_ticket_new` |

**Nota:** `support_ticket_update` está definido en el enum y en el dropdown pero **no hay trigger ni insert** que lo genere actualmente.

**Funciones RPC:**
- `mark_notification_read(notification_id)`
- `mark_all_notifications_read()`
- `get_unread_notification_count(admin_user_id)`

---

## 3. Arquitectura y Flujos

### 3.1 Flujo de notificaciones admin

```
[Evento] → Trigger DB o API insert → admin_notifications
                ↓
[Admin] → AdminNotificationDropdown (polling 30s) → GET /api/admin/notifications
                ↓
[Click] → PATCH /api/admin/notifications (mark read) → router.push(action_url)
```

### 3.2 Flujo de emails transaccionales

```
[Evento] → EmailNotificationService.sendXxx() → loadEmailTemplate(type)
                ↓
[DB]     → system_email_templates (activa) → replaceTemplateVariables
                ↓
[Resend] → sendEmail() → Resend API
                ↓
[Opcional] → incrementTemplateUsage(template.id)
```

### 3.3 Coexistencia de fuentes de plantillas

| Fuente | Usado por | Ejemplos |
|--------|-----------|----------|
| **system_email_templates** (DB) | EmailNotificationService | order_confirmation, order_shipped, order_delivered, password_reset, account_welcome, membership_*, low_stock_alert, payment_* |
| **Hardcodeado en código** | templates/support.ts | Ticket creado, nueva respuesta, cambio de estado |
| **templates.ts** | Ninguno (legacy) | createOrderConfirmationEmail, createPaymentSuccessEmail, etc. — no se invocan |

### 3.4 Dependencias con otros módulos

| Módulo | Uso en Notificaciones & Email |
|--------|-------------------------------|
| **Checkout** | Webhook MercadoPago → sendOrderConfirmation |
| **Admin Core** | PATCH order status → sendShippingNotification / sendDeliveryConfirmation |
| **Cuenta usuario** | Crear cliente manual → sendAccountWelcome |
| **Soporte** | Crear ticket → sendTicketCreatedEmail + insert admin_notification; nueva respuesta → sendNewResponseEmail |
| **Auth** | Password reset → sendPasswordReset (si se integra) |
| **Membresía** | sendMembershipWelcome, sendMembershipReminder (si se integra) |

---

## 4. Fortalezas

- **EmailNotificationService unificado:** Un solo punto de entrada para emails transaccionales; usa plantillas DB cuando existen.
- **Fallback graceful:** Si Resend no está configurado, se loguea warning y no se rompe el flujo.
- **Plantillas editables:** CRUD completo en admin; test de email por plantilla.
- **Variables de plantilla:** Sistema `{{variable}}` con `replaceTemplateVariables` y lista de variables por tipo.
- **Autorización:** APIs de notifications y email-templates verifican `is_admin`.
- **RLS:** `admin_notifications` y `system_email_templates` con políticas para admins.
- **Triggers DB:** Notificaciones automáticas en pedidos, stock y reseñas sin lógica en app.
- **log_admin_activity:** Usado en creación de plantillas.
- **Incremento de uso:** `incrementTemplateUsage` para métricas de plantillas.

---

## 5. Debilidades y Deuda Técnica

### 5.1 Problemas críticos

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Ruta inexistente** | AdminNotificationDropdown → `/admin/notifications` | 404 al hacer clic en "Ver todas las notificaciones" |
| **API GET template sin is_admin** | `/api/admin/system/email-templates/[id]` GET | RLS protege, pero inconsistente con otras APIs admin |

### 5.2 Duplicación y legacy

| Problema | Detalle |
|----------|---------|
| **templates.ts no usado** | `createOrderConfirmationEmail`, `createPaymentSuccessEmail`, etc. — legacy; EmailNotificationService usa solo DB |
| **Soporte hardcodeado** | `templates/support.ts` no usa `system_email_templates`; plantillas fijas en código |
| **support_ticket_update** | Tipo definido pero nunca se inserta; no hay notificación al actualizar ticket |

### 5.3 Código que necesita refactorización

- **EmailNotificationService (~600 líneas):** Supera el límite de 250 líneas; considerar extraer métodos por dominio (orders, auth, membership, etc.).
- **EmailTemplateEditor (~430 líneas):** Cerca del límite; plantillas base hardcodeadas dentro del componente.
- **Preview con dangerouslySetInnerHTML:** En EmailTemplatesManager y EmailTemplateEditor; requiere sanitización si el contenido viene de usuario.

### 5.4 Inconsistencias

- **API test:** El frontend envía `testEmail`; la API espera `testEmail` — correcto, pero el body de la API usa `variables` que el frontend no envía.
- **mark_all_notifications_read:** No recibe `admin_user_id`; usa `auth.uid()` internamente — correcto para RPC.
- **createServiceRoleClient en template-loader:** `loadEmailTemplate` puede usar `useServiceRole` para bypass RLS; `incrementTemplateUsage` siempre usa service role (necesario para update).

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Crear página `/admin/notifications`** o eliminar el enlace "Ver todas las notificaciones" del dropdown.
2. **Añadir verificación `is_admin`** en GET de `/api/admin/system/email-templates/[id]` para consistencia.
3. **Implementar notificación `support_ticket_update`** al cambiar estado de ticket (API PATCH de tickets).

### Prioridad media

4. **Migrar soporte a plantillas DB:** Crear tipos `support_ticket_created`, `support_ticket_response`, `support_ticket_status_change` en `system_email_templates` y usar `loadEmailTemplate` en `templates/support.ts`.
5. **Refactorizar EmailNotificationService:** Extraer en `notifications/orders.ts`, `notifications/auth.ts`, `notifications/support.ts`, etc.
6. **Sanitizar HTML en preview:** Usar DOMPurify o similar antes de `dangerouslySetInnerHTML` en plantillas editables.
7. **Eliminar o documentar `templates.ts`:** Si es legacy, marcar como deprecated o eliminar.

### Prioridad baja

8. **WebSockets o Server-Sent Events** para notificaciones en tiempo real (en lugar de polling 30s).
9. **Tests E2E** para flujo de plantillas (crear, editar, test email).
10. **Validación Zod** en APIs de email-templates (subject, content, variables).

---

## 7. Planes en Curso / Roadmap

- **Test Email:** Requiere `RESEND_API_KEY` y dominio verificado o `onboarding@resend.dev` para desarrollo (ver `Docs/RESEND_SETUP_GUIDE.md`).
- **Mantenimiento:** Test Email en `/admin/system` → Mantenimiento usa `sendEmail` directo; test de plantillas usa endpoint específico.
- **Documentación modular:** Este módulo cierra la serie de 12 módulos documentados.

---

## 8. Guía de Trabajo

### Cómo abordar cambios en este módulo

1. **Leer primero:** `Docs/PROJECT_OVERVIEW.md`, `.cursor/skills/daluz-ecommerce-admin/SKILL.md`, `.cursor/skills/daluz-notificaciones-email/SKILL.md`.
2. **Verificar dependencias:** Cambios en plantillas afectan Checkout, Admin orders, Soporte, Auth.
3. **Resend:** Sin `RESEND_API_KEY`, los emails no se envían pero el flujo no falla; probar con key en desarrollo.

### Puntos de atención al modificar

- **Plantillas DB vs código:** EmailNotificationService prioriza DB; si no hay plantilla activa, no envía. No hay fallback a templates.ts.
- **Variables:** Usar `{{variable}}` y `replaceTemplateVariables`; añadir nuevas variables en `getDefaultVariables` y en la lista del editor.
- **RLS:** `admin_notifications` filtra por `target_admin_id` o null; `system_email_templates` requiere admin para CRUD.
- **Triggers:** Cambios en `notify_admin_*` requieren migración; probar con `npx supabase db reset`.

### Checklist antes de hacer cambios

- [ ] ¿La API verifica `is_admin`?
- [ ] ¿Las plantillas nuevas tienen tipo en `system_email_templates` CHECK?
- [ ] ¿Se usa `loadEmailTemplate` en lugar de HTML hardcodeado cuando el tipo existe en DB?
- [ ] ¿Las variables usadas están en `getDefaultVariables` o se pasan explícitamente?
- [ ] ¿El componente supera 200 líneas? (extraer si aplica)
- [ ] `npm run lint` y `npm run type-check` pasan

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Overview del sistema
- `Docs/RESEND_SETUP_GUIDE.md` — Configuración Resend
- `Docs/MAINTENANCE_TOOLS_GUIDE.md` — Test Email en mantenimiento
- `Docs/modules/10-admin-core/MODULE.md` — AdminNotificationDropdown
- `Docs/modules/11-admin-sistema/MODULE.md` — Plantillas email, tab Email
- `Docs/modules/09-soporte/MODULE.md` — Emails de soporte
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guía global
- `.cursor/skills/daluz-notificaciones-email/SKILL.md` — Guía del módulo
