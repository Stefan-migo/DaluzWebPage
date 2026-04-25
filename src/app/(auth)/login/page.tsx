"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Eye, EyeOff, Mail, Lock } from "lucide-react";
import './login.css';

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
      if (result.error || !result.data?.user) {
        return;
      }

      const supabase = createClient();
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("two_factor_enabled")
        .eq("id", result.data.user.id)
        .single();

      if (profileRow?.two_factor_enabled) {
        await supabase.auth.signOut();
        const sendRes = await fetch("/api/auth/2fa/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email, password: data.password }),
        });
        if (!sendRes.ok) {
          const err = await sendRes.json().catch(() => ({}));
          console.error("2FA send-code failed:", err);
          alert(err.error || "No se pudo enviar el código de verificación");
          return;
        }
        sessionStorage.setItem("pending_2fa_password", data.password);
        sessionStorage.setItem("pending_2fa_email", data.email);
        router.push("/verify-2fa");
        return;
      }

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 100);
    } catch (err) {
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
    <Card className="login-card w-full shadow-alkimya">
      <CardHeader className="login-header space-y-2">
        <CardTitle className="login-title font-title text-brand-primary">
          Iniciar Sesión
        </CardTitle>
        <CardDescription className="login-description text-text-primary/70 font-text">
          Accede a tu cuenta de DA LUZ CONSCIENTE
        </CardDescription>
      </CardHeader>

      <CardContent className="login-content space-y-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive" className="login-alert">
              <AlertDescription className="login-alert-text">
                {error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Email Field */}
          <div className="login-field-group">
            <Label htmlFor="email" className="login-field-label text-text-primary font-text">
              Email
            </Label>
            <div className="login-input-wrapper">
              <Mail className="login-input-icon text-text-primary" />
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register("email")}
                className={`login-input ${errors.email ? "login-input--error" : ""}`}
              />
            </div>
            {errors.email && (
              <p className="login-error-text font-text">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="login-field-group">
            <Label htmlFor="password" className="login-field-label text-text-primary font-text">
              Contraseña
            </Label>
            <div className="login-input-wrapper">
              <Lock className="login-input-icon text-text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Tu contraseña"
                {...register("password")}
                className={`login-input--with-toggle ${errors.password ? "login-input--error" : ""}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="login-toggle-password text-text-primary"
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
              <p className="login-error-text font-text">{errors.password.message}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="login-forgot-row">
            <Link
              href="/reset-password"
              className="login-forgot-link text-brand-primary hover:text-brand-secondary font-text"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="login-submit-btn bg-brand-primary hover:bg-brand-secondary text-white font-text"
            disabled={loading}
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

        {/* Divider */}
        <div className="login-divider">
          <div className="login-divider-line">
            <span className="border-text-primary" />
          </div>
          <div className="login-divider-text-wrapper">
            <span className="login-divider-text font-text">O</span>
          </div>
        </div>

        {/* Google Button */}
        <Button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading || loading}
          className="login-google-btn"
        >
          {googleLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Conectando con Google...</span>
            </>
          ) : (
            <>
              <svg viewBox="0 0 24 24">
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
              <span>Continuar con Google</span>
            </>
          )}
        </Button>

        {/* Signup Link */}
        <div className="login-signup-text">
          <p className="text-text-primary font-text">
            ¿No tienes cuenta?{" "}
            <Link
              href="/signup"
              className="login-signup-link text-brand-primary hover:text-brand-secondary"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}