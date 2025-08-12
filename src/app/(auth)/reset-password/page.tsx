"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft } from "lucide-react";

const resetSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
});

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const { resetPassword, loading, error } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      await resetPassword(data.email);
      setIsSuccess(true);
    } catch (err) {
      console.error("Password reset error:", err);
    }
  };

  if (isSuccess) {
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
                onClick={() => setIsSuccess(false)}
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
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