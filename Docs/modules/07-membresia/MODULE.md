# Membresía - Documentación del Módulo

**Módulo:** 07 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo **Membresía** cubre el programa transformacional de 7 meses de DA LUZ CONSCIENTE:

- **Descubrimiento y conversión**: Landing de membresía, programa completo, módulos semanales, comunidad
- **Experiencia de miembro**: Área privada `/mi-membresia` con progreso, contenido y próximos lanzamientos
- **Estructura del programa**: 7 meses (28 semanas), módulos mensuales, lecciones, kits descargables, sesiones de coaching
- **Contenido transformacional**: Videos, meditaciones, ejercicios prácticos, reflexiones, materiales descargables

### 1.2 Objetivos de negocio

- Monetizar el programa de transformación mediante suscripción mensual (7 meses)
- Generar leads y conversiones a través de la landing y CTAs
- Crear comunidad de miembros activos con acceso a contenido exclusivo
- Diferenciar planes (Básico, Premium) según beneficios y precio

### 1.3 Objetivos técnicos

- Integrar MercadoPago subscriptions para cobros recurrentes
- Mantener sincronización entre `profiles` (acceso rápido) y tabla `memberships` (fuente de verdad)
- Proporcionar contenido dinámico desde Sanity (editorial) y Supabase (estructura, progreso)
- Garantizar acceso exclusivo solo a miembros activos (RLS, verificación `is_member`)

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción | Estado |
|------|---------|-------------|--------|
| `/membresia` | `src/app/(marketing)/membresia/page.tsx` | Landing principal de membresía | ✅ Completa (hardcoded) |
| `/membresia/programa` | `src/app/(marketing)/membresia/programa/page.tsx` | Programa de 7 meses, módulos mensuales | ✅ Completa (placeholders) |
| `/membresia/modulos` | `src/app/(marketing)/membresia/modulos/page.tsx` | Módulos semanales, progreso semanal | ✅ Completa (mock data) |
| `/membresia/comunidad` | `src/app/(marketing)/membresia/comunidad/page.tsx` | Comunidad | ⚠️ Placeholder "Próximamente" |
| `/membresia/coaching` | — | Coaching personal (Footer) | **❌ No existe** |
| `/membresia/testimonios` | — | Testimonios (Footer) | **❌ No existe** |
| `/membresia/beneficios` | — | Beneficios (NavigationMenu) | **❌ No existe** |
| `/programa-transformacion` | `src/app/(marketing)/programa-transformacion/page.tsx` | Duplicado de `/membresia/programa` | ✅ Existe (Header/Homepage) |
| `/mi-membresia` | `src/app/(account)/mi-membresia/page.tsx` | Área de miembro | ⚠️ Mock data |

**Nota:** Las rutas de marketing están bajo `(marketing)/membresia/`. El layout `(membresia)/layout.tsx` solo envuelve con `MainLayout`; no hay rutas bajo `(membresia)/` propiamente. El Header y Homepage usan `/programa-transformacion`; el Footer usa `/membresia/programa`, `/membresia/modulos`, `/membresia/comunidad`.

### 2.2 APIs

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| Sanity | `getMembershipContent()` | `src/lib/sanity/client.ts` — **No usado** en ninguna página; query espera estructura distinta al schema |
| GET | `/api/admin/customers` | Filtro `membership_tier` y segmentación por membresía |
| GET | `/api/admin/customers/[id]` | Incluye `memberships` (tabla memberships) y `profiles.membership_*` |
| GET | `/api/admin/analytics/dashboard` | Métricas de `membership_tier`, `is_member` |

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `profiles` | `membership_tier`, `membership_start_date`, `membership_end_date`, `is_member` — denormalizado para acceso rápido |
| `membership_plans` | Planes (nombre, precio, duración, features, billing_cycle) |
| `memberships` | Inscripción usuario-plan (user_id, plan_id, status, start_date, end_date, mp_subscription_id, current_week, progress_percentage) |
| `program_modules` | Módulos del programa (plan_id, week_number, title, objectives, intro_video_url) |
| `lessons` | Lecciones dentro de módulos (module_id, content_type, content, video_url, duration_minutes) |
| `lesson_progress` | Progreso por usuario-lección-membresía (status, completed_at, time_spent_minutes) |
| `coaching_sessions` | Sesiones de coaching (membership_id, coach_user_id, scheduled_at, meeting_url) |
| `discussions` / `discussion_replies` | Foro de comunidad |
| `kits` / `kit_downloads` | Materiales descargables y tracking |

### 2.4 Componentes principales

| Componente | Ubicación | Propósito | Uso actual |
|------------|-----------|-----------|------------|
| Páginas membresía | `src/app/(marketing)/membresia/*/page.tsx` | Landing, programa, módulos, comunidad | Marketing estático |
| `MembershipPage` | `src/app/(account)/mi-membresia/page.tsx` | Área de miembro | Mock data |
| `MembresiaIcon` | `src/components/svg/SVGComponents.tsx` | Icono SVG membresía | Homepage sección SERVICIOS HOLÍSTICOS |
| `ProgressIndicator` | `src/components/ui/brand/ProgressIndicator.tsx` | Indicador de progreso | mi-membresia en tab "Progreso" |
| Layout (membresia) | `src/app/(membresia)/layout.tsx` | Envuelve con MainLayout | Solo usado si hay rutas bajo (membresia)/ |

