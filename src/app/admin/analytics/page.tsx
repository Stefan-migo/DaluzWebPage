"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  DollarSign,
  Users,
  Package,
  Target,
  Download,
  Filter
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Analíticas y Reportes</h1>
          <p className="text-tierra-media">
            Obtén insights de tu negocio y toma decisiones informadas
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-16">
        <CardContent>
          <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
              <BarChart3 className="h-24 w-24 text-dorado mx-auto" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-verde-suave rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-azul-profundo mb-2">
                Dashboard de Analíticas
              </h2>
              <p className="text-tierra-media">
                Sistema completo de business intelligence con métricas avanzadas, reportes personalizados y insights en tiempo real para optimizar tu negocio.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-dorado/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-dorado mr-2" />
                <span>Ingresos</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-verde-suave/10 rounded-lg">
                <Users className="h-4 w-4 text-verde-suave mr-2" />
                <span>Clientes</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-azul-profundo/10 rounded-lg">
                <Package className="h-4 w-4 text-azul-profundo mr-2" />
                <span>Productos</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                <Target className="h-4 w-4 text-red-500 mr-2" />
                <span>Conversión</span>
              </div>
            </div>

            <Badge variant="outline" className="border-dorado text-dorado">
              Próximamente en Fase 3
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <DollarSign className="h-5 w-5 mr-2" />
              Analíticas de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Métricas detalladas de ingresos, tendencias de ventas y rendimiento financiero.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Tendencias de ingresos</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>Análisis estacional</span>
              </div>
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-2" />
                <span>Metas vs realidad</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Package className="h-5 w-5 mr-2" />
              Rendimiento de Productos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Insights sobre productos más vendidos, márgenes de ganancia y rotación de inventario.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <BarChart3 className="h-3 w-3 mr-2" />
                <span>Productos top</span>
              </div>
              <div className="flex items-center">
                <PieChart className="h-3 w-3 mr-2" />
                <span>Análisis de categorías</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Rotación de inventario</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Users className="h-5 w-5 mr-2" />
              Comportamiento del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Análisis del comportamiento de compra, segmentación de clientes y lifetime value.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-2" />
                <span>Segmentación RFM</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-3 w-3 mr-2" />
                <span>Valor de vida útil</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>Patrones de compra</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <BarChart3 className="h-5 w-5 mr-2" />
              Reportes Personalizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Crea reportes personalizados con las métricas que más te importan.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Download className="h-3 w-3 mr-2" />
                <span>Exportación automática</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>Reportes programados</span>
              </div>
              <div className="flex items-center">
                <Filter className="h-3 w-3 mr-2" />
                <span>Filtros avanzados</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <PieChart className="h-5 w-5 mr-2" />
              Dashboard en Tiempo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Visualización en tiempo real de métricas clave y KPIs del negocio.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Métricas en vivo</span>
              </div>
              <div className="flex items-center">
                <Target className="h-3 w-3 mr-2" />
                <span>Alertas inteligentes</span>
              </div>
              <div className="flex items-center">
                <BarChart3 className="h-3 w-3 mr-2" />
                <span>Gráficos interactivos</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Target className="h-5 w-5 mr-2" />
              Predicciones & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Análisis predictivo e insights inteligentes para optimizar estrategias.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Forecasting de ventas</span>
              </div>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-2" />
                <span>Predicción de churn</span>
              </div>
              <div className="flex items-center">
                <Package className="h-3 w-3 mr-2" />
                <span>Recomendaciones de stock</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
