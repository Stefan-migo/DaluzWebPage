'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface CreateManualOrderFormProps {
  onSubmit: (orderData: any) => void;
  onCancel: () => void;
}

export default function CreateManualOrderForm({ onSubmit, onCancel }: CreateManualOrderFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    status: 'pending',
    payment_status: 'paid',
    payment_method: 'transfer',
    subtotal: 0,
    total_amount: 0,
    notes: '',
    shipping: {
      first_name: '',
      last_name: '',
      address_1: '',
      city: '',
      state: '',
      postal_code: '',
      phone: ''
    },
    items: [] as Array<{
      product_name: string;
      quantity: number;
      unit_price: number;
    }>
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShippingChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [field]: value
      }
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_name: '', quantity: 1, unit_price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateTotal = () => {
    const itemsTotal = formData.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    setFormData(prev => ({
      ...prev,
      subtotal: itemsTotal,
      total_amount: itemsTotal
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Customer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-azul-profundo">Información del Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email del Cliente *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-azul-profundo">Detalles del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Estado</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="payment_status">Estado del Pago</Label>
              <Select value={formData.payment_status} onValueChange={(value) => handleInputChange('payment_status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="failed">Fallido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="payment_method">Método de Pago</Label>
            <Select value={formData.payment_method} onValueChange={(value) => handleInputChange('payment_method', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transfer">Transferencia</SelectItem>
                <SelectItem value="cash">Efectivo</SelectItem>
                <SelectItem value="check">Cheque</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Notas del Pedido</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionales sobre el pedido..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-azul-profundo">Información de Envío</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shipping_first_name">Nombre</Label>
              <Input
                id="shipping_first_name"
                value={formData.shipping.first_name}
                onChange={(e) => handleShippingChange('first_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="shipping_last_name">Apellido</Label>
              <Input
                id="shipping_last_name"
                value={formData.shipping.last_name}
                onChange={(e) => handleShippingChange('last_name', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shipping_address_1">Dirección</Label>
            <Input
              id="shipping_address_1"
              value={formData.shipping.address_1}
              onChange={(e) => handleShippingChange('address_1', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shipping_city">Ciudad</Label>
              <Input
                id="shipping_city"
                value={formData.shipping.city}
                onChange={(e) => handleShippingChange('city', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="shipping_state">Provincia</Label>
              <Input
                id="shipping_state"
                value={formData.shipping.state}
                onChange={(e) => handleShippingChange('state', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="shipping_postal_code">Código Postal</Label>
              <Input
                id="shipping_postal_code"
                value={formData.shipping.postal_code}
                onChange={(e) => handleShippingChange('postal_code', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shipping_phone">Teléfono</Label>
            <Input
              id="shipping_phone"
              value={formData.shipping.phone}
              onChange={(e) => handleShippingChange('phone', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-azul-profundo">Productos del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="flex gap-4 items-end">
              <div className="flex-1">
                <Label>Nombre del Producto</Label>
                <Input
                  value={item.product_name}
                  onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                  placeholder="Ej: Crema Hidratante Rosa Mosqueta"
                />
              </div>
              <div className="w-24">
                <Label>Cantidad</Label>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="w-32">
                <Label>Precio Unitario</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={addItem}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>

          <div className="flex justify-between items-center pt-4 border-t">
            <span className="font-semibold">Total: ${formData.total_amount.toFixed(2)}</span>
            <Button
              type="button"
              variant="outline"
              onClick={calculateTotal}
            >
              Recalcular Total
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Pedido'}
        </Button>
      </div>
    </form>
  );
}
