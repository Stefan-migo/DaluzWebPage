"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  ShoppingCart, 
  Package, 
  Users,
  AlertTriangle,
  Eye,
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

// Default fallback data structure
const defaultDashboardData = {
  kpis: {
    revenue: {
      current: 0,
      previous: 0,
      change: 0,
      currency: 'ARS'
    },
    orders: {
      total: 0,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    },
    products: {
      total: 0,
      lowStock: 0,
      outOfStock: 0
    },
    customers: {
      total: 0,
      new: 0,
      returning: 0
    }
  },
  recentOrders: [] as any[],
  lowStockProducts: [] as any[]
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(defaultDashboardData);
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch products data
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        
        // Fetch orders data
        let ordersData = { orders: [] };
        try {
          const ordersResponse = await fetch('/api/orders');
          if (ordersResponse.ok) {
            ordersData = await ordersResponse.json();
          }
        } catch (ordersError) {
          console.log('Orders endpoint not available, using empty data');
        }

        // Fetch customers data
        let customersData = { profiles: [] };
        try {
          const customersResponse = await fetch('/api/admin/customers');
          if (customersResponse.ok) {
            const customerResult = await customersResponse.json();
            customersData = { profiles: customerResult.customers || [] };
          }
        } catch (customerError) {
          console.log('Customers endpoint not available, using empty data');
        }

        // Calculate metrics from real data
        const products = productsData.products || [];
        const orders = ordersData.orders || [];
        const customers = customersData.profiles || [];
        
        // Get low stock products (≤5 units)
        const lowStockProducts = products
          .filter((p: any) => (p.inventory_quantity || 0) <= 5)
          .map((p: any) => ({
            id: p.id,
            name: p.name || p.title,
            currentStock: p.inventory_quantity || 0,
            threshold: 5
          }))
          .slice(0, 5); // Show top 5 low stock items

        // Get recent orders (last 5)
        const recentOrders = orders
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
          .map((o: any) => ({
            id: o.id,
            orderNumber: o.order_number || `DL-${o.id}`,
            customerName: o.customer_name || 'Cliente no especificado',
            total: o.total_amount || 0,
            status: o.status || 'pending',
            createdAt: o.created_at
          }));

        // Calculate revenue from completed orders
        const completedOrders = orders.filter((o: any) => o.status === 'completed' || o.payment_status === 'paid');
        const currentRevenue = completedOrders.reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

        // Calculate customers metrics
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const newCustomers = customers.filter((c: any) => 
          new Date(c.created_at) >= thirtyDaysAgo
        ).length;

        const metrics = {
          products: {
            total: products.length,
            lowStock: lowStockProducts.length,
            outOfStock: products.filter((p: any) => (p.inventory_quantity || 0) === 0).length,
            active: products.filter((p: any) => p.status === 'active' || !p.status).length
          },
          orders: {
            total: orders.length,
            pending: orders.filter((o: any) => o.status === 'pending').length,
            processing: orders.filter((o: any) => o.status === 'processing').length,
            completed: orders.filter((o: any) => o.status === 'completed').length,
            failed: orders.filter((o: any) => o.status === 'failed').length
          },
          revenue: {
            current: currentRevenue,
            previous: 0, // TODO: Calculate from previous period data
            change: 0, // TODO: Calculate percentage change
            currency: 'ARS'
          },
          customers: {
            total: customers.length,
            new: newCustomers,
            returning: customers.length - newCustomers
          }
        };
        
        // Update data with real information
        setData({
          kpis: {
            revenue: metrics.revenue,
            orders: metrics.orders,
            products: metrics.products,
            customers: metrics.customers
          },
          recentOrders,
          lowStockProducts
        });
        
        setDashboardMetrics(metrics);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar algunos datos');
        // Keep default data as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  // Use the current data state (always real data or default empty state)
  const currentData = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-verde-suave text-white"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'pending':
        return <Badge className="bg-dorado text-azul-profundo"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'processing':
        return <Badge className="bg-azul-profundo text-white"><Package className="h-3 w-3 mr-1" />Procesando</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Fallido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Dashboard</h1>
          <p className="text-tierra-media">
            Bienvenido al panel de administración de DA LUZ CONSCIENTE
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/orders">
              <Eye className="h-4 w-4 mr-2" />
              Ver Pedidos
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
            <DollarSign className="h-4 w-4 text-verde-suave" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-azul-profundo">
              {formatPrice(currentData.kpis.revenue.current)}
            </div>
            <div className="flex items-center text-xs text-verde-suave mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              Datos en tiempo real
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-dorado" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-azul-profundo">
              {currentData.kpis.orders.total}
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-dorado">{currentData.kpis.orders.pending} pendientes</span>
              <span className="text-verde-suave">{currentData.kpis.orders.completed} completados</span>
            </div>
          </CardContent>
        </Card>

        {/* Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-azul-profundo" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-azul-profundo">
              {currentData.kpis.products.total}
            </div>
            <div className="flex items-center text-xs mt-1">
              <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
              <span className="text-red-500">{currentData.kpis.products.lowStock} con stock bajo</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-tierra-media" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-azul-profundo">
              {data.kpis.customers.total}
            </div>
            <div className="flex items-center text-xs text-verde-suave mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{data.kpis.customers.new} nuevos este mes
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-azul-profundo">Pedidos Recientes</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/orders">
                  Ver todos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-azul-profundo text-sm">
                          {order.orderNumber}
                        </p>
                        {getOrderStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-tierra-media mb-1">
                        {order.customerName}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-verde-suave">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs text-tierra-media flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-tierra-media mx-auto mb-2" />
                  <p className="text-tierra-media">
                    No hay pedidos recientes para mostrar.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-azul-profundo flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                Alertas de Stock
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/products">
                  Ver inventario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data.lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {data.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex-1">
                      <p className="font-medium text-azul-profundo text-sm mb-1">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-tierra-media">
                          Stock actual: <span className="font-semibold text-red-600">{product.currentStock}</span>
                        </p>
                        <p className="text-xs text-tierra-media">
                          Mínimo: {product.threshold}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-verde-suave mx-auto mb-2" />
                <p className="text-tierra-media">
                  ¡Perfecto! Todos los productos tienen stock suficiente.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dorado/20 rounded-lg">
                <Plus className="h-6 w-6 text-dorado" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Nuevo Producto</h3>
                <p className="text-sm text-tierra-media">Agregar producto al catálogo</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products/add">Crear</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-azul-profundo/20 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-azul-profundo" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Gestionar Pedidos</h3>
                <p className="text-sm text-tierra-media">Procesar y actualizar pedidos</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">Ver</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-verde-suave/20 rounded-lg">
                <Users className="h-6 w-6 text-verde-suave" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Ver Clientes</h3>
                <p className="text-sm text-tierra-media">Gestionar base de clientes</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/customers">Ver</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
