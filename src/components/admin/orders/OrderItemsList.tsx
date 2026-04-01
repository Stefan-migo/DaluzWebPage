"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import type { OrderItem } from "@/types/admin";

interface OrderItemsListProps {
  items: OrderItem[];
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
  onUpdateItem: (
    index: number,
    field: keyof OrderItem,
    value: string | number,
  ) => void;
  onRecalculate: () => void;
}

export default function OrderItemsList({
  items,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onRecalculate,
}: OrderItemsListProps) {
  const calculateSubtotal = (): number => {
    return items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0,
    );
  };

  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleQuantityChange = (index: number, value: string) => {
    const quantity = parseInt(value) || 1;
    onUpdateItem(index, "quantity", quantity);
    setTimeout(onRecalculate, 100);
  };

  const handlePriceChange = (index: number, value: string) => {
    const price = parseFloat(value) || 0;
    onUpdateItem(index, "unit_price", price);
    setTimeout(onRecalculate, 100);
  };

  const handleRemove = (index: number) => {
    onRemoveItem(index);
    setTimeout(onRecalculate, 100);
  };

  return (
    <div className="space-y-4">
      {/* Items List */}
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 items-end p-3 bg-gray-50 rounded-lg"
        >
          <div className="flex-1">
            <Label>Nombre del Producto</Label>
            <Input
              value={item.product_name}
              onChange={(e) =>
                onUpdateItem(index, "product_name", e.target.value)
              }
              placeholder="Ej: Crema Hidratante Rosa Mosqueta"
            />
          </div>
          <div className="w-24">
            <Label>Cantidad</Label>
            <Input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleQuantityChange(index, e.target.value)}
            />
          </div>
          <div className="w-32">
            <Label>Precio Unitario</Label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unit_price}
              onChange={(e) => handlePriceChange(index, e.target.value)}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => handleRemove(index)}
            aria-label={`Eliminar item ${item.product_name || index + 1}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      ))}

      {/* Add Item Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onAddItem}
        className="w-full"
        aria-label="Agregar nuevo producto manualmente"
      >
        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
        Agregar Producto Manual
      </Button>

      {/* Total Section */}
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <div className="text-sm text-gray-600">Subtotal</div>
          <div className="text-2xl font-bold text-verde-suave">
            {formatPrice(calculateSubtotal())}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onRecalculate}
          aria-label="Recalcular total del pedido"
        >
          <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
          Recalcular Total
        </Button>
      </div>
    </div>
  );
}
