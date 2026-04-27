# Reset Password Flow — Design Spec

**Fecha:** 2026-04-27
**Autor:** brainstorming session
**Estado:** approved (pending implementation plan)

## Problema

El flujo actual de "Olvidé mi contraseña" está roto:

1. La página `/reset-password` ([src/app/(auth)/reset-password/page.tsx](../../../src/app/(auth)/reset-password/page.tsx)) sólo tiene UI para **pedir** el email de recuperación.
2. Cuando el usuario hace click en el link del mail, Supabase redirige de vuelta a `/reset-password` — pero como esa página no detecta el modo recovery, vuelve a mostrar el formulario de "ingresá tu email", quedando en un loop sin sentido.
3. No existe ningún formulario para que el usuario ingrese una **nueva contraseña**.

Adicionalmente, el botón del mail dice "Reset Password" en inglés (viene de la plantilla por defecto de Supabase). El usuario pidió que diga "Cambiar contraseña" en español.

## Objetivo

Permitir que un usuario existente recupere acceso a su cuenta cambiando su contraseña, vía mail de verificación, en el dominio https://daluzconsciente.com.

## Diseño

### Arquitectura general

Una sola ruta `/reset-password` con **dos modos** que se alternan según el estado de autenticación:

- **Modo `request`:** formulario para pedir el email de recuperación (lo que hoy ya existe).
- **Modo `update`:** formulario para ingresar la nueva contraseña (a construir).

El cambio de modo se detecta escuchando el evento `PASSWORD_RECOVERY` que emite el cliente de Supabase cuando el callback verifica el token y crea una sesión temporal de recovery.

### Flujo end-to-end

1. Usuario en `/login` → click en "¿Olvidaste tu contraseña?" → navega a `/reset-password`.
2. Página detecta que NO hay sesión recovery → muestra **Modo `request`**.
3. Usuario ingresa email → submit llama a `supabase.auth.resetPasswordForEmail(email, { redirectTo: '${origin}/auth/callback?type=recovery&next=/reset-password' })`.
4. UI muestra mensaje de confirmación ("Revisá tu email").
5. Usuario abre el mail → click en el link → llega a `/auth/callback?token_hash=...&type=recovery`.
6. El handler en [src/app/auth/callback/route.ts](../../../src/app/auth/callback/route.ts) ya hace `verifyOtp` y redirige a `/reset-password`. Esto crea la sesión de recovery en el cliente de Supabase. **Sin cambios necesarios en el callback.**
7. Página `/reset-password` detecta el evento `PASSWORD_RECOVERY` → cambia a **Modo `update`**.
8. Usuario ingresa nueva contraseña + confirmación → submit llama a `supabase.auth.updateUser({ password })`.
9. Éxito → muestra Card de "Contraseña actualizada" con un link a `/login` (no se hace logout automático ni redirect forzado — opción A confirmada por el usuario).

### Estados de UI

Un solo componente `ResetPasswordPage` con dos dimensiones de estado: `mode` (`"request" | "update"`) e `isSuccess` (boolean).

| Mode | isSuccess | Qué se ve |
|---|---|---|
| `request` | `false` | Form actual: input de email + botón "Enviar enlace de restablecimiento" |
| `request` | `true` | Card actual: "Email enviado" con instrucciones |
| `update` | `false` | **Nuevo:** form con `password` + `confirmPassword` (con toggle de visibilidad) + botón "Guardar contraseña" |
| `update` | `true` | **Nuevo:** Card "Contraseña actualizada" con botón "Volver al inicio de sesión" |

### Detección de modo

Al montar la página:

```ts
// 1. Verificar sesión inicial (cubre el caso de re-render con sesión recovery ya activa)
supabase.auth.getSession().then(({ data: { session } }) => {
  // Si hay sesión, asumimos modo update (la sesión recovery también es una sesión).
  // En la práctica, el usuario llega aquí con sesión recovery sólo si vino del callback.
  // Si tiene sesión normal y abre /reset-password manualmente, mostrar modo request es
  // aceptable (no rompemos nada — sólo le pediría email).
  // Por simplicidad: confiar en el evento PASSWORD_RECOVERY como la señal canónica.
});

// 2. Suscribirse a cambios — la fuente de verdad para activar modo update
const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
  if (event === "PASSWORD_RECOVERY") {
    setMode("update");
  }
});
```

**Decisión:** confiar en `PASSWORD_RECOVERY` como única señal para activar modo `update`. No usar `getSession()` para inferir el modo, porque un usuario logueado normal que abre `/reset-password` manualmente también tendría sesión, y queremos que en ese caso vea el formulario de pedir email.

### Validaciones

Schema Zod para modo `update`:

```ts
const updateSchema = z.object({
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});
```

