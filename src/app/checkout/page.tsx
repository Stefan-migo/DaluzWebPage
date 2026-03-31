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
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { createClient } from "@/utils/supabase/client";

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
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [form, setForm] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    addressNumber: "", // Added for street number
    city: "",
    state: "",
    zipCode: "",
    notes: "",
  });

  // Initialize Mercado Pago with dynamic public key
  useEffect(() => {
    const initializeMercadoPago = async () => {
      try {
        // Try to get public key from API (uses correct key based on test_mode)
        const response = await fetch("/api/mercadopago/public-key");
        const data = await response.json();

        if (data.publicKey) {
          initMercadoPago(data.publicKey);
        } else {
          // Fallback to environment variable
          initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!);
        }
      } catch (error) {
        console.warn(
          "Failed to fetch dynamic public key, using env fallback:",
          error,
        );
        // Fallback to environment variable
        initMercadoPago(process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY!);
      }
    };

    initializeMercadoPago();
  }, []);

  // Redirect if cart is empty
  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-admin-bg-primary">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-admin-text-primary/30 mx-auto mb-4" />
            <h1 className="text-2xl font-title font-bold text-admin-text-primary mb-2">
              Tu carrito está vacío
            </h1>
            <p className="text-admin-text-secondary mb-6">
              Agrega algunos productos a tu carrito antes de proceder al
              checkout.
            </p>
            <Link href="/productos">
              <Button
                className="bg-admin-bg-secondary hover:bg-admin-bg-secondary/90 text-white font-semibold font-title transition-all"
                style={{ borderRadius: "0px 15px" }}
              >
                Ir a productos
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const shippingThreshold = 50000;
  const shippingCost = total >= shippingThreshold ? 0 : 5000;
  const totalWithShipping = total + shippingCost;

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "addressNumber",
      "city",
      "state",
      "zipCode",
    ];
    for (const field of required) {
      if (!form[field as keyof CheckoutForm]) {
        toast.error(`El campo ${field} es requerido`);
        return false;
      }
    }
    // Validar que se acepten los términos y condiciones
    if (!acceptTerms) {
      setTermsError(true);
      toast.error(
        "Debes aceptar los Términos y Condiciones y la Política de Privacidad para continuar",
      );
      return false;
    }
    setTermsError(false);
    return true;
  };

  const handleAcceptTerms = (checked: boolean) => {
    setAcceptTerms(checked);
    if (checked) setTermsError(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (!user) {
      toast.error("Debes iniciar sesión para continuar");
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      // Get the current session token for authentication
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization header if session exists
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
        console.log("Checkout: Adding auth token to request");
      } else {
        console.warn(
          "Checkout: No session token available, trying without auth",
        );
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: items,
          customerInfo: form,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Log detailed error information
        console.error("Checkout API error response:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Create a more detailed error message
        const errorMessage =
          data.details || data.error || "Failed to create payment preference";
        const fullError = data.mercadopagoResponse
          ? `${errorMessage}: ${JSON.stringify(data.mercadopagoResponse)}`
          : errorMessage;

        throw new Error(fullError);
      }

      if (data.id) {
        setPreferenceId(data.id);
        // The Wallet component will now be rendered and will handle the redirect
      } else {
        toast.error("Could not start payment process.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error al procesar el pedido";
      toast.error(
        errorMessage.length > 100
          ? "Error al procesar el pedido. Por favor, verifica los datos e intenta nuevamente."
          : errorMessage,
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-admin-bg-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/productos"
            className="inline-flex items-center mb-4 transition-colors"
            style={{ color: "#AE0000" }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Link>
          <h1
            className="text-3xl font-title font-bold"
            style={{ color: "#AE0000" }}
          >
            Finalizar compra
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <Card
              className="shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ borderRadius: "0px 15px", backgroundColor: "#F0EACE" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center font-title"
                  style={{ color: "#AE0000" }}
                >
                  <User className="h-5 w-5 mr-2" style={{ color: "#AE0000" }} />
                  Información personal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Nombre *
                    </label>
                    <Input
                      value={form.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      placeholder="Tu nombre"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Apellido *
                    </label>
                    <Input
                      value={form.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      placeholder="Tu apellido"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="tu@email.com"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Teléfono *
                    </label>
                    <Input
                      value={form.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+54 9 11 1234-5678"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Information */}
            <Card
              className="shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ borderRadius: "0px 15px", backgroundColor: "#F0EACE" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center font-title"
                  style={{ color: "#AE0000" }}
                >
                  <MapPin
                    className="h-5 w-5 mr-2"
                    style={{ color: "#AE0000" }}
                  />
                  Dirección de envío
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Calle *
                    </label>
                    <Input
                      value={form.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="E.g., Av. Corrientes"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Número *
                    </label>
                    <Input
                      value={form.addressNumber}
                      onChange={(e) =>
                        handleInputChange("addressNumber", e.target.value)
                      }
                      placeholder="E.g., 1234"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Ciudad *
                    </label>
                    <Input
                      value={form.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      placeholder="Ciudad"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Provincia *
                    </label>
                    <Input
                      value={form.state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                      placeholder="Provincia"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                  <div>
                    <label
                      className="text-sm font-medium mb-1 block"
                      style={{ color: "#AE0000" }}
                    >
                      Código Postal *
                    </label>
                    <Input
                      value={form.zipCode}
                      onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                      }
                      placeholder="CP"
                      className="text-admin-text-primary"
                      style={{ backgroundColor: "#FFFFFF" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "#AE0000" }}
                  >
                    Notas adicionales
                  </label>
                  <Input
                    value={form.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Instrucciones especiales de entrega (opcional)"
                    className="text-admin-text-primary"
                    style={{ backgroundColor: "#FFFFFF" }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card
              className="shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ borderRadius: "0px 15px", backgroundColor: "#F0EACE" }}
            >
              <CardHeader>
                <CardTitle
                  className="flex items-center font-title"
                  style={{ color: "#AE0000" }}
                >
                  <CreditCard
                    className="h-5 w-5 mr-2"
                    style={{ color: "#AE0000" }}
                  />
                  Método de pago
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="p-4 border rounded-lg"
                  style={{
                    borderRadius: "0px 15px",
                    borderColor: "#AE0000",
                    backgroundColor: "rgba(174, 0, 0, 0.05)",
                  }}
                >
                  <div className="flex items-center justify-center mb-2">
                    <Shield
                      className="h-6 w-6 mr-2"
                      style={{ color: "#AE0000" }}
                    />
                    <span
                      className="font-semibold font-title"
                      style={{ color: "#AE0000" }}
                    >
                      Mercado Pago
                    </span>
                  </div>
                  <p
                    className="text-sm text-center"
                    style={{ color: "#AE0000" }}
                  >
                    Pago seguro con tarjeta de crédito, débito, transferencia
                    bancaria o efectivo
                  </p>
                  <div className="mt-3 flex justify-center">
                    <Badge
                      variant="default"
                      className="bg-admin-success/20 border-admin-success/30"
                    >
                      Pago 100% seguro
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card
              className="shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ borderRadius: "0px 15px", backgroundColor: "#F0EACE" }}
            >
              <CardHeader>
                <CardTitle className="font-title" style={{ color: "#AE0000" }}>
                  Resumen del pedido
                </CardTitle>
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
                        <h4
                          className="font-medium text-sm line-clamp-2"
                          style={{ color: "#AE0000" }}
                        >
                          {item.name}
                        </h4>
                        {item.size && (
                          <p
                            className="text-xs"
                            style={{ color: "#AE0000", opacity: 0.7 }}
                          >
                            {item.size}
                          </p>
                        )}
                        <div className="flex justify-between items-center">
                          <span
                            className="text-sm"
                            style={{ color: "#AE0000", opacity: 0.8 }}
                          >
                            Cantidad: {item.quantity}
                          </span>
                          <span
                            className="font-semibold text-sm"
                            style={{ color: "#AE0000" }}
                          >
                            $
                            {(item.price * item.quantity).toLocaleString(
                              "es-AR",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-gray-300" />

                {/* Totals */}
                <div className="space-y-2">
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "#AE0000", opacity: 0.9 }}
                  >
                    <span>Subtotal:</span>
                    <span>${total.toLocaleString("es-AR")}</span>
                  </div>
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: "#AE0000", opacity: 0.9 }}
                  >
                    <span>Envío:</span>
                    <span
                      style={{
                        color: shippingCost === 0 ? "#10B981" : "#AE0000",
                        opacity: shippingCost === 0 ? 1 : 0.9,
                      }}
                    >
                      {shippingCost === 0
                        ? "Gratis"
                        : `$${shippingCost.toLocaleString("es-AR")}`}
                    </span>
                  </div>
                  {total < shippingThreshold && (
                    <p
                      className="text-xs"
                      style={{ color: "#AE0000", opacity: 0.7 }}
                    >
                      Agregar $
                      {(shippingThreshold - total).toLocaleString("es-AR")} más
                      para envío gratis
                    </p>
                  )}
                  <Separator className="bg-gray-300" />
                  <div
                    className="flex justify-between font-semibold text-lg font-title"
                    style={{ color: "#AE0000" }}
                  >
                    <span>Total:</span>
                    <span>${totalWithShipping.toLocaleString("es-AR")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Info */}
            <Card
              className="shadow-[0_1px_3px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.4)] transition-all"
              style={{ borderRadius: "0px 15px", backgroundColor: "#F0EACE" }}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" style={{ color: "#10B981" }} />
                    <span className="text-sm" style={{ color: "#AE0000" }}>
                      Envío en 3-5 días hábiles
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" style={{ color: "#AE0000" }} />
                    <span className="text-sm" style={{ color: "#AE0000" }}>
                      Compra protegida
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions Checkbox - REQUIRED BY LAW */}
            <div
              className={`p-4 rounded-lg border-2 transition-all ${termsError ? "border-red-500 bg-red-50" : "border-gray-300 bg-white"}`}
              style={{ borderRadius: "0px 15px" }}
            >
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => handleAcceptTerms(e.target.checked)}
                  className="mt-1 h-5 w-5 accent-brand-primary"
                  style={{ accentColor: "#AE0000" }}
                />
                <span className="text-sm" style={{ color: "#AE0000" }}>
                  He leído y acepto los{" "}
                  <Link
                    href="/politicas/terminos"
                    target="_blank"
                    className="underline font-semibold hover:opacity-80"
                  >
                    Términos y Condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="/politicas/privacidad"
                    target="_blank"
                    className="underline font-semibold hover:opacity-80"
                  >
                    Política de Privacidad
                  </Link>
                  . *
                </span>
              </label>
              {termsError && (
                <p className="text-xs text-red-600 mt-2 ml-8">
                  Debes aceptar los términos y condiciones para continuar
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !!preferenceId}
              className="w-full font-semibold h-12 font-title transition-all hover:opacity-90"
              style={{
                borderRadius: "0px 15px",
                backgroundColor: "#AE0000",
                color: "#F0EACE",
              }}
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
    </div>
  );
}
