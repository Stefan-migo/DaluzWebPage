# Reset Password Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hacer funcional el flujo de "Olvidé mi contraseña" para que un usuario reciba un mail, clickee el link y pueda ingresar una nueva contraseña en `/reset-password`.

**Architecture:** Una sola ruta `/reset-password` con dos modos (`request` para pedir el mail, `update` para ingresar la nueva contraseña). Detección de modo via evento `PASSWORD_RECOVERY` de Supabase. El callback `/auth/callback` ya verifica el token y redirige — sin cambios. Post-cambio, mostrar Card con link a `/login` (no logout automático).

**Tech Stack:** Next.js 14 (App Router, client components), Supabase Auth (`@supabase/ssr`), react-hook-form + Zod, lucide-react, Tailwind, shadcn/ui.

---

## File Structure

- **Modify:** `src/hooks/useAuth.ts`
  - Modificar `resetPassword` (líneas 444-464) — cambiar `redirectTo` para que pase por `/auth/callback`.
  - Agregar nueva función `updatePassword` y exportarla.
- **Modify:** `src/app/(auth)/reset-password/page.tsx`
  - Agregar modo dual (`request` / `update`), listener de `PASSWORD_RECOVERY`, formulario de nueva contraseña, Card de éxito.
- **No cambios** en `src/app/auth/callback/route.ts` — ya redirige correctamente para `type=recovery`.
- **Acción manual fuera de código:** traducir template de email en dashboard de Supabase.

---

## Task 1: Commit del spec antes de empezar

**Files:**
- Add: `docs/superpowers/specs/2026-04-27-reset-password-flow-design.md`
- Add: `docs/superpowers/plans/2026-04-27-reset-password-flow.md` (este archivo)

- [ ] **Step 1: Verificar archivos a commitear**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && git status`
Expected: Untracked files: `Docs/superpowers/specs/2026-04-27-reset-password-flow-design.md` y `Docs/superpowers/plans/2026-04-27-reset-password-flow.md`.

- [ ] **Step 2: Stage y commit**

```bash
cd "c:/Users/juan/Desktop/DaluzWebPage"
git add "docs/superpowers/specs/2026-04-27-reset-password-flow-design.md" "docs/superpowers/plans/2026-04-27-reset-password-flow.md"
git commit -m "docs: add reset password flow spec and implementation plan"
```

Expected: commit creado en `main`.

---

## Task 2: Modificar `resetPassword` en useAuth para pasar por el callback

**Files:**
- Modify: `src/hooks/useAuth.ts:444-464`

**Contexto:** Hoy `resetPassword` redirige directo a `/reset-password` saltándose el callback. Sin el callback, no se ejecuta `verifyOtp`, no se crea sesión recovery, y el evento `PASSWORD_RECOVERY` nunca se dispara. Hay que cambiar el `redirectTo` para que pase por `/auth/callback?type=recovery&next=/reset-password`.

- [ ] **Step 1: Leer el bloque actual antes de editar**

Read líneas 444-464 de `src/hooks/useAuth.ts` para confirmar el contenido exacto.

- [ ] **Step 2: Reemplazar la función `resetPassword`**

Buscar este bloque exacto en `src/hooks/useAuth.ts`:

```ts
  const resetPassword = async (email: string) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

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

Reemplazarlo por:

```ts
  const resetPassword = async (email: string) => {
    const supabase = supabaseRef.current || getSupabaseClient();
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      (typeof window !== "undefined" ? window.location.origin : "");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/auth/callback?type=recovery&next=/reset-password`,
      });

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

- [ ] **Step 3: Type check**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npm run type-check`
Expected: sin errores nuevos en `src/hooks/useAuth.ts` (puede haber errores preexistentes en otros archivos — esos los ignoramos).

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/juan/Desktop/DaluzWebPage"
git add src/hooks/useAuth.ts
git commit -m "fix(auth): route password reset email link through /auth/callback"
```

---

## Task 3: Agregar `updatePassword` en useAuth

**Files:**
- Modify: `src/hooks/useAuth.ts` (agregar función después de `resetPassword`, antes de `resendConfirmation`; añadir al `return`)

**Contexto:** Necesitamos una función que llame a `supabase.auth.updateUser({ password })` y actualice el estado de auth. Sigue el patrón de las otras funciones del hook.

- [ ] **Step 1: Insertar `updatePassword` después de `resetPassword`**

Buscar el final de la función `resetPassword` (línea con cierre `};` después de `throw error;` en el `catch`) e insertar inmediatamente después de ella, antes de `const resendConfirmation`:

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

- [ ] **Step 2: Exportar `updatePassword` desde el `return` del hook**