Mínimo 6 caracteres, consistente con `loginSchema` en [src/app/(auth)/login/page.tsx:21](../../../src/app/(auth)/login/page.tsx#L21).

### Cambios concretos en código

**1. `src/hooks/useAuth.ts`**

- Modificar `resetPassword` ([líneas 444-464](../../../src/hooks/useAuth.ts#L444-L464)) para que `redirectTo` apunte al callback con los params correctos:
  ```ts
  redirectTo: `${siteUrl}/auth/callback?type=recovery&next=/reset-password`
  ```
  En lugar de `${window.location.origin}/reset-password` directo. Razón: el callback es el que ejecuta `verifyOtp`, y sin ese paso no se crea la sesión recovery, por lo que el evento `PASSWORD_RECOVERY` nunca se dispara.

  Nota: usar `siteUrl` con el mismo patrón que `signUp` (env var `NEXT_PUBLIC_SITE_URL` / `NEXT_PUBLIC_APP_URL` con fallback a `window.location.origin`).

- Agregar nueva función `updatePassword`:
  ```ts
  const updatePassword = async (newPassword: string) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setAuthState((prev) => ({ ...prev, error, loading: false }));
        throw error;
      }
      setAuthState((prev) => ({ ...prev, loading: false }));
      return { error: null };
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, error, loading: false }));
      throw error;
    }
  };
  ```
  Exportarla desde el `return` del hook.

**2. `src/app/(auth)/reset-password/page.tsx`**

- Agregar imports: `useEffect`, `Eye`, `EyeOff` de lucide-react, `createClient` de `@/utils/supabase/client`.
- Agregar `updateSchema` y `type UpdateForm`.
- Agregar estado `mode` (`"request" | "update"`) y `isUpdateSuccess` (boolean).
- Agregar segundo `useForm` para el modo `update` con su propio resolver.
- Agregar `useEffect` con suscripción a `onAuthStateChange` que setea `mode = "update"` al recibir `PASSWORD_RECOVERY`.
- Agregar `onUpdateSubmit` que llama a `updatePassword` y al éxito setea `isUpdateSuccess = true`.
- Renderizado condicional según `mode` e `isUpdateSuccess`:
  - `mode === "update" && !isUpdateSuccess` → form de nueva contraseña.
  - `mode === "update" && isUpdateSuccess` → Card de éxito con link a `/login`.
  - `mode === "request"` → comportamiento actual sin cambios.
- Toggle de visibilidad de password idéntico al de [login/page.tsx:148-160](../../../src/app/(auth)/login/page.tsx#L148-L160).

**3. Plantilla de email en Supabase (manual, fuera del código)**

El texto "Reset Password" en inglés viene de la plantilla por defecto de Supabase. **No es algo que se cambie con código.**

Acción manual: en el dashboard de Supabase del proyecto `xdvemkyvgnfnibntfbwq` ir a:

**Authentication → Email Templates → Reset Password**

Editar el HTML para reemplazar:
- Subject: "Reset Your Password" → "Restablecé tu contraseña"
- Body: "Reset Password" (en el `<a>` del CTA) → "Cambiar contraseña"
- Cualquier otro texto en inglés del template → traducir a español.

Mantener intactos los placeholders `{{ .ConfirmationURL }}`, `{{ .Token }}`, etc.

Esta acción la hace el usuario en el dashboard. La incluimos en el plan como step manual para no olvidarla.

### Manejo de errores

| Caso | Comportamiento |
|---|---|
| Token expirado o inválido en el link del mail | El callback ya redirige a `/login?error=...` ([route.ts:39-44](../../../src/app/auth/callback/route.ts#L39-L44)). Sin cambios. |
| Usuario abre `/reset-password` sin sesión recovery | Ve modo `request`. Comportamiento correcto, sin error. |
| Contraseñas no coinciden | Error inline de Zod en el campo `confirmPassword`. |
| Falla de red en `updateUser` | Alert visible con `error.message`. |
| Usuario ya logueado abre `/reset-password` | Ve modo `request`. Si pide reset para su propio email funciona normal. |

### Testing manual (golden path)

1. Crear usuario nuevo vía `/signup`, confirmar email.
2. Cerrar sesión, ir a `/login`, click en "¿Olvidaste tu contraseña?".
3. Ingresar email del usuario → submit.
4. Verificar Card "Email enviado".
5. Abrir el mail recibido → click en el botón "Cambiar contraseña" (post-actualización del template).
6. Verificar que se llega a `/reset-password` en modo `update` (form de nueva contraseña visible).
7. Ingresar nueva contraseña dos veces (que coincidan, ≥6 caracteres) → submit.
8. Verificar Card "Contraseña actualizada" con link a login.
9. Click en "Volver al inicio de sesión" → verificar redirect a `/login`.
10. Login con la nueva contraseña → debe funcionar y entrar al perfil.
11. Logout, intentar login con la contraseña vieja → debe fallar.

### Testing manual (edge cases)

- Submit con contraseñas que no coinciden → error inline visible, no se hace request.
- Submit con contraseña <6 caracteres → error inline visible, no se hace request.
- Abrir un link de recovery viejo (>1 hora) → callback redirige a `/login?error=...` con mensaje de "enlace expirado".
- Abrir `/reset-password` directamente sin venir del mail → ve modo `request` (no rompe).

## Fuera de alcance

- Cambiar el flujo de signup o de login.
- Endurecer reglas de contraseña (mayúsculas, números, etc.). Mantener consistencia con el resto del sitio en min 6 caracteres.
- Internacionalización general del sitio. Sólo se traduce el template de reset password.
- Magic link login. Sigue funcionando igual via callback genérico.
