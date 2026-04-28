"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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
  return (
    <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin text-azul-profundo" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const { resetPassword, updatePassword, loading, error } = useAuth();
  const searchParams = useSearchParams();
  const initialMode: Mode = searchParams.get("recovery") === "1" ? "update" : "request";
  const [mode, setMode] = useState<Mode>(initialMode);
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