Buscar el bloque `return` al final del hook (que comienza con `return {` y contiene `...authState,`). Agregar `updatePassword,` después de `resetPassword,`.

Bloque actual:

```ts
  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    resendConfirmation,
    signInWithGoogle,
    signUpWithGoogle,
    refetchProfile: () =>
      authState.user ? fetchProfile(authState.user.id) : null,
  };
```

Reemplazar por:

```ts
  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
    resendConfirmation,
    signInWithGoogle,
    signUpWithGoogle,
    refetchProfile: () =>
      authState.user ? fetchProfile(authState.user.id) : null,
  };
```

- [ ] **Step 3: Type check**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npm run type-check`
Expected: sin errores nuevos.

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/juan/Desktop/DaluzWebPage"
git add src/hooks/useAuth.ts
git commit -m "feat(auth): add updatePassword helper to useAuth hook"
```

---

## Task 4: Reescribir `reset-password/page.tsx` con modo dual

**Files:**
- Modify: `src/app/(auth)/reset-password/page.tsx` (reemplazo completo del contenido)

**Contexto:** El archivo actual sólo tiene el modo `request`. Lo reemplazamos por una versión que maneja ambos modos, escucha el evento `PASSWORD_RECOVERY` y muestra el formulario de nueva contraseña cuando corresponde.

- [ ] **Step 1: Reemplazar el contenido completo del archivo**

Sobreescribir `src/app/(auth)/reset-password/page.tsx` con:

```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react";

const resetSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});
type ResetForm = z.infer<typeof resetSchema>;

const updateSchema = z
  .object({
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });
type UpdateForm = z.infer<typeof updateSchema>;

type Mode = "request" | "update";

export default function ResetPasswordPage() {
  const { resetPassword, updatePassword, loading, error } = useAuth();
  const [mode, setMode] = useState<Mode>("request");
  const [isRequestSuccess, setIsRequestSuccess] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const requestForm = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const updateForm = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setMode("update");
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const onRequestSubmit = async (data: ResetForm) => {
    try {
      await resetPassword(data.email);
      setIsRequestSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
    }
  };

  const onUpdateSubmit = async (data: UpdateForm) => {
    try {
      await updatePassword(data.password);
      setIsUpdateSuccess(true);
    } catch (err) {
      console.error("Password update error:", err);
    }
  };

  if (mode === "update" && isUpdateSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-azul-profundo">
            Contraseña Actualizada
          </CardTitle>
          <CardDescription className="text-center text-tierra-media">
            Ya podés iniciar sesión con tu nueva contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert>
            <AlertDescription>
              Tu contraseña fue cambiada correctamente.
            </AlertDescription>
          </Alert>
          <Button asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (mode === "update") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-azul-profundo">
            Nueva Contraseña
          </CardTitle>
          <CardDescription className="text-center text-tierra-media">
            Ingresá tu nueva contraseña dos veces para confirmarla
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={updateForm.handleSubmit(onUpdateSubmit)} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 6 caracteres"
                  {...updateForm.register("password")}
                  className={updateForm.formState.errors.password ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {updateForm.formState.errors.password && (
                <p className="text-sm text-red-500">
                  {updateForm.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repetí la contraseña"
                  {...updateForm.register("confirmPassword")}
                  className={updateForm.formState.errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {updateForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {updateForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar contraseña"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  if (isRequestSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-azul-profundo">
            Email Enviado
          </CardTitle>
          <CardDescription className="text-center text-tierra-media">
            Revisa tu bandeja de entrada
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Alert>
            <AlertDescription>
              Te hemos enviado un email con las instrucciones para restablecer tu contraseña.
              Por favor, revisa tu bandeja de entrada y sigue el enlace proporcionado.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-sm text-tierra-media">
              ¿No recibiste el email? Revisa tu carpeta de spam o intenta nuevamente.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsRequestSuccess(false)}
              className="w-full"
            >
              Enviar de nuevo
            </Button>
          </div>

          <Button asChild className="w-full">
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-azul-profundo">
          Restablecer Contraseña
        </CardTitle>
        <CardDescription className="text-center text-tierra-media">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={requestForm.handleSubmit(onRequestSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              {...requestForm.register("email")}
              className={requestForm.formState.errors.email ? "border-red-500" : ""}
            />
            {requestForm.formState.errors.email && (
              <p className="text-sm text-red-500">
                {requestForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              "Enviar Enlace de Restablecimiento"
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-azul-profundo hover:text-azul-profundo/80 underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>

          <div className="text-center text-sm text-tierra-media">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="text-azul-profundo hover:text-azul-profundo/80 font-semibold underline"
            >
              Regístrate aquí
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Type check**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npm run type-check`
Expected: sin errores nuevos en `src/app/(auth)/reset-password/page.tsx`. Si hay errores preexistentes en OTROS archivos, ignorarlos.