---

## 3. Arquitectura y Flujos

### 3.1 Dualidad profiles vs memberships

**`profiles`** (denormalizado):

- `membership_tier`: `'none' | 'basic' | 'premium'` — usado en admin, filtros, analytics
- `membership_start_date`, `membership_end_date`, `is_member`
- Actualizado manualmente por admin o (futuro) webhook al activar/cancelar

**`memberships`** (fuente de verdad):

- Relación `user_id` → `plan_id` con status, fechas, progreso
- `mp_subscription_id` para integración MercadoPago
- RLS: usuarios solo ven sus propias memberships

**Regla:** Para verificar acceso a contenido exclusivo, usar `memberships` (status = 'active') o `profiles.is_member`. Evitar hardcodear `hasActiveMembership = false` en producción.

### 3.2 Contenido: Sanity vs Supabase

| Fuente | Uso | Estado actual |
|--------|-----|---------------|
| **Sanity** | `membershipContent` — contenido editorial | `getMembershipContent()` existe pero **no se usa**. La query espera `title, subtitle, price, modules, benefits`; el schema define documentos por módulo (moduleNumber, phase, content, exercises). **Inconsistencia.** |
| **Supabase** | `program_modules`, `lessons`, `lesson_progress` | Estructura de programa y progreso. Páginas no consumen datos reales; mi-membresia usa mock. |

### 3.3 Flujo principal

```
[Usuario] → Homepage / Header
    └── Membresía → /programa-transformacion (✅)

[Footer] → Membresía
    ├── Programa Completo → /membresia/programa (✅)
    ├── Módulos Semanales → /membresia/modulos (✅)
    ├── Comunidad → /membresia/comunidad (✅)
    ├── Coaching Personal → /membresia/coaching (❌ 404)
    └── Testimonios → /membresia/testimonios (❌ 404)

[NavigationMenu] → Membresía
    ├── Visión General → /membresia (✅)
    ├── Módulos → /membresia/modulos (✅)
    └── Beneficios → /membresia/beneficios (❌ 404)

[Usuario autenticado] → /mi-membresia
    └── Mock data (isActive: false por defecto)
```

### 3.4 Dependencias con otros módulos

| Módulo | Relación |
|--------|----------|
| **Checkout** | Futuro: pago de membresía vía MercadoPago subscriptions; webhook actualizará `memberships` y `profiles` |
| **Cuenta de usuario** | Layout account usa `hasActiveMembership = false` (TODO); `mi-membresia` es parte del área de cuenta |
| **Email** | `sendMembershipWelcome`, `sendMembershipReminder` en `notifications.ts`; templates `membership_welcome`, `membership_reminder` |
| **Admin** | Customers filtran por `membership_tier`; analytics muestran `membershipDistribution`; customer detail muestra `memberships` |
| **Marketing** | Landing, programa, módulos, comunidad comparten layout marketing |

---

## 4. Fortalezas

- **Schema DB completo**: `membership_plans`, `memberships`, `program_modules`, `lessons`, `lesson_progress`, `coaching_sessions`, `kits`, `discussions` con RLS
- **RLS correcto**: Miembros solo ven sus memberships; módulos solo visibles si membership activa
- **Email templates**: `membership_welcome`, `membership_reminder` definidos y usables desde `EmailNotificationService`
- **Admin integrado**: Filtros por membership_tier, vista de memberships por cliente
- **Diseño coherente**: Uso de `card-enhanced`, `font-title`, paleta de marca en páginas marketing
- **Metadata SEO**: Páginas con `metadata` export

---

## 5. Debilidades y Deuda Técnica

### 5.1 Rutas rotas e inconsistentes

| Origen | Enlace | Destino | Problema |
|--------|--------|---------|----------|
| Footer | `/membresia/coaching` | No existe | 404 |
| Footer | `/membresia/testimonios` | No existe | 404 |
| NavigationMenu | `/membresia/beneficios` | No existe | 404 |
| Header/Homepage | `/programa-transformacion` | Existe | Duplicado de `/membresia/programa`; contenido idéntico |

### 5.2 Mock data y placeholders

- **mi-membresia**: `mockMembershipData` con `isActive: false`; cambiar a `true` muestra UI ficticia. No hay conexión con datos reales.
- **account layout**: `hasActiveMembership = false` hardcoded — TODO
- **membresia/modulos**: Módulos semanales con datos estáticos (completed, current, locked)
- **membresia landing**: Planes Básico ($29) y Premium ($49) hardcoded; botones sin acción

### 5.3 Sanity vs schema

