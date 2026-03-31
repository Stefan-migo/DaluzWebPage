"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Clock,
  MapPin,
  Package,
  Shield,
  Phone,
  Mail,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  PackageCheck,
  MapPinned,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Metadata is handled by the parent layout or through generateMetadata in server components

const shippingZones = [
  {
    zone: "Córdoba Capital",
    description: "Zona Norte",
    time: "24-48 hs",
    price: "Coordinamos entrega",
    icon: MapPin,
    color: "jade",
  },
  {
    zone: "Gran Córdoba",
    description: "Zonas aledañas",
    time: "48-72 hs",
    price: "Cadetería ($1.800)",
    icon: MapPinned,
    color: "ecos",
  },
  {
    zone: "Interior Córdoba",
    description: "Resto de la provincia",
    time: "3-5 días hábiles",
    price: "Desde $2.000",
    icon: Truck,
    color: "umbral",
  },
  {
    zone: "Nacional",
    description: "Todo el país",
    time: "3-7 días hábiles",
    price: "Desde $2.500",
    icon: Package,
    color: "alma",
  },
];

const shippingProcess = [
  {
    step: 1,
    title: "Realizás tu pedido",
    description: "Elegí tus Alquimias y completá el checkout",
    icon: Package,
  },
  {
    step: 2,
    title: "Coordinamos el pago",
    description:
      "Te enviamos los datos para realizar la transferencia o pagás con Mercado Pago",
    icon: CheckCircle,
  },
  {
    step: 3,
    title: "Preparamos tu pedido",
    description:
      "Tu pedido es preparado con cuidado y amor en nuestras instalaciones",
    icon: PackageCheck,
  },
  {
    step: 4,
    title: "Despachamos tu envío",
    description: "Te enviamos el número de seguimiento una vez despachado",
    icon: Truck,
  },
];

const faqShipping = [
  {
    question: "¿Cuál es el costo de envío?",
    answer:
      "Los costos varían según tu ubicación. Para CABA y GBA: $1.200-$1.800. Interior: $2.500-$4.000. ¡Envío gratis en compras mayores a $15.000!",
  },
  {
    question: "¿Cuánto tarda en llegar mi pedido?",
    answer:
      "Córdoba Capital: 24-48hs. Interior de Córdoba: 3-5 días. Nacional: 3-7 días hábiles. Los tiempos pueden extenderse en zonas remotas.",
  },
  {
    question: "¿Puedo retirar mi pedido?",
    answer:
      "Sí, podés retirar en Zona Norte de Córdoba los días Miércoles y Viernes coordinando previamente por WhatsApp.",
  },
  {
    question: "¿Cómo hago el seguimiento?",
    answer:
      "Una vez despachado tu pedido, recibirás un email con el número de seguimiento para monitorear tu envío.",
  },
];

