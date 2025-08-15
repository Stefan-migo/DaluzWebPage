"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  User, 
  Mail, 
  Phone,
  ShoppingBag,
  ArrowLeft,
  Shield
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { createClient } from '@/utils/supabase/client';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressNumber: string; // Added for street number
  city: string;
  state: string;
  zipCode: string;
  notes: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuthContext();
  
  const [loading, setLoading] = useState(false);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    addressNumber: '', // Added for street number
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  // Initialize Mercado Pago
  useEffect(() => {
    initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!);
  }, []);

  // Redirect if cart is empty
  if (items.length === 0 && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-azul-profundo mb-2">Tu carrito está vacío</h1>
          <p className="text-gray-600 mb-6">
            Agrega algunos productos a tu carrito antes de proceder al checkout.
          </p>
          <Link href="/productos">
            <Button className="bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold">
              Ir a productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shippingThreshold = 50000;
  const shippingCost = total >= shippingThreshold ? 0 : 5000;
  const totalWithShipping = total + shippingCost;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address', 'addressNumber', 'city', 'state', 'zipCode'];
    for (const field of required) {
      if (!form[field as keyof CheckoutForm]) {
        toast.error(`El campo ${field} es requerido`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!user) {
      toast.error('Debes iniciar sesión para continuar');
      router.push('/login');
      return;
    }

    setLoading(true);
    
    try {
      // Get the current session token for authentication
      const supabase = createClient();
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if session exists
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
        console.log('Checkout: Adding auth token to request');
      } else {
        console.warn('Checkout: No session token available, trying without auth');
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          items: items,
          customerInfo: form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create preference');
      }

      if (data.id) {
        setPreferenceId(data.id);
        // The Wallet component will now be rendered and will handle the redirect
      } else {
        toast.error('Could not start payment process.');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Error al procesar el pedido');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/productos" className="inline-flex items-center text-azul-profundo hover:text-azul-profundo/80 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a productos
        </Link>
        <h1 className="text-3xl font-bold text-azul-profundo">Finalizar compra</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre *</label>
                  <Input
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Apellido *</label>
                  <Input
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Email *</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Teléfono *</label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Dirección de envío
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Calle *</label>
                  <Input
                    value={form.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="E.g., Av. Corrientes"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Número *</label>
                  <Input
                    value={form.addressNumber}
                    onChange={(e) => handleInputChange('addressNumber', e.target.value)}
                    placeholder="E.g., 1234"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Ciudad *</label>
                  <Input
                    value={form.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Ciudad"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Provincia *</label>
                  <Input
                    value={form.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Provincia"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Código Postal *</label>
                  <Input
                    value={form.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    placeholder="CP"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Notas adicionales</label>
                <Input
                  value={form.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Instrucciones especiales de entrega (opcional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Método de pago
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border border-dorado rounded-lg bg-dorado/5">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="h-6 w-6 text-azul-profundo mr-2" />
                  <span className="font-semibold text-azul-profundo">Mercado Pago</span>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Pago seguro con tarjeta de crédito, débito, transferencia bancaria o efectivo
                </p>
                <div className="mt-3 flex justify-center">
                  <Badge variant="secondary" className="bg-verde-suave/20 text-verde-suave">
                    Pago 100% seguro
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumen del pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative h-16 w-16 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                      {item.size && (
                        <p className="text-xs text-gray-500">{item.size}</p>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Cantidad: {item.quantity}</span>
                        <span className="font-semibold text-sm">
                          ${(item.price * item.quantity).toLocaleString('es-AR')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${total.toLocaleString('es-AR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className={shippingCost === 0 ? "text-verde-suave" : ""}>
                    {shippingCost === 0 ? "Gratis" : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>
                {total < shippingThreshold && (
                  <p className="text-xs text-gray-500">
                    Agregar ${(shippingThreshold - total).toLocaleString('es-AR')} más para envío gratis
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg text-azul-profundo">
                  <span>Total:</span>
                  <span>${totalWithShipping.toLocaleString('es-AR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-verde-suave" />
                  <span className="text-sm">Envío en 3-5 días hábiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-azul-profundo" />
                  <span className="text-sm">Compra protegida</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !!preferenceId}
            className="w-full bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold h-12"
          >
            {loading ? (
              "Procesando..."
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Continuar con el pago
              </>
            )}
          </Button>

          {/* This component will handle the redirect to Mercado Pago */}
          {preferenceId && (
            <div className="mt-4">
              <Wallet initialization={{ preferenceId }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 