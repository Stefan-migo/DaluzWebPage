---
name: daluz-membresia
description: Guía para el módulo Membresía de DA LUZ: programa 7 meses, módulos semanales, comunidad, planes. Usar al modificar /membresia/*, mi-membresia, membershipContent (Sanity), memberships/program_modules (DB), o flujos de suscripción.
---

# Membresía - Guía de Desarrollo

## Alcance

**Incluye:** Programa transformacional de 7 meses, landing de membresía, módulos semanales, comunidad, área de miembro (`/mi-membresia`), planes (Básico, Premium), progreso de lecciones, sesiones de coaching, kits descargables.

**No incluye:** Servicios holísticos puntuales (sesiones, talleres); e-commerce de productos (módulo commerce).

**Estado actual:** Páginas marketing estáticas; mi-membresia con mock data; integración MercadoPago subscriptions pendiente.

---

## Reglas de Código

### Convenciones

- **Rutas marketing:** `/membresia`, `/membresia/programa`, `/membresia/modulos`, `/membresia/comunidad` bajo `(marketing)/membresia/`
- **Ruta account:** `/mi-membresia` bajo `(account)/`
- **Header/Homepage:** Usan `/programa-transformacion` (duplicado de `/membresia/programa`); unificar en futuras refactorizaciones
- **Evitar `any`:** Tipar props y retornos; usar tipos de `database.ts` para memberships, profiles

### Patrones a seguir

1. **Verificación de membresía:** Consultar `memberships` con `status = 'active'` o `profiles.is_member`; nunca hardcodear `hasActiveMembership = true/false`
2. **Contenido exclusivo:** Antes de mostrar módulos/lecciones, verificar que el usuario tenga membership activa (RLS en DB; verificación en cliente si es necesario)
3. **Sanity vs DB:** Sanity para contenido editorial (landing, descripciones); Supabase para estructura del programa (`program_modules`, `lessons`), progreso (`lesson_progress`), planes (`membership_plans`), membresías (`memberships`)
4. **Páginas marketing:** Hero (gradiente) → Grid/Contenido → CTA; metadata con title y description

### Anti-patrones a evitar

- **Mock data en producción:** No dejar `mockMembershipData` ni `isActive: false` hardcoded en mi-membresia
- **Hardcodear hasActiveMembership:** En `(account)/layout.tsx` debe consultar DB
- **Links rotos:** No enlazar a `/membresia/coaching`, `/membresia/testimonios`, `/membresia/beneficios` sin crear la página
- **renewal_url incorrecto:** Emails usan `/membresias`; debe ser `/membresia` o `/mi-membresia`

---

## Arquitectura

### Estructura esperada

```
src/app/
├── (marketing)/
│   ├── membresia/
│   │   ├── page.tsx           # Landing
│   │   ├── programa/page.tsx   # Programa 7 meses
│   │   ├── modulos/page.tsx    # Módulos semanales
│   │   └── comunidad/page.tsx  # Comunidad
│   └── programa-transformacion/page.tsx  # Duplicado; unificar
├── (account)/
│   └── mi-membresia/page.tsx   # Área de miembro
└── (membresia)/
    └── layout.tsx              # MainLayout wrapper
```

### Separación Sanity vs Supabase

| Fuente | Uso |
|--------|-----|
| **Sanity** | Contenido editorial: landing (título, beneficios, testimonios), descripciones de módulos. Schema `membershipContent` actualmente define documentos por módulo; query en client.ts espera estructura de landing — alinear antes de usar |
| **Supabase** | `membership_plans`, `memberships`, `program_modules`, `lessons`, `lesson_progress`, `coaching_sessions`, `kits`. Fuente de verdad para planes, inscripciones, progreso |

### Integración con otros módulos

| Módulo | Punto de integración |
|--------|----------------------|
| **Checkout** | Webhook MercadoPago al aprobar suscripción → crear/actualizar `memberships` y `profiles` |
| **Cuenta usuario** | Layout account: badge "Activa" según membership; mi-membresia en sidebar |
| **Email** | `sendMembershipWelcome` al activar; `sendMembershipReminder` antes de renovación |
| **Admin** | Filtro `membership_tier` en customers; analytics `membershipDistribution` |

---

## Mejores Prácticas

### Performance

- Consultar `memberships` y `lesson_progress` en una sola query o en paralelo cuando sea posible
- Usar `React.memo` en componentes de lista (módulos, lecciones) si hay animaciones
- Evitar over-fetch: solicitar solo campos necesarios en selects de Supabase

### Seguridad

- **RLS:** `memberships` — usuarios solo ven las propias; `program_modules`, `lessons` — solo si membership activa
- **Verificación is_member:** Antes de mostrar contenido exclusivo en cliente, verificar `profiles.is_member` o existencia de membership activa
- **Admin:** APIs de customers/analytics requieren `is_admin`; no exponer datos de memberships de otros usuarios

### Mantenibilidad

- **Límites:** Componentes < 200 líneas; servicios < 250 líneas
- **DRY:** Extraer lógica de verificación de membresía a hook `useMembership()` o utilidad
- **Single Responsibility:** Páginas marketing para descubrimiento; mi-membresia para experiencia de miembro

### Accesibilidad

- Botones "Elegir Plan", "Unirse" deben tener `aria-label` si el texto no es descriptivo
- Progreso visual (Progress, ProgressIndicator) debe tener `aria-valuenow`, `aria-valuemin`, `aria-valuemax`

---

## Refactorización

### Cuándo refactorizar

- mi-membresia supera 200 líneas → extraer `MembershipOverview`, `MembershipProgress`, `MembershipContent`
- Lógica de verificación de membresía repetida → crear `useMembership()` o `getActiveMembership(userId)`
- Duplicación `/programa-transformacion` y `/membresia/programa` → redirigir una a la otra o unificar

### Cómo refactorizar sin romper

- **profiles.membership_tier vs memberships:** Mantener ambos; al activar membresía, actualizar `memberships` (insert) y `profiles` (update membership_tier, is_member, fechas)
- **Sanity membershipContent:** Si se usa, crear schema de landing separado o adaptar query al schema actual de módulos

---

## Checklist Pre-Commit

- [ ] ¿Se modificó mi-membresia? → Verificar que no quede mock data en producción
- [ ] ¿Se añadió verificación de membresía? → No hardcodear; consultar DB
- [ ] ¿Se añadieron links a Footer/NavigationMenu? → Verificar que la ruta exista
- [ ] ¿Se modificaron emails de membresía? → Verificar `renewal_url` y `access_url`
- [ ] ¿Componente > 200 líneas? → Planificar extracción
- [ ] `npm run lint` y `npm run type-check` pasan

---

## Referencias

- **Docs del módulo:** `Docs/modules/07-membresia/MODULE.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **MercadoPago:** `Docs/MercadoPagoImplementationPlan.md` (Phase 5)
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
