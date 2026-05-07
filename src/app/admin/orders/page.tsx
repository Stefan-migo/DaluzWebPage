"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, Package, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import CreateManualOrderForm from "@/components/admin/CreateManualOrderForm";
import OrderTable from "@/components/admin/orders/OrderTable";
import OrderDetailDialog from "@/components/admin/orders/OrderDetailDialog";
import EditOrderDialog from "@/components/admin/orders/EditOrderDialog";
import type { Order, OrderStatus, PaymentStatus } from "@/types/admin";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [deletingOrder, setDeletingOrder] = useState<string | null>(null);
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const ordersPerPage = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);

      const offset = (currentPage - 1) * ordersPerPage;
      const params = new URLSearchParams({
        limit: ordersPerPage.toString(),
        offset: offset.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const response = await fetch(`/api/admin/orders?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      setOrders(data.orders || []);
      setTotalOrders(data.total || 0);
      const calculatedTotalPages = Math.ceil((data.total || 0) / ordersPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Error al cargar los pedidos");

      // Mock data for development
      setOrders([
        {
          id: "1",
          order_number: "DL-1704123456",
          customer_name: "María González",
          customer_email: "maria@example.com",
          total_amount: 15750,
          status: "pending" as OrderStatus,
          payment_status: "pending" as PaymentStatus,
          created_at: "2024-01-20T10:30:00Z",
          mp_payment_id: "123456789",
          mp_payment_method: "credit_card",
          order_items: [
            {
              product_name: "Crema Hidratante Rosa Mosqueta",
              quantity: 1,
              unit_price: 12500,
              variant_title: "50ml",
            },
            {
              product_name: "Aceite Corporal Lavanda",
              quantity: 1,
              unit_price: 3250,
            },
          ],
        },
        {
          id: "2",
          order_number: "DL-1704123455",
          customer_name: "Carlos Ruiz",
          customer_email: "carlos@example.com",
          total_amount: 8900,
          status: "completed" as OrderStatus,
          payment_status: "paid" as PaymentStatus,
          created_at: "2024-01-20T09:15:00Z",
          mp_payment_id: "123456788",
          mp_payment_method: "bank_transfer",
          order_items: [
            {
              product_name: "Hidrolato de Rosas",
              quantity: 1,
              unit_price: 8900,
              variant_title: "100ml",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdating(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, status: newStatus as OrderStatus }
            : order,
        ),
      );

      toast.success("Estado del pedido actualizado");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Error al actualizar el pedido");
    } finally {
      setUpdating(null);
    }
  };

  const updatePaymentStatus = async (
    orderId: string,
    newPaymentStatus: string,
  ) => {
    try {
      setUpdating(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      setOrders(
        orders.map((order) =>
          order.id === orderId
            ? { ...order, payment_status: newPaymentStatus as PaymentStatus }
            : order,
        ),
      );

      toast.success("Estado de pago actualizado");
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Error al actualizar el estado de pago");
    } finally {
      setUpdating(null);
    }
  };

  const sendEmailNotification = async (order: Order) => {
    try {
      const response = await fetch(`/api/admin/orders/${order.id}/notify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      toast.success("Notificación enviada al cliente");
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Error al enviar la notificación");
    }
  };

  const createManualOrder = async (orderData: unknown) => {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create_manual_order",
          orderData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      toast.success("Pedido creado exitosamente");
      setShowCreateOrder(false);
      fetchOrders();
    } catch (error) {
      console.error("Error creating manual order:", error);
      toast.error("Error al crear el pedido");
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      setDeletingOrder(orderId);

      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete order");
      }

      toast.success("Pedido eliminado exitosamente");
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error al eliminar el pedido");
    } finally {
      setDeletingOrder(null);
    }
  };

  const displayOrders = searchTerm
    ? orders.filter((order) => {
        const matchesSearch =
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : orders;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div
            className="h-8 rounded w-64 mb-2"
            style={{ backgroundColor: "var(--admin-border-secondary)" }}
          ></div>
          <div
            className="h-4 rounded w-96"
            style={{ backgroundColor: "var(--admin-border-secondary)" }}
          ></div>
        </div>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="h-12 rounded"
                    style={{ backgroundColor: "var(--admin-border-secondary)" }}
                  ></div>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Pedidos
          </h1>
          <p style={{ color: "var(--admin-text-secondary)" }}>
            Administra todos los pedidos de la tienda
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            onClick={fetchOrders}
            className="flex-1 md:flex-none"
            style={{
              borderColor: "var(--admin-border-secondary)",
              color: "var(--admin-text-primary)",
              backgroundColor: "var(--admin-bg-primary)",
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button
            onClick={() => setShowCreateOrder(true)}
            className="flex-1 md:flex-none"
            style={{
              backgroundColor: "var(--admin-bg-secondary)",
              color: "white",
            }}
          >
            <Package className="h-4 w-4 mr-2" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <Input
                  placeholder="Buscar por número, cliente o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                  }}
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full md:w-[200px]"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: "var(--admin-bg-primary)" }}
              >
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-warning)" }}
                    ></span>
                    Pendiente
                  </span>
                </SelectItem>
                <SelectItem value="processing">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-info)" }}
                    ></span>
                    Procesando
                  </span>
                </SelectItem>
                <SelectItem value="shipped">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-info)" }}
                    ></span>
                    Enviado
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-success)" }}
                    ></span>
                    Completado
                  </span>
                </SelectItem>
                <SelectItem value="cancelled">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-error)" }}
                    ></span>
                    Cancelado
                  </span>
                </SelectItem>
                <SelectItem value="refunded">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-text-tertiary)" }}
                    ></span>
                    Reembolsado
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div
            className="mt-3 text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            {searchTerm ? (
              <>
                Resultados para "<strong>{searchTerm}</strong>"
              </>
            ) : (
              <>
                Mostrando <strong>{totalOrders}</strong> pedidos
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-0">
          <OrderTable
            orders={displayOrders}
            loading={loading}
            updating={updating}
            deletingOrder={deletingOrder}
            currentPage={currentPage}
            totalPages={totalPages}
            totalOrders={totalOrders}
            ordersPerPage={ordersPerPage}
            onUpdateStatus={updateOrderStatus}
            onUpdatePaymentStatus={updatePaymentStatus}
            onViewDetails={setSelectedOrder}
            onEditOrder={(order) => setEditingOrderId(order.id)}
            onSendNotification={sendEmailNotification}
            onDeleteOrder={deleteOrder}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        open={!!selectedOrder}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
      />

      {/* Edit Order Dialog */}
      <EditOrderDialog
        orderId={editingOrderId}
        open={!!editingOrderId}
        onOpenChange={(open) => !open && setEditingOrderId(null)}
        onSaved={fetchOrders}
      />

      {/* Create Manual Order Dialog */}
      <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
        <DialogContent
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
          style={{
            backgroundColor: "var(--admin-bg-primary)",
            borderColor: "var(--admin-border-secondary)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "var(--admin-text-primary)" }}>
              Crear Pedido Manual
            </DialogTitle>
            <DialogDescription style={{ color: "var(--admin-text-secondary)" }}>
              Agregar un pedido realizado fuera de la plataforma
            </DialogDescription>
          </DialogHeader>

          <CreateManualOrderForm
            onSubmit={createManualOrder}
            onCancel={() => setShowCreateOrder(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
