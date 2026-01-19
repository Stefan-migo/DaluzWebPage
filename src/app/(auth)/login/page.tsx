"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signInWithGoogle, loading, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await signIn(data.email, data.password);
      if (result.error) {
        // Error is handled by the useAuth hook
        return;
      }
      // Small delay to let auth state update, then redirect
      // The redirect will happen via auth state change, but we can also do it here
      setTimeout(() => {
        router.push("/"); // Redirect to home after successful login
        router.refresh(); // Refresh to update auth state
      }, 100);
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error("Login error:", err);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      await signInWithGoogle();
      // The redirect will happen automatically via OAuth flow
    } catch (err) {
      console.error("Google sign in error:", err);
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-alkimya border-0 overflow-hidden" style={{ borderRadius: '0px 15px', backgroundColor: 'var(--admin-accent-primary)' }}>
      <CardHeader className="space-y-2 pb-6" style={{ backgroundColor: 'var(--admin-accent-primary)' }}>
        <CardTitle className="text-3xl font-title text-center text-brand-primary">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="text-center text-text-primary/70 font-text">
          Accede a tu cuenta de DA LUZ CONSCIENTE
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-bg-light p-6 space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-text-primary font-text font-medium">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-primary/40" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
                className={`pl-10 border-text-primary/20 focus:border-brand-primary focus:ring-brand-primary ${errors.email ? "border-red-500" : ""}`}
                style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600 font-text">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-text-primary font-text font-medium">
              Contraseña
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-primary/40" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                {...register("password")}
                className={`pl-10 pr-10 border-text-primary/20 focus:border-brand-primary focus:ring-brand-primary ${errors.password ? "border-red-500" : ""}`}
                style={{ backgroundColor: 'var(--admin-bg-tertiary)', borderColor: 'var(--admin-text-primary)' }}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-text-primary/60 hover:text-text-primary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600 font-text">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/reset-password"
              className="text-sm text-brand-primary hover:text-brand-secondary font-text underline transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-text font-semibold py-6 text-base transition-all duration-300 shadow-md hover:shadow-lg"
            disabled={loading}
            style={{ borderRadius: '0px 15px' }}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-text-primary/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-bg-light px-2 text-text-primary/60 font-text">O</span>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="w-full py-6 text-base transition-all duration-300 shadow-md hover:shadow-lg"
          style={{ 
            borderRadius: '0px 15px',
            backgroundColor: 'var(--admin-bg-secondary)',
            border: '1px solid var(--admin-bg-secondary)',
            color: 'var(--color-text-inverse)',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600
          }}
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Conectando con Google...
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </>
          )}
        </Button>

        <div className="text-center">
          <p className="text-sm text-text-primary/70 font-text">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="text-brand-primary hover:text-brand-secondary font-semibold underline transition-colors"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 