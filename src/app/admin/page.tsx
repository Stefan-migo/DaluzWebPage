"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
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
  ResponsiveContainer,
} from "recharts";
import KPICard from "@/components/admin/dashboard/KPICard";
import ChartCard from "@/components/admin/dashboard/ChartCard";
import RecentOrdersList from "@/components/admin/dashboard/RecentOrdersList";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import type { DashboardData, Order, Product } from "@/types/admin";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Eye,
  Plus,
  ArrowRight,
} from "lucide-react";

// Colores del sistema admin
const COLORS = {
  primary: "#6A1111", // Burdeos Oscuro
  secondary: "#8B0000", // Rojo Sangre
  accent: "#285D30", // Verde Alkimya
  success: "#285D30", // Verde Alkimya
  warning: "#FF4E21", // Naranja Alkimya
  danger: "#8B0000", // Rojo Sangre
  info: "#1D3F6A", // Azul Acero
  cream: "#FDF3E3", // Crema
};

// Colores para gráficos - paleta coherente con el admin
const CHART_COLORS = [
  "#285D30", // Verde - Completado
  "#FF4E21", // Naranja - Pendiente
  "#1D3F6A", // Azul - Procesando
  "#6A1111", // Burdeos - Enviado
  "#8B0000", // Rojo - Fallido
];

