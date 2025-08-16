"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  User,
  CreditCard,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: Array<{
    product_name: string;
    quantity: number;
    unit_price: number;
    variant_title?: string;
  }>;
  mp_payment_id?: string;
  mp_payment_method?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // This will fetch from a new admin orders API endpoint
      const response = await fetch('/api/admin/orders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar los pedidos');
      
      // Mock data for development
      setOrders([
        {
          id: '1',
          order_number: 'DL-1704123456',
          customer_name: 'María González',
          customer_email: 'maria@example.com',
          total_amount: 15750,
          status: 'pending',
          payment_status: 'pending',
          created_at: '2024-01-20T10:30:00Z',
          mp_payment_id: '123456789',
          mp_payment_method: 'credit_card',
          order_items: [
            {
              product_name: 'Crema Hidratante Rosa Mosqueta',
              quantity: 1,
              unit_price: 12500,
              variant_title: '50ml'
            },
            {
              product_name: 'Aceite Corporal Lavanda',
              quantity: 1,
              unit_price: 3250
            }
          ]
        },
        {
          id: '2',
          order_number: 'DL-1704123455',
          customer_name: 'Carlos Ruiz',
          customer_email: 'carlos@example.com',
          total_amount: 8900,
          status: 'completed',
          payment_status: 'paid',
          created_at: '2024-01-20T09:15:00Z',
          mp_payment_id: '123456788',
          mp_payment_method: 'bank_transfer',
          order_items: [
            {
              product_name: 'Hidrolato de Rosas',
              quantity: 1,
              unit_price: 8900,
              variant_title: '100ml'
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);
      
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      ));

      toast.success('Estado del pedido actualizado');
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Error al actualizar el pedido');
    } finally {
      setUpdating(null);
    }
  };

  const sendEmailNotification = async (order: Order) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      toast.success('Notificación enviada al cliente');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Error al enviar la notificación');
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-verde-suave text-white"><CheckCircle className="h-3 w-3 mr-1" />Completado</Badge>;
      case 'pending':
        return <Badge className="bg-dorado text-azul-profundo"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'processing':
        return <Badge className="bg-azul-profundo text-white"><Package className="h-3 w-3 mr-1" />Procesando</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500 text-white"><Truck className="h-3 w-3 mr-1" />Enviado</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelado</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Fallido</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="border-verde-suave text-verde-suave">Pagado</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-dorado text-dorado">Pendiente</Badge>;
      case 'failed':
        return <Badge variant="outline" className="border-red-500 text-red-500">Fallido</Badge>;
      case 'refunded':
        return <Badge variant="outline" className="border-gray-500 text-gray-500">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
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
          <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Pedidos</h1>
          <p className="text-tierra-media">
            Administra todos los pedidos de la tienda
          </p>
        </div>
        
        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-azul-profundo">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por número de pedido, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendiente</SelectItem>
                <SelectItem value="processing">Procesando</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="completed">Completado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
                <SelectItem value="failed">Fallido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Pago</TableHead>
                <TableHead>Total</TableHead>
                <TableHead className="w-[50px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-azul-profundo">{order.order_number}</p>
                      <p className="text-xs text-tierra-media">
                        {order.order_items.length} producto{order.order_items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-tierra-media">{order.customer_email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-tierra-media" />
                      {formatDate(order.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(order.status)}
                  </TableCell>
                  <TableCell>
                    {getPaymentStatusBadge(order.payment_status)}
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-verde-suave">
                      {formatPrice(order.total_amount)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        {order.status === 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            disabled={updating === order.id}
                          >
                            <Package className="h-4 w-4 mr-2" />
                            Marcar como Procesando
                          </DropdownMenuItem>
                        )}
                        
                        {order.status === 'processing' && (
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'shipped')}
                            disabled={updating === order.id}
                          >
                            <Truck className="h-4 w-4 mr-2" />
                            Marcar como Enviado
                          </DropdownMenuItem>
                        )}
                        
                        {order.status === 'shipped' && (
                          <DropdownMenuItem 
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            disabled={updating === order.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Marcar como Completado
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem onClick={() => sendEmailNotification(order)}>
                          <Mail className="h-4 w-4 mr-2" />
                          Enviar Notificación
                        </DropdownMenuItem>
                        
                        {order.mp_payment_id && (
                          <DropdownMenuItem asChild>
                            <a 
                              href={`https://www.mercadopago.com.ar/activities?id=${order.mp_payment_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Ver en MercadoPago
                            </a>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-tierra-media mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-azul-profundo mb-2">
                No hay pedidos
              </h3>
              <p className="text-tierra-media">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No se encontraron pedidos con los filtros aplicados'
                  : 'Aún no hay pedidos para mostrar'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-azul-profundo">
              Detalles del Pedido
            </DialogTitle>
            <DialogDescription>
              {selectedOrder?.order_number}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-azul-profundo mb-2">Cliente</h4>
                  <div className="space-y-1">
                    <p className="flex items-center text-sm">
                      <User className="h-4 w-4 mr-2 text-tierra-media" />
                      {selectedOrder.customer_name}
                    </p>
                    <p className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-tierra-media" />
                      {selectedOrder.customer_email}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-azul-profundo mb-2">Pago</h4>
                  <div className="space-y-1">
                    <p className="flex items-center text-sm">
                      <CreditCard className="h-4 w-4 mr-2 text-tierra-media" />
                      {selectedOrder.mp_payment_method || 'MercadoPago'}
                    </p>
                    {selectedOrder.mp_payment_id && (
                      <p className="text-xs text-tierra-media">
                        ID: {selectedOrder.mp_payment_id}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-semibold text-azul-profundo mb-3">Productos</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-azul-profundo">{item.product_name}</p>
                        {item.variant_title && (
                          <p className="text-xs text-tierra-media">Variante: {item.variant_title}</p>
                        )}
                        <p className="text-sm text-tierra-media">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-verde-suave">
                        {formatPrice(item.unit_price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold text-azul-profundo">Total del Pedido</h4>
                  <p className="text-2xl font-bold text-verde-suave">
                    {formatPrice(selectedOrder.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
