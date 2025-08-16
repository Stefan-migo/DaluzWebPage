"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserPlus, 
  Star, 
  Calendar,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  TrendingUp
} from 'lucide-react';

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Clientes</h1>
          <p className="text-tierra-media">
            Administra tu base de clientes y comunidad
          </p>
        </div>
        
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Coming Soon Card */}
      <Card className="text-center py-16">
        <CardContent>
          <div className="max-w-md mx-auto space-y-6">
            <div className="relative">
              <Users className="h-24 w-24 text-dorado mx-auto" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-verde-suave rounded-full flex items-center justify-center">
                <Star className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-azul-profundo mb-2">
                Gestión de Clientes
              </h2>
              <p className="text-tierra-media">
                Esta sección estará disponible próximamente. Incluirá herramientas para gestionar perfiles de clientes, historial de pedidos, y comunicación personalizada.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-center p-3 bg-dorado/10 rounded-lg">
                <Calendar className="h-4 w-4 text-dorado mr-2" />
                <span>Historial Completo</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-verde-suave/10 rounded-lg">
                <Mail className="h-4 w-4 text-verde-suave mr-2" />
                <span>Comunicación</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-azul-profundo/10 rounded-lg">
                <Package className="h-4 w-4 text-azul-profundo mr-2" />
                <span>Pedidos</span>
              </div>
              <div className="flex items-center justify-center p-3 bg-red-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-red-500 mr-2" />
                <span>Analíticas</span>
              </div>
            </div>

            <Badge variant="outline" className="border-dorado text-dorado">
              Próximamente en Fase 2
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Users className="h-5 w-5 mr-2" />
              Perfiles de Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Gestiona información completa de cada cliente, incluyendo preferencias y historial de interacciones.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-2" />
                <span>Información de contacto</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-3 w-3 mr-2" />
                <span>Direcciones de envío</span>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 mr-2" />
                <span>Preferencias de producto</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Package className="h-5 w-5 mr-2" />
              Historial de Pedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Acceso rápido al historial completo de compras y comportamiento de compra.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>Cronología de pedidos</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-3 w-3 mr-2" />
                <span>Métodos de pago</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-3 w-3 mr-2" />
                <span>Valor de vida útil</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-azul-profundo">
              <Mail className="h-5 w-5 mr-2" />
              Comunicación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-tierra-media text-sm mb-4">
              Herramientas para comunicación personalizada y seguimiento de interacciones.
            </p>
            <div className="space-y-2 text-xs text-tierra-media">
              <div className="flex items-center">
                <Mail className="h-3 w-3 mr-2" />
                <span>Emails personalizados</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-3 w-3 mr-2" />
                <span>Registro de llamadas</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-2" />
                <span>Programar seguimientos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