const defaultDashboardData: DashboardData = {
  kpis: {
    revenue: { current: 0, previous: 0, change: 0, currency: "ARS" },
    orders: { total: 0, pending: 0, processing: 0, completed: 0, failed: 0 },
    products: { total: 0, lowStock: 0, outOfStock: 0 },
    customers: { total: 0, new: 0, returning: 0 },
  },
  recentOrders: [],
  lowStockProducts: [],
  charts: {
    revenueTrend: [],
    ordersStatus: {},
    topProducts: [],
  },
};

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData>(defaultDashboardData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/admin/dashboard");

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error al cargar los datos del dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const ordersStatusData = data.charts.ordersStatus
    ? [
        { name: "Pendiente", value: data.charts.ordersStatus.pending || 0 },
        { name: "Procesando", value: data.charts.ordersStatus.processing || 0 },
        { name: "Completado", value: data.charts.ordersStatus.completed || 0 },
        { name: "Enviado", value: data.charts.ordersStatus.shipped || 0 },
        { name: "Fallido", value: data.charts.ordersStatus.failed || 0 },
      ].filter((item) => item.value > 0)
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#E5DFD3] rounded w-64 mb-2"></div>
          <div className="h-4 bg-[#E5DFD3] rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#E5DFD3] h-32 rounded-lg"></div>
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
          <p className="text-lg font-semibold text-azul-profundo mb-2">
            Error al cargar el dashboard
          </p>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Dashboard
          </h1>
          <p
            className="text-sm md:text-base"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Bienvenido al panel de administración de DA LUZ CONSCIENTE
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link href="/admin/products/add">
            <Button
              className="px-6 py-3 lg:px-8 lg:py-4 font-semibold text-sm lg:text-base w-full sm:w-auto"
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button
              className="px-6 py-3 lg:px-8 lg:py-4 font-semibold text-sm lg:text-base w-full sm:w-auto"
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Pedidos
            </Button>
          </Link>
        </div>
      </div>

      {/* Stock Alert Banner */}
      {data.lowStockProducts.length > 0 && (
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle
                  className="h-5 w-5"
                  style={{ color: "var(--admin-error)" }}
                />
                <div>
                  <p
                    className="font-semibold text-sm"
                    style={{ color: "var(--admin-text-primary)" }}
                  >
                    {data.lowStockProducts.length} producto
                    {data.lowStockProducts.length !== 1 ? "s" : ""} con stock
                    bajo
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {data.lowStockProducts
                      .slice(0, 2)
                      .map((p) => p.name)
                      .join(", ")}
                    {data.lowStockProducts.length > 2 &&
                      ` y ${data.lowStockProducts.length - 2} más`}
                  </p>
                </div>
              </div>
              <Link href="/admin/products?filter=low_stock">
                <Button
                  size="sm"
                  style={{
                    borderColor: "var(--admin-error)",
                    color: "var(--admin-error)",
                    backgroundColor: "transparent",
                  }}
                >
                  Ver Inventario
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <KPICard
          title="Ingresos del Mes"
          value={formatPrice(data.kpis.revenue.current)}
          icon={DollarSign}
          change={data.kpis.revenue.change}
          changeLabel="vs anterior"
          subtitle="Solo completados/pagados"
          href="/admin/orders?filter=completed"
          description="Ver pedidos completados"
        />
        <KPICard
          title="Pedidos"
          value={data.kpis.orders.total}
          icon={ShoppingCart}
          subtitle={`${data.kpis.orders.pending} pend. • ${data.kpis.orders.completed} comp. • ${data.kpis.orders.processing} en proceso`}
          href="/admin/orders"
          description="Gestionar pedidos"
        />
        <KPICard
          title="Productos Activos"
          value={data.kpis.products.total}
          icon={Package}
          subtitle={
            data.kpis.products.lowStock > 0
              ? `${data.kpis.products.lowStock} stock bajo • ${data.kpis.products.outOfStock} sin stock`
              : `Stock saludable • ${data.kpis.products.outOfStock} sin stock`
          }
          variant={data.kpis.products.lowStock > 0 ? "warning" : "default"}
          href="/admin/products"
          description="Ver inventario"
        />
        <KPICard
          title="Clientes"
          value={data.kpis.customers.total}
          icon={Users}
          change={data.kpis.customers.new}
          changeLabel="nuevos"
          subtitle={`${data.kpis.customers.returning} recurrentes`}
          href="/admin/customers"
          description="Ver clientes"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Ingresos Últimos 7 Días"
          description="Evolución de ingresos diarios"
        >
          {data.charts.revenueTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data.charts.revenueTrend}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--admin-border-secondary)"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: "var(--admin-text-secondary)" }}
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString("es-AR", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  axisLine={{ stroke: "var(--admin-border-secondary)" }}
                  tickLine={{ stroke: "var(--admin-border-secondary)" }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--admin-text-secondary)" }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  axisLine={{ stroke: "var(--admin-border-secondary)" }}
                  tickLine={{ stroke: "var(--admin-border-secondary)" }}
                />
                <Tooltip
                  formatter={(value: number) => [
                    formatPrice(value),
                    "Ingresos",
                  ]}
                  labelFormatter={(date) =>
                    new Date(date).toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  }
                  contentStyle={{
                    backgroundColor: "var(--admin-bg-primary)",
                    border: "1px solid var(--admin-border-secondary)",
                    borderRadius: "8px",
                    color: "var(--admin-text-primary)",
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: "10px" }} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  name="Ingresos"
                  stroke={COLORS.success}
                  strokeWidth={3}
                  dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-center">
              <p style={{ color: "var(--admin-text-secondary)" }}>
                No hay datos de ingresos disponibles
              </p>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Estado de Pedidos (30 días)"
          description="Distribución por estado"
        >
          {ordersStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({
                    name,
                    percent,
                  }: {
                    name?: string;
                    percent?: number;
                  }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                      stroke="var(--admin-bg-primary)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `${value} pedidos`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "var(--admin-bg-primary)",
                    border: "1px solid var(--admin-border-secondary)",
                    borderRadius: "8px",
                    color: "var(--admin-text-primary)",
                  }}
                />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-center">
              <p style={{ color: "var(--admin-text-secondary)" }}>
                No hay pedidos recientes
              </p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Top Products Chart */}
      {data.charts.topProducts.length > 0 && (
        <ChartCard
          title="Productos Más Vendidos"
          description="Top 5 por ingresos"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.charts.topProducts}
              layout="horizontal"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--admin-border-secondary)"
              />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "var(--admin-text-secondary)" }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                axisLine={{ stroke: "var(--admin-border-secondary)" }}
                tickLine={{ stroke: "var(--admin-border-secondary)" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 12, fill: "var(--admin-text-secondary)" }}
                axisLine={{ stroke: "var(--admin-border-secondary)" }}
                tickLine={{ stroke: "var(--admin-border-secondary)" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "revenue")
                    return [formatPrice(value), "Ingresos"];
                  return [value, "Cantidad"];
                }}
                contentStyle={{
                  backgroundColor: "var(--admin-bg-primary)",
                  border: "1px solid var(--admin-border-secondary)",
                  borderRadius: "8px",
                  color: "var(--admin-text-primary)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "10px" }} />
              <Bar
                dataKey="revenue"
                name="Ingresos"
                fill={COLORS.primary}
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

      {/* Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersList orders={data.recentOrders} onViewAll={() => {}} />
        </div>
        <QuickActions lowStockProducts={data.lowStockProducts} />
      </div>
    </div>
  );
}
