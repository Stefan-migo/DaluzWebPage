"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface EditOrderDialogProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

interface ItemDraft {
  id?: string;
  product_id?: string | null;
  product_name: string;
  variant_title?: string | null;
  quantity: number;
  unit_price: number;
}

interface ShippingDraft {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
}

interface FormState {
  customer_email: string;
  customer_name: string;
  shipping: ShippingDraft;
  items: ItemDraft[];
  tracking_number: string;
  carrier: string;
  notes: string;
  subtotal: number;
  total_amount: number;
}

export default function EditOrderDialog({
  orderId,
  open,
  onOpenChange,
  onSaved,
}: EditOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productResults, setProductResults] = useState<any[]>([]);
  const [searchingProducts, setSearchingProducts] = useState(false);
  const [openProductSearch, setOpenProductSearch] = useState(false);

  const loadOrder = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to load order");
      const json = await res.json();
      const o = json.order;

      const items: ItemDraft[] = (o.order_items || []).map((it: any) => ({
        id: it.id,
        product_id: it.product_id ?? null,
        product_name: it.product_name,
        variant_title: it.variant_title ?? null,
        quantity: Number(it.quantity) || 0,
        unit_price: Number(it.unit_price) || 0,
      }));

      setForm({
        customer_email: o.email ?? "",
        customer_name: [o.shipping_first_name, o.shipping_last_name]
          .filter(Boolean)
          .join(" "),
        shipping: {
          first_name: o.shipping_first_name ?? "",
          last_name: o.shipping_last_name ?? "",
          address_1: o.shipping_address_1 ?? "",
          address_2: o.shipping_address_2 ?? "",
          city: o.shipping_city ?? "",
          state: o.shipping_state ?? "",
          postal_code: o.shipping_postal_code ?? "",
          phone: o.shipping_phone ?? "",
        },
        items,
        tracking_number: o.tracking_number ?? "",
        carrier: o.carrier ?? "",
        notes: o.customer_notes ?? "",
        subtotal: Number(o.subtotal) || 0,
        total_amount: Number(o.total_amount) || 0,
      });
    } catch (e) {
      console.error(e);
      toast.error("Error al cargar el pedido");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [orderId, onOpenChange]);

  useEffect(() => {
    if (open && orderId) {
      loadOrder();
    } else {
      setForm(null);
      setProductSearch("");
      setProductResults([]);
    }
  }, [open, orderId, loadOrder]);

  // Product search (debounced)
  useEffect(() => {
    if (productSearch.length < 2) {
      setProductResults([]);
      return;
    }
    setSearchingProducts(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `/api/admin/products/search?q=${encodeURIComponent(productSearch)}`,
        );
        if (r.ok) {
          const j = await r.json();
          setProductResults(j.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setSearchingProducts(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [productSearch]);

  const subtotalFromItems = (items: ItemDraft[]) =>
    items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const updateItem = (idx: number, patch: Partial<ItemDraft>) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = prev.items.map((it, i) =>
        i === idx ? { ...it, ...patch } : it,
      );
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
  };

  const removeItem = (idx: number) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = prev.items.filter((_, i) => i !== idx);
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
  };

  const addProduct = (product: any) => {
    setForm((prev) => {
      if (!prev) return prev;
      const items = [
        ...prev.items,
        {
          product_id: product.id,
          product_name: product.name,
          variant_title: null,
          quantity: 1,
          unit_price: Number(product.price) || 0,
        },
      ];
      const newSubtotal = subtotalFromItems(items);
      return { ...prev, items, subtotal: newSubtotal, total_amount: newSubtotal };
    });
    setProductSearch("");
    setOpenProductSearch(false);
  };

  const recalculate = () => {
    setForm((prev) =>
      prev ? { ...prev, total_amount: subtotalFromItems(prev.items) } : prev,
    );
  };

  const validate = (f: FormState): string | null => {
    if (f.items.length < 1) return "El pedido debe tener al menos un producto";
    for (const it of f.items) {
      if (!it.product_name.trim()) return "Hay items sin nombre de producto";
      if (!Number.isFinite(it.quantity) || it.quantity < 1)
        return "Hay items con cantidad inválida";
      if (!Number.isFinite(it.unit_price) || it.unit_price < 0)
        return "Hay items con precio inválido";
    }
    if (!Number.isFinite(f.total_amount) || f.total_amount < 0)
      return "Total inválido";
    return null;
  };

  const handleSave = async () => {
    if (!form || !orderId) return;
    const err = validate(form);
    if (err) {
      toast.error(err);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        shipping: form.shipping,
        items: form.items.map((it) => ({
          product_id: it.product_id ?? null,
          product_name: it.product_name,
          variant_title: it.variant_title ?? null,
          quantity: it.quantity,
          unit_price: it.unit_price,
        })),
        tracking_number: form.tracking_number,
        carrier: form.carrier,
        notes: form.notes,
        subtotal: form.subtotal,
        total_amount: form.total_amount,
      };
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.status === 409) {
        const j = await res.json().catch(() => ({}));
        toast.error(
          `Stock insuficiente para ${j.product_name ?? "producto"}. Disponible: ${j.available ?? 0}`,
        );
        return;
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        toast.error(j.error || "Error al guardar el pedido");
        return;
      }
      toast.success("Pedido actualizado");
      onSaved();
      onOpenChange(false);
    } catch (e) {
      console.error(e);
      toast.error("Error al guardar el pedido");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Pedido</DialogTitle>
          <DialogDescription>
            Modifica los datos del pedido. El stock se ajustará automáticamente.
          </DialogDescription>
        </DialogHeader>

        {loading || !form ? (
          <div className="py-8 flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Customer */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={form.customer_email} disabled />
                </div>
                <div>
                  <Label>Nombre</Label>
                  <Input value={form.customer_name} disabled />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nombre</Label>
                    <Input
                      value={form.shipping.first_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, first_name: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Apellido</Label>
                    <Input
                      value={form.shipping.last_name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, last_name: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Dirección</Label>
                  <Input
                    value={form.shipping.address_1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shipping: { ...form.shipping, address_1: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label>Ciudad</Label>
                    <Input
                      value={form.shipping.city}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, city: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Provincia</Label>
                    <Input
                      value={form.shipping.state}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, state: e.target.value },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      value={form.shipping.postal_code}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          shipping: { ...form.shipping, postal_code: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    value={form.shipping.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shipping: { ...form.shipping, phone: e.target.value },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Productos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="relative">
                  <Label>Buscar producto</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar productos por nombre..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setOpenProductSearch(true);
                      }}
                      className="pl-10"
                    />
                    {searchingProducts && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                    )}
                  </div>
                  {openProductSearch && productResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {productResults.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => addProduct(p)}
                          className="w-full p-3 text-left hover:bg-gray-100 border-b last:border-b-0"
                        >
                          <div className="flex justify-between">
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-sm text-gray-600">
                                Stock: {p.inventory_quantity}
                              </div>
                            </div>
                            <div className="font-semibold">
                              ${Number(p.price).toFixed(2)}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {form.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 items-end p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <Label>Producto</Label>
                      <Input
                        value={it.product_name}
                        onChange={(e) =>
                          updateItem(idx, { product_name: e.target.value })
                        }
                        disabled={!!it.product_id}
                      />
                      {it.variant_title && (
                        <div className="text-xs text-gray-500 mt-1">
                          Variante: {it.variant_title}
                        </div>
                      )}
                    </div>
                    <div className="w-24">
                      <Label>Cantidad</Label>
                      <Input
                        type="number"
                        min={1}
                        value={it.quantity}
                        onChange={(e) =>
                          updateItem(idx, {
                            quantity: parseInt(e.target.value, 10) || 1,
                          })
                        }
                      />
                    </div>
                    <div className="w-32">
                      <Label>Precio</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={it.unit_price}
                        onChange={(e) =>
                          updateItem(idx, {
                            unit_price: parseFloat(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItem(idx)}
                      aria-label="Eliminar item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Tracking + Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Envío y Notas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Tracking</Label>
                    <Input
                      value={form.tracking_number}
                      onChange={(e) =>
                        setForm({ ...form, tracking_number: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Transportista</Label>
                    <Input
                      value={form.carrier}
                      onChange={(e) =>
                        setForm({ ...form, carrier: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Notas</Label>
                  <Textarea
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Totals */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div>
                <div className="text-sm text-gray-600">Subtotal</div>
                <div className="text-lg font-semibold">
                  ${form.subtotal.toFixed(2)}
                </div>
              </div>
              <div className="flex items-end gap-3">
                <div>
                  <Label>Total</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.total_amount}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        total_amount: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <Button type="button" variant="outline" onClick={recalculate}>
                  Recalcular
                </Button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar cambios"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
