"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  ShoppingCart,
  CheckCircle,
  XCircle,
  Clock,
  Package,
} from "lucide-react";
import type { Order } from "@/types/admin";

interface RecentOrdersListProps {
  orders: Order[];
  onViewAll?: () => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("es-AR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Función para obtener el color del estado
function getStatusColor(status: string): {
  bg: string;
  text: string;
  icon: string;
} {
  switch (status) {
    case "completed":
      return {
        bg: "rgba(40, 93, 48, 0.1)",
        text: "var(--admin-success)",
        icon: "var(--admin-success)",
      };
    case "pending":
      return {
        bg: "rgba(255, 78, 33, 0.1)",
        text: "var(--admin-warning)",
        icon: "var(--admin-warning)",
      };
    case "processing":
      return {
        bg: "rgba(29, 63, 106, 0.1)",
        text: "var(--admin-info)",
        icon: "var(--admin-info)",
      };
    case "shipped":
      return {
        bg: "rgba(29, 63, 106, 0.1)",
        text: "var(--admin-info)",
        icon: "var(--admin-info)",
      };
    case "failed":
      return {
        bg: "rgba(139, 0, 0, 0.1)",
        text: "var(--admin-error)",
        icon: "var(--admin-error)",
      };
    case "cancelled":
      return {
        bg: "rgba(139, 0, 0, 0.05)",
        text: "var(--admin-text-tertiary)",
        icon: "var(--admin-text-tertiary)",
      };
    default:
      return {
        bg: "rgba(139, 0, 0, 0.05)",
        text: "var(--admin-text-tertiary)",
        icon: "var(--admin-text-tertiary)",
      };
  }
}

function getOrderStatusBadge(status: string) {
  const colors = getStatusColor(status);

  const iconMap: Record<string, React.ReactNode> = {
    completed: <CheckCircle className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    processing: <Package className="h-3 w-3" />,
    shipped: <Package className="h-3 w-3" />,
    failed: <XCircle className="h-3 w-3" />,
    cancelled: <XCircle className="h-3 w-3" />,
  };

  const labelMap: Record<string, string> = {
    completed: "Completado",
    pending: "Pendiente",
    processing: "Procesando",
    shipped: "Enviado",
    failed: "Fallido",
    cancelled: "Cancelado",
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {iconMap[status] || iconMap.default}
      {labelMap[status] || status}
    </span>
  );
}

export default function RecentOrdersList({
  orders,
  onViewAll,
}: RecentOrdersListProps) {
  return (
    <Card
      className="admin-card"
      style={{ border: "1px solid var(--admin-border-secondary)" }}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle
            className="font-subtitle text-xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Pedidos Recientes
          </CardTitle>
          {onViewAll ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              style={{ color: "var(--admin-accent-secondary)" }}
            >
              Ver todos
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Link href="/admin/orders">
              <Button
                variant="ghost"
                size="sm"
                style={{ color: "var(--admin-accent-secondary)" }}
              >
                Ver todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <Link key={order.id} href={`/admin/orders?id=${order.id}`}>
                <div
                  className="group flex items-center gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer"
                  style={{
                    backgroundColor: "var(--admin-bg-primary)",
                    border: "1px solid var(--admin-border-secondary)",
                  }}
                >
                  {/* Order Number - Left */}
                  <div className="flex-shrink-0 min-w-[60px]">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--admin-accent-secondary)" }}
                    >
                      #{order.order_number}
                    </p>
                  </div>

                  {/* Customer & Items - Center */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-medium text-sm truncate"
                      style={{ color: "var(--admin-text-primary)" }}
                    >
                      {order.customer_name}
                    </p>
                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--admin-text-tertiary)" }}
                    >
                      {(order as any).items_count || 0} producto
                      {((order as any).items_count || 0) !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {/* Amount - Right */}
                  <div className="flex-shrink-0 text-right">
                    <p
                      className="font-semibold text-sm"
                      style={{ color: "var(--admin-success)" }}
                    >
                      {formatPrice(order.total_amount)}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--admin-text-tertiary)" }}
                    >
                      {formatDate(order.created_at)}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {getOrderStatusBadge(order.status)}
                  </div>

                  {/* Arrow Icon - Only visible on hover */}
                  <ArrowRight
                    className="h-4 w-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: "var(--admin-accent-secondary)" }}
                  />
                </div>
              </Link>
            ))
          ) : (
            <div className="flex items-center justify-center h-[200px] text-center">
              <div>
                <ShoppingCart
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  No hay pedidos recientes para mostrar.
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
