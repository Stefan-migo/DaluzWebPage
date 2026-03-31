# Architecture Decision Record: Sistema de Autenticación para Tesoros Da Luz

**Fecha:** 2026-03-23  
**Estado:** RESOLVED  
**Contexto:** El documento de requirements menciona Clerk como sistema de auth, pero el proyecto DaLuz usa Supabase Auth.

---

## Decisión

**RESUELTO: El proyecto usa Supabase Auth, NO Clerk.**

### Evidencia

1. **package.json** - Solo contiene `@supabase/ssr` y `@supabase/supabase-js`:
   - `@supabase/ssr`: `^0.6.1`
   - `@supabase/supabase-js`: `^2.52.0`
   - NO existe `@clerk/*` en todo el proyecto

2. **Búsqueda global** - 107 resultados de `supabase.auth.*`, cero resultados de `clerk.*`:
   - `supabase.auth.getUser()` en middleware.ts
   - `supabase.auth.signInWithPassword()` en useAuth.ts
   - `supabase.auth.exchangeCodeForSession()` en callback route

3. **Módulos existentes** - MODULE.md de Autenticación confirma:

   > "Sesión: Gestión de sesión Supabase Auth (tokens, refresh, persistencia en cookies)"

4. **Arquitectura actual:**
   ```
   auth.users (Supabase Auth)
       ↓ Trigger handle_new_user
   profiles (datos extendidos)
       ↓ FK
   admin_users (permisos admin)
   ```

### Implicaciones para Tesoros

| Concepto Clerk             | Equivalente Supabase Auth                      |
| -------------------------- | ---------------------------------------------- |
| `publicMetadata.treasures` | **Tabla `user_treasures`** (nueva)             |
| `user.publicMetadata`      | `auth.users.raw_user_meta_data` (solo lectura) |
| `user.privateMetadata`     | `profiles` o tabla separada con RLS            |
| Middleware Clerk           | `createServerClient` + RLS en cada query       |

### Consecuencias

**Positivas:**

- Arquitectura ya establecida y funcionando
- RLS integrado nativamente
- Trigger `handle_new_user` ya existente

**Negativas:**

- Requiere tabla adicional para `treasures` (no existe equivalente directo a `publicMetadata`)
- Metadatos de Clerk son automáticos post-pago; aquí requerimos webhook + INSERT

---

## Alternativas Consideradas

### 1. Migrar a Clerk

- **Pros:** API más simple, `publicMetadata` automático post-pago
- **Contras:** Duplicar sistema de auth, trabajo adicional, costo adicional

### 2. Usar `auth.users.raw_user_meta_data`

- **Pros:** Nativo de Supabase
- **Contras:** No actualizable via API pública directamente (requiere service_role)

### 3. Usar tabla `user_treasures` (ELEGIDA)

- **Pros:** Flexible, RLS nativo, queries eficientes
- **Contras:** Más código inicial

---

## Acción Recomendada

**Implementar con Supabase Auth usando tabla `user_treasures`** para almacenar los access_ids comprados por cada usuario.
