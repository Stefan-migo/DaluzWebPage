"use client";

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, CreditCard, AlertTriangle, ArrowLeft, RefreshCw, HelpCircle } from 'lucide-react';

export default function CheckoutFailurePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Get URL parameters from Mercado Pago redirect
  const collection_status = searchParams.get('collection_status');
  const payment_id = searchParams.get('payment_id');
  const status = searchParams.get('status');
  const external_reference = searchParams.get('external_reference');
  const payment_type = searchParams.get('payment_type');
  const status_detail = searchParams.get('status_detail');

  useEffect(() => {
    setLoading(false);
  }, []);

  const getFailureInfo = () => {
    const statusLower = status?.toLowerCase() || collection_status?.toLowerCase();
    
    switch (statusLower) {
      case 'rejected':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Pago Rechazado',
          message: 'Tu pago no pudo ser procesado. Por favor verifica los datos de tu tarjeta.',
          color: 'bg-red-50 text-red-600 border-red-200',
          reasons: [
            'Datos de tarjeta incorrectos',
            'Fondos insuficientes',
            'Tarjeta vencida o bloqueada',
            'Límite de compra excedido'
          ]
        };
      case 'cancelled':
        return {
          icon: <AlertTriangle className="h-16 w-16 text-orange-500" />,
          title: 'Pago Cancelado',
          message: 'El pago fue cancelado. Puedes intentar nuevamente cuando gustes.',
          color: 'bg-orange-50 text-orange-600 border-orange-200',
          reasons: [
            'Cancelación manual durante el proceso',
            'Sesión expirada',
            'Cierre de ventana de pago'
          ]
        };
      default:
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: 'Error en el Pago',
          message: 'Ocurrió un problema durante el procesamiento del pago.',
          color: 'bg-red-50 text-red-600 border-red-200',
          reasons: [
            'Error temporal del sistema',
            'Problema de conexión',
            'Datos incompletos'
          ]
        };
    }
  };

  const getStatusDetailMessage = (detail: string | null) => {
    if (!detail) return null;
    
    const details: Record<string, string> = {
      'cc_rejected_insufficient_amount': 'Fondos insuficientes en la tarjeta',
      'cc_rejected_bad_filled_card_number': 'Número de tarjeta incorrecto',
      'cc_rejected_bad_filled_date': 'Fecha de vencimiento incorrecta',
      'cc_rejected_bad_filled_security_code': 'Código de seguridad incorrecto',
      'cc_rejected_bad_filled_other': 'Datos de tarjeta incorrectos',
      'cc_rejected_max_attempts': 'Máximo de intentos excedido',
      'cc_rejected_duplicated_payment': 'Pago duplicado detectado',
      'cc_rejected_card_disabled': 'Tarjeta deshabilitada',
      'cc_rejected_call_for_authorize': 'Debes autorizar el pago con tu banco',
      'cc_rejected_card_error': 'Error en la tarjeta',
      'cc_rejected_blacklist': 'Tarjeta en lista negra'
    };
    
    return details[detail] || detail;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-b-2 border-dorado mx-auto mb-4"></div>
            <p className="text-gris-oscuro">Procesando información...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const failureInfo = getFailureInfo();
  const statusDetailMessage = getStatusDetailMessage(status_detail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-crema-suave to-blanco py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Failure Header */}
        <Card className="mb-8 border-2 border-red-200">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              {failureInfo.icon}
            </div>
            <h1 className="text-3xl font-bold text-azul-profundo mb-4">
              {failureInfo.title}
            </h1>
            <p className="text-lg text-gris-oscuro mb-6">
              {failureInfo.message}
            </p>
            <Badge variant="destructive" className="mb-4">
              {status?.toUpperCase() || 'ERROR'}
            </Badge>
            
            {statusDetailMessage && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-sm text-red-700 font-medium">
                  Detalle: {statusDetailMessage}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Information */}
        {external_reference && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-azul-profundo">
                <CreditCard className="h-5 w-5" />
                Información del Intento de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gris-medio">Referencia de Orden</p>
                  <p className="font-semibold">#{external_reference}</p>
                </div>
                {payment_id && (
                  <div>
                    <p className="text-sm text-gris-medio">ID de Transacción</p>
                    <p className="font-mono text-sm">{payment_id}</p>
                  </div>
                )}
                {payment_type && (
                  <div>
                    <p className="text-sm text-gris-medio">Método de Pago</p>
                    <p className="font-semibold capitalize">{payment_type}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gris-medio">Estado</p>
                  <p className="font-semibold text-red-600">
                    {status ? (status.charAt(0).toUpperCase() + status.slice(1)) : 'Error'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Possible Reasons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-azul-profundo">
              <HelpCircle className="h-5 w-5" />
              Posibles Causas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {failureInfo.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-gris-medio mt-2 flex-shrink-0"></div>
                  <span className="text-gris-oscuro">{reason}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Solutions */}
        <Card className="mb-8 bg-azul-profundo/5">
          <CardHeader>
            <CardTitle className="text-azul-profundo">¿Qué puedes hacer?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-verde-suave flex items-center justify-center text-white text-sm font-bold">1</div>
                <div>
                  <p className="font-semibold">Verificar Datos</p>
                  <p className="text-sm text-gris-medio">Revisa que los datos de tu tarjeta sean correctos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-verde-suave flex items-center justify-center text-white text-sm font-bold">2</div>
                <div>
                  <p className="font-semibold">Intentar Otro Método</p>
                  <p className="text-sm text-gris-medio">Prueba con otra tarjeta o método de pago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-verde-suave flex items-center justify-center text-white text-sm font-bold">3</div>
                <div>
                  <p className="font-semibold">Contactar al Banco</p>
                  <p className="text-sm text-gris-medio">Si el problema persiste, contacta a tu banco</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button 
            onClick={() => router.back()} 
            className="flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Intentar Nuevamente
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/productos">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Productos
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <Card className="bg-dorado/5">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold text-azul-profundo mb-2">¿Necesitas Ayuda?</h3>
            <p className="text-sm text-gris-oscuro mb-4">
              Nuestro equipo está disponible para ayudarte con cualquier problema de pago
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild className="flex-1">
                <Link href="/contacto">
                  Contactar Soporte
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link href="/ayuda/pagos">
                  Ayuda con Pagos
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 