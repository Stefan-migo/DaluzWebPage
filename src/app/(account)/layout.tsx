"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthContext } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Package, 
  Sparkles, 
  LogOut,
  Loader2,
  Shield 
} from "lucide-react";

interface AccountLayoutProps {
  children: ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const { user, profile, loading, signOut } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-dorado mx-auto" />
            <p className="text-tierra-media">Cargando tu cuenta...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  // Check if user has active membership (placeholder logic)
  const hasActiveMembership = false; // TODO: Implement membership check

  const navigationItems = [
    {
      href: "/perfil",
      label: "Mi Perfil",
      icon: User,
      description: "Información personal y contacto"
    },
    {
      href: "/mis-pedidos",
      label: "Mis Pedidos",
      icon: Package,
      description: "Historial de compras y envíos"
    },
    {
      href: "/mi-membresia",
      label: "Mi Membresía",
      icon: Sparkles,
      description: "Progreso del programa",
      badge: hasActiveMembership ? 'Activa' : undefined
    },
    {
      href: "/configuracion",
      label: "Configuración",
      icon: Settings,
      description: "Preferencias y seguridad"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="min-h-screen bg-gradient-to-b from-white to-verde-suave/10">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardContent className="p-6">
                    {/* User Info */}
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 rounded-full bg-dorado/20 flex items-center justify-center mx-auto mb-4">
                        {profile?.avatar_url ? (
                          <img
                            src={profile.avatar_url}
                            alt="Avatar"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <User className="h-10 w-10 text-azul-profundo" />
                        )}
                      </div>
                      <h2 className="font-semibold text-azul-profundo">
                        {profile?.first_name} {profile?.last_name}
                      </h2>
                      <p className="text-sm text-tierra-media">{user.email}</p>
                      {hasActiveMembership && (
                        <Badge className="mt-2 bg-dorado text-azul-profundo">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Miembro Activo
                        </Badge>
                      )}
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href as any}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-verde-suave/20 transition-colors group"
                        >
                          <item.icon className="h-5 w-5 text-tierra-media group-hover:text-azul-profundo" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-azul-profundo group-hover:text-azul-profundo/80">
                                {item.label}
                              </span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs bg-dorado/20 text-azul-profundo">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-tierra-media">
                              {item.description}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* Sign Out */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleSignOut}
                        variant="ghost"
                        className="w-full justify-start text-tierra-media hover:text-azul-profundo"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Cerrar Sesión
                      </Button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-4 p-3 bg-verde-suave/10 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-verde-suave mt-0.5" />
                        <div className="text-xs text-tierra-media">
                          <p className="font-medium text-azul-profundo mb-1">
                            Cuenta Protegida
                          </p>
                          <p>
                            Tu información está segura con cifrado de extremo a extremo.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {children}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 