"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
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
  CreditCard,
  X,
  XCircle
} from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number;
  currency: string;
  mercadopago_payment_id?: string;
  payment_method?: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    variant_title?: string;
  }>;
}

export default function OrdersPage() {
  const { user } = useAuthContext();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('No se pudieron cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

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
      case 'completed':
        return (
          <Badge className="bg-verde-suave text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-dorado text-azul-profundo">
            <Clock className="h-3 w-3 mr-1" />
            Pendiente
          </Badge>
        );
      case 'processing':
        return (
          <Badge className="bg-azul-profundo text-white">
            <Clock className="h-3 w-3 mr-1" />
            Procesando
          </Badge>
        );
      case 'failed':
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Fallido
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="secondary">
            <X className="h-3 w-3 mr-1" />
            Cancelado
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            {status}
          </Badge>
        );
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Tu pedido ha sido completado exitosamente';
      case 'pending':
        return 'Tu pago está siendo procesado';
      case 'processing':
        return 'Estamos preparando tu pedido';
      case 'failed':
        return 'Hubo un problema con el pago';
      case 'cancelled':
        return 'El pedido fue cancelado';
      default:
        return `Estado: ${status}`;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-tierra-media">Debes iniciar sesión para ver tus pedidos</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dorado mx-auto"></div>
          <p className="mt-2 text-tierra-media">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-azul-profundo">Mis Pedidos</h1>
        <p className="text-tierra-media">
          Revisa el estado y detalles de todos tus pedidos
        </p>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={fetchOrders} 
              variant="outline" 
              className="mt-2"
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      )}

      {orders.length === 0 ? (
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
          {orders.map((order) => (
            <Card key={order.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-azul-profundo">
                      Pedido #{order.order_number}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-tierra-media mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {formatPrice(order.total_amount)}
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
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-medium text-azul-profundo">{item.product_name}</p>
                        {item.variant_title && (
                          <p className="text-xs text-tierra-media">Variante: {item.variant_title}</p>
                        )}
                        <p className="text-sm text-tierra-media">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-azul-profundo">
                        {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Payment Info */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-azul-profundo">Pago:</h4>
                  <div className="flex items-start gap-2 bg-verde-suave/10 p-3 rounded-lg">
                    <CreditCard className="h-4 w-4 text-verde-suave mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-azul-profundo">
                        Método: {order.payment_method || 'MercadoPago'}
                      </p>
                      {order.mercadopago_payment_id && (
                        <p className="text-xs text-tierra-media mt-1">
                          ID de Pago: {order.mercadopago_payment_id}
                        </p>
                      )}
                      <p className="text-xs text-azul-profundo mt-1">
                        Moneda: {order.currency}
                      </p>
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
                  
                  {order.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-verde-suave text-verde-suave hover:bg-verde-suave hover:text-white"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Recomprar
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
                        <p className="text-azul-profundo">{formatPrice(order.total_amount)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-tierra-media">Moneda:</p>
                        <p className="text-azul-profundo">{order.currency}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2 border-t border-gray-200">
                      <div className="text-right">
                        <p className="font-semibold text-azul-profundo">
                          Total: {formatPrice(order.total_amount)}
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
      {orders.length > 0 && (
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