- **Query**: `membershipContent` espera `title, subtitle, description, mainImage, price, duration, modules, benefits, exercises, downloads, testimonials`
- **Schema**: `membershipContent` define documento por módulo con `moduleNumber`, `phase`, `content`, `exercises`, `downloads`, `journalPrompts`, etc.
- **Uso**: `getMembershipContent()` nunca se invoca en ninguna página

### 5.4 Integración MercadoPago

- **Estado**: Pendiente (Phase 5 en MercadoPagoImplementationPlan.md)
- **Falta**: `mp_subscription_id` en memberships; webhook para crear/actualizar memberships; API `/api/subscriptions/*`

### 5.5 URLs en emails

- `renewal_url` apunta a `/membresias` (plural) — ruta no existe; debería ser `/membresia` o `/mi-membresia`

---

## 6. Mejoras Propuestas

### 6.1 Prioridad alta

1. **Conectar mi-membresia con datos reales**: Reemplazar mock por fetch de `memberships` + `lesson_progress`; verificar `profiles.is_member` o membership activa
2. **Implementar `hasActiveMembership` en account layout**: Consultar `memberships` o `profiles.is_member` para mostrar badge "Activa" en sidebar
3. **Corregir rutas rotas**: Crear `/membresia/coaching` y `/membresia/testimonios` (o quitar del Footer); crear `/membresia/beneficios` o quitar del NavigationMenu
4. **Unificar rutas programa**: Redirigir `/programa-transformacion` → `/membresia/programa` o viceversa; evitar duplicación

### 6.2 Prioridad media

5. **Integrar MercadoPago subscriptions**: Seguir Phase 5 de MercadoPagoImplementationPlan.md; crear API `/api/subscriptions/create`; webhook para crear/actualizar memberships
6. **Resolver Sanity membershipContent**: Alinear query con schema o crear schema separado para landing de membresía; usar `getMembershipContent()` en landing
7. **Corregir renewal_url**: Emails `membership_reminder` usan `/membresias`; cambiar a `/membresia` o `/mi-membresia`
8. **Sincronizar profiles con memberships**: Trigger o job que actualice `profiles.membership_*` cuando cambie membership

### 6.3 Prioridad baja

9. **Tests E2E**: Flujo miembro activo → mi-membresia → contenido; verificación de acceso exclusivo
10. **Comunidad**: Implementar foro real (discussions) o integrar plataforma externa
11. **Coaching**: Página de listado de sesiones; integración con calendario

---

## 7. Planes en Curso / Roadmap

- **MercadoPago subscriptions**: Phase 5 del plan; 7 meses, auto_recurring, back_url `/membresia/activada`
- **Membership integration**: Conectar subscriptions a membreships; access control para contenido
- **mi-membresia datos reales**: Reemplazar mock por API y Supabase
- **Documentación**: Este documento; skill `daluz-membresia` para agentes

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en este módulo

1. **Añadir nueva página de membresía**: Crear bajo `(marketing)/membresia/`; verificar que Header/Footer/NavigationMenu enlacen correctamente
2. **Modificar acceso a contenido**: Usar `memberships` o `profiles.is_member`; nunca hardcodear `hasActiveMembership`
3. **Datos de miembro**: Consultar `memberships` con `status = 'active'`; `lesson_progress` para progreso; `program_modules` y `lessons` para contenido
4. **Sanity**: Si se usa membershipContent, alinear query con schema; si se crea landing dinámica, definir schema de landing

### 8.2 Puntos de atención al modificar

- **profiles vs memberships**: profiles es denormalizado; memberships es fuente de verdad. Mantener ambos sincronizados cuando se active/cancele membresía
- **RLS**: `program_modules`, `lessons` requieren membership activa; `lesson_progress` solo para el propio usuario
- **Emails**: `sendMembershipWelcome` y `sendMembershipReminder` requieren templates; verificar variables en `renewal_url` y `access_url`

### 8.3 Checklist antes de hacer cambios

- [ ] ¿Se añade o modifica ruta `/membresia/*`? → Actualizar Footer, NavigationMenu, Header
- [ ] ¿Se usa `hasActiveMembership` o `is_member`? → No hardcodear; consultar DB
- [ ] ¿Se modifica mi-membresia? → Eliminar o reemplazar mock data
- [ ] ¿Se crea nueva página? → Añadir metadata (title, description)
- [ ] ¿Se modifican links? → Verificar que no queden 404
- [ ] ¿Se añade contenido exclusivo? → Verificar RLS y verificación de membresía

---

## Referencias

- `Docs/PROJECT_OVERVIEW.md` — Overview del sistema
- `Docs/MercadoPagoImplementationPlan.md` — Phase 5: Subscription System
- `Docs/UNIFIED_FRONTEND_UIUX_DOCUMENTATION.md` — Sistema de diseño
- `.cursor/skills/daluz-ecommerce-admin/SKILL.md` — Guías globales
- `.cursor/skills/daluz-membresia/SKILL.md` — Skill del módulo
