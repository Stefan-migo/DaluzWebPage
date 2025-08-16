"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Package, CreditCard, Clock, ArrowRight } from 'lucide-react';
import { formatArgentinePesos } from '@/lib/mercadopago';
import { useCart } from '@/contexts/CartContext';

interface OrderDetails {
  order_id: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_id?: string;
  payment_method?: string;
  created_at: string;
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartCleared, setCartCleared] = useState(false);

  // Get URL parameters from Mercado Pago redirect
  const collection_id = searchParams.get('collection_id');
  const collection_status = searchParams.get('collection_status');
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');
  const payment_type = searchParams.get('payment_type');
  const merchant_order_id = searchParams.get('merchant_order_id');
  const preference_id = searchParams.get('preference_id');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!external_reference) {
          setError('No se encontró información de la orden.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/checkout?order_id=${external_reference}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Error al obtener detalles de la orden');
        }

        setOrderDetails({
          order_id: data.order_id,
          status: data.status,
          total_amount: data.total_amount,
          currency: data.currency,
          payment_id: payment_id || undefined,
          payment_method: payment_type || undefined,
          created_at: data.created_at
        });

        // Clear cart only after successful order confirmation and only once
        if (!cartCleared && (status === 'approved' || collection_status === 'approved')) {
          clearCart();
          setCartCleared(true);
          console.log('🛒 Cart cleared after successful payment');
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('No se pudieron cargar los detalles de la orden.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [external_reference, payment_id, payment_type, status, collection_status, clearCart, cartCleared]);

  const getStatusInfo = () => {
    const statusLower = status?.toLowerCase() || collection_status?.toLowerCase();
    
    switch (statusLower) {
      case 'approved':
        return {
          icon: <CheckCircle className="h-16 w-16 text-verde-suave" />,
          title: '¡Pago Exitoso!',
          message: 'Tu pago ha sido procesado correctamente.',
          color: 'bg-verde-suave/10 text-verde-suave',
          badge: 'Aprobado'
        };
      case 'pending':
        return {
          icon: <Clock className="h-16 w-16 text-dorado" />,
          title: 'Pago Pendiente',
          message: 'Tu pago está siendo procesado. Te notificaremos cuando se complete.',
          color: 'bg-dorado/10 text-dorado',
          badge: 'Pendiente'
        };
      case 'in_process':
        return {
          icon: <Clock className="h-16 w-16 text-azul-profundo" />,
          title: 'Pago en Proceso',
          message: 'Tu pago está siendo verificado. Esto puede tomar unos minutos.',
          color: 'bg-azul-profundo/10 text-azul-profundo',
          badge: 'En Proceso'
        };
      default:
        return {
          icon: <CheckCircle className="h-16 w-16 text-verde-suave" />,
          title: 'Orden Recibida',
          message: 'Hemos recibido tu orden y estamos procesando el pago.',
          color: 'bg-verde-suave/10 text-verde-suave',
          badge: 'Recibida'
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-dorado mx-auto mb-4"></div>
            <p className="text-gris-oscuro">Cargando detalles de tu orden...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <CreditCard className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-azul-profundo mb-4">Error</h1>
            <p className="text-gris-oscuro mb-6">{error}</p>
            <Button onClick={() => router.push('/')} className="w-full">
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <Card className="mb-8 border-2 border-verde-suave/20">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {statusInfo.icon}
            </div>
            <h1 className="text-3xl font-bold text-azul-profundo mb-4">
              {statusInfo.title}
            </h1>
            <p className="text-lg text-gris-oscuro mb-6">
              {statusInfo.message}
            </p>
            <Badge className={statusInfo.color}>
              {statusInfo.badge}
            </Badge>
          </CardContent>
        </Card>

        {/* Order Details */}
        {orderDetails && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-azul-profundo">
                <Package className="h-5 w-5" />
                Detalles de tu Orden
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gris-medio">Número de Orden</p>
                  <p className="font-semibold">#{orderDetails.order_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gris-medio">Total</p>
                  <p className="font-semibold text-lg text-verde-suave">
                    {formatArgentinePesos(orderDetails.total_amount)}
                  </p>
                </div>
                {orderDetails.payment_id && (
                  <div>
                    <p className="text-sm text-gris-medio">ID de Pago</p>
                    <p className="font-mono text-sm">{orderDetails.payment_id}</p>
                  </div>
                )}
                {orderDetails.payment_method && (
                  <div>
                    <p className="text-sm text-gris-medio">Método de Pago</p>
                    <p className="font-semibold capitalize">{orderDetails.payment_method}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-azul-profundo">¿Qué sigue?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-dorado flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <p className="font-semibold">Confirmación por Email</p>
                  <p className="text-sm text-gris-medio">Te enviaremos un email con todos los detalles de tu orden</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-dorado flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <p className="font-semibold">Preparación</p>
                  <p className="text-sm text-gris-medio">Preparamos cuidadosamente tus productos naturales</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-dorado flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <p className="font-semibold">Envío</p>
                  <p className="text-sm text-gris-medio">Te notificaremos cuando tu pedido esté en camino</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="flex-1">
            <Link href="/mis-pedidos">
              Ver Mis Pedidos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/productos">
              Seguir Comprando
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <Card className="mt-8 bg-azul-profundo/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-azul-profundo mb-2">¿Necesitas Ayuda?</h3>
            <p className="text-sm text-gris-oscuro mb-4">
              Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos
            </p>
            <Button variant="outline" asChild>
              <Link href="/contacto">
                Contactar Soporte
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-dorado mx-auto mb-4"></div>
            <p className="text-gris-oscuro">Cargando detalles de tu orden...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 