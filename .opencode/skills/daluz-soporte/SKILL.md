---
name: daluz-soporte
description: Guía para el módulo Soporte (tickets, plantillas, mensajes). Usar cuando implementes o refactorices tickets, plantillas de respuestas, categorías o mensajes de soporte.
---

# Soporte - Guía de Desarrollo

## Alcance

Sistema de tickets de soporte con plantillas reutilizables, mensajes en hilo, categorías y asignación a admins. Integra con admin_users, orders y profiles (customers).

**Trigger terms:** soporte, support, tickets, plantillas de respuestas, support_templates, support_tickets, support_messages, support_categories, mensajes internos, notas internas.

---

## Reglas de Código

### Convenciones

- **APIs admin**: Siempre verificar `is_admin` con RPC antes de cualquier operación.
- **Tickets**: Campo `subject` en DB (no `title`); el frontend puede usar `title` en formularios y mapear a `subject` en POST.
- **Plantillas**: `support_templates` es distinto de `EmailTemplatesManager` (plantillas de email del sistema en `/admin/system`).
- **Mensajes**: `is_internal=true` → nota interna (no envía email, no visible para cliente); `is_from_customer` para distinguir origen.

### Patrones a seguir

1. **Crear ticket**:
   ```ts
   // Validar: title, description, customer_email obligatorios
   // Generar ticket_number: SUP-XXX (extraer último, incrementar)
   // Buscar customer_id por email en profiles
   // Insertar ticket → mensaje inicial (message_type: 'note') → email Resend
   ```

2. **Enviar mensaje**:
   ```ts
   // Si is_internal: no enviar email
   // Si !is_internal && !is_from_customer: enviar sendNewResponseEmail, actualizar status a pending_customer
   // Actualizar first_response_at si es primera respuesta admin
   ```

3. **Actualizar ticket**:
   ```ts
   // Si cambia status: crear mensaje message_type='status_change'
   // Si status resolved/closed: set resolved_at, resolved_by
   // Si cambia assigned_to: crear mensaje message_type='assignment'
   // Enviar sendStatusChangeEmail si cambia status
   ```

4. **Plantillas**:
   ```ts
   // GET /templates: listar con filtros category_id, active_only
   // POST /templates: crear (name, subject, content, category_id, variables)
   // PUT/PATCH /templates/[id]: actualizar (NO existe actualmente - ver MODULE.md 5.3)
   // Render: PUT /templates con body { template_id, variables } → devuelve { rendered: { subject, content } }
   ```

### Anti-patrones a evitar

- No asumir que `PUT /api/admin/support/templates/${id}` existe; actualmente devuelve 404. Crear `templates/[id]/route.ts` para edición.
- No enviar email en mensajes con `is_internal=true`.
- No exponer notas internas a clientes (RLS ya lo impide en support_messages).
- No usar `any` en interfaces de ticket, mensaje o plantilla.
- No omitir validación de `customer_email` en creación de tickets.
- No hacer búsqueda full-text sin índices; el search actual es client-side en la página cargada.

---

## Arquitectura

### Estructura esperada

```
src/
├── app/
│   ├── admin/support/
│   │   ├── page.tsx                 # Listado tickets
│   │   ├── tickets/
│   │   │   ├── new/page.tsx         # Crear ticket
│   │   │   └── [id]/page.tsx        # Detalle + mensajes
│   │   └── templates/page.tsx       # CRUD plantillas
│   └── api/admin/support/
│       ├── tickets/
│       │   ├── route.ts             # GET list, POST create
│       │   └── [id]/
│       │       ├── route.ts         # GET, PUT, DELETE
│       │       └── messages/route.ts # GET, POST
│       ├── categories/route.ts      # GET, POST
│       └── templates/
│           ├── route.ts            # GET, POST, PUT (render)
│           └── [id]/route.ts        # PUT/PATCH update (CREAR - no existe)
└── lib/email/templates/support.ts   # sendTicketCreatedEmail, sendNewResponseEmail, sendStatusChangeEmail
```

### Separación de responsabilidades

- **Páginas**: Fetch, estado local, UI; delegar lógica pesada a hooks o servicios.
- **APIs**: Autenticación, autorización, validación, persistencia, emails (async, no bloqueante).
- **Emails**: Plantillas en `support.ts`; errores de envío se registran pero no fallan la request.

### Integración con el sistema

- **admin_users**: `is_admin`, `assigned_to`, `log_admin_activity`.
- **orders**: `order_id` opcional en tickets.
- **profiles**: `customer_id` por email.
- **Resend**: Variables `RESEND_API_KEY`, `RESEND_FROM_EMAIL`.

---

## Mejores Prácticas

### Performance

- Paginación en GET tickets (default limit=20).
- Índices en support_tickets: status, priority, created_at, assigned_to (ya existen).
- Evitar N+1: mensajes y stats se calculan por ticket; considerar cachear stats si el volumen crece.

### Seguridad

- **RLS**: Todas las tablas support_* tienen RLS; políticas admin y customer.
- **Validación**: Sanitizar contenido de mensajes (XSS); validar longitud.
- **Autorización**: `is_admin` en todas las rutas `/api/admin/support/*`.

### Mantenibilidad

- Componentes < 200 líneas; APIs < 250.
- Tipos explícitos: `SupportTicket`, `SupportMessage`, `SupportTemplate`.
- DRY: Lógica de emails centralizada en `support.ts`.

### Accesibilidad

- Labels en formularios de ticket y mensaje.
- Indicadores visuales para notas internas (lock icon, fondo amarillo).
- Badges de estado y prioridad con contraste suficiente.

---

## Refactorización

### Cuándo refactorizar

- Página > 200 líneas: extraer hooks (`useSupportTickets`, `useTicketDetail`) o subcomponentes.
- Lógica de filtros duplicada: centralizar en utilidad.
- Props con `any`: definir interfaces en `src/types/support.ts` o similar.

### Cómo refactorizar sin romper

1. Mantener contratos de API (paths, métodos, body/query).
2. Probar flujo: crear ticket → enviar mensaje → cambiar estado → verificar emails.
3. Verificar que la edición de plantillas funcione tras crear `templates/[id]/route.ts`.

---

## Checklist Pre-Commit

- [ ] APIs verifican `is_admin` antes de operar.
- [ ] Mensajes internos no envían email.
- [ ] Sin `any` en interfaces de ticket, mensaje, plantilla.
- [ ] Componentes bajo 200 líneas (o plan de extracción documentado).
- [ ] Si se modifica templates: verificar que exista endpoint de actualización por ID.
- [ ] `npm run lint` y `npm run type-check` pasan.
- [ ] Si se modifican migraciones: `npx supabase db reset` exitoso.

---

## Referencias

- **Docs del módulo:** `Docs/modules/09-soporte/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Support Workflow:** `Docs/SUPPORT_SYSTEM_WORKFLOW.md`
- **Implementation Complete:** `Docs/SUPPORT_SYSTEM_IMPLEMENTATION_COMPLETE.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
