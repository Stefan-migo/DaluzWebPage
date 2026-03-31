# Arquitectura Sistema Tesoros Da Luz

**Fecha:** 2026-03-23  
**Status:** Planificado (no implementado)

---

## Resumen Ejecutivo

Sistema de acceso a contenido exclusivo "Tesoros Da Luz" donde usuarios que compran productos específicos desbloquean contenido en Sanity CMS.

### Conflicto Resuelto

| Requisito Original                 | Solución                                   |
| ---------------------------------- | ------------------------------------------ |
| Clerk + `publicMetadata.treasures` | **Supabase Auth** + tabla `user_treasures` |

### Arquitectura

```
MercadoPago Webhook → INSERT user_treasures → Profile.treasures sync
                                                      │
                                                      ▼
Usuario → GET /api/treasures → Frontend filtering ← Sanity CMS
```

---

## Documentos

| Documento                                                | Descripción                       |
| -------------------------------------------------------- | --------------------------------- |
| [01-adr-auth-conflict.md](./01-adr-auth-conflict.md)     | ADR resolviendo Clerk vs Supabase |
| [02-discovery.md](./02-discovery.md)                     | User Journey, Bounded Contexts    |
| [03-architecture-design.md](./03-architecture-design.md) | Schema, APIs, Security            |
| [04-implementation-plan.md](./04-implementation-plan.md) | Plan de 4 fases, ~14 horas        |
| [05-validation-report.md](./05-validation-report.md)     | Checklist de compliance           |
| [06-delegation-log.md](./06-delegation-log.md)           | Log de decisiones, artifacts      |

---

## Estimación

| Phase                 | Duración | Entregables                                    |
| --------------------- | -------- | ---------------------------------------------- |
| Phase 1: Foundation   | 5h       | Tabla user_treasures, RLS, Webhook enhancement |
| Phase 2: API Layer    | 3h       | APIs /treasures, RPC function                  |
| Phase 3: Frontend     | 4h       | Hook, Página filtrada, Header                  |
| Phase 4: CMS & Polish | 2h       | Sanity schema, tipos                           |
| **Total**             | **14h**  |                                                |

---

## Gap Analysis Resumida

| Componente     | Estado             | Gap                                  |
| -------------- | ------------------ | ------------------------------------ |
| Products       | ❌ Sin `access_id` | Crear columna                        |
| user_treasures | ❌ No existe       | Crear tabla                          |
| Webhook MP     | ⚠️ Parcial         | Agregar grant treasures              |
| Sanity schema  | ❌ No existe       | Crear tesoroContent                  |
| APIs           | ❌ No existen      | Crear /treasures, /treasures/content |
| Frontend       | ⚠️ Estático        | Filtrar por acceso                   |
| RLS            | ⚠️ Parcial         | + políticas en user_treasures        |

---

## Decisiones Clave

1. **Supabase Auth** - Proyecto existente, no Clerk
2. **Tabla user_treasures** - Almacena access_ids por usuario
3. **Denormalización** - profiles.treasures[] para queries rápidas
4. **access_id = slug** - Productos existentes get access por su slug

---

## Archivos a Crear

### Migrations

- `supabase/migrations/20260323000000_create_user_treasures.sql`
- `supabase/migrations/20260323000001_add_access_id_to_products.sql`
- `supabase/migrations/20260323000002_add_treasures_to_profiles.sql`
- `supabase/migrations/20260323000003_add_has_treasure_access_function.sql`

### Código

- `src/hooks/useTreasures.ts`
- `src/app/api/treasures/route.ts`
- `src/app/api/treasures/content/route.ts`
- `src/app/api/treasures/public/route.ts`
- `src/sanity/schemas/tesoroContent.ts`

### Modificaciones

- `src/app/api/webhooks/mercadopago/route.ts`
- `src/app/(marketing)/alkimya/tesoros-daluz/page.tsx`
- `src/components/layout/Header.tsx`
- `src/types/database.ts`

---

## Siguiente Paso

Ejecutar **Phase 1** (Foundation):

1. Crear migrations
2. Modificar webhook
3. Verificar RLS
