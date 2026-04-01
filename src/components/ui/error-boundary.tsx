"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error for debugging (avoid logging sensitive data)
    console.error("Page error:", {
      message: error.message,
      digest: error.digest,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-crema to-white px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 rounded-full bg-rojo/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-rojo" />
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-display text-tierra-oscura">
            Algo salió mal
          </h1>
          <p className="text-tierra-media">
            Lo sentimos, encontramos un error inesperado. Por favor intenta
            nuevamente.
          </p>
        </div>

        {/* Error ID for debugging */}
        {error.digest && (
          <p className="text-xs text-gray-400 font-mono">
            Referencia: {error.digest}
          </p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button
            onClick={reset}
            variant="default"
            className="bg-dorado hover:bg-dorado/90 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-dorado text-dorado hover:bg-dorado/10"
          >
            <Home className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>

        {/* Support Link */}
        <p className="text-sm text-gray-500 pt-4">
          Si el problema persiste,{" "}
          <a href="/ayuda" className="text-dorado hover:underline">
            contáctanos
          </a>
        </p>
      </div>
    </div>
  );
}
