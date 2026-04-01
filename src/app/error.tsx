"use client";

import ErrorBoundary from "@/components/ui/error-boundary";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <ErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  );
}
