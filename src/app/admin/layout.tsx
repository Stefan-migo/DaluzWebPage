"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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
  Home,
  MessageSquare,
  Server,
  Tag
} from 'lucide-react';
import AdminNotificationDropdown from '@/components/admin/AdminNotificationDropdown';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Admin navigation items - will be populated dynamically
const createNavigationItems = (ordersCount?: number) => [
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
    badge: ordersCount !== undefined ? ordersCount.toString() : undefined
  },
  {
    href: '/admin/products',
    label: 'Productos',
    icon: Package,
    description: 'Catálogo e inventario'
  },
  {
    href: '/admin/categories',
    label: 'Categorías',
    icon: Tag,
    description: 'Gestión de categorías'
  },
  {
    href: '/admin/reviews',
    label: 'Reseñas',
    icon: MessageSquare,
    description: 'Moderación de reseñas'
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
    href: '/admin/support',
    label: 'Soporte',
    icon: MessageSquare,
    description: 'Tickets y atención al cliente'
  },
  {
    href: '/admin/admin-users',
    label: 'Administradores',
    icon: Users,
    description: 'Gestión de usuarios admin'
  },
  {
    href: '/admin/system',
    label: 'Sistema',
    icon: Server,
    description: 'Administración del sistema'
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
    checkedUserId: string | null; // Track which user ID was checked
  }>({
    isChecking: true,
    isAdmin: false,
    hasChecked: false,
    checkedUserId: null
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
    lowStock: 0
  });

  // Add state to prevent multiple simultaneous admin checks
  const [isAdminCheckInProgress, setIsAdminCheckInProgress] = useState(false);
  
  // Add ref to prevent multiple redirects
  const redirectInProgress = useRef(false);
  
  // Debug mode - can be enabled via localStorage
  const debugMode = typeof window !== 'undefined' && localStorage.getItem('admin-debug') === 'true';

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!adminState.isAdmin) return;

      try {
        const response = await fetch('/api/admin/dashboard');
        if (response.ok) {
          const data = await response.json();
          setStats({
            todayOrders: data.todayOrders || 0,
            totalOrders: data.pendingOrders || 0,
            revenue: data.revenue || 0,
            lowStock: data.lowStockProducts?.length || 0
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 60 seconds
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [adminState.isAdmin]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('🔍 Admin layout useEffect triggered:', { loading, user: !!user, profile: !!profile });
      
      // Don't check admin status if auth is still loading
      if (loading) {
        console.log('⏳ Auth still loading, waiting...');
        // Don't set state here to avoid unnecessary re-renders
        return;
      }

      // Wait a bit longer after auth loads to ensure auth state is stable
      if (!user) {
        console.log('🔍 No user found, setting admin state to false');
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: true,
          checkedUserId: null
        });
        return;
      }

      // Additional check: ensure we have a valid user with email
      if (!user.email) {
        console.log('🔍 User found but no email, waiting...');
        setAdminState({
          isChecking: false,
          isAdmin: false,
          hasChecked: false, // Don't mark as checked yet
          checkedUserId: null
        });
        return;
      }

      // 🚀 KEY FIX: Skip admin check if we already checked this exact user ID
      // This prevents re-checking during token refresh events
      if (adminState.hasChecked && adminState.checkedUserId === user.id && adminState.isAdmin) {
        console.log('✅ Admin status already verified for user ID:', user.id, '- skipping re-check');
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
          hasChecked: true,
          checkedUserId: user.id
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
          hasChecked: true,
          checkedUserId: user.id // 🚀 KEY FIX: Store the user ID we checked
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
          hasChecked: true,
          checkedUserId: user.id
        });
        setIsAdminCheckInProgress(false);
      }
    };

    checkAdminStatus();
  }, [user?.id, loading]); // 🚀 KEY FIX: Only depend on user.id instead of entire user object

  useEffect(() => {
    // Skip if redirect is already in progress
    if (redirectInProgress.current) {
      return;
    }

    // Only redirect after both auth and admin checks are COMPLETELY finished
    if (!loading && adminState.hasChecked && !adminState.isChecking) {
      console.log('🔄 Admin redirect check:', { 
        user: !!user, 
        userEmail: user?.email,
        isAdmin: adminState.isAdmin, 
        loading, 
        isChecking: adminState.isChecking,
        hasChecked: adminState.hasChecked
      });
      
      // If user is admin, just mark as done and return early
      if (user && user.email && adminState.isAdmin) {
        console.log('✅ Admin access confirmed immediately, showing dashboard');
        return;
      }

      // Add a small delay to let auth fully stabilize before redirecting
      const delayRedirect = () => {
        redirectInProgress.current = true;
        setTimeout(() => {
          if (!user || !user.email) {
            console.log('🚪 No user or email found after delay, redirecting to login');
            router.push('/login');
            return;
          }

          // Check admin access - only redirect if we've definitely checked and user is not admin
          if (!adminState.isAdmin) {
            console.log('🚫 User not admin after delay, redirecting to home');
            router.push('/');
            return;
          }
        }, 500); // 500ms delay to let auth stabilize
      };
      
      if (!user || !user.email || !adminState.isAdmin) {
        delayRedirect();
      }
    }
  }, [user?.id, adminState.hasChecked, adminState.isChecking, adminState.isAdmin, loading, router]);

  // Reset redirect flag when user changes
  useEffect(() => {
    redirectInProgress.current = false;
  }, [user?.id]);

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
    <div className="admin-layout">
      {/* Mobile Header */}
      <div className="lg:hidden admin-header">
        <div className="admin-header-content">
          <div className="flex items-center space-x-3">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" color="#F0EACE" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <AdminSidebar pathname={pathname} onNavigate={() => setSidebarOpen(false)} stats={stats} />
              </SheetContent>
            </Sheet>
            
            <h1 className="admin-header-title">Admin</h1>
          </div>
          
          <div className="admin-header-actions">
            <AdminNotificationDropdown />
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="h-5 w-5" color="#F0EACE" />
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
        <div className="lg:pl-72"
        style={{width: '-webkit-fill-available'}}
        >
          {/* Desktop Header */}
          <div className="hidden lg:block admin-header">
            <div className="admin-header-content">
              <div>
                <h1 className="admin-header-title font-malisha text-[#F0EACE]">
                  DA LUZ CONSCIENTE
                </h1>
                <p className="admin-header-subtitle font-caption text-[#F0EACE]">Panel de Administración</p>
              </div>
              
              <div className="admin-header-actions">
                <AdminNotificationDropdown />
                
                <div className="admin-header-user">
                  <div className="admin-header-user-info">
                    <p className="admin-header-user-name font-caption text-[#F0EACE]">
                      {profile?.first_name ? `${profile.first_name} ${profile.last_name || ''}`.trim() : user.email}
                    </p>
                    <p className="admin-header-user-role font-caption text-[#F0EACE]">
                      Administrador
                    </p>
                  </div>
                  <Link href="/perfil">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="hover:bg-[#AE000020] transition-colors"
                      title="Ver perfil"
                    >
                      <User className="h-5 w-5" color="#F0EACE" />
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleSignOut}
                    className="hover:bg-[#AE000020] transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut className="h-5 w-5" color="#F0EACE" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

// Sidebar Component
function AdminSidebar({ 
  pathname, 
  onNavigate,
  stats
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
                  style={{color: '#F0EACE'}}
                />
          </div>
          <span className="font-malisha text-[#F0EACE]">DA LUZ</span>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <div className="admin-card">
          <div className="admin-card-content">
            <h3 className="admin-card-title">Resumen Rápido</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Pedidos Hoy</span>
                <span className="font-medium text-gray-900">{stats.todayOrders}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Ventas</span>
                <span className="font-medium text-green-600">
                  ${stats.revenue.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Stock Bajo</span>
                <span className="font-medium text-red-500">{stats.lowStock}</span>
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
            <Link
              href="/"
              className="admin-nav-item"
              onClick={onNavigate}
            >
              <Home className="h-5 w-5 shrink-0" />
              <span>Volver al Sitio</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-50 group-hover:opacity-100" />
            </Link>
          </li>

          {createNavigationItems(stats.totalOrders).map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    'admin-nav-item',
                    isActive && 'active'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="admin-badge admin-badge-error"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
          <p className="text-xs text-gray-500">
            DA LUZ CONSCIENTE v1.0
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
