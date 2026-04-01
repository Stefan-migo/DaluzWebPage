import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Clock,
  Package,
  Mail,
  Phone,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Botón de Arrepentimiento | DA LUZ CONSCIENTE",
  description:
    "Derecho de arrepentimiento según Ley 24.240 - Devoluciones en Argentina.",
};

export default function ArrepentimientoPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Special Design for Legal Notice */}
      <section className="py-16 px-6 bg-gradient-to-br from-amber-600 to-amber-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Obligatorio por Ley
          </Badge>
          <h1 className="font-velista text-4xl md:text-6xl font-bold mb-6">
            Botón de Arrepentimiento
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Tu derecho a cancelar tu compra dentro de los 10 días corridos
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          {/* Información Principal */}
          <div className="space-y-8">
            {/* ¿Qué es el derecho de arrepentimiento? */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-amber-600" />
                  <CardTitle className="font-velista text-xl">
                    ¿Qué es el Derecho de Arrepentimiento?
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  Según la <strong>Ley 24.240</strong> de Defensa del
                  Consumidor, tenés derecho a arrepentirte de una compra
                  realizada fuera de un local comercial (por ejemplo, por
                  internet, teléfono o catálogo).
                </p>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
                  <p className="text-amber-800 font-medium">
                    Plazo: <strong>10 días corridos</strong> desde que recibís
                    el producto.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Condiciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-amber-600" />
                  <CardTitle className="font-velista text-xl">
                    Condiciones para Ejercer el Derecho
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>
                  Para que tu devolución sea aceptada, el producto debe cumplir
                  con:
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Estado Original</h4>
                      <p className="text-sm">
                        Sin usar, en su empaque original
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Comprobante de Compra</h4>
                      <p className="text-sm">Presentar factura o ticket</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Empaque Ítegro</h4>
                      <p className="text-sm">Sin daños, completo</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Plazo Válido</h4>
                      <p className="text-sm">Dentro de los 10 días</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Excepciones */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                  <CardTitle className="font-velista text-xl">
                    Excepciones
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p className="font-medium text-red-700">
                  IMPORTANTE: El derecho de arrepentimiento NO aplica en los
                  siguientes casos:
                </p>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>
                      Productos digitales descargables (Ebooks) una vez
                      descargado el enlace
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Productos abiertos o usados</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Servicios ya prestados o comenzados</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Productos personalizados o por encargo</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                    <span className="text-red-600 font-bold">✕</span>
                    <span>Productos放入密封包装后打开不能退货 (higiene)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cómo ejercer el derecho */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-amber-600" />
                  <CardTitle className="font-velista text-xl">
                    ¿Cómo Ejercer el Derecho?
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <p>Seguís estos pasos para iniciar el proceso de devolución:</p>
                <div className="space-y-4 mt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold">Contactanos</h4>
                      <p className="text-sm">
                        Envianos un email a{" "}
                        <strong>daluzalkimya@gmail.com</strong> indicando tu
                        número de pedido y motivo de devolución.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold">Te Respondemos</h4>
                      <p className="text-sm">
                        Nuestro equipo te contactará dentro de las 48 horas
                        hábiles para confirmarte los pasos a seguir.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold">Envíanos el Producto</h4>
                      <p className="text-sm">
                        Una vez aprobado, tendrás que enviar el producto a
                        nuestra dirección. Los costos de envío corre por cuenta
                        del comprador.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold">Reembolso</h4>
                      <p className="text-sm">
                        Una vez recibido y verificado el producto, procesamos el
                        reembolso en un plazo de 10 días hábiles.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tiempos */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-amber-600" />
                  <CardTitle className="font-velista text-xl">
                    Tiempos del Proceso
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-primary">
                      Respuesta inicial
                    </h4>
                    <p className="text-2xl font-bold">48 horas</p>
                    <p className="text-sm text-gray-600">hábiles</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-primary">
                      Reembolso
                    </h4>
                    <p className="text-2xl font-bold">10 días</p>
                    <p className="text-sm text-gray-600">
                      hábiles luego de recibido el producto
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacto */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-amber-600" />
                  <CardTitle className="font-velista text-xl text-amber-900">
                    ¿Tenés dudas?
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-amber-900">
                <p>
                  Si tenés alguna consulta sobre el proceso de devolución o
                  necesitás más información, no dudes en contactarnos:
                </p>
                <div className="flex flex-col md:flex-row gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    <span>daluzalkimya@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5" />
                    <span>+54 9 11 1234-5678</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/contacto">
                    <Button
                      className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold font-title transition-all"
                      style={{ borderRadius: "0px 15px" }}
                    >
                      Contactános
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nota legal */}
          <div className="mt-12 p-6 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Nota legal:</strong> Este derecho está regulado por la{" "}
              <strong>Ley 24.240</strong>
              de Defensa del Consumidor y el <strong>Decreto 242/2021</strong>.
              Para más información, consultá la web oficial de{" "}
              <a
                href="https://www.argentina.gob.ar/defensadelconsumidor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-primary underline"
              >
                Defensa del Consumidor
              </a>
              .
            </p>
          </div>

          {/* Footer de la página */}
          <div className="mt-8 text-center py-8 border-t border-gray-200">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-brand-primary hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a la página principal
            </Link>
            <p className="text-gray-500 text-xs mt-4">
              © {new Date().getFullYear()} DA LUZ CONSCIENTE. Todos los
              derechos reservados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
