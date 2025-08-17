"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  PieChart, 
  Calendar,
  DollarSign,
  Users,
  Package,
  Target,
  Download,
  Filter,
  RefreshCw,
  AlertTriangle,
  Activity,
  ShoppingCart,
  Crown,
  ArrowUpRight,
  ArrowDownRight,
  User
} from 'lucide-react';

interface AnalyticsData {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    avgOrderValue: number;
    revenueGrowth: number;
    conversionRate: number;
  };
  trends: {
    sales: Array<{ date: string; value: number; count: number }>;
    customers: Array<{ date: string; value: number; count: number }>;
  };
  products: {
    topProducts: Array<{
      id: string;
      name: string;
      category: string;
      revenue: number;
      quantity: number;
      orders: number;
    }>;
    categoryRevenue: Array<{ category: string; revenue: number }>;
  };
  customers: {
    segmentation: {
      new: number;
      basic: number;
      premium: number;
      members: number;
      nonMembers: number;
    };
  };
  orders: {
    statusDistribution: Record<string, number>;
  };
  period: {
    from: string;
    to: string;
    days: number;
  };
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setRefreshing(true);
      
      const response = await fetch(`/api/admin/analytics/dashboard?period=${period}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics);
      setError(null);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);

  const formatPercentage = (value: number) => 
    `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
    return <Activity className="h-4 w-4 text-gray-500" />;
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  // Simple bar chart component using CSS
  const SimpleBarChart = ({ data, title, valueKey, labelKey, color = "bg-azul-profundo" }: any) => {
    const maxValue = Math.max(...data.map((item: any) => item[valueKey]));
    
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-azul-profundo">{title}</h4>
        <div className="space-y-2">
          {data.slice(0, 8).map((item: any, index: number) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-24 text-sm truncate">{item[labelKey]}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-2 relative">
                <div 
                  className={`${color} h-2 rounded-full`}
                  style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-20 text-sm text-right font-medium">
                {typeof item[valueKey] === 'number' && item[valueKey] > 1000 
                  ? formatPrice(item[valueKey])
                  : item[valueKey]
                }
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simple line chart using CSS
  const SimpleLineChart = ({ data, title, valueKey }: any) => {
    if (!data || data.length === 0) return null;
    
    const maxValue = Math.max(...data.map((item: any) => item[valueKey]));
    const minValue = Math.min(...data.map((item: any) => item[valueKey]));
    const range = maxValue - minValue || 1;
    
    return (
      <div className="space-y-3">
        <h4 className="font-medium text-azul-profundo">{title}</h4>
        <div className="h-32 relative border border-gray-200 rounded p-2">
          <svg width="100%" height="100%" className="overflow-visible">
            <polyline
              points={data.map((item: any, index: number) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((item[valueKey] - minValue) / range) * 100;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#1e40af"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {data.map((item: any, index: number) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((item[valueKey] - minValue) / range) * 100;
              return (
                <circle
                  key={index}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="3"
                  fill="#1e40af"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex justify-between text-xs text-tierra-media">
          <span>{data[0]?.date}</span>
          <span>{data[data.length - 1]?.date}</span>
        </div>
      </div>
    );
  };

  if (loading && !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Analíticas y Reportes</h1>
            <p className="text-tierra-media">Cargando datos analíticos...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Analíticas y Reportes</h1>
            <p className="text-tierra-media">Error al cargar los datos</p>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error al cargar analíticas</h3>
            <p className="text-tierra-media mb-4">{error || 'No se pudieron cargar los datos'}</p>
            <Button onClick={fetchAnalytics}>Reintentar</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Analíticas y Reportes</h1>
          <p className="text-tierra-media">
            Insights de negocio para los últimos {analytics.period.days} días
          </p>
        </div>
        
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchAnalytics} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-tierra-media">Ingresos Totales</p>
                <p className="text-2xl font-bold text-verde-suave">
                  {formatPrice(analytics.kpis.totalRevenue)}
                </p>
                <div className="flex items-center mt-1">
                  {getGrowthIcon(analytics.kpis.revenueGrowth)}
                  <span className={`text-sm ml-1 ${getGrowthColor(analytics.kpis.revenueGrowth)}`}>
                    {formatPercentage(analytics.kpis.revenueGrowth)}
                  </span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-verde-suave" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-tierra-media">Pedidos</p>
                <p className="text-2xl font-bold text-azul-profundo">
                  {analytics.kpis.totalOrders}
                </p>
                <p className="text-sm text-tierra-media mt-1">
                  Promedio: {formatPrice(analytics.kpis.avgOrderValue)}
                </p>
              </div>
              <ShoppingCart className="h-8 w-8 text-azul-profundo" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-tierra-media">Clientes</p>
                <p className="text-2xl font-bold text-dorado">
                  {analytics.kpis.totalCustomers}
                </p>
                <p className="text-sm text-tierra-media mt-1">
                  Conv: {analytics.kpis.conversionRate.toFixed(1)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-dorado" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-tierra-media">Productos</p>
                <p className="text-2xl font-bold text-red-500">
                  {analytics.kpis.totalProducts}
                </p>
                <p className="text-sm text-tierra-media mt-1">
                  Activos
                </p>
              </div>
              <Package className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="sales">Ventas</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Tendencia de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={analytics.trends.sales} 
                  title="Ingresos Diarios"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            {/* Customer Acquisition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Adquisición de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={analytics.trends.customers} 
                  title="Nuevos Clientes Diarios"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            {/* Order Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Estados de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.orders.statusDistribution).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-azul-profundo rounded-full"></div>
                        <span className="capitalize">{status}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Segmentación de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Crown className="h-4 w-4 text-dorado" />
                      <span>Miembros</span>
                    </div>
                    <span className="font-medium">{analytics.customers.segmentation.members}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Premium</Badge>
                    </div>
                    <span className="font-medium">{analytics.customers.segmentation.premium}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">Básico</Badge>
                    </div>
                    <span className="font-medium">{analytics.customers.segmentation.basic}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-tierra-media" />
                      <span>Sin membresía</span>
                    </div>
                    <span className="font-medium">{analytics.customers.segmentation.nonMembers}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Ingresos por Categoría
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={analytics.products.categoryRevenue}
                  title="Categorías Más Rentables"
                  valueKey="revenue"
                  labelKey="category"
                  color="bg-verde-suave"
                />
              </CardContent>
            </Card>

            {/* Sales Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Métricas de Ventas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-verde-suave/10 rounded-lg">
                    <p className="text-2xl font-bold text-verde-suave">
                      {formatPrice(analytics.kpis.totalRevenue)}
                    </p>
                    <p className="text-sm text-tierra-media">Ingresos Totales</p>
                  </div>
                  <div className="text-center p-4 bg-azul-profundo/10 rounded-lg">
                    <p className="text-2xl font-bold text-azul-profundo">
                      {formatPrice(analytics.kpis.avgOrderValue)}
                    </p>
                    <p className="text-sm text-tierra-media">Ticket Promedio</p>
                  </div>
                  <div className="text-center p-4 bg-dorado/10 rounded-lg">
                    <p className="text-2xl font-bold text-dorado">
                      {analytics.kpis.totalOrders}
                    </p>
                    <p className="text-sm text-tierra-media">Pedidos Totales</p>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <p className="text-2xl font-bold text-red-500">
                      {formatPercentage(analytics.kpis.revenueGrowth)}
                    </p>
                    <p className="text-sm text-tierra-media">Crecimiento</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Productos Más Vendidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={analytics.products.topProducts}
                  title="Por Ingresos"
                  valueKey="revenue"
                  labelKey="name"
                  color="bg-dorado"
                />
              </CardContent>
            </Card>

            {/* Product Performance Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Rendimiento Detallado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Ingresos</TableHead>
                      <TableHead>Cantidad</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analytics.products.topProducts.slice(0, 5).map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium truncate max-w-[150px]">
                              {product.name}
                            </div>
                            <div className="text-sm text-tierra-media">
                              {product.category}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatPrice(product.revenue)}
                        </TableCell>
                        <TableCell>{product.quantity} unidades</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Acquisition Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Adquisición de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleLineChart 
                  data={analytics.trends.customers} 
                  title="Nuevos Clientes por Día"
                  valueKey="value"
                />
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Métricas de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-azul-profundo/10 rounded-lg">
                    <p className="text-2xl font-bold text-azul-profundo">
                      {analytics.kpis.totalCustomers}
                    </p>
                    <p className="text-sm text-tierra-media">Total Clientes</p>
                  </div>
                  <div className="text-center p-4 bg-dorado/10 rounded-lg">
                    <p className="text-2xl font-bold text-dorado">
                      {analytics.customers.segmentation.members}
                    </p>
                    <p className="text-sm text-tierra-media">Miembros Activos</p>
                  </div>
                  <div className="text-center p-4 bg-verde-suave/10 rounded-lg">
                    <p className="text-2xl font-bold text-verde-suave">
                      {analytics.kpis.conversionRate.toFixed(1)}%
                    </p>
                    <p className="text-sm text-tierra-media">Tasa Conversión</p>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <p className="text-2xl font-bold text-red-500">
                      {analytics.customers.segmentation.premium}
                    </p>
                    <p className="text-sm text-tierra-media">Miembros Premium</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
