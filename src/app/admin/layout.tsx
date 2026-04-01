"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Menu,
  LogOut,
  Bell,
  User,
  ChevronRight,
  Home,
  MessageSquare,
  Server,
  Tag,
  Settings,
  UserCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminNotificationDropdown from "@/components/admin/AdminNotificationDropdown";
import {
  ADMIN_STATS_REFRESH_INTERVAL,
  ADMIN_CHECK_TIMEOUT,
} from "@/constants/admin";

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin navigation items - will be populated dynamically
const createNavigationItems = (ordersCount?: number) => [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Visión general y KPIs",
  },
  {
    href: "/admin/orders",
    label: "Pedidos",
    icon: ShoppingCart,
    description: "Gestión de pedidos",
    badge: ordersCount !== undefined ? ordersCount.toString() : undefined,
  },
  {
    href: "/admin/products",
    label: "Productos",
    icon: Package,
    description: "Catálogo e inventario",
  },
  {
    href: "/admin/categories",
    label: "Categorías",
    icon: Tag,
    description: "Gestión de categorías",
  },
  {
    href: "/admin/reviews",
    label: "Reseñas",
    icon: MessageSquare,
    description: "Moderación de reseñas",
  },
  {
    href: "/admin/customers",
    label: "Clientes",
    icon: Users,
    description: "Gestión de clientes",
  },
  {
    href: "/admin/analytics",
    label: "Analíticas",
    icon: BarChart3,
    description: "Reportes y estadísticas",
  },
  {
    href: "/admin/support",
    label: "Soporte",
    icon: MessageSquare,
    description: "Tickets y atención al cliente",
  },
  {
    href: "/admin/admin-users",
    label: "Administradores",
    icon: Users,
    description: "Gestión de usuarios admin",
  },
  {
    href: "/admin/system",
    label: "Sistema",
    icon: Server,
    description: "Administración del sistema",
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile, loading, signOut } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Admin state management - using combined state to prevent race conditions
  const [adminState, setAdminState] = useState<{
    isChecking: boolean;
    isAdmin: boolean;
    hasChecked: boolean;
    checkedUserId: string | null; // Track which user ID was checked
  }>({
    isChecking: true,
    isAdmin: false,
    hasChecked: false,
    checkedUserId: null,
  });

  // Dynamic stats state
  const [stats, setStats] = useState<{
    todayOrders: number;
    totalOrders: number;
    revenue: number;
    lowStock: number;
  }>({
    todayOrders: 0,
    totalOrders: 0,
    revenue: 0,
    lowStock: 0,
  });

  // Add state to prevent multiple simultaneous admin checks
  const [isAdminCheckInProgress, setIsAdminCheckInProgress] = useState(false);

  // Add ref to prevent multiple redirects
  const redirectInProgress = useRef(false);

  // Debug mode - can be enabled via localStorage
  const debugMode =
    typeof window !== "undefined" &&
    localStorage.getItem("admin-debug") === "true";

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!adminState.isAdmin) return;

      try {
        const response = await fetch("/api/admin/dashboard");
        if (response.ok) {
          const data = await response.json();
          setStats({
            todayOrders: data.todayOrders || 0,
            totalOrders: data.pendingOrders || 0,
            revenue: data.revenue || 0,
            lowStock: data.lowStockProducts?.length || 0,
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
    // Refresh stats every 60 seconds
    const interval = setInterval(fetchStats, ADMIN_STATS_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [adminState.isAdmin]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Don't check admin status if auth is still loading
      if (loading) {
        return;
      }

      // Wait a bit longer after auth loads to ensure auth state is stable
      if (!user || !user.id) {
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: true,
          checkedUserId: null,
        });
        return;
      }

      // Additional check: ensure we have a valid user with email
      // But don't wait for email - we can check admin with just user ID
      if (!user.email) {
        setTimeout(() => {
          // Continue with admin check even without email
        }, 500);
      }

      // Skip admin check if we already checked this exact user ID
      if (
        adminState.hasChecked &&
        adminState.checkedUserId === user.id &&
        adminState.isAdmin
      ) {
        return;
      }

      // Prevent multiple simultaneous admin checks
      if (isAdminCheckInProgress) {
        return;
      }

      // Start admin check
      setIsAdminCheckInProgress(true);
      setAdminState((prev) => ({
        ...prev,
        isChecking: true,
        hasChecked: false,
      }));

      try {
        const { createClient } = await import("@/utils/supabase/client");
        const supabase = createClient();

        // Add timeout to admin check - reduced to 5 seconds for faster response
        const adminCheckPromise = supabase.rpc("is_admin", {
          user_id: user.id,
        });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Admin check timeout")),
            ADMIN_CHECK_TIMEOUT,
          ),
        );

        const { data, error } = (await Promise.race([
          adminCheckPromise,
          timeoutPromise,
        ])) as any;

        let isAdminResult = false;

        if (error) {
          isAdminResult = false;
        } else {
          isAdminResult = !!data;
        }

        // Atomic state update - set both checking and result together
        setAdminState({
          isChecking: false,
          isAdmin: isAdminResult,
          hasChecked: true,
          checkedUserId: user.id,
        });
        setIsAdminCheckInProgress(false);
      } catch (error: any) {
        // Atomic state update for error case
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: true,
          checkedUserId: user.id,
        });
        setIsAdminCheckInProgress(false);
      }
    };

    checkAdminStatus();
  }, [user?.id, loading]);

  useEffect(() => {
    // Skip if redirect is already in progress
    if (redirectInProgress.current) {
      return;
    }

    // Only redirect after both auth and admin checks are COMPLETELY finished
    if (!loading && adminState.hasChecked && !adminState.isChecking) {
      // If user is admin, just mark as done and return early
      if (user && user.email && adminState.isAdmin) {
        return;
      }

      // Add a small delay to let auth fully stabilize before redirecting
      const delayRedirect = () => {
        redirectInProgress.current = true;
        setTimeout(() => {
          if (!user || !user.email) {
            router.push("/login");
            return;
          }

          // Check admin access - only redirect if we've definitely checked and user is not admin
          if (!adminState.isAdmin) {
            router.push("/");
            return;
          }
        }, 500);
      };

      if (!user || !user.email || !adminState.isAdmin) {
        delayRedirect();
      }
    }
  }, [
    user?.id,
    adminState.hasChecked,
    adminState.isChecking,
    adminState.isAdmin,
    loading,
    router,
  ]);

  // Reset redirect flag when user changes
  useEffect(() => {
    redirectInProgress.current = false;
  }, [user?.id]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Show loading while auth or admin check is in progress
  if (loading || adminState.isChecking || !adminState.hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dorado mx-auto"></div>
          <div className="space-y-2">
            <p className="text-azul-profundo font-semibold">
              {loading
                ? "Cargando autenticación..."
                : "Verificando permisos de admin..."}
            </p>
            <p className="text-tierra-media text-sm">
              {loading
                ? "Iniciando sesión..."
                : user?.email
                  ? `Verificando acceso para ${user.email}`
                  : "Verificando permisos..."}
            </p>
            <div className="text-xs text-tierra-media mt-2">
              Estado:{" "}
              {loading
                ? "Auth loading"
                : adminState.isChecking
                  ? "Admin checking"
                  : adminState.hasChecked
                    ? "Check complete"
                    : "Not checked"}{" "}
              | User: {user ? "✓" : "✗"} | Admin:{" "}
              {adminState.isAdmin ? "✓" : "✗"} | Checked:{" "}
              {adminState.hasChecked ? "✓" : "✗"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If auth is loaded but user is not found or not admin, let the redirect useEffect handle it
  // Don't render the admin interface until we confirm admin access
  if (!user || !adminState.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-red-600">
            {!user
              ? "Redirigiendo al login..."
              : "Acceso no autorizado, redirigiendo..."}
          </p>
          <div className="text-xs text-tierra-media">
            User: {user ? "✓" : "✗"} | Admin: {adminState.isAdmin ? "✓" : "✗"} |
            Loading: {loading ? "✓" : "✗"} | Checking:{" "}
            {adminState.isChecking ? "✓" : "✗"} | HasChecked:{" "}
            {adminState.hasChecked ? "✓" : "✗"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="lg:hidden admin-header">
        <div className="admin-header-content">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu
                    className="h-5 w-5"
                    style={{ color: "var(--admin-text-inverse)" }}
                  />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <AdminSidebar
                  pathname={pathname}
                  onNavigate={() => setSidebarOpen(false)}
                  stats={stats}
                />
              </SheetContent>
            </Sheet>

            <h1
              className="admin-header-title"
              style={{ color: "var(--admin-text-inverse)" }}
            >
              Admin
            </h1>
          </div>

          <div className="admin-header-actions">
            <AdminNotificationDropdown />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut
                className="h-5 w-5"
                style={{ color: "var(--admin-text-inverse)" }}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
          <AdminSidebar pathname={pathname} stats={stats} />
        </div>

        {/* Main Content */}
        <div className="lg:pl-72" style={{ width: "-webkit-fill-available" }}>
          {/* Desktop Header */}
          <div className="hidden lg:block admin-header">
            <div className="admin-header-content">
              <div>
                <h1
                  className="admin-header-title font-malisha"
                  style={{ color: "var(--admin-text-inverse)" }}
                >
                  DA LUZ CONSCIENTE
                </h1>
                <p
                  className="admin-header-subtitle font-caption"
                  style={{ color: "var(--admin-text-inverse)", opacity: 0.8 }}
                >
                  Panel de Administración
                </p>
              </div>

              <div className="admin-header-actions">
                {/* Notificaciones */}
                <AdminNotificationDropdown />

                {/* Usuario - Dropdown Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="admin-header-user-dropdown"
                      aria-label="Menú de usuario"
                    >
                      <div className="admin-header-user-avatar">
                        {profile?.first_name
                          ? `${profile.first_name[0]}${profile.last_name?.[0] || ""}`.toUpperCase()
                          : user.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="admin-header-dropdown-content"
                    align="end"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="admin-header-dropdown-label">
                      <div className="admin-header-dropdown-user">
                        <div className="admin-header-dropdown-avatar">
                          {profile?.first_name
                            ? `${profile.first_name[0]}${profile.last_name?.[0] || ""}`.toUpperCase()
                            : user.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="admin-header-dropdown-user-info">
                          <p className="admin-header-dropdown-name">
                            {profile?.first_name
                              ? `${profile.first_name} ${profile.last_name || ""}`.trim()
                              : user.email?.split("@")[0] || "Usuario"}
                          </p>
                          <p className="admin-header-dropdown-role">
                            Administrador
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="admin-header-dropdown-separator" />
                    <DropdownMenuItem
                      asChild
                      className="admin-header-dropdown-item"
                    >
                      <Link href="/perfil">
                        <UserCircle className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="admin-header-dropdown-item"
                    >
                      <Link href="/configuracion">
                        <Settings className="h-4 w-4 mr-2" />
                        Configuración
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="admin-header-dropdown-separator" />
                    <DropdownMenuItem
                      onSelect={handleSignOut}
                      className="admin-header-dropdown-logout"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="admin-content">{children}</main>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function AdminSidebar({
  pathname,
  onNavigate,
  stats,
}: {
  pathname: string;
  onNavigate?: () => void;
  stats: {
    todayOrders: number;
    totalOrders: number;
    revenue: number;
    lowStock: number;
  };
}) {
  return (
    <div className="admin-sidebar flex grow flex-col gap-y-5 overflow-y-auto">
      {/* Logo */}
      <div className="admin-sidebar-header">
        <Link href="/" className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-icon">
            <Image
              src="/svg/logo.svg"
              alt="DA LUZ Logo"
              width={60}
              height={60}
              className="transition-transform duration-300 hover:scale-105"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
          <span
            className="font-title"
            style={{ color: "var(--admin-text-inverse)" }}
          >
            DA LUZ
          </span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <div
          className="admin-card"
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderColor: "rgba(253,243,227,0.3)",
          }}
        >
          <div className="admin-card-content">
            <h3
              className="admin-card-title"
              style={{ color: "var(--admin-text-inverse)" }}
            >
              Resumen Rápido
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span
                  style={{ color: "var(--admin-text-inverse)", opacity: 0.7 }}
                >
                  Pedidos Hoy
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--admin-text-inverse)" }}
                >
                  {stats.todayOrders}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span
                  style={{ color: "var(--admin-text-inverse)", opacity: 0.7 }}
                >
                  Ventas
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--admin-accent-primary)" }}
                >
                  $
                  {stats.revenue.toLocaleString("es-AR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span
                  style={{ color: "var(--admin-text-inverse)", opacity: 0.7 }}
                >
                  Stock Bajo
                </span>
                <span
                  className="font-medium"
                  style={{ color: "var(--admin-accent-tertiary)" }}
                >
                  {stats.lowStock}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {/* Quick Return to Site */}
          <li className="mb-4">
            <Link href="/" className="admin-nav-item" onClick={onNavigate}>
              <Home className="h-5 w-5 shrink-0" />
              <span>Volver al Sitio</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100" />
            </Link>
          </li>

          {createNavigationItems(stats.totalOrders).map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn("admin-nav-item", isActive && "active")}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="admin-badge admin-badge-error"
                          style={{
                            backgroundColor: "var(--admin-accent-tertiary)",
                            color: "white",
                          }}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p
                      className="text-xs mt-1"
                      style={{
                        color: "var(--admin-text-inverse)",
                        opacity: 0.6,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div
        className="border-t p-4"
        style={{ borderColor: "var(--admin-border-secondary)" }}
      >
        <div className="text-center">
          <p
            className="text-[10px]"
            style={{ color: "var(--admin-text-inverse)", opacity: 0.6 }}
          >
            DA LUZ CONSCIENTE v2.0
          </p>
          <p
            className="text-[10px] mt-1"
            style={{ color: "var(--admin-text-inverse)", opacity: 0.6 }}
          >
            Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
