---
name: daluz-autenticacion
description: Guía para el módulo de Autenticación de DA LUZ: login, signup, reset password, OAuth Google. Usar al modificar useAuth, AuthContext, páginas /login, /signup, /reset-password, auth/callback, profiles, o flujos de sesión.
---

# Autenticación - Guía de Desarrollo

## Alcance

**Incluye:** Login (email/password), signup, reset de contraseña, OAuth Google. AuthContext, useAuth, profiles, callback OAuth, AuthLayout.

**No incluye:** Lógica de admin (`is_admin`, `admin_users`) que vive en el layout admin. El módulo auth provee la sesión; el admin layout verifica permisos.

---

## Reglas de Código

### Convenciones

- **Hooks:** Usar `useAuthContext` en componentes (no `useAuth` directamente, salvo en AuthProvider).
- **Validación:** Zod para esquemas de formularios; `@hookform/resolvers/zod` con react-hook-form.
- **Tipos:** Evitar `any`; usar `AuthError`, `User`, `Session` de `@supabase/supabase-js`; `Tables<'profiles'>` para Profile.
- **Errores:** `AuthError` tiene `message` y `status`; tipar retornos de signIn/signUp/signOut.

### Patrones a seguir

- **Supabase Auth:** `signInWithPassword`, `signUp`, `signInWithOAuth`, `resetPasswordForEmail`, `exchangeCodeForSession`.
- **Profile fetch:** No bloquear render; cargar profile en background tras `SIGNED_IN`.
- **Fallback profile:** Si PGRST116 (no existe), intentar insert con metadata de auth user.
- **Trigger:** `handle_new_user` crea profile; no duplicar lógica en cliente.

### Anti-patrones a evitar

- No usar `any` en AuthContextType ni en useAuth.
- No llamar `useAuth` en páginas que ya tienen AuthProvider; usar `useAuthContext`.
- No modificar `auth.users` directamente; solo `profiles` y `admin_users`.
- No exponer tokens o refresh_token en cliente; Supabase los gestiona en cookies.
- No usar `profiles.membership_tier = 'admin'` para acceso admin; usar RPC `is_admin` contra `admin_users`.

---

## Arquitectura

### Estructura esperada

```
AuthProvider (layout.tsx)
  └── useAuth() (hook internamente)
        └── AuthContext.Provider value={auth}
              └── Páginas: useAuthContext()
```

- **useAuth:** Lógica de estado, llamadas Supabase, fetchProfile, timeouts.
- **AuthContext:** Provider que envuelve la app; expone useAuthContext.
- **Páginas:** Consumen `useAuthContext()` para user, profile, loading, signIn, signOut, etc.

### Separación de responsabilidades

| Capa | Responsabilidad |
|------|-----------------|
| Supabase Auth | Sesión, tokens, OAuth |
| useAuth | Estado, fetch profile, retries, timeouts |
| AuthContext | Inyección y hooks de conveniencia |
| Páginas | UI, validación, redirección |

### Integración con Supabase Auth y profiles

- **auth.users:** Gestionado por Supabase; solo lectura vía `getUser()`, `getSession()`.
- **profiles:** Extensión; RLS permite SELECT/UPDATE/INSERT propio; admins tienen políticas adicionales.
- **Trigger:** `handle_new_user` crea profile en INSERT de auth.users; soporta email/password y OAuth.

---

## Mejores Prácticas

### Seguridad

- **RLS:** profiles tiene `auth.uid() = id` para operaciones propias; no deshabilitar.
- **Validación inputs:** Zod en email, password (min 6), nombres; sanitizar antes de insert.
- **No exponer credenciales:** `SUPABASE_SERVICE_ROLE_KEY` solo en servidor; anon key en cliente.
- **Redirect URIs:** Registrar exactamente en Google Cloud Console y Supabase; no usar wildcards.
- **OAuth:** `redirectTo` debe ser `{origin}/auth/callback`; no incluir tokens en query.

### Performance

- **Loading states:** Mostrar loading en botones durante signIn/signUp/reset; no bloquear toda la página.
- **Timeouts:** useAuth tiene 10s init, 5s profile fetch con retries; no aumentar sin necesidad.
- **Profile en background:** No esperar profile para mostrar el usuario; actualizar cuando llegue.

### Mantenibilidad

- **Límites:** Componentes < 200 líneas; useAuth < 250 líneas; extraer fetchProfile si crece.
- **DRY:** Formularios auth comparten estructura (Card, Alert, Button); considerar componente compartido.
- **Migraciones:** Probar `supabase db reset` tras cambios en handle_new_user.

### Accesibilidad

- **Labels:** `htmlFor` e `id` en todos los inputs.
- **Mensajes de error:** Mostrar `error.message` en Alert; no solo "Error".
- **Focus:** Mantener focus en primer campo tras error de validación.
- **Contraste:** Usar clases del sistema de diseño (brand-primary, text-primary, etc.).

---

## Refactorización

### Cuándo refactorizar

- `useAuth.ts` > 250 líneas → extraer lógica de profile a `useProfileFetch`.
- AuthContext con muchos `any` → tipar retornos y errores.
- Páginas auth con código duplicado → extraer `AuthFormCard`, `AuthDivider`, `GoogleButton`.

### Cómo refactorizar sin romper

1. **Triggers:** Cualquier cambio en `handle_new_user` requiere migración; probar con usuario nuevo y OAuth.
2. **OAuth redirects:** No cambiar la ruta `/auth/callback` sin actualizar Google y Supabase.
3. **AuthContext:** Cambiar tipos de retorno puede romper consumidores; hacer cambio gradual.
4. **Profile:** Si se añaden campos, actualizar migration, database.ts, y formularios de perfil.

---

## Checklist Pre-Commit

- [ ] `npm run type-check` pasa sin errores.
- [ ] `npm run lint` pasa sin errores.
- [ ] No hay `any` nuevos en AuthContext/useAuth.
- [ ] Si se modificó trigger: `npx supabase db reset` exitoso.
- [ ] Si se modificó OAuth: redirect URIs actualizados en Google y Supabase.
- [ ] Formularios validados con Zod; mensajes de error mostrados al usuario.
- [ ] Loading states en botones durante operaciones async.
- [ ] `Docs/modules/03-autenticacion/MODULE.md` actualizado si cambió alcance o flujos.

---

## Referencias

- **Docs del módulo:** `Docs/modules/03-autenticacion/MODULE.md`
- **OAuth:** `Docs/GOOGLE_OAUTH_SETUP.md`
- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **Skill global:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
