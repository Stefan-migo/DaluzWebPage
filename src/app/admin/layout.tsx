"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  Menu,
  LogOut,
  Bell,
  User,
  ChevronRight,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin navigation items
const navigationItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'Visión general y KPIs'
  },
  {
    href: '/admin/orders',
    label: 'Pedidos',
    icon: ShoppingCart,
    description: 'Gestión de pedidos',
    badge: '12' // This would be dynamic
  },
  {
    href: '/admin/products',
    label: 'Productos',
    icon: Package,
    description: 'Catálogo e inventario'
  },
  {
    href: '/admin/customers',
    label: 'Clientes',
    icon: Users,
    description: 'Gestión de clientes'
  },
  {
    href: '/admin/analytics',
    label: 'Analíticas',
    icon: BarChart3,
    description: 'Reportes y estadísticas'
  },
  {
    href: '/admin/settings',
    label: 'Configuración',
    icon: Settings,
    description: 'Configuración del sistema'
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
  }>({
    isChecking: true,
    isAdmin: false,
    hasChecked: false
  });

  // Add state to prevent multiple simultaneous admin checks
  const [isAdminCheckInProgress, setIsAdminCheckInProgress] = useState(false);
  
  // Add ref to prevent multiple redirects
  const redirectInProgress = useRef(false);
  
  // Debug mode - can be enabled via localStorage
  const debugMode = typeof window !== 'undefined' && localStorage.getItem('admin-debug') === 'true';

  useEffect(() => {
    const checkAdminStatus = async () => {
      // Don't check admin status if auth is still loading
      if (loading) {
        setAdminState(prev => ({ ...prev, isChecking: true, hasChecked: false }));
        return;
      }

      // Wait a bit longer after auth loads to ensure auth state is stable
      if (!user) {
        console.log('🔍 No user found, waiting for auth to stabilize...');
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: true
        });
        return;
      }

      // Additional check: ensure we have a valid user with email
      if (!user.email) {
        console.log('🔍 User found but no email, waiting...');
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: false // Don't mark as checked yet
        });
        return;
      }

      // Prevent multiple simultaneous admin checks
      if (isAdminCheckInProgress) {
        console.log('🔄 Admin check already in progress, skipping...');
        return;
      }

      // Start admin check
      setIsAdminCheckInProgress(true);
      setAdminState(prev => ({ ...prev, isChecking: true, hasChecked: false }));
      
      try {
        console.log('🔍 Checking admin status for user:', user.email);
      
      if (debugMode) {
        console.log('🐛 DEBUG MODE: Bypassing admin check for debugging');
        setAdminState({
          isChecking: false,
          isAdmin: true, // Force admin access in debug mode
          hasChecked: true
        });
        setIsAdminCheckInProgress(false);
        return;
      }
        
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();

        // Add timeout to admin check to prevent infinite loading
        const adminCheckPromise = supabase.rpc('is_admin', { user_id: user.id });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Admin check timeout')), 10000)
        );

        const { data, error } = await Promise.race([adminCheckPromise, timeoutPromise]) as any;
        
        let isAdminResult = false;
        
        if (error) {
          if (error.message === 'Admin check timeout') {
            console.error('⏱️ Admin check timed out');
          } else {
            console.error('❌ Error checking admin status:', error);
          }
          isAdminResult = false;
        } else {
          console.log('✅ Admin check result:', !!data);
          isAdminResult = !!data;
        }

        // Atomic state update - set both checking and result together
        setAdminState({
          isChecking: false,
          isAdmin: isAdminResult,
          hasChecked: true
        });
        setIsAdminCheckInProgress(false);

        console.log('🏁 Admin check completed, isAdmin:', isAdminResult);
        
      } catch (error: any) {
        if (error.message === 'Admin check timeout') {
          console.error('⏱️ Admin check timed out - assuming not admin');
        } else {
          console.error('❌ Error checking admin status:', error);
        }
        
        // Atomic state update for error case
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: true
        });
        setIsAdminCheckInProgress(false);
      }
    };

    checkAdminStatus();
  }, [user, loading]);

  useEffect(() => {
    // Only redirect after both auth and admin checks are COMPLETELY finished
    if (!loading && adminState.hasChecked && !adminState.isChecking && !redirectInProgress.current) {
      console.log('🔄 Admin redirect check:', { 
        user: !!user, 
        userEmail: user?.email,
        isAdmin: adminState.isAdmin, 
        loading, 
        isChecking: adminState.isChecking,
        hasChecked: adminState.hasChecked
      });
      
      // Add a small delay to let auth fully stabilize
      const delayRedirect = () => {
        setTimeout(() => {
          if (!user || !user.email) {
            console.log('🚪 No user or email found after delay, redirecting to login');
            redirectInProgress.current = true;
            router.push('/login');
            return;
          }

          // Check admin access - only redirect if we've definitely checked and user is not admin
          if (!adminState.isAdmin) {
            console.log('🚫 User not admin after delay, redirecting to home');
            redirectInProgress.current = true;
            router.push('/');
            return;
          }
          
          console.log('✅ Admin access confirmed after delay, showing dashboard');
          // Reset redirect flag when we successfully show dashboard
          redirectInProgress.current = false;
        }, 500); // 500ms delay to let auth stabilize
      };
      
      if (!user || !user.email) {
        delayRedirect();
      } else if (!adminState.isAdmin) {
        delayRedirect();
      } else {
        console.log('✅ Admin access confirmed immediately, showing dashboard');
        redirectInProgress.current = false;
      }
    }
  }, [user, adminState, loading, router]);

  // Reset redirect flag when user changes
  useEffect(() => {
    redirectInProgress.current = false;
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Show loading while auth or admin check is in progress
  if (loading || adminState.isChecking || !adminState.hasChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dorado mx-auto"></div>
          <div className="space-y-2">
            <p className="text-azul-profundo font-semibold">
              {loading ? 'Cargando autenticación...' : 'Verificando permisos de admin...'}
            </p>
            <p className="text-tierra-media text-sm">
              {loading ? 'Iniciando sesión...' : user?.email ? `Verificando acceso para ${user.email}` : 'Verificando permisos...'}
            </p>
            <div className="text-xs text-gray-500 mt-2">
              Estado: {loading ? 'Auth loading' : adminState.isChecking ? 'Admin checking' : adminState.hasChecked ? 'Check complete' : 'Not checked'} | 
              User: {user ? '✓' : '✗'} | 
              Admin: {adminState.isAdmin ? '✓' : '✗'} |
              Checked: {adminState.hasChecked ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If auth is loaded but user is not found or not admin, let the redirect useEffect handle it
  // Don't render the admin interface until we confirm admin access
  if (!user || !adminState.isAdmin) {
    console.log('🚨 Access denied - showing redirect screen:', { 
      user: !!user, 
      isAdmin: adminState.isAdmin, 
      loading, 
      isChecking: adminState.isChecking,
      hasChecked: adminState.hasChecked,
      userEmail: user?.email 
    });
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-red-600">
            {!user ? 'Redirigiendo al login...' : 'Acceso no autorizado, redirigiendo...'}
          </p>
          <div className="text-xs text-gray-500">
            User: {user ? '✓' : '✗'} | 
            Admin: {adminState.isAdmin ? '✓' : '✗'} | 
            Loading: {loading ? '✓' : '✗'} | 
            Checking: {adminState.isChecking ? '✓' : '✗'} |
            HasChecked: {adminState.hasChecked ? '✓' : '✗'}
          </div>
        </div>
      </div>
    );
  }

  // If we reach here, user is authenticated and is admin
  console.log('🎉 Admin dashboard rendering for:', user.email);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <AdminSidebar pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
              </SheetContent>
            </Sheet>
            
            <h1 className="text-xl font-semibold text-azul-profundo">Admin</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0">
          <AdminSidebar pathname={pathname} />
        </div>

        {/* Main Content */}
        <div className="lg:pl-72">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white border-b border-gray-200">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-azul-profundo">
                    DA LUZ CONSCIENTE
                  </h1>
                  <p className="text-sm text-tierra-media">Panel de Administración</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  </Button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-azul-profundo">
                        {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email}
                      </p>
                      <p className="text-xs text-tierra-media">
                        Administrador
                      </p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleSignOut}>
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="flex-1 py-6">
            <div className="px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function AdminSidebar({ 
  pathname, 
  onNavigate 
}: { 
  pathname: string; 
  onNavigate?: () => void;
}) {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-dorado to-verde-suave rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DL</span>
          </div>
          <span className="font-semibold text-azul-profundo">DA LUZ</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <div className="bg-gradient-to-r from-dorado/10 to-verde-suave/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-azul-profundo mb-2">Resumen Rápido</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-tierra-media">Pedidos Hoy</span>
              <span className="font-medium text-azul-profundo">12</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-tierra-media">Ventas</span>
              <span className="font-medium text-verde-suave">$48,320</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-tierra-media">Stock Bajo</span>
              <span className="font-medium text-red-500">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-1">
          {/* Quick Return to Site */}
          <li className="mb-4">
            <Link
              href="/"
              className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-tierra-media hover:text-azul-profundo hover:bg-gray-50 transition-colors"
              onClick={onNavigate}
            >
              <Home className="h-5 w-5 shrink-0" />
              <span>Volver al Sitio</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100" />
            </Link>
          </li>

          {navigationItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'group flex gap-x-3 rounded-md p-3 text-sm leading-6 font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-dorado/20 to-verde-suave/20 text-azul-profundo border-r-2 border-dorado'
                      : 'text-tierra-media hover:text-azul-profundo hover:bg-gray-50'
                  )}
                >
                  <item.icon 
                    className={cn(
                      'h-5 w-5 shrink-0',
                      isActive ? 'text-dorado' : 'text-tierra-media group-hover:text-azul-profundo'
                    )} 
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="bg-red-100 text-red-700 border-red-200"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-tierra-media mt-1">
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
      <div className="border-t border-gray-200 p-6">
        <div className="text-center">
          <p className="text-xs text-tierra-media">
            DA LUZ CONSCIENTE v1.0
          </p>
          <p className="text-xs text-tierra-media mt-1">
            Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
