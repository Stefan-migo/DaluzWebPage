"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  CreditCard, 
  Truck, 
  Shield,
  Bell,
  Palette,
  Mail,
  Globe,
  Users,
  Database,
  Key,
  Zap
} from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Configuración del Sistema</h1>
          <p className="text-tierra-media">
            Configura y personaliza tu plataforma DA LUZ CONSCIENTE
          </p>
        </div>
        
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-16">
        <CardContent>
          <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
              <Settings className="h-24 w-24 text-dorado mx-auto" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-verde-suave rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-azul-profundo mb-2">
                Panel de Configuración
              </h2>
              <p className="text-tierra-media">
                Centro de control completo para personalizar todos los aspectos de tu plataforma, desde pagos hasta notificaciones y seguridad.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-dorado/10 rounded-lg">
                <CreditCard className="h-4 w-4 text-dorado mr-2" />
                <span>Pagos</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-verde-suave/10 rounded-lg">
                <Truck className="h-4 w-4 text-verde-suave mr-2" />
                <span>Envíos</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-azul-profundo/10 rounded-lg">
                <Bell className="h-4 w-4 text-azul-profundo mr-2" />
                <span>Notificaciones</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                <Shield className="h-4 w-4 text-red-500 mr-2" />
                <span>Seguridad</span>
              </div>
            </div>

            <Badge variant="outline" className="border-dorado text-dorado">
              Próximamente en Fase 4
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <CreditCard className="h-5 w-5 mr-2" />
              Configuración de Pagos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Gestiona MercadoPago, métodos de pago aceptados y configuraciones de checkout.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Key className="h-3 w-3 mr-2" />
                <span>Credenciales MercadoPago</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-3 w-3 mr-2" />
                <span>Métodos de pago</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2" />
                <span>Configuración de seguridad</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Truck className="h-5 w-5 mr-2" />
              Gestión de Envíos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Configura zonas de envío, costos de shipping y políticas de entrega.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-2" />
                <span>Zonas de envío</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-3 w-3 mr-2" />
                <span>Costos de envío</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-3 w-3 mr-2" />
                <span>Transportistas</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Bell className="h-5 w-5 mr-2" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Personaliza emails automáticos, alertas del sistema y comunicaciones con clientes.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-2" />
                <span>Plantillas de email</span>
              </div>
              <div className="flex items-center">
                <Bell className="h-3 w-3 mr-2" />
                <span>Alertas automáticas</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-2" />
                <span>Webhooks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Palette className="h-5 w-5 mr-2" />
              Personalización
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Personaliza colores, logos, tipografías y elementos visuales de la marca.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Palette className="h-3 w-3 mr-2" />
                <span>Paleta de colores</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-3 w-3 mr-2" />
                <span>Logo y branding</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-3 w-3 mr-2" />
                <span>Configuración SEO</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Users className="h-5 w-5 mr-2" />
              Gestión de Usuarios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Administra usuarios del sistema, permisos y roles de acceso.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-2" />
                <span>Usuarios admin</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-3 w-3 mr-2" />
                <span>Roles y permisos</span>
              </div>
              <div className="flex items-center">
                <Key className="h-3 w-3 mr-2" />
                <span>Autenticación 2FA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Database className="h-5 w-5 mr-2" />
              Configuración Avanzada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Configuraciones técnicas, backups, integraciones y mantenimiento del sistema.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Database className="h-3 w-3 mr-2" />
                <span>Backups automáticos</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-2" />
                <span>Integraciones API</span>
              </div>
              <div className="flex items-center">
                <Settings className="h-3 w-3 mr-2" />
                <span>Configuración técnica</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Configuration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-azul-profundo">Estado Actual de Configuración</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 bg-verde-suave/10 rounded-lg">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-verde-suave mr-2" />
                <span className="text-sm font-medium">MercadoPago</span>
              </div>
              <Badge className="bg-verde-suave text-white">Activo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-verde-suave/10 rounded-lg">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-verde-suave mr-2" />
                <span className="text-sm font-medium">Emails</span>
              </div>
              <Badge className="bg-verde-suave text-white">Activo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dorado/10 rounded-lg">
              <div className="flex items-center">
                <Truck className="h-4 w-4 text-dorado mr-2" />
                <span className="text-sm font-medium">Envíos</span>
              </div>
              <Badge className="bg-dorado text-azul-profundo">Pendiente</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-dorado/10 rounded-lg">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-dorado mr-2" />
                <span className="text-sm font-medium">Seguridad</span>
              </div>
              <Badge className="bg-dorado text-azul-profundo">En Progreso</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
