---
name: daluz-backend-db
description: Guía para el módulo Backend/DB de DA LUZ. Usar al modificar schema, migraciones, RLS, funciones SQL, triggers, Supabase config, tipos database.ts, o crear nuevas tablas.
---

# Backend / Base de datos - Guía de Desarrollo

## Alcance

Este módulo cubre: schema PostgreSQL (Supabase), migraciones, Row Level Security (RLS), funciones SQL, triggers, configuración Supabase, tipos TypeScript (`database.ts`) y cliente Supabase (`createClient`, `createServiceRoleClient`).

**Ubicaciones clave:**
- Migraciones: `supabase/migrations/*.sql`
- Config: `supabase/config.toml`
- Seed: `supabase/seed-ecommerce.sql`
- Tipos: `src/types/database.ts`
- Cliente: `src/lib/supabase.ts`, `src/utils/supabase/server.ts`

---

## Reglas de Código

### Migraciones

- **Idempotencia**: Usar `DROP IF EXISTS` / `CREATE OR REPLACE` / `ADD COLUMN IF NOT EXISTS` en todas las migraciones
- **Orden**: Las migraciones se ejecutan por timestamp; dependencias deben existir en migraciones anteriores
- **Funciones**: Antes de crear una función, verificar si ya existe con otra firma. Evitar duplicar firmas; usar `DROP FUNCTION IF EXISTS nombre(tipo1, tipo2)` antes de `CREATE OR REPLACE`
- **Nombres**: `YYYYMMDDHHMMSS_nombre_descriptivo.sql`

### Anti-patrones

- **NO** crear múltiples versiones de la misma función sin consolidar (ej: `decrease_product_stock` 2 params vs 3 params)
- **NO** usar `CREATE POLICY` sin `DROP POLICY IF EXISTS` antes si cambias una política existente
- **NO** crear tablas sin RLS habilitado si contienen datos sensibles
- **NO** hardcodear credenciales en código; usar `process.env.*`

### Patrones a seguir

- Funciones SECURITY DEFINER: siempre `SET search_path = public, pg_temp`
- Políticas admin: verificar `is_admin(auth.uid())` o consulta directa a `admin_users` sin recursión
- Triggers: `DROP TRIGGER IF EXISTS` antes de `CREATE TRIGGER`

---

## Arquitectura

### Estructura esperada de migraciones

```
supabase/migrations/
├── 20241220000000_create_user_profiles.sql
├── 20241220000001_create_ecommerce_system.sql
├── ...
└── 20251116033131_remote_commit.sql
```

### Orden de dependencias

1. `profiles` (auth) → `update_updated_at_column`
2. `ecommerce` → products, product_variants, categories, orders, order_items
3. `admin_users` → is_admin, get_admin_role
4. Otras tablas (support, membership, shipping, etc.)

### Uso de clientes

| Cliente | Cuándo | RLS |
|---------|--------|-----|
| `createClient()` | Cliente con sesión (anon key) | Aplicado |
| `createServerClient()` | Server con cookies | Aplicado |
| `createServiceRoleClient()` | Webhooks, APIs admin, operaciones bulk | Bypass |

---

## Mejores Prácticas

### Performance

- Crear índices en columnas usadas en WHERE, JOIN, ORDER BY
- Evitar `SELECT *` en funciones que solo necesitan pocas columnas
- Usar `EXISTS` en lugar de `COUNT(*)` cuando solo se verifica existencia

### Seguridad

- **RLS**: Todas las tablas con datos de usuario o admin deben tener RLS habilitado
- **Políticas explícitas**: No dejar tablas con RLS sin políticas (bloquean todo por defecto)
- **Service role**: Solo en server-side; nunca exponer en cliente
- **SECURITY DEFINER**: Usar con cuidado; `search_path` explícito obligatorio

### Mantenibilidad

- `database.ts` debe reflejar el schema real; evitar `any` en service role
- Comentar funciones complejas con `COMMENT ON FUNCTION`
- Documentar cambios en migraciones con comentarios SQL

---

## Refactorización

### Cuándo refactorizar migraciones

- Cuando hay conflictos de funciones (ej: `decrease_product_stock`)
- Cuando una migración falla en `db reset`
- Cuando el schema está fragmentado (ej: stock_movements con/sin variant_id)

### Cómo consolidar funciones sin romper

1. Crear nueva migración con timestamp posterior
2. `DROP FUNCTION IF EXISTS nombre(tipo1, tipo2)` para cada firma existente
3. `CREATE OR REPLACE FUNCTION nombre(...)` con firma unificada
4. Actualizar código que llama a la función (webhook, APIs)
5. Probar `npx supabase db reset`

### Schema stock_movements

- Si se usa variantes: añadir `variant_id UUID NULL` a la tabla
- Unificar `movement_type` ('decrease', 'increase', 'sale', 'adjustment') según convención
- Unificar signo de `quantity` (positivo vs negativo)

---

## Checklist Pre-Commit

- [ ] Migración probada localmente: `npx supabase db reset`
- [ ] No hay conflictos de nombres de funciones (firmas únicas)
- [ ] Tablas nuevas con RLS habilitado y políticas explícitas
- [ ] `database.ts` actualizado si se añadieron tablas/columnas
- [ ] Sin credenciales hardcodeadas en cambios
- [ ] Comentarios en funciones SQL complejas

---

## Referencias

- **Docs del módulo**: `Docs/modules/13-backend-db/MODULE.md`
- **Overview**: `Docs/PROJECT_OVERVIEW.md` (secciones 3, 6.1, 6.2)
- **Supabase CLI**: `Docs/SUPABASE_CLI_SETUP_GUIDE.md`
- **Skill e-commerce**: `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
