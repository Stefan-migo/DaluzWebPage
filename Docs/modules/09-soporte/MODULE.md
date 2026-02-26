# Soporte - Documentación del Módulo

**Módulo:** 09 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo Soporte gestiona la comunicación con clientes mediante un sistema de tickets:

- **Gestión de tickets**: Crear, listar, filtrar y actualizar tickets de soporte
- **Mensajería en hilo**: Conversaciones con mensajes públicos e internos (notas admin-only)
- **Plantillas de respuestas**: Plantillas reutilizables con variables dinámicas ({{customer_name}}, {{order_number}})
- **Categorías**: Organización por tipo (Pedidos, Productos, Membresía, Técnico, General)
- **Asignación a admins**: Asignar tickets a usuarios administradores
- **Notificaciones por email**: Resend para creación, respuestas y cambios de estado

### 1.2 Objetivos de negocio

- Atender consultas de clientes de forma organizada y trazable
- Reducir tiempo de respuesta con plantillas predefinidas
- Vincular tickets a pedidos y clientes para contexto
- Medir tiempos de respuesta y resolución

### 1.3 Objetivos técnicos

- APIs REST coherentes para tickets, mensajes, categorías y plantillas
- Integración con Resend para emails transaccionales
- RLS en todas las tablas support_*
- Auditoría vía `log_admin_activity`

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/admin/support` | `src/app/admin/support/page.tsx` | Listado de tickets con filtros, stats, edición inline de estado |
| `/admin/support/tickets/new` | `src/app/admin/support/tickets/new/page.tsx` | Crear ticket en nombre del cliente (búsqueda cliente/pedido) |
| `/admin/support/tickets/[id]` | `src/app/admin/support/tickets/[id]/page.tsx` | Detalle de ticket, hilo de mensajes, notas internas, edición |
| `/admin/support/templates` | `src/app/admin/support/templates/page.tsx` | CRUD de plantillas de respuestas con variables |

**Nota:** `EmailTemplatesManager` (plantillas de email del sistema) está en `/admin/system` y es distinto de `support_templates`.

---

### 2.2 APIs (endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/admin/support/tickets` | Listado paginado (status, priority, category_id, assigned_to, page, limit) |
| POST | `/api/admin/support/tickets` | Crear ticket (title, description, customer_email, category_id, order_id, assigned_to) |
| GET | `/api/admin/support/tickets/[id]` | Detalle de ticket con mensajes y analytics |
| PUT | `/api/admin/support/tickets/[id]` | Actualizar ticket (status, priority, assigned_to, resolution) |
| GET | `/api/admin/support/tickets/[id]/messages` | Mensajes del ticket |
| POST | `/api/admin/support/tickets/[id]/messages` | Enviar mensaje o nota interna |
| GET | `/api/admin/support/categories` | Listar categorías activas |
| POST | `/api/admin/support/categories` | Crear categoría |
| GET | `/api/admin/support/templates` | Listar plantillas (category_id, active_only) |
| POST | `/api/admin/support/templates` | Crear plantilla |
| PUT | `/api/admin/support/templates` | **Renderizar** plantilla con variables (body: `template_id`, `variables`) |

**⚠️ Inconsistencia documentada (ver sección 5.3):** No existe `PUT /api/admin/support/templates/[id]` para actualizar plantillas. La página de plantillas hace PUT a `/api/admin/support/templates/${id}` con body `{ name, subject, content, category_id, variables }`, pero el `route.ts` de templates solo expone PUT con body `{ template_id, variables }` para renderizar, no para actualizar. La ruta dinámica `templates/[id]/route.ts` no existe, por lo que la edición de plantillas devuelve 404.

---

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `support_categories` | Categorías (Pedidos, Productos, Membresía, Técnico, General, Facturación) |
| `support_tickets` | Tickets con subject, description, status, priority, assigned_to, order_id, resolution |
| `support_messages` | Mensajes en hilo (message, is_internal, is_from_customer, message_type) |
| `support_templates` | Plantillas (name, subject, content, variables JSONB, usage_count) |

