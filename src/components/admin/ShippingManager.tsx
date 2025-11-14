"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Truck, 
  Plus, 
  MapPin, 
  DollarSign,
  Package
} from 'lucide-react';
import { toast } from 'sonner';

interface ShippingZone {
  id: string;
  name: string;
  description?: string;
  countries: string[];
  is_active: boolean;
}

interface ShippingRate {
  id: string;
  zone_id: string;
  name: string;
  rate_type: string;
  flat_rate?: number;
  is_active: boolean;
}

interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export default function ShippingManager() {
  const [zones, setZones] = useState<ShippingZone[]>([]);
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [carriers, setCarriers] = useState<ShippingCarrier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [zonesRes, ratesRes, carriersRes] = await Promise.all([
        fetch('/api/admin/system/shipping/zones'),
        fetch('/api/admin/system/shipping/rates'),
        fetch('/api/admin/system/shipping/carriers')
      ]);

      if (zonesRes.ok) {
        const zonesData = await zonesRes.json();
        setZones(zonesData.zones || []);
      }

      if (ratesRes.ok) {
        const ratesData = await ratesRes.json();
        setRates(ratesData.rates || []);
      }

      if (carriersRes.ok) {
        const carriersData = await carriersRes.json();
        setCarriers(carriersData.carriers || []);
      }
    } catch (error) {
      console.error('Error fetching shipping data:', error);
      toast.error('Error al cargar datos de envío');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-tierra-media">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-azul-profundo">Gestión de Envíos</h2>
          <p className="text-tierra-media">Configura zonas, tarifas y transportistas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Zones Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Zonas de Envío
            </CardTitle>
            <CardDescription>
              {zones.length} {zones.length === 1 ? 'zona' : 'zonas'} configuradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {zones.slice(0, 3).map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{zone.name}</span>
                  <Badge variant={zone.is_active ? 'default' : 'outline'}>
                    {zone.is_active ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Zona
            </Button>
          </CardContent>
        </Card>

        {/* Rates Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Tarifas
            </CardTitle>
            <CardDescription>
              {rates.length} {rates.length === 1 ? 'tarifa' : 'tarifas'} configuradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rates.slice(0, 3).map(rate => (
                <div key={rate.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{rate.name}</span>
                  <Badge variant="outline">{rate.rate_type}</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Tarifa
            </Button>
          </CardContent>
        </Card>

        {/* Carriers Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Transportistas
            </CardTitle>
            <CardDescription>
              {carriers.length} {carriers.length === 1 ? 'transportista' : 'transportistas'} configurados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {carriers.slice(0, 3).map(carrier => (
                <div key={carrier.id} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{carrier.name}</span>
                  <Badge variant={carrier.is_active ? 'default' : 'outline'}>
                    {carrier.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Transportista
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-tierra-media">
            El sistema de gestión de envíos permite configurar zonas geográficas, tarifas de envío 
            y transportistas. Las funcionalidades completas de creación y edición estarán disponibles próximamente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

