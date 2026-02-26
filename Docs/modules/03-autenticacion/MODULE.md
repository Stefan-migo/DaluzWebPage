# Autenticación - Documentación del Módulo

**Módulo:** 03 de 12  
**Versión:** 1.0  
**Última actualización:** Febrero 2025

---

## 1. Propósito y Objetivos

### 1.1 Qué resuelve este módulo

El módulo de Autenticación gestiona la identidad, sesión y perfiles de usuario en DA LUZ CONSCIENTE:

- **Identidad**: Login con email/contraseña y OAuth Google
- **Sesión**: Gestión de sesión Supabase Auth (tokens, refresh, persistencia en cookies)
- **Perfiles**: Extensión de `auth.users` con datos adicionales (nombre, teléfono, avatar, dirección)
- **Permisos admin**: Integración con `admin_users` para verificar acceso al panel (RPC `is_admin`)

### 1.2 Objetivos de negocio

- Permitir que clientes creen cuenta y accedan a su perfil, pedidos y favoritos
- Ofrecer login social (Google) para reducir fricción
- Proteger rutas de cuenta (`/perfil`, `/mis-pedidos`, etc.) y admin
- Facilitar recuperación de contraseña

### 1.3 Objetivos técnicos

- Sesión segura con Supabase Auth (JWT, refresh automático)
- Perfiles creados automáticamente vía trigger `handle_new_user`
- UX fluida: loading states, manejo de errores, redirecciones coherentes
- TypeScript estricto y validación con Zod en formularios

---

## 2. Alcance del Módulo

### 2.1 Rutas (páginas)

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/login` | `src/app/(auth)/login/page.tsx` | Login email/password + botón OAuth Google |
| `/signup` | `src/app/(auth)/signup/page.tsx` | Registro con datos de perfil (nombre, email, teléfono, contraseña) |
| `/reset-password` | `src/app/(auth)/reset-password/page.tsx` | Solicitud de enlace para restablecer contraseña |
| `/auth/callback` | `src/app/auth/callback/route.ts` | Route Handler: intercambia `code` por sesión tras OAuth redirect |

**Layout:** `src/app/(auth)/layout.tsx` — Envuelve login, signup y reset con header DA LUZ y contenedor centrado.

### 2.2 APIs (endpoints)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/auth/callback` | Intercambia `code` (query) por sesión Supabase; redirige a `next` o `/` |
| GET | `/api/debug-auth` | Debug: estado de autenticación, cookies, user (solo desarrollo) |

**Nota:** El callback OAuth es un Route Handler en `src/app/auth/callback/route.ts`, no en `/api/`.

### 2.3 Tablas de base de datos

| Tabla | Propósito |
|-------|-----------|
| `auth.users` | Usuarios de Supabase Auth (email, metadata, OAuth providers) |
| `profiles` | Perfil extendido: `id` (FK auth.users), `email`, `first_name`, `last_name`, `phone`, `avatar_url`, dirección, membresía, etc. |
| `admin_users` | Usuarios con acceso al panel admin (`id` FK auth.users, `role`, `permissions`, `is_active`) |

### 2.4 Componentes principales

| Componente | Ubicación | Descripción |
|------------|------------|-------------|
| `LoginPage` | `src/app/(auth)/login/page.tsx` | Formulario login + OAuth Google |
| `SignupPage` | `src/app/(auth)/signup/page.tsx` | Formulario registro + OAuth Google |
| `ResetPasswordPage` | `src/app/(auth)/reset-password/page.tsx` | Formulario solicitud de reset |
| `AuthLayout` | `src/app/(auth)/layout.tsx` | Layout común para páginas auth |
| `AuthContext` | `src/contexts/AuthContext.tsx` | Provider + `useAuthContext`, `useRequireAuth`, `useProfile` |
| `useAuth` | `src/hooks/useAuth.ts` | Hook con lógica de auth: signIn, signUp, signOut, resetPassword, OAuth, fetchProfile |

