# Delegation Log: Sistema Tesoros Da Luz

## Resumen

**Fecha:** 2026-03-23  
**Arquitecto:** @architect-orchestrator  
**Proyecto:** DaLuz WebPage  
**Feature:** Sistema Tesoros Da Luz

---

## Decisiones de Arquitectura

### ADR-001: Sistema de Auth

- **Decisión:** Usar Supabase Auth (NO Clerk)
- **Rationale:** Proyecto existente usa Supabase Auth exclusivamente
- **Impacto:** Requiere tabla `user_treasures` en lugar de `publicMetadata`

### ADR-002: Denormalización

- **Decisión:** Sincronizar `profiles.treasures[]` con `user_treasures`
- **Rationale:** Evitar JOIN en cada request
- **Impacto:** Requiere sync post-insert

### ADR-003: Access ID Strategy

- **Decisión:** `access_id = product.slug` por defecto
- **Rationale:** Productos existentes obtienen acceso automáticamente
- **Impacto:** URLs predecibles

---

## Componentes Creados

### Documentación

| Archivo                     | Descripción                            |
| --------------------------- | -------------------------------------- |
| `01-adr-auth-conflict.md`   | ADR resolviendo Clerk vs Supabase Auth |
| `02-discovery.md`           | User Journey y Bounded Contexts        |
| `03-architecture-design.md` | Schema, APIs, Security, Dependencies   |
| `04-implementation-plan.md` | 4 fases, 14 horas estimadas            |
| `05-validation-report.md`   | Checklist de compliance                |

### Base de Datos (Migrations a crear)

| Migration                                             | Tabla/Cambio        |
| ----------------------------------------------------- | ------------------- |
| `20260323000000_create_user_treasures.sql`            | Nueva tabla con RLS |
| `20260323000001_add_access_id_to_products.sql`        | Nueva columna       |
| `20260323000002_add_treasures_to_profiles.sql`        | Nueva columna       |
| `20260323000003_add_has_treasure_access_function.sql` | RPC function        |

### Código Frontend (Archivos a crear)

| Archivo                                  | Descripción                   |
| ---------------------------------------- | ----------------------------- |
| `src/hooks/useTreasures.ts`              | Hook para acceder a treasures |
| `src/app/api/treasures/route.ts`         | API endpoint                  |
| `src/app/api/treasures/content/route.ts` | API endpoint con Sanity       |
| `src/app/api/treasures/public/route.ts`  | API pública para lista        |

### Código Backend (Modificaciones)

| Archivo                                     | Cambio                      |
| ------------------------------------------- | --------------------------- |
| `src/app/api/webhooks/mercadopago/route.ts` | + grant treasures post-pago |

### Sanity (Schema a crear)

| Archivo                               | Descripción                     |
| ------------------------------------- | ------------------------------- |
| `src/sanity/schemas/tesoroContent.ts` | Schema para contenido exclusivo |

---

## Dependencias entre Components

```
webhook (modificar)
    │
    ▼
user_treasures (crear) ──► profiles.treasures (crear)
    │                              │
    ▼                              ▼
has_treasure_access RPC      useTreasures hook
    │                              │
    ▼                              ▼
/api/treasures/content ◄─── página Tesoros (modificar)
                                  │
                                  ▼
                             Header (modificar)
```

---

## Orden de Implementación Recomendado

1. **Migrations** (en orden)
   - `20260323000000_create_user_treasures.sql`
   - `20260323000001_add_access_id_to_products.sql`
   - `20260323000002_add_treasures_to_profiles.sql`
   - `20260323000003_add_has_treasure_access_function.sql`

2. **Modificar existente**
   - `src/app/api/webhooks/mercadopago/route.ts`

3. **Crear APIs**
   - `src/app/api/treasures/route.ts`
   - `src/app/api/treasures/content/route.ts`
   - `src/app/api/treasures/public/route.ts`

4. **Crear Hook**
   - `src/hooks/useTreasures.ts`

5. **Crear Schema Sanity**
   - `src/sanity/schemas/tesoroContent.ts`

6. **Modificar Frontend**
   - `src/app/(marketing)/alkimya/tesoros-daluz/page.tsx`
   - `src/components/layout/Header.tsx`

7. **Actualizar Tipos**
   - `src/types/database.ts`

---

## Preocupaciones de Seguridad

| Área             | Preocupación            | Mitigación                         |
| ---------------- | ----------------------- | ---------------------------------- |
| **Webhook**      | injection en access_ids | Zod validation                     |
| **RLS**          | policy bypass           | Testing con usuarios distintos     |
| **Sanity**       | No auth en queries      | Solo servir via API que valida RLS |
| **Service Role** | Credenciales expuestas  | Usar env, no hardcodear            |

---

## Métricas de Éxito

| Métrica                      | Target       |
| ---------------------------- | ------------ |
| Tiempo de acceso post-compra | < 5 minutos  |
| Queries a user_treasures     | < 10ms (p95) |
| Cobertura de tests           | > 70%        |
| RLS policy violations        | 0            |

---

## Notas para Delegation

Al delegar a subagentes:

1. **Dar contexto completo:**
   - ADR-001 ya resuelto: Supabase Auth, no Clerk
   - Estructura de tablas existentes en `supabase/migrations/`
   - Patrones de RLS en `20241220000001_create_ecommerce_system.sql`

2. **Especificar acceptance criteria:**
   - RLS debe pasar `supabase.auth.getUser()` test
   - APIs deben retornar 401 si no auth
   - Hook debe tener loading/error states

3. **Proporcionar ejemplos:**
   - Webhook actual en `src/app/api/webhooks/mercadopago/route.ts`
   - Hook useAuth en `src/hooks/useAuth.ts`
   - Sanity schema membershipContent en `src/sanity/schemas/membershipContent.ts`
