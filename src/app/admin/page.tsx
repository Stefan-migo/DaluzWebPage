"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Colors from the brand palette
const COLORS = {
  primary: '#8B5A3C',
  secondary: '#B17A47',
  accent: '#D4A574',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#ef4444',
  info: '#60a5fa'
};

const CHART_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning];

interface DashboardData {
  kpis: {
    products: {
      total: number;
      lowStock: number;
      outOfStock: number;
    };
    orders: {
      total: number;
      pending: number;
      processing: number;
      completed: number;
      failed: number;
    };
    revenue: {
      current: number;
      previous: number;
      change: number;
      currency: string;
    };
    customers: {
      total: number;
      new: number;
      returning: number;
    };
  };
  recentOrders: any[];
  lowStockProducts: any[];
  charts: {
    revenueTrend: any[];
    ordersStatus: any;
    topProducts: any[];
  };
}

const defaultDashboardData: DashboardData = {
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
  recentOrders: [],
  lowStockProducts: [],
  charts: {
    revenueTrend: [],
    ordersStatus: {},
    topProducts: []
  }
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(defaultDashboardData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch('/api/admin/dashboard');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Error al cargar los datos del dashboard');
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
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

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
        return <Badge className="bg-verde-suave text-white text-xs"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'pending':
        return <Badge className="bg-dorado text-azul-profundo text-xs"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'processing':
        return <Badge className="bg-azul-profundo text-white text-xs"><Package className="h-3 w-3 mr-1" />Procesando</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="text-xs"><XCircle className="h-3 w-3 mr-1" />Fallido</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>;
    }
  };

  // Prepare chart data
  const ordersStatusData = data.charts.ordersStatus ? [
    { name: 'Pendiente', value: data.charts.ordersStatus.pending || 0 },
    { name: 'Procesando', value: data.charts.ordersStatus.processing || 0 },
    { name: 'Completado', value: data.charts.ordersStatus.completed || 0 },
    { name: 'Enviado', value: data.charts.ordersStatus.shipped || 0 },
    { name: 'Fallido', value: data.charts.ordersStatus.failed || 0 }
  ].filter(item => item.value > 0) : [];

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-azul-profundo mb-2">Error al cargar el dashboard</p>
          <p className="text-tierra-media">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Reintentar
          </Button>
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
        
        <div className="flex space-x-2">
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

      {/* Stock Alert Banner - Compact */}
      {data.lowStockProducts.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-semibold text-azul-profundo text-sm">
                    {data.lowStockProducts.length} producto{data.lowStockProducts.length !== 1 ? 's' : ''} con stock bajo
                  </p>
                  <p className="text-xs text-tierra-media">
                    {data.lowStockProducts.slice(0, 2).map(p => p.name).join(', ')}
                    {data.lowStockProducts.length > 2 && ` y ${data.lowStockProducts.length - 2} más`}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products?filter=low_stock">
                  Ver Inventario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Ingresos del Mes</p>
                <p className="text-2xl font-bold text-azul-profundo">
                  {formatPrice(data.kpis.revenue.current)}
                </p>
                <div className={cn(
                  "flex items-center text-xs mt-1",
                  data.kpis.revenue.change >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {data.kpis.revenue.change >= 0 ? (
                    <>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>
                        +{data.kpis.revenue.change.toFixed(1)}% vs mes anterior
                      </span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      <span>
                        {data.kpis.revenue.change.toFixed(1)}% vs mes anterior
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Solo pedidos completados/pagados
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Pedidos</p>
                <p className="text-2xl font-bold text-azul-profundo">
                  {data.kpis.orders.total}
                </p>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-orange-600">{data.kpis.orders.pending} pendientes</span>
                  <span className="text-green-600">{data.kpis.orders.completed} completados</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.kpis.orders.processing} en proceso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Card - Only Active */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Productos Activos</p>
                <p className="text-2xl font-bold text-azul-profundo">
                  {data.kpis.products.total}
                </p>
                <div className="flex items-center text-xs mt-1">
                  {data.kpis.products.lowStock > 0 ? (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1 text-red-500" />
                      <span className="text-red-500">{data.kpis.products.lowStock} con stock bajo</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600">Stock saludable</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.kpis.products.outOfStock} sin stock
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Clientes</p>
                <p className="text-2xl font-bold text-azul-profundo">
                  {data.kpis.customers.total}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{data.kpis.customers.new} nuevos (30 días)
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {data.kpis.customers.returning} recurrentes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ingresos Últimos 7 Días</CardTitle>
            <p className="text-sm text-tierra-media">Evolución de ingresos diarios</p>
          </CardHeader>
          <CardContent>
            {data.charts.revenueTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.charts.revenueTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    formatter={(value: number) => formatPrice(value)}
                    labelFormatter={(date) => new Date(date).toLocaleDateString('es-AR', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    name="Ingresos"
                    stroke={COLORS.success} 
                    strokeWidth={2}
                    dot={{ fill: COLORS.success }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-tierra-media">No hay datos de ingresos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Orders Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Pedidos (30 días)</CardTitle>
            <p className="text-sm text-tierra-media">Distribución por estado</p>
          </CardHeader>
          <CardContent>
            {ordersStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ordersStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }: { name?: string }) => name || ''}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ordersStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-center">
                <p className="text-tierra-media">No hay pedidos recientes</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products Chart */}
      {data.charts.topProducts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <p className="text-sm text-tierra-media">Top 5 por ingresos</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.charts.topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => formatPrice(value)} />
                <YAxis type="category" dataKey="name" width={150} tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [formatPrice(value), 'Ingresos'];
                    return [value, 'Cantidad'];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Ingresos" fill={COLORS.primary} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Pedidos Recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/orders">
                    Ver todos
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recentOrders.length > 0 ? (
                  data.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-azul-profundo text-sm">
                            #{order.order_number}
                          </p>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-tierra-media mb-1">
                          {order.customer_name} • {order.items_count} producto{order.items_count !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-verde-suave text-sm">
                            {formatPrice(order.total_amount)}
                          </p>
                          <p className="text-xs text-tierra-media flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(order.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[200px] text-center">
                    <div>
                      <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-tierra-media">
                        No hay pedidos recientes para mostrar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/orders">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Gestionar Pedidos
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/customers">
                <Users className="h-4 w-4 mr-2" />
                Ver Clientes
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/products">
                <Package className="h-4 w-4 mr-2" />
                Inventario
              </Link>
            </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