---

## 3. Arquitectura y Flujos

### 3.1 Flujo login email/password

1. Usuario completa formulario en `/login` (Zod + react-hook-form).
2. `signIn(email, password)` llama a `supabase.auth.signInWithPassword`.
3. Supabase devuelve sesión; `onAuthStateChange` emite `SIGNED_IN`.
4. `useAuth` actualiza estado: `user`, `session`; carga `profile` en background.
5. Página hace `router.push("/")` y `router.refresh()` tras éxito.

### 3.2 Flujo signup con datos de perfil

1. Usuario completa formulario en `/signup` (firstName, lastName, email, phone, password).
2. `signUp(email, password, { firstName, lastName, phone })` llama a `supabase.auth.signUp` con `options.data`.
3. Trigger `handle_new_user` crea fila en `profiles` al insertar en `auth.users`.
4. Si email requiere confirmación: se muestra pantalla "Revisa tu email".
5. Si confirmación inmediata: se crea profile manualmente en cliente (fallback si trigger falla).

### 3.3 Flujo reset password (email → link → Supabase)

1. Usuario ingresa email en `/reset-password`.
2. `resetPasswordForEmail(email, { redirectTo: origin + "/reset-password" })` envía email.
3. Usuario recibe email con enlace a Supabase.
4. Usuario hace clic → Supabase muestra formulario para nueva contraseña.
5. Tras guardar, Supabase redirige a `redirectTo` con sesión en hash.
6. **Limitación actual:** La página `/reset-password` solo muestra el formulario de solicitud; no detecta el caso "ya resetee" para mostrar mensaje de éxito o redirigir a login.

### 3.4 Flujo OAuth Google

1. Usuario hace clic en "Continuar con Google" en login o signup.
2. `signInWithGoogle()` llama a `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: origin + '/auth/callback' } })`.
3. Supabase redirige a Google; usuario autoriza.
4. Google redirige a Supabase; Supabase redirige a `{origin}/auth/callback?code=xxx&next=/`.
5. Route Handler `GET /auth/callback` ejecuta `supabase.auth.exchangeCodeForSession(code)`.
6. Si error: redirige a `/login?error=...`.
7. Si éxito: redirige a `next` o `/`.
8. Trigger `handle_new_user` crea/actualiza `profiles` con `full_name`, `picture` de metadata.

### 3.5 Trigger `handle_new_user` y creación de profile

- **Trigger:** `on_auth_user_created` AFTER INSERT ON `auth.users`.
- **Función:** `handle_new_user()` (SECURITY DEFINER, `search_path = public, pg_temp`).
- **Lógica:** Inserta en `profiles` con `id`, `email`, `first_name`, `last_name`, `avatar_url` extraídos de `raw_user_meta_data`.
- **OAuth:** Usa `full_name`, `name`, `picture`, `avatar_url`; divide `full_name` en first/last si no vienen explícitos.
- **Idempotencia:** `ON CONFLICT (id) DO UPDATE` para evitar errores si el profile ya existe.

### 3.6 Integración con admin (`is_admin`, `admin_users`)

- **RPC:** `is_admin(user_id UUID DEFAULT auth.uid())` consulta `admin_users` donde `id = user_id` y `is_active = true`.
- **Admin layout:** `src/app/admin/layout.tsx` usa `useAuthContext`, verifica `is_admin` vía RPC, redirige a `/login` si no hay user o a `/` si no es admin.
- **Admin por email:** Trigger `handle_new_admin_user` inserta en `admin_users` cuando `NEW.email = 'daluzalkimya@gmail.com'`.
- **Debug:** `localStorage.setItem('admin-debug', 'true')` permite bypass del check admin para desarrollo.

---

## 4. Fortalezas

