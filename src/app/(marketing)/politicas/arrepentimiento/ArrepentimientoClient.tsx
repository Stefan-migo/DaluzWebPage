"use client";

import {
  AlertCircle,
  Clock,
  Mail,
  Phone,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Botón azul (aplicado directo al Link; el componente Button con asChild no
// propaga clases sobre un Fragment de icono + texto).
const btnSolid =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white bg-faq-bright shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-light";

const condiciones = [
  { title: "Estado Original", text: "Sin usar, en su empaque original" },
  { title: "Comprobante de Compra", text: "Presentar factura o ticket" },
  { title: "Empaque Íntegro", text: "Sin daños, completo" },
  { title: "Plazo Válido", text: "Dentro de los 10 días" },
];

const excepciones = [
  "Productos digitales descargables (Ebooks) una vez descargado el enlace",
  "Productos abiertos o usados",
  "Servicios ya prestados o comenzados",
  "Productos personalizados o por encargo",
];

const pasos = [
  {
    title: "Contactanos",
    text: "Envianos un email a daluzalkimya@gmail.com indicando tu número de pedido y motivo de devolución.",
  },
  {
    title: "Te Respondemos",
    text: "Nuestro equipo te contactará dentro de las 48 horas hábiles para confirmarte los pasos a seguir.",
  },
  {
    title: "Envíanos el Producto",
    text: "Una vez aprobado, tendrás que enviar el producto a nuestra dirección. Los costos de envío corren por cuenta del comprador.",
  },
  {
    title: "Reembolso",
    text: "Una vez recibido y verificado el producto, procesamos el reembolso en un plazo de 10 días hábiles.",
  },
];

const tiempos = [
  { label: "Respuesta inicial", value: "48 horas", note: "hábiles" },
  {
    label: "Reembolso",
    value: "10 días",
    note: "hábiles luego de recibido el producto",
  },
];

// Bloques desplegables
const sections = [
  {
    id: "que-es",
    number: "1",
    title: "¿Qué es el Derecho de Arrepentimiento?",
    icon: AlertCircle,
  },
  {
    id: "condiciones",
    number: "2",
    title: "Condiciones para Ejercer el Derecho",
    icon: CheckCircle,
  },
  { id: "excepciones", number: "3", title: "Excepciones", icon: AlertCircle },
  {
    id: "como",
    number: "4",
    title: "¿Cómo Ejercer el Derecho?",
    icon: RefreshCw,
  },
  { id: "tiempos", number: "5", title: "Tiempos del Proceso", icon: Clock },
  { id: "contacto", number: "6", title: "¿Tenés dudas?", icon: Mail },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function CollapsibleSection({
  id,
  number,
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  number: string;
  title: string;
  icon: React.ElementType;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      variants={itemVariants}
      style={{ scrollMarginTop: "100px" }}
    >
      <div className="overflow-hidden rounded-2xl border border-faq-ink/10 bg-faq-surface shadow-soft">
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          className="w-full p-5 text-left transition-colors duration-300 hover:bg-faq-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-faq-ocean/50 md:p-6"
        >
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-faq-ocean/10 text-faq-ocean">
              <Icon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="mb-1 inline-block rounded-full border border-faq-ocean/30 px-2 py-0.5 font-caption text-xs font-medium text-faq-ocean">
                Bloque {number}
              </span>
              <h3 className="font-velista text-lg font-bold text-faq-ink md:text-xl">
                {title}
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
              <div className="space-y-4 border-t border-faq-ink/10 p-5 md:p-6">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

export default function ArrepentimientoClient() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const isOpen = (id: string) => openItems.includes(id);

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
              Botón de Arrepentimiento
            </h1>

            <p className="mx-auto mb-8 max-w-3xl font-subtitle text-xl italic text-white/90 md:text-2xl">
              Tu derecho a cancelar tu compra dentro de los 10 días corridos
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-faq-light/50" />
              <div className="h-2 w-2 rounded-full bg-faq-light" />
              <div className="h-px w-12 bg-faq-light/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bloques desplegables */}
      <section className="px-6 pb-12">
        <div className="container mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center font-body text-sm text-white/70"
          >
            Tocá cada bloque para desplegar su contenido.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* 1. ¿Qué es? */}
            <CollapsibleSection
              {...sections[0]}
              isOpen={isOpen("que-es")}
              onToggle={() => toggle("que-es")}
            >
              <p className="font-body text-faq-ink/90">
                Según la <strong>Ley 24.240</strong> de Defensa del Consumidor,
                tenés derecho a arrepentirte de una compra realizada fuera de un
                local comercial (por ejemplo, por internet, teléfono o
                catálogo).
              </p>
              <div className="rounded-lg border border-faq-ocean/25 bg-faq-ocean/10 p-4">
                <p className="font-body text-sm text-faq-ink">
                  Plazo: <strong>10 días corridos</strong> desde que recibís el
                  producto.
                </p>
              </div>
            </CollapsibleSection>

            {/* 2. Condiciones */}
            <CollapsibleSection
              {...sections[1]}
              isOpen={isOpen("condiciones")}
              onToggle={() => toggle("condiciones")}
            >
              <p className="font-body text-faq-ink/90">
                Para que tu devolución sea aceptada, el producto debe cumplir
                con:
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {condiciones.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-lg border border-faq-ink/10 bg-white/70 p-4"
                  >
                    <CheckCircle className="mt-0.5 h-6 w-6 flex-shrink-0 text-faq-ocean" />
                    <div>
                      <h4 className="font-heading font-semibold text-faq-ocean">
                        {c.title}
                      </h4>
                      <p className="font-body text-sm text-faq-ink/70">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 3. Excepciones */}
            <CollapsibleSection
              {...sections[2]}
              isOpen={isOpen("excepciones")}
              onToggle={() => toggle("excepciones")}
            >
              <p className="font-body font-medium text-amber-700">
                IMPORTANTE: El derecho de arrepentimiento NO aplica en los
                siguientes casos:
              </p>
              <div className="space-y-3">
                {excepciones.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3"
                  >
                    <span className="font-bold text-amber-700">✕</span>
                    <span className="font-body text-sm text-amber-900">
                      {t}
                    </span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 4. Cómo ejercer */}
            <CollapsibleSection
              {...sections[3]}
              isOpen={isOpen("como")}
              onToggle={() => toggle("como")}
            >
              <p className="font-body text-faq-ink/90">
                Seguí estos pasos para iniciar el proceso de devolución:
              </p>
              <div className="space-y-4">
                {pasos.map((p, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-faq-ocean font-bold text-white">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-faq-ocean">
                        {p.title}
                      </h4>
                      <p className="font-body text-sm text-faq-ink/80">
                        {p.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 5. Tiempos */}
            <CollapsibleSection
              {...sections[4]}
              isOpen={isOpen("tiempos")}
              onToggle={() => toggle("tiempos")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {tiempos.map((t, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-faq-ink/10 bg-white/70 p-4 text-center"
                  >
                    <h4 className="font-heading font-semibold text-faq-ocean">
                      {t.label}
                    </h4>
                    <p className="font-velista text-2xl font-bold text-faq-ink">
                      {t.value}
                    </p>
                    <p className="font-body text-sm text-faq-ink/60">{t.note}</p>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 6. Contacto */}
            <CollapsibleSection
              {...sections[5]}
              isOpen={isOpen("contacto")}
              onToggle={() => toggle("contacto")}
            >
              <p className="font-body text-faq-ink/90">
                Si tenés alguna consulta sobre el proceso de devolución o
                necesitás más información, no dudes en contactarnos:
              </p>
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex items-center gap-2 font-body text-faq-ink">
                  <Mail className="h-5 w-5 text-faq-ocean" />
                  daluzalkimya@gmail.com
                </div>
                <div className="flex items-center gap-2 font-body text-faq-ink">
                  <Phone className="h-5 w-5 text-faq-ocean" />
                  +54 9 11 1234-5678
                </div>
              </div>
              <div className="pt-2">
                <Link href="/contacto" className={btnSolid}>
                  Contactános
                </Link>
              </div>
            </CollapsibleSection>
          </motion.div>

          {/* Nota legal */}
          <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <p className="font-body text-sm text-white/70">
              <strong className="text-white">Nota legal:</strong> Este derecho
              está regulado por la <strong>Ley 24.240</strong> de Defensa del
              Consumidor y el <strong>Decreto 242/2021</strong>. Para más
              información, consultá la web oficial de{" "}
              <a
                href="https://www.argentina.gob.ar/defensadelconsumidor"
                target="_blank"
                rel="noopener noreferrer"
                className="text-faq-light underline hover:opacity-80"
              >
                Defensa del Consumidor
              </a>
              .
            </p>
          </div>

          {/* Footer de la página */}
          <div className="mt-8 border-t border-white/10 py-8 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-caption text-faq-light transition-opacity hover:opacity-80"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la página principal
            </Link>
            <p className="mt-4 font-body text-xs text-white/50">
              © {new Date().getFullYear()} DA LUZ CONSCIENTE. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
