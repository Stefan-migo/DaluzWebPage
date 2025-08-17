"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  Settings, 
  Server,
  Mail,
  Database,
  Shield,
  Activity,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Save,
  Eye,
  EyeOff,
  Plus,
  Edit,
  Trash2,
  Monitor,
  HardDrive,
  Users,
  Package,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';

interface SystemConfig {
  id: string;
  config_key: string;
  config_value: any;
  description?: string;
  category: string;
  is_public: boolean;
  is_sensitive: boolean;
  value_type: string;
  updated_at: string;
}

interface HealthMetric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit?: string;
  category: string;
  is_healthy: boolean;
  collected_at: string;
  threshold_warning?: number;
  threshold_critical?: number;
}

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  warnings: number;
  criticals: number;
  warning_metrics: HealthMetric[];
  critical_metrics: HealthMetric[];
  last_check: number | null;
}

export default function SystemAdministrationPage() {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([]);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null);
  const [showSensitive, setShowSensitive] = useState(false);
  const [refreshingHealth, setRefreshingHealth] = useState(false);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchConfigs(),
        fetchHealthMetrics()
      ]);
      setError(null);
    } catch (err) {
      console.error('Error fetching system data:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/admin/system/config');
      if (!response.ok) {
        throw new Error('Failed to fetch system config');
      }

      const data = await response.json();
      setConfigs(data.configs || []);
    } catch (error) {
      console.error('Error fetching configs:', error);
      throw error;
    }
  };

  const fetchHealthMetrics = async () => {
    try {
      const response = await fetch('/api/admin/system/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health metrics');
      }

      const data = await response.json();
      setHealthMetrics(data.latest || []);
      setHealthStatus(data.health_status);
    } catch (error) {
      console.error('Error fetching health metrics:', error);
      throw error;
    }
  };

  const handleUpdateConfig = async (configKey: string, newValue: any) => {
    try {
      const response = await fetch('/api/admin/system/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: [{ config_key: configKey, config_value: newValue }]
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update config');
      }

      const data = await response.json();
      const result = data.results[0];
      
      if (result.success) {
        toast.success('Configuración actualizada exitosamente');
        fetchConfigs();
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('Error updating config:', error);
      toast.error(error instanceof Error ? error.message : 'Error al actualizar configuración');
    }
  };

  const handleRefreshHealth = async () => {
    try {
      setRefreshingHealth(true);
      
      const response = await fetch('/api/admin/system/health', { method: 'POST' });
      if (!response.ok) {
        throw new Error('Failed to refresh health metrics');
      }

      toast.success('Métricas de salud actualizadas');
      await fetchHealthMetrics();

    } catch (error) {
      console.error('Error refreshing health:', error);
      toast.error('Error al actualizar métricas de salud');
    } finally {
      setRefreshingHealth(false);
    }
  };

  const getHealthStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string; icon: any }> = {
      healthy: { variant: 'default', label: 'Saludable', icon: CheckCircle },
      warning: { variant: 'secondary', label: 'Advertencias', icon: AlertTriangle },
      critical: { variant: 'destructive', label: 'Crítico', icon: XCircle }
    };

    const statusConfig = config[status] || config['healthy'];
    const Icon = statusConfig.icon;

    return (
      <Badge variant={statusConfig.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      general: Settings,
      contact: Mail,
      ecommerce: Package,
      inventory: HardDrive,
      membership: Users,
      email: Mail,
      system: Server,
      database: Database,
      business: BarChart3
    };

    return icons[category] || Settings;
  };

  const formatMetricValue = (value: number, unit?: string) => {
    if (unit === 'megabytes') {
      return `${value.toFixed(1)} MB`;
    }
    if (unit === 'percentage') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === 'seconds') {
      return `${value.toFixed(2)}s`;
    }
    if (unit === 'count') {
      return Math.round(value).toString();
    }
    return value.toString();
  };

  const filteredConfigs = configs.filter(config => {
    if (categoryFilter !== 'all' && config.category !== categoryFilter) return false;
    if (config.is_sensitive && !showSensitive) return false;
    return true;
  });

  const configsByCategory = filteredConfigs.reduce((acc: any, config) => {
    if (!acc[config.category]) {
      acc[config.category] = [];
    }
    acc[config.category].push(config);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Administración del Sistema</h1>
            <p className="text-tierra-media">Cargando configuración del sistema...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Administración del Sistema</h1>
            <p className="text-tierra-media">Error al cargar los datos</p>
          </div>
        </div>
        <Card>
          <CardContent className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error al cargar sistema</h3>
            <p className="text-tierra-media mb-4">{error}</p>
            <Button onClick={fetchSystemData}>Reintentar</Button>
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
          <h1 className="text-3xl font-bold text-azul-profundo">Administración del Sistema</h1>
          <p className="text-tierra-media">
            Configuración, monitoreo y mantenimiento del sistema
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefreshHealth} disabled={refreshingHealth}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshingHealth ? 'animate-spin' : ''}`} />
            Actualizar Estado
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-tierra-media">Estado del Sistema</p>
                {healthStatus && getHealthStatusBadge(healthStatus.status)}
              </div>
              <Monitor className="h-8 w-8 text-azul-profundo" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Advertencias</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {healthStatus?.warnings || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Críticos</p>
                <p className="text-2xl font-bold text-red-600">
                  {healthStatus?.criticals || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-verde-suave" />
              <div className="ml-4">
                <p className="text-sm text-tierra-media">Última Verificación</p>
                <p className="text-sm font-medium text-verde-suave">
                  {healthStatus?.last_check 
                    ? new Date(healthStatus.last_check).toLocaleTimeString('es-AR')
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
          <TabsTrigger value="health">Salud del Sistema</TabsTrigger>
          <TabsTrigger value="maintenance">Mantenimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab('config')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración
                  </Button>
                  <Button variant="outline" className="justify-start" onClick={() => setActiveTab('health')}>
                    <Activity className="h-4 w-4 mr-2" />
                    Salud del Sistema
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Plantillas Email
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Database className="h-4 w-4 mr-2" />
                    Base de Datos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* System Metrics Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Métricas del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthMetrics.slice(0, 6).map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          metric.is_healthy ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm capitalize">
                          {metric.metric_name.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <span className="font-medium">
                        {formatMetricValue(metric.metric_value, metric.metric_unit)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          {/* Config Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {Array.from(new Set(configs.map(c => c.category))).map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowSensitive(!showSensitive)}
                  className="w-fit"
                >
                  {showSensitive ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Ocultar Sensibles
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Mostrar Sensibles
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration by Category */}
          {Object.entries(configsByCategory).map(([category, categoryConfigs]) => {
            const Icon = getCategoryIcon(category);
            
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="h-5 w-5 mr-2" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(categoryConfigs as SystemConfig[]).map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{config.config_key}</h4>
                            {config.is_sensitive && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Sensible
                              </Badge>
                            )}
                          </div>
                          {config.description && (
                            <p className="text-sm text-tierra-media mt-1">{config.description}</p>
                          )}
                          <div className="mt-2">
                            {config.value_type === 'boolean' ? (
                              <Select
                                value={config.config_value.toString()}
                                onValueChange={(value) => 
                                  handleUpdateConfig(config.config_key, value === 'true')
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="true">Verdadero</SelectItem>
                                  <SelectItem value="false">Falso</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                type={config.value_type === 'number' ? 'number' : 'text'}
                                value={config.config_value}
                                onChange={(e) => {
                                  const value = config.value_type === 'number' 
                                    ? parseFloat(e.target.value) || 0
                                    : e.target.value;
                                  handleUpdateConfig(config.config_key, value);
                                }}
                                className="max-w-md"
                              />
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-tierra-media">
                            Actualizado: {new Date(config.updated_at).toLocaleDateString('es-AR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Métricas de Salud
                  </div>
                  <Button variant="outline" size="sm" onClick={handleRefreshHealth}>
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Métrica</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healthMetrics.map((metric) => (
                      <TableRow key={metric.id}>
                        <TableCell className="capitalize">
                          {metric.metric_name.replace(/_/g, ' ')}
                        </TableCell>
                        <TableCell>
                          {formatMetricValue(metric.metric_value, metric.metric_unit)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={metric.is_healthy ? 'default' : 'destructive'}>
                            {metric.is_healthy ? 'Saludable' : 'Problema'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Critical Issues */}
            {healthStatus && (healthStatus.critical_metrics.length > 0 || healthStatus.warning_metrics.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Problemas Detectados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {healthStatus.critical_metrics.map((metric) => (
                      <div key={metric.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="font-medium text-red-700">Crítico</span>
                        </div>
                        <p className="text-sm text-red-600 mt-1">
                          {metric.metric_name}: {formatMetricValue(metric.metric_value, metric.metric_unit)}
                        </p>
                      </div>
                    ))}
                    
                    {healthStatus.warning_metrics.map((metric) => (
                      <div key={metric.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium text-yellow-700">Advertencia</span>
                        </div>
                        <p className="text-sm text-yellow-600 mt-1">
                          {metric.metric_name}: {formatMetricValue(metric.metric_value, metric.metric_unit)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Herramientas de Mantenimiento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5" />
                    <span className="font-medium">Backup Base de Datos</span>
                  </div>
                  <p className="text-sm text-tierra-media">Crear copia de seguridad</p>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trash2 className="h-5 w-5" />
                    <span className="font-medium">Limpiar Logs</span>
                  </div>
                  <p className="text-sm text-tierra-media">Eliminar logs antiguos</p>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <RefreshCw className="h-5 w-5" />
                    <span className="font-medium">Optimizar DB</span>
                  </div>
                  <p className="text-sm text-tierra-media">Optimizar rendimiento</p>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Verificar Seguridad</span>
                  </div>
                  <p className="text-sm text-tierra-media">Auditoría de seguridad</p>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Mail className="h-5 w-5" />
                    <span className="font-medium">Test Email</span>
                  </div>
                  <p className="text-sm text-tierra-media">Probar configuración email</p>
                </Button>

                <Button variant="outline" className="justify-start h-auto p-4 flex-col items-start">
                  <div className="flex items-center space-x-2 mb-2">
                    <Monitor className="h-5 w-5" />
                    <span className="font-medium">Estado Sistema</span>
                  </div>
                  <p className="text-sm text-tierra-media">Reporte completo</p>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
