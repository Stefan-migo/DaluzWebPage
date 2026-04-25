"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ShieldCheck } from "lucide-react";

export default function VerifyTwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("pending_2fa_password");
    if (!stored) {
      router.replace("/login");
      return;
    }
    setPassword(stored);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/2fa/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo verificar el código");
        setLoading(false);
        return;
      }

      sessionStorage.removeItem("pending_2fa_password");
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("2FA verify error:", err);
      setError("Error de conexión. Intentá de nuevo.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!password) return;
    setError(null);
    setInfo(null);
    setResending(true);

    try {
      const stored = sessionStorage.getItem("pending_2fa_email");
      if (!stored) {
        setError("Sesión expirada. Volvé a iniciar sesión.");
        setResending(false);
        setTimeout(() => router.push("/login"), 1500);
        return;
      }
      const res = await fetch("/api/auth/2fa/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: stored, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "No se pudo reenviar el código");
      } else {
        setInfo("Te enviamos un nuevo código.");
      }
    } catch (err) {
      console.error("2FA resend error:", err);
      setError("Error de conexión.");
    } finally {
      setResending(false);
    }
  };

  return (
    <Card className="w-full shadow-alkimya">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-center mb-2">
          <ShieldCheck className="h-10 w-10 text-brand-primary" />
        </div>
        <CardTitle className="font-title text-brand-primary text-center">
          Verificación en dos pasos
        </CardTitle>
        <CardDescription className="text-text-primary/70 font-text text-center">
          Ingresá el código de 6 dígitos que enviamos a tu email.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {info && (
            <Alert>
              <AlertDescription>{info}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="code" className="text-text-primary font-text">
              Código de verificación
            </Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="text-center text-2xl tracking-[0.5em] font-mono"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-text"
            disabled={loading || code.length !== 6}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verificando...
              </>
            ) : (
              "Verificar e ingresar"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-text-primary/70 font-text">
          ¿No te llegó el código?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-brand-primary hover:text-brand-secondary underline disabled:opacity-50"
          >
            {resending ? "Reenviando..." : "Reenviar"}
          </button>
        </div>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem("pending_2fa_password");
              sessionStorage.removeItem("pending_2fa_email");
              router.push("/login");
            }}
            className="text-text-primary/70 hover:text-text-primary font-text"
          >
            ← Volver al login
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
