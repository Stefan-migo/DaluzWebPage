import { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-light">
      <div className="flex min-h-screen items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* DA LUZ Brand Header */}
          <div className="text-center mb-4">
            <Link href="/" className="inline-block">
              <h1 className="text-4xl font-display font-bold text-brand-primary mb-2 transition-colors hover:text-brand-secondary">
                DA LUZ CONSCIENTE
              </h1>
            </Link>
            <p className="text-text-primary/70 text-sm font-text">
              Alkimyas para alma y cuerpo
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
} 