**Enums:** `support_priority` (low, medium, high, urgent), `support_status` (open, in_progress, pending_customer, resolved, closed).

**Vista:** `support_ticket_stats` para estadísticas agregadas.

---

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| Support page | `src/app/admin/support/page.tsx` | Listado, filtros, stats, edición inline de estado |
| New ticket page | `src/app/admin/support/tickets/new/page.tsx` | Formulario con búsqueda cliente/pedido |
| Ticket detail page | `src/app/admin/support/tickets/[id]/page.tsx` | Hilo de mensajes, notas internas, edición |
| Templates page | `src/app/admin/support/templates/page.tsx` | Grid de plantillas, crear/editar/preview |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo principal de datos

```
Admin crea ticket → POST /tickets → Email Resend → Cliente recibe
Admin responde → POST /tickets/[id]/messages → Email (si no es nota interna)
Admin cambia estado → PUT /tickets/[id] → Email de actualización
Admin usa plantilla → PUT /templates (render) → Copia contenido al mensaje (frontend)
```

### 3.2 Dependencias con otros módulos

| Módulo | Dependencia |
|--------|--------------|
| **admin_users** | `is_admin`, asignación de tickets, `log_admin_activity` |
| **orders** | Vinculación opcional `order_id` en tickets |
| **profiles** | `customer_id` para vincular cliente por email |
| **Resend** | Emails de creación, respuesta y cambio de estado |

### 3.3 Integración con emails

