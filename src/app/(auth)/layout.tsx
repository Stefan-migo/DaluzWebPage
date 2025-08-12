import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-suave to-turquesa-claro">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* DA LUZ Brand Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-azul-profundo mb-2">
              DA LUZ CONSCIENTE
            </h1>
            <p className="text-tierra-media text-sm">
              Alkimyas para alma y cuerpo
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
} 