"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin,
  Eye,
  Download,
  ArrowRight,
  Calendar,
  CreditCard 
} from "lucide-react";

// Mock data - replace with actual data fetching
const mockOrders = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 12500,
    items: [
      { name: "Crema Facial Hidratante", quantity: 1, price: 8500 },
      { name: "Aceite Corporal Lavanda", quantity: 1, price: 4000 }
    ],
    shippingAddress: "Av. Corrientes 1234, CABA, Buenos Aires",
    trackingNumber: "MP123456789",
    deliveryDate: "2024-01-18"
  },
  {
    id: "ORD-2024-002", 
    date: "2024-01-10",
    status: "shipped",
    total: 6800,
    items: [
      { name: "Jabón Artesanal Miel", quantity: 2, price: 3400 }
    ],
    shippingAddress: "Av. Corrientes 1234, CABA, Buenos Aires",
    trackingNumber: "MP987654321",
    estimatedDelivery: "2024-01-16"
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-05", 
    status: "processing",
    total: 15200,
    items: [
      { name: "Kit Completo Cuidado Facial", quantity: 1, price: 15200 }
    ],
    shippingAddress: "Av. Corrientes 1234, CABA, Buenos Aires"
  }
];

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return (
          <Badge className="bg-verde-suave text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Entregado
          </Badge>
        );
      case 'shipped':
        return (
          <Badge className="bg-azul-profundo text-white">
            <Truck className="h-3 w-3 mr-1" />
            En Camino
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-dorado text-azul-profundo">
            <Clock className="h-3 w-3 mr-1" />
            Procesando
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Desconocido
          </Badge>
        );
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Tu pedido ha sido entregado exitosamente';
      case 'shipped':
        return 'Tu pedido está en camino';
      case 'processing':
        return 'Estamos preparando tu pedido';
      default:
        return 'Estado desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-azul-profundo">Mis Pedidos</h1>
        <p className="text-tierra-media">
          Revisa el estado y detalles de todos tus pedidos
        </p>
      </div>

      {mockOrders.length === 0 ? (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 text-tierra-media mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-azul-profundo mb-2">
              Aún no tienes pedidos
            </h3>
            <p className="text-tierra-media mb-6">
              Cuando realices tu primera compra, aparecerá aquí
            </p>
            <Button className="bg-dorado hover:bg-dorado/90 text-azul-profundo">
              Explorar Productos
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Orders List */
        <div className="space-y-4">
          {mockOrders.map((order) => (
            <Card key={order.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-azul-profundo">
                      Pedido #{order.id}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-tierra-media mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {formatPrice(order.total)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <p className="text-xs text-tierra-media mt-1">
                      {getStatusDescription(order.status)}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-azul-profundo">Productos:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-azul-profundo">{item.name}</p>
                        <p className="text-sm text-tierra-media">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-azul-profundo">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-azul-profundo">Envío:</h4>
                  <div className="flex items-start gap-2 bg-verde-suave/10 p-3 rounded-lg">
                    <MapPin className="h-4 w-4 text-verde-suave mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-azul-profundo">{order.shippingAddress}</p>
                      {order.trackingNumber && (
                        <p className="text-xs text-tierra-media mt-1">
                          Número de seguimiento: {order.trackingNumber}
                        </p>
                      )}
                      {order.deliveryDate && (
                        <p className="text-xs text-verde-suave mt-1 font-medium">
                          Entregado el {formatDate(order.deliveryDate)}
                        </p>
                      )}
                      {order.estimatedDelivery && order.status !== 'delivered' && (
                        <p className="text-xs text-azul-profundo mt-1 font-medium">
                          Entrega estimada: {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-azul-profundo text-azul-profundo hover:bg-azul-profundo hover:text-white"
                    onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  
                  {order.status === 'delivered' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dorado text-dorado hover:bg-dorado hover:text-azul-profundo"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Factura
                    </Button>
                  )}
                  
                  {order.trackingNumber && order.status === 'shipped' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-verde-suave text-verde-suave hover:bg-verde-suave hover:text-white"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Rastrear Pedido
                    </Button>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedOrder === order.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                    <h5 className="font-semibold text-azul-profundo">Detalles del Pedido</h5>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-tierra-media">Método de Pago:</p>
                        <p className="text-azul-profundo">Mercado Pago</p>
                      </div>
                      <div>
                        <p className="font-medium text-tierra-media">Tipo de Envío:</p>
                        <p className="text-azul-profundo">Envío Standard</p>
                      </div>
                      <div>
                        <p className="font-medium text-tierra-media">Subtotal:</p>
                        <p className="text-azul-profundo">{formatPrice(order.total * 0.9)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-tierra-media">Envío:</p>
                        <p className="text-azul-profundo">{formatPrice(order.total * 0.1)}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2 border-t border-gray-200">
                      <div className="text-right">
                        <p className="font-semibold text-azul-profundo">
                          Total: {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reorder Section */}
      {mockOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-azul-profundo">¿Necesitas algo más?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-tierra-media">
                  Explora nuestros productos biocosmecéticos artesanales
                </p>
              </div>
              <Button className="bg-dorado hover:bg-dorado/90 text-azul-profundo">
                Explorar Productos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 