- `src/lib/email/templates/support.ts`: `sendTicketCreatedEmail`, `sendNewResponseEmail`, `sendStatusChangeEmail`
- Variables de entorno: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_APP_URL`

---

## 4. Fortalezas

| Área | Fortaleza |
|------|-----------|
| **APIs** | Autenticación admin, validación de campos, paginación, filtros |
| **RLS** | Políticas para admin y clientes en support_tickets, support_messages |
| **Emails** | Plantillas HTML, reply-to, fallback en error sin romper flujo |
| **UI** | Edición inline de estado, badges de prioridad, "Requiere respuesta" |
| **Mensajes** | Notas internas (is_internal) con indicador visual (lock, fondo amarillo) |
| **Migración** | Índices en status, priority, created_at, assigned_to; triggers updated_at |
| **Ticket number** | Formato SUP-XXX generado en API (SUP-001, SUP-002...) |

---

## 5. Debilidades y Deuda Técnica

### 5.1 Problemas detectados

| Problema | Ubicación | Impacto |
|----------|-----------|---------|
| **Edición de plantillas rota** | templates/page.tsx → PUT /templates/[id] | 404: no existe ruta dinámica; edición no funciona |
| **PUT templates mal usado** | templates/route.ts | PUT expone render con variables, no update; confusión de semántica |
| **Búsqueda client-side** | support/page.tsx | searchTerm filtra solo en página actual; no hay server-side search |
| **Console.log en producción** | tickets/route.ts, categories/route.ts | logs de debug en APIs |
| **Categorías** | support_categories | INSERT con ON CONFLICT DO NOTHING sin constraint único; puede fallar |

### 5.2 Código que necesita refactorización

| Archivo | Líneas | Problema |
|---------|--------|----------|
| `support/page.tsx` | ~857 | Lógica de filtros y stats mezclada; extraer hooks |
| `templates/page.tsx` | ~527 | Muy largo; extraer lógica de formulario y preview |
| `tickets/[id]/page.tsx` | ~893 | Muy largo; extraer componentes de mensajes y sidebar |

### 5.3 Inconsistencia documentada: Plantillas

**Descripción:** Durante la investigación se detectó una inconsistencia entre el frontend y el backend de plantillas:

1. **Frontend** (`/admin/support/templates`)
   - Al editar: hace `PUT /api/admin/support/templates/${id}` con body:
     ```json
     { "name", "subject", "content", "category_id", "variables" }
     ```

2. **Backend** (`templates/route.ts`)
   - No existe `templates/[id]/route.ts` para manejar PUT por ID
   - El PUT en `route.ts` espera body `{ template_id, variables }` para **renderizar** la plantilla con variables, no para actualizar
   - Resultado: la petición PUT a `/api/admin/support/templates/uuid` devuelve **404** porque no hay ruta dinámica

**Solución propuesta:** Crear `src/app/api/admin/support/templates/[id]/route.ts` con:
- `PATCH` o `PUT` para actualizar plantilla (name, subject, content, category_id, variables, is_active)
- Opcionalmente: mover el render a `POST /api/admin/support/templates/render` para separar responsabilidades

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Crear endpoint PATCH/PUT para plantillas por ID**
   - Añadir `templates/[id]/route.ts` con método PUT o PATCH
   - Body: `{ name, subject, content, category_id, variables, is_active }`
   - Mover el render a `/api/admin/support/templates/render` (POST) o mantener PUT en base con body distinto

2. **Integrar plantillas en el formulario de mensajes**
   - Selector de plantilla en ticket detail para insertar contenido en el textarea
   - Usar PUT render (o nuevo endpoint) para obtener contenido con variables

### 6.2 Prioridad media

3. **Búsqueda server-side**
   - Añadir query param `search` en GET tickets
   - Full-text o ILIKE en ticket_number, subject, description, customer_email

4. **Eliminar console.log de APIs**
   - Reemplazar por logger condicional o eliminar en producción

5. **Validación con Zod**
   - Schemas para body de POST/PUT en tickets, messages, templates

### 6.3 Prioridad baja

6. **Portal del cliente**
   - Permitir a clientes ver sus tickets y responder vía web

7. **Adjuntos**
   - Campo `attachments` en support_messages ya existe (JSONB); implementar upload a Storage

8. **SLA y auto-cierre**
   - Auto-cerrar tickets resueltos tras X días

---

## 7. Planes en Curso / Roadmap

- **Corregir edición de plantillas**: Crear `templates/[id]/route.ts` (prioridad inmediata)
- **Portal cliente**: Futuro; actualmente solo admin gestiona tickets
- **Adjuntos**: Campo en DB listo; falta UI y Storage

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios

| Cambio | Pasos |
|--------|-------|
| **Tickets** | 1) API tickets/route.ts y [id]/route.ts 2) Páginas support/ y tickets/ 3) Emails support.ts |
| **Mensajes** | 1) API tickets/[id]/messages 2) Ticket detail page 3) Notas internas vs públicas |
| **Plantillas** | 1) Crear templates/[id]/route.ts 2) Corregir frontend 3) Integrar en formulario mensajes |
| **Categorías** | 1) API categories 2) Migración si se añaden campos |

### 8.2 Puntos de atención

- **is_internal**: Mensajes con `is_internal=true` no envían email y no son visibles para clientes (RLS)
- **first_response_at / last_response_at**: Se actualizan en messages y en PUT tickets
- **Ticket number**: Generado en API (SUP-XXX); la migración tiene trigger TKT-YYYYMM-XXXX pero la API lo sobrescribe
- **log_admin_activity**: RPC puede fallar si no existe; no bloquear flujo principal

### 8.3 Checklist antes de hacer cambios

- [ ] ¿Afecta a plantillas? Verificar si existe `templates/[id]/route.ts` antes de asumir PUT por ID
- [ ] ¿Afecta a emails? Revisar Resend y variables de entorno
- [ ] ¿Afecta a RLS? Probar con usuario no-admin y con customer_id
- [ ] `npm run lint` y `npm run type-check` pasan
- [ ] Si se añaden campos a support_*: migración + actualizar tipos

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` - Sección 5.2 (módulos admin)
- `Docs/SUPPORT_SYSTEM_WORKFLOW.md` - Flujo completo, schema, emails, API
- `Docs/SUPPORT_SYSTEM_IMPLEMENTATION_COMPLETE.md` - Estado de implementación
- `Docs/ADMIN_MANAGEMENT_SYSTEM_COMPLETE.md` - Contexto admin
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` - Guía global
- `.cursor/skills/daluz-soporte/SKILL.md` - Skill del módulo Soporte