- **Validación robusta:** Zod + react-hook-form en login, signup y reset.
- **Arquitectura clara:** `useAuth` (lógica) → `AuthContext` (provider) → páginas; separación de responsabilidades.
- **Profile en background:** No bloquea el render tras login; el usuario ve la app mientras se carga el profile.
- **Timeout y retries:** useAuth tiene timeout de 10s en init y 5s + retries en fetchProfile para evitar loading infinito.
- **Fallback de profile:** Si el profile no existe (PGRST116), useAuth intenta crearlo con metadata de auth user.
- **Trigger bien diseñado:** `handle_new_user` soporta email/password y OAuth; ON CONFLICT; EXCEPTION para no fallar auth.
- **RLS en profiles:** Usuarios solo ven/editan su propio profile; admins tienen políticas adicionales.
- **OAuth redirect correcto:** `/auth/callback` intercambia code por sesión y redirige con parámetro `next`.

---

## 5. Debilidades y Deuda Técnica

### 5.1 Tipos `any` en AuthContext

- `AuthContextType` usa `Promise<{ data: any; error: any }>` en signUp/signIn y `error: any` en signOut/resetPassword.
- **Impacto:** Pérdida de type safety; errores de Supabase no tipados.

### 5.2 Tipos `any` en useAuth

- `Promise.race` con `as any` en fetchProfile (línea 151).
- `catch (error: any)` en varios bloques.
- **Impacto:** Dificulta refactors y detección de errores.

### 5.3 Inconsistencia useAuth vs useAuthContext

- Páginas auth (login, signup, reset) usan `useAuth` directamente.
- Account, checkout, admin, Header usan `useAuthContext`.
- **Impacto:** Ambos exponen lo mismo vía AuthProvider, pero la convención no está unificada (debería usarse `useAuthContext` en toda la app).

### 5.4 Manejo de errores en OAuth callback

- Si `exchangeCodeForSession` falla, se redirige a `/login?error=...` pero no hay UI específica para mostrar el error en la página de login.
- **Impacto:** Usuario puede no entender por qué falló el login con Google.

### 5.5 UX de loading en OAuth

- Tras hacer clic en "Continuar con Google", la página redirige; `googleLoading` se mantiene hasta el redirect.
- Si el redirect tarda o falla, el usuario ve "Conectando con Google..." sin feedback adicional.
- **Impacto:** Posible percepción de que la app se colgó.

### 5.6 Reset password: flujo incompleto

- `redirectTo` apunta a `/reset-password`.
- Tras completar el reset en Supabase, el usuario llega a `/reset-password` con sesión en hash.
- La página actual no detecta este caso; muestra el formulario de solicitud o el mensaje "Email Enviado".
- **Impacto:** UX confusa; falta mensaje "Contraseña actualizada" y redirección a login.

### 5.7 Reset password: estilos inconsistentes

- `ResetPasswordPage` usa clases `text-azul-profundo`, `text-tierra-media`, `bg-dorado` que no coinciden con el sistema de diseño unificado (login/signup usan `brand-primary`, `bg-light`, etc.).
- **Impacto:** Inconsistencia visual con el resto del módulo auth.

### 5.8 debug-auth expone información

- `/api/debug-auth` devuelve `user`, `cookies`, `environment`; útil para desarrollo pero no debe estar en producción.
- **Recomendación:** Deshabilitar en producción o proteger con variable de entorno.

### 5.9 Profile: phone no se persiste en signup email

- `signUp` pasa `phone` en `userData` pero el trigger `handle_new_user` no inserta `phone` (solo first_name, last_name, avatar_url).
- El fallback en cliente inserta `phone` si `email_confirmed_at` existe, pero el trigger no.
- **Impacto:** Usuarios que confirman por email pueden no tener `phone` en profile.

---

## 6. Mejoras Propuestas

### Prioridad alta

1. **Eliminar `any` en AuthContext y useAuth:** Tipar retornos con `AuthError`, `User`, `Session` de Supabase.
2. **Unificar uso de hooks:** Usar `useAuthContext` en todas las páginas (incluidas login, signup, reset) para consistencia.
3. **Completar flujo reset password:** Detectar sesión/hash en `/reset-password` tras reset exitoso; mostrar "Contraseña actualizada" y redirigir a `/login`.
4. **Manejar error OAuth en login:** Leer `?error=` en `/login` y mostrar Alert con mensaje decodificado.

