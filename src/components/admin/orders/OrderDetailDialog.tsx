"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { User, Mail, CreditCard } from "lucide-react";
import type { Order } from "@/types/admin";

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

export default function OrderDetailDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl max-h-[80vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
      >
        <DialogHeader>
          <DialogTitle id="order-detail-title" className="text-azul-profundo">
            Detalles del Pedido
          </DialogTitle>
          <DialogDescription>Pedido {order.order_number}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-azul-profundo mb-2">Cliente</h4>
              <div className="space-y-1">
                <p className="flex items-center text-sm">
                  <User
                    className="h-4 w-4 mr-2 text-tierra-media"
                    aria-hidden="true"
                  />
                  {order.customer_name}
                </p>
                <p className="flex items-center text-sm">
                  <Mail
                    className="h-4 w-4 mr-2 text-tierra-media"
                    aria-hidden="true"
                  />
                  {order.customer_email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-azul-profundo mb-2">Pago</h4>
              <div className="space-y-1">
                <p className="flex items-center text-sm">
                  <CreditCard className="h-4 w-4 mr-2 text-tierra-media" />
                  {order.mp_payment_method || "MercadoPago"}
                </p>
                {order.mp_payment_id && (
                  <p className="text-xs text-tierra-media">
                    ID: {order.mp_payment_id}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-semibold text-azul-profundo mb-3">Productos</h4>
            <div className="space-y-2">
              {order.order_items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-azul-profundo">
                      {item.product_name}
                    </p>
                    {item.variant_title && (
                      <p className="text-xs text-tierra-media">
                        Variante: {item.variant_title}
                      </p>
                    )}
                    <p className="text-sm text-tierra-media">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-verde-suave">
                    {formatPrice(item.unit_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-azul-profundo">
                Total del Pedido
              </h4>
              <p className="text-2xl font-bold text-verde-suave">
                {formatPrice(order.total_amount)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