const colorVariants = {
  jade: {
    bg: "bg-jade-primary",
    light: "bg-jade-lightest",
    text: "text-jade-primary",
  },
  ecos: {
    bg: "bg-ecos-primary",
    light: "bg-ecos-lightest",
    text: "text-ecos-primary",
  },
  umbral: {
    bg: "bg-umbral-primary",
    light: "bg-umbral-lightest",
    text: "text-umbral-primary",
  },
  alma: {
    bg: "bg-alma-primary",
    light: "bg-alma-lightest",
    text: "text-alma-primary",
  },
  brand: {
    bg: "bg-brand-primary",
    light: "bg-bg-cream",
    text: "text-brand-primary",
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PoliticasEnvioPage() {
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="py-4 px-6 bg-bg-cream border-b border-brand-primary/10">
        <div className="container mx-auto max-w-6xl">
          <nav className="flex items-center gap-2 text-sm font-caption text-[#791010]/70">
            <Link
              href="/"
              className="hover:text-brand-primary transition-colors"
            >
              Inicio
            </Link>
            <ChevronRight className="w-4 h-4" />
            <Link
              href="/ayuda"
              className="hover:text-brand-primary transition-colors"
            >
              Ayuda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-brand-primary font-medium">
              Políticas de Envío
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary py-24 px-6 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-24 h-24 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-highlight/20 rounded-full blur-2xl" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-highlight/20 text-highlight border-highlight/30 backdrop-blur-sm">
              <Truck className="w-4 h-4 mr-2" />
              Información de Envíos
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Políticas de Envío
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-text-inverse/90 mb-8 italic max-w-3xl mx-auto">
              Todo lo que necesitas saber sobre nuestros envíos y entregas
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-highlight/50" />
              <div className="w-2 h-2 bg-highlight rounded-full" />
              <div className="w-12 h-px bg-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <section className="py-8 px-6 bg-highlight/10 border-b border-highlight/20">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-4"
          >
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-brand-primary" />
              <span className="font-heading text-lg font-bold text-brand-primary">
                ¡Envío GRATIS en compras mayores a $15.000!
              </span>
            </div>
            <Badge className="bg-brand-primary text-white">
              Envío gratuito
            </Badge>
          </motion.div>
        </div>
      </section>

      {/* Shipping Zones */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              <MapPin className="w-4 h-4 mr-2" />
              Cobertura y Tiempos
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              Zonas de Envío
            </h2>
            <p className="font-body text-lg text-[#791010]/70 max-w-2xl mx-auto">
              Llegamos a toda Argentina con diferentes opciones según tu
              ubicación
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {shippingZones.map((zone) => {
              const colors =
                colorVariants[zone.color as keyof typeof colorVariants];
              const IconComponent = zone.icon;

              return (
                <motion.div key={zone.zone} variants={itemVariants}>
                  <Card
                    variant="brand"
                    className="text-center h-full relative overflow-hidden"
                  >
                    <div className={`h-1 ${colors.bg}`} />
                    <CardHeader className="pb-2">
                      <div
                        className={`w-14 h-14 mx-auto mb-4 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <CardTitle className="font-velista text-lg font-bold">
                        {zone.zone}
                      </CardTitle>
                      <CardDescription className="font-body text-sm text-[#791010]/70">
                        {zone.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4 text-brand-primary" />
                          <span className="font-body text-sm font-semibold text-brand-primary">
                            {zone.time}
                          </span>
                        </div>
                        <div className="font-body text-sm text-[#791010]">
                          {zone.price}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Shipping Process Timeline */}
      <section className="py-20 px-6 bg-bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-jade-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-alma-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              <Package className="w-4 h-4 mr-2" />
              Así funciona
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              Proceso de Envío
            </h2>
            <p className="font-body text-lg text-[#791010]/70 max-w-2xl mx-auto">
              Desde que realizás tu pedido hasta que llega a tus manos
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-alma-primary via-ecos-primary to-jade-primary -translate-y-1/2" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {shippingProcess.map((step, index) => {
                const colorKeys = ["alma", "ecos", "jade", "brand"] as const;
                const colors = colorVariants[colorKeys[index]];
                const IconComponent = step.icon;

                return (
                  <motion.div
                    key={step.step}
                    variants={itemVariants}
                    className="relative"
                  >
                    <Card variant="brand" className="text-center h-full">
                      <div
                        className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center text-white font-velista text-lg font-bold shadow-lg z-10`}
                      >
                        {step.step}
                      </div>
                      <CardHeader className="pt-10">
                        <div
                          className={`w-14 h-14 mx-auto mb-4 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                        >
                          <IconComponent className="w-7 h-7" />
                        </div>
                        <CardTitle className="font-velista text-lg font-bold">
                          {step.title}
                        </CardTitle>
                        <CardDescription className="font-body text-sm text-[#791010]/70">
                          {step.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              <Shield className="w-4 h-4 mr-2" />
              Preguntas Frecuentes
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              Consultas sobre Envíos
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {faqShipping.map((item, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card
                  variant="brand-subtle"
                  className="border-l-4 border-l-brand-primary"
                >
                  <CardHeader>
                    <CardTitle className="font-heading text-lg font-semibold text-brand-primary flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-primary text-white text-sm flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      {item.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-body text-[#791010]">{item.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Important Info */}
      <section className="py-12 px-6 bg-bg-cream">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card variant="brand" className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-brand-primary" />
                <h3 className="font-velista text-xl font-bold text-brand-primary">
                  Compromiso con tu Experiencia
                </h3>
              </div>
              <p className="font-body text-[#791010] max-w-2xl mx-auto mb-6">
                Todos tus pedidos son preparados con sumo cuidado y enviados en
                packaging protector para asegurar que lleguen en perfectas
                condiciones. Si tenés alguna consulta sobre tu envío, no dudes
                en contactarnos.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="brand" asChild>
                  <Link href="/faq">
                    Ver FAQ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="brand-outline" asChild>
                  <Link href="/ayuda">Centro de Ayuda</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 left-20 w-48 h-48 border border-white/20 rounded-full" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Phone className="w-4 h-4 mr-2" />
              ¿Necesitás ayuda?
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-text-inverse">
              Contactanos por cualquier consulta
            </h2>
            <p className="font-body text-lg text-text-inverse/80 mb-8 max-w-2xl mx-auto">
              Estamos disponibles para ayudarte con cualquier duda sobre tus
              envíos
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="elegant" size="lg" asChild>
                <Link href="mailto:info@daluzconsciente.com">
                  <Mail className="w-5 h-5 mr-2" />
                  info@daluzconsciente.com
                </Link>
              </Button>
              <Button variant="elegant-outline" size="lg" asChild>
                <Link href="https://wa.me/5490000000000">
                  <Phone className="w-5 h-5 mr-2" />
                  WhatsApp
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