### Prioridad media

5. **Añadir `phone` al trigger handle_new_user:** Incluir `phone` en el INSERT si está en `raw_user_meta_data` (para signup con metadata).
6. **Unificar estilos de ResetPasswordPage:** Usar `brand-primary`, `bg-light`, `font-title`, etc., como login/signup.
7. **Proteger debug-auth:** Solo habilitar si `NODE_ENV === 'development'` o `DEBUG_AUTH_ENABLED=true`.
8. **Tests E2E:** Login, signup, reset, OAuth callback (Playwright o similar).

### Prioridad baja

9. **Skeleton de loading:** Componente reutilizable para estados de carga en auth.
10. **Rate limiting:** Limitar intentos de login/signup por IP en API (Supabase tiene opciones).
11. **Logout en otras pestañas:** Sincronizar signOut con `BroadcastChannel` o `storage` event.

---

## 7. Planes en Curso / Roadmap

- No hay trabajo pendiente explícito documentado para este módulo.
- El PROJECT_OVERVIEW menciona "Revisar RLS en todas las tablas críticas" (prioridad alta); `profiles` ya tiene RLS, pero conviene auditar políticas.
- Documentación modular: este MODULE.md es el primer documento dedicado al módulo 03.

---

## 8. Guía de Trabajo

### 8.1 Cómo abordar cambios en este módulo

1. **Leer primero:** `Docs/GOOGLE_OAUTH_SETUP.md` para cambios en OAuth.
2. **Probar localmente:** Login, signup, reset, OAuth con Supabase local (`npx supabase start`).
3. **Verificar triggers:** Cualquier cambio en `handle_new_user` o `handle_new_admin_user` requiere migración y `supabase db reset`.
4. **No modificar auth.users:** Es tabla gestionada por Supabase; solo `profiles` y `admin_users` son extensibles.

### 8.2 Puntos de atención al modificar

| Área | Atención |
|------|----------|
| **Redirect URIs** | Google Cloud Console y Supabase Dashboard deben incluir `http://localhost:3000/auth/callback` y la URL de producción. |
| **OAuth callback** | La ruta es `/auth/callback` (Route Handler), no `/api/auth/callback`. |
| **Trigger handle_new_user** | Usa `search_path = public, pg_temp`; no invocar funciones no cualificadas. |
| **RLS profiles** | Políticas "Users can view/update/insert own profile"; admins tienen políticas separadas. |
| **admin_users** | `is_admin` es la fuente de verdad; no usar `profiles.membership_tier = 'admin'` para acceso admin. |

### 8.3 Checklist antes de hacer cambios

- [ ] ¿El cambio afecta el trigger `handle_new_user`? → Crear migración, probar con `supabase db reset`.
- [ ] ¿Se añaden redirect URIs? → Actualizar Google Cloud Console y Supabase URL Configuration.
- [ ] ¿Se modifican tipos de AuthContext/useAuth? → Actualizar todos los consumidores.
- [ ] ¿Se cambia la estructura de `profiles`? → Actualizar `src/types/database.ts` y migración.
- [ ] Ejecutar `npm run type-check` y `npm run lint` antes de commit.

---

## Referencias

- **Overview:** `Docs/PROJECT_OVERVIEW.md`
- **OAuth Google:** `Docs/GOOGLE_OAUTH_SETUP.md`
- **Skill del proyecto:** `.cursor/skills/daluz-ecommerce-admin/SKILL.md`
- **Migraciones clave:** `20241220000000_create_user_profiles.sql`, `20250220000000_enhance_google_oauth_profile.sql`, `20250116000000_setup_admin_users.sql`, `20250220000001_fix_security_linter_issues.sql`