- [ ] **Step 3: Lint del archivo modificado**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npx next lint --file "src/app/(auth)/reset-password/page.tsx"`
Expected: sin errores ni warnings críticos.

- [ ] **Step 4: Commit**

```bash
cd "c:/Users/juan/Desktop/DaluzWebPage"
git add "src/app/(auth)/reset-password/page.tsx"
git commit -m "feat(auth): add update-password mode to reset-password page"
```

---

## Task 5: Verificación final + instrucciones de testing manual

**Files:** ninguno modificado en esta tarea — sólo verificación.

- [ ] **Step 1: Type check global**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npm run type-check`
Expected: cualquier error nuevo introducido por nuestros cambios debe estar resuelto. Errores preexistentes en otros archivos no son responsabilidad de este plan.

- [ ] **Step 2: Build local (smoke check)**

Run: `cd "c:/Users/juan/Desktop/DaluzWebPage" && npm run build`
Expected: build exitoso. Si falla por errores en otros archivos preexistentes, evaluar si están relacionados con nuestros cambios (no deberían).

  Si el build tarda demasiado o falla por motivos no relacionados, podemos saltar este step y dejar que se valide en deploy.

- [ ] **Step 3: Documentar instrucciones de prueba manual al usuario**

Después de que el código esté en `main`, instruir al usuario que:

1. **Antes de probar**, traduzca el template de email en Supabase:
   - Ir a https://supabase.com/dashboard/project/xdvemkyvgnfnibntfbwq/auth/templates
   - Seleccionar "Reset Password"
   - Cambiar el subject a "Restablecé tu contraseña"
   - En el HTML, cambiar el texto del botón de "Reset Password" a "Cambiar contraseña"
   - Cualquier otro texto en inglés del template → traducir a español
   - Guardar

2. **Verificar URL de Site URL en Supabase:**
   - En el dashboard ir a Authentication → URL Configuration
   - Confirmar que `Site URL` es `https://daluzconsciente.com`
   - En `Redirect URLs` agregar (si no está): `https://daluzconsciente.com/auth/callback`, `http://localhost:3000/auth/callback`

3. **Probar el golden path:**
   - Cerrar sesión.
   - En `/login` clickear "¿Olvidaste tu contraseña?".
   - Ingresar email de un usuario existente → submit.
   - Verificar Card "Email enviado".
   - Abrir el mail y clickear "Cambiar contraseña".
   - Confirmar que llegás a `/reset-password` y ves el form de "Nueva Contraseña" (no el de email).
   - Ingresar nueva contraseña ≥6 caracteres dos veces (que coincidan) → submit.
   - Verificar Card "Contraseña Actualizada".
   - Click en "Volver al inicio de sesión".
   - Login con la contraseña nueva → debe entrar.
   - Logout, login con la contraseña vieja → debe fallar.

4. **Edge cases a probar:**
   - Submit con contraseñas que no coinciden → error inline.
   - Submit con contraseña <6 → error inline.
   - Abrir un link de recovery viejo (>1 hora) → debe redirigir a `/login?error=...`.

---

## Self-Review

**Spec coverage:**
- [x] Una sola ruta `/reset-password` con dos modos → Task 4.
- [x] Detección via `PASSWORD_RECOVERY` → Task 4 (`useEffect` con `onAuthStateChange`).
- [x] Modificar `resetPassword` para pasar por `/auth/callback` → Task 2.
- [x] Agregar `updatePassword` en useAuth → Task 3.
- [x] Validación min 6 + confirmación coincidente → Task 4 (`updateSchema` con refine).
- [x] Card de éxito post-cambio con link a `/login` (opción A) → Task 4 (bloque `if (mode === "update" && isUpdateSuccess)`).
- [x] Recordatorio de traducir template de Supabase → Task 5 step 3.
- [x] Sin cambios en `auth/callback/route.ts` → confirmado en File Structure.

**Placeholder scan:** ningún "TBD"/"TODO"/"implementar luego". Todos los bloques de código están completos.

**Type consistency:**
- `updatePassword(newPassword: string)` definida en Task 3, usada en Task 4 como `await updatePassword(data.password)` ✅
- `setMode("update")` consistente entre Task 4 useEffect y los renders condicionales ✅
- `isUpdateSuccess`/`isRequestSuccess` consistentes entre estado y renders ✅
