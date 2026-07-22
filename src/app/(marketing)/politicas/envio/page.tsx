"use client";

import {
  Truck,
  Clock,
  MapPin,
  Package,
  Shield,
  Phone,
  Mail,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MapPinned,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Estilo de botón azul (aplicado directo al Link; el componente Button con
// asChild no propaga clases sobre un Fragment de icono + texto).
const btnSolid =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white bg-faq-bright shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-light";
const btnOutline =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white border-2 border-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10";

// Acentos monocromáticos azules para las zonas (sobre tarjeta clara)
const zoneColor: Record<
  string,
  { bar: string; chip: string; text: string }
> = {
  jade: { bar: "bg-faq-mid", chip: "bg-faq-mid/10", text: "text-faq-mid" },
  ecos: { bar: "bg-faq-ocean", chip: "bg-faq-ocean/10", text: "text-faq-ocean" },
  umbral: { bar: "bg-faq-deep", chip: "bg-faq-deep/10", text: "text-faq-deep" },
  alma: {
    bar: "bg-faq-bright",
    chip: "bg-faq-bright/10",
    text: "text-faq-bright",
  },
};

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

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function CollapsibleShippingFAQ({
  index,
  question,
  answer,
  isOpen,
  onToggle,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div variants={itemVariants}>
      <div className="overflow-hidden rounded-none border-l-4 border-l-faq-ocean bg-faq-surface shadow-soft">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full p-6 text-left transition-colors duration-300 hover:bg-faq-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-faq-ocean/50"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-faq-ocean text-sm font-bold text-white">
                {index + 1}
              </span>
              <h3 className="font-heading text-lg font-semibold text-faq-ink">
                {question}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="h-5 w-5 text-faq-ocean" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="px-6 pb-6 pl-[3.75rem] font-body text-faq-ink/90">
                {answer}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function PoliticasEnvioPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index],
    );
  };

  return (
    <div className="min-h-screen bg-faq-gradient">

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-[#0085B1]/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#2A2543]/40 blur-3xl" />
        </div>
        <div className="pointer-events-none absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-20 h-40 w-40 rounded-full border border-white/30" />
          <div className="absolute bottom-10 right-20 h-24 w-24 rounded-full border border-white/20" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >

            <h1 className="mb-6 font-velista text-4xl font-bold tracking-wide text-text-inverse md:text-6xl lg:text-7xl">
              Políticas de Envío
            </h1>

            <p className="mx-auto mb-8 max-w-3xl font-subtitle text-xl italic text-white/90 md:text-2xl">
              Todo lo que necesitás saber sobre nuestros envíos y entregas
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-faq-light/50" />
              <div className="h-2 w-2 rounded-full bg-faq-light" />
              <div className="h-px w-12 bg-faq-light/50" />
            </div>
          </motion.div>
        </div>
      </section>
      {/* Shipping Zones */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 font-velista text-3xl font-bold text-text-inverse md:text-4xl">
              Zonas de Envío
            </h2>
            <p className="mx-auto max-w-2xl font-body text-lg text-white/80">
              Llegamos a toda Argentina con diferentes opciones según tu
              ubicación
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {shippingZones.map((zone) => {
              const colors = zoneColor[zone.color];
              const IconComponent = zone.icon;

              return (
                <motion.div key={zone.zone} variants={itemVariants}>
                  <div className="relative h-full overflow-hidden rounded-2xl bg-faq-surface text-center shadow-soft">
                    <div className={`h-1 ${colors.bar}`} />
                    <div className="p-6">
                      <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.chip} ${colors.text}`}
                      >
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h3 className="mb-1 font-velista text-lg font-bold text-faq-ink">
                        {zone.zone}
                      </h3>
                      <p className="mb-4 font-body text-sm text-faq-ink/70">
                        {zone.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                          <Clock className="h-4 w-4 text-faq-ocean" />
                          <span className="font-body text-sm font-semibold text-faq-ocean">
                            {zone.time}
                          </span>
                        </div>
                        <div className="font-body text-sm text-faq-ink">
                          {zone.price}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section — Consultas sobre Envíos (desplegables) */}
      <section className="px-6 py-20">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 font-velista text-3xl font-bold text-text-inverse md:text-4xl">
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
              <CollapsibleShippingFAQ
                key={index}
                index={index}
                question={item.question}
                answer={item.answer}
                isOpen={openItems.includes(index)}
                onToggle={() => toggleItem(index)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Important Info */}
      <section className="px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-2xl bg-faq-surface p-8 text-center shadow-soft">
              <div className="mb-4 flex items-center justify-center gap-3">
                <Shield className="h-6 w-6 text-faq-ocean" />
                <h3 className="font-velista text-xl font-bold text-faq-ink">
                  Compromiso con tu Experiencia
                </h3>
              </div>
              <p className="mx-auto mb-6 max-w-2xl font-body text-faq-ink/90">
                Todos tus pedidos son preparados con sumo cuidado y enviados en
                packaging protector para asegurar que lleguen en perfectas
                condiciones. Si tenés alguna consulta sobre tu envío, no dudes
                en contactarnos.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/faq" className={btnSolid}>
                  Ver FAQ
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/ayuda"
                  className="inline-flex items-center justify-center gap-2 h-11 rounded-md border-2 border-faq-ocean px-6 text-sm font-title uppercase tracking-wider text-faq-ocean transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-ocean hover:text-white"
                >
                  Centro de Ayuda
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative overflow-hidden border-t border-white/10 px-6 py-20">
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-[#0085B1]/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-48 w-48 rounded-full bg-[#2A2543]/40 blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-faq-light/30 bg-white/10 px-4 py-1.5 font-caption text-xs font-semibold uppercase tracking-wider text-faq-light backdrop-blur-sm">
              <Phone className="h-4 w-4" />
              ¿Necesitás ayuda?
            </span>
            <h2 className="mb-4 font-velista text-3xl font-bold text-text-inverse md:text-4xl">
              Contactanos por cualquier consulta
            </h2>
            <p className="mx-auto mb-8 max-w-2xl font-body text-lg text-white/80">
              Estamos disponibles para ayudarte con cualquier duda sobre tus
              envíos
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="mailto:daluzalkimya@gmail.com" className={btnSolid}>
                <Mail className="h-5 w-5" />
                daluzalkimya@gmail.com
              </Link>
              <Link href="https://wa.me/5493512344580" className={btnOutline}>
                <Phone className="h-5 w-5" />
                WhatsApp
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
