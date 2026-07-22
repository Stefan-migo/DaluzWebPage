"use client";

import {
  Lock,
  Shield,
  FileText,
  Mail,
  Eye,
  Trash2,
  Database,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  User,
  MapPin,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Botón azul (aplicado directo al Link; el componente Button con asChild no
// propaga clases sobre un Fragment de icono + texto).
const btnSolid =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white bg-faq-bright shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-light";
// Outline claro para fondos oscuros (sobre el degradado)
const btnOutlineLight =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white border-2 border-white/40 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10";

// Acentos monocromáticos azules (reemplazan las líneas de color)
const toneColor: Record<
  string,
  { chip: string; text: string; dot: string; bar: string }
> = {
  alma: {
    chip: "bg-faq-bright/10",
    text: "text-faq-bright",
    dot: "bg-faq-bright",
    bar: "bg-faq-bright",
  },
  ecos: {
    chip: "bg-faq-ocean/10",
    text: "text-faq-ocean",
    dot: "bg-faq-ocean",
    bar: "bg-faq-ocean",
  },
  jade: {
    chip: "bg-faq-mid/10",
    text: "text-faq-mid",
    dot: "bg-faq-mid",
    bar: "bg-faq-mid",
  },
  brand: {
    chip: "bg-faq-deep/10",
    text: "text-faq-deep",
    dot: "bg-faq-deep",
    bar: "bg-faq-deep",
  },
};

const dataTypes = [
  {
    category: "Datos de Identificación",
    icon: User,
    items: ["Nombre completo", "Correo electrónico", "Teléfono"],
    color: "alma",
  },
  {
    category: "Datos de Envío",
    icon: MapPin,
    items: ["Dirección completa", "Ciudad y provincia", "Código postal"],
    color: "ecos",
  },
  {
    category: "Datos de Facturación",
    icon: CreditCard,
    items: ["DNI (solo facturación AFIP)", "CUIT (solo factura A)"],
    color: "jade",
  },
];

const purposeItems = [
  {
    title: "Gestión de pedidos",
    description: "Procesar tus compras, confirmar envíos y entregar productos.",
    icon: CheckCircle,
  },
  {
    title: "Comunicación",
    description:
      "Enviarte información sobre pedidos, ofertas de Alkimya y novedades.",
    icon: Mail,
  },
  {
    title: "Facturación",
    description: "Generar comprobantes de compra conforme a normativa AFIP.",
    icon: CreditCard,
  },
  {
    title: "Mejora de servicios",
    description: "Analizar tendencias y mejorar nuestra tienda online.",
    icon: Shield,
  },
];

const rightsArco = [
  {
    title: "ACCESO",
    description: "Consultá qué datos tenemos tuyos",
    icon: Eye,
    color: "alma",
  },
  {
    title: "RECTIFICACIÓN",
    description: "Corregí datos incorrectos",
    icon: FileText,
    color: "ecos",
  },
  {
    title: "ELIMINACIÓN",
    description: "Solicitá eliminación de tus datos",
    icon: Trash2,
    color: "jade",
  },
];

const securityItems = [
  {
    title: "Encriptación SSL/TLS",
    description: "Protección en la transmisión de datos",
  },
  {
    title: "Servidores seguros",
    description: "Acceso controlado y almacenamiento protegido",
  },
  {
    title: "Terceros limitados",
    description: "Solo empresas necesarias para logística y pago",
  },
  {
    title: "Retención responsable",
    description:
      "Datos mientras tengas cuenta activa o sea legalmente necesario",
  },
];

// Índice de secciones (cada una es un panel desplegable)
const sections = [
  { id: "compromiso", number: "1", title: "Nuestro Compromiso", icon: Heart },
  {
    id: "informacion",
    number: "2",
    title: "Información que Recopilamos",
    icon: Database,
  },
  {
    id: "finalidad",
    number: "3",
    title: "Cómo Usamos tu Información",
    icon: FileText,
  },
  { id: "proteccion", number: "4", title: "Seguridad y Protección", icon: Lock },
  {
    id: "derechos",
    number: "5",
    title: "Tus Derechos (Ley 25.326)",
    icon: Eye,
  },
  {
    id: "cookies",
    number: "6",
    title: "Cookies y Tecnologías Similares",
    icon: Database,
  },
  { id: "contacto", number: "7", title: "Contacto", icon: Mail },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function InfoBox({
  children,
  type = "info",
  className = "",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
  className?: string;
}) {
  const styles = {
    info: "bg-faq-ocean/10 border-faq-ocean/25 text-faq-ink",
    warning: "bg-amber-500/10 border-amber-500/40 text-amber-800",
    success: "bg-faq-bright/10 border-faq-bright/30 text-faq-ink",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]} ${className}`}>
      {children}
    </div>
  );
}

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
                Sección {number}
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

export default function PrivacidadPage() {
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
              Política de Privacidad
            </h1>

            <p className="mx-auto mb-8 max-w-3xl font-subtitle text-xl italic text-white/90 md:text-2xl">
              Cómo protegemos y usamos tus datos personales
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-12 bg-faq-light/50" />
              <div className="h-2 w-2 rounded-full bg-faq-light" />
              <div className="h-px w-12 bg-faq-light/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Secciones desplegables */}
      <section className="px-6 pb-12">
        <div className="container mx-auto max-w-4xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center font-body text-sm text-white/70"
          >
            Tocá cada sección para desplegar su contenido.
          </motion.p>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {/* 1. Nuestro Compromiso */}
            <CollapsibleSection
              {...sections[0]}
              isOpen={isOpen("compromiso")}
              onToggle={() => toggle("compromiso")}
            >
              <p className="font-body text-faq-ink/90">
                En <strong>DA LUZ CONSCIENTE</strong> respetamos tu privacidad y
                nos comprometemos a proteger tus datos personales. Esta política
                de privacidad describe cómo recopilamos, usamos, divulgamos y
                protegemos tu información.
              </p>
              <InfoBox type="success">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                  <p className="font-body text-sm">
                    Cumplimos con la <strong>Ley 25.326</strong> de Protección
                    de Datos Personales de Argentina y normativas equivalentes
                    en otras jurisdicciones.
                  </p>
                </div>
              </InfoBox>
            </CollapsibleSection>

            {/* 2. Información que Recopilamos */}
            <CollapsibleSection
              {...sections[1]}
              isOpen={isOpen("informacion")}
              onToggle={() => toggle("informacion")}
            >
              <p className="font-body text-faq-ink/90">
                Recopilamos los siguientes tipos de información de forma segura:
              </p>
              <div className="mt-2 grid gap-4 md:grid-cols-3">
                {dataTypes.map((data, index) => {
                  const colors = toneColor[data.color];
                  const IconComponent = data.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-faq-ink/10 bg-white/70 p-4"
                    >
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${colors.chip} ${colors.text}`}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <h4 className="mb-2 font-heading font-semibold text-faq-ocean">
                        {data.category}
                      </h4>
                      <ul className="space-y-1">
                        {data.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-2 font-body text-sm text-faq-ink/90"
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full ${colors.dot}`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </CollapsibleSection>

            {/* 3. Cómo Usamos tu Información */}
            <CollapsibleSection
              {...sections[2]}
              isOpen={isOpen("finalidad")}
              onToggle={() => toggle("finalidad")}
            >
              <p className="font-body text-faq-ink/90">
                Utilizamos tu información exclusivamente para los siguientes
                fines:
              </p>
              <div className="mt-2 grid gap-4 md:grid-cols-2">
                {purposeItems.map((item, index) => {
                  const colorKeys = ["alma", "ecos", "jade", "brand"] as const;
                  const colors = toneColor[colorKeys[index]];
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-faq-ink/10 bg-white/70 p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${colors.chip} ${colors.text}`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="mb-1 font-heading font-semibold text-faq-ocean">
                            {item.title}
                          </h4>
                          <p className="font-body text-sm text-faq-ink/70">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <InfoBox type="info" className="mt-2">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                  <p className="font-body text-sm">
                    <strong>Importante:</strong> No utilizamos tus datos para
                    spam ni compartimos con terceros para fines de marketing no
                    relacionado con nuestros productos.
                  </p>
                </div>
              </InfoBox>
            </CollapsibleSection>

            {/* 4. Seguridad y Protección */}
            <CollapsibleSection
              {...sections[3]}
              isOpen={isOpen("proteccion")}
              onToggle={() => toggle("proteccion")}
            >
              <div className="grid gap-4 md:grid-cols-2">
                {securityItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 rounded-lg border border-faq-ink/10 bg-white/60 p-4"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-faq-ocean/10">
                      <Shield className="h-5 w-5 text-faq-ocean" />
                    </div>
                    <div>
                      <h4 className="mb-1 font-heading font-semibold text-faq-ocean">
                        {item.title}
                      </h4>
                      <p className="font-body text-sm text-faq-ink/70">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleSection>

            {/* 5. Tus Derechos */}
            <CollapsibleSection
              {...sections[4]}
              isOpen={isOpen("derechos")}
              onToggle={() => toggle("derechos")}
            >
              <p className="font-body text-faq-ink/90">
                Tenés los siguientes derechos sobre tus datos personales:
              </p>
              <div className="mt-2 grid gap-4 md:grid-cols-3">
                {rightsArco.map((right, index) => {
                  const colors = toneColor[right.color];
                  const IconComponent = right.icon;
                  return (
                    <div
                      key={index}
                      className="relative overflow-hidden rounded-xl border border-faq-ink/10 bg-white/70 p-6 text-center"
                    >
                      <div
                        className={`absolute left-0 right-0 top-0 h-1 ${colors.bar}`}
                      />
                      <div
                        className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.chip} ${colors.text}`}
                      >
                        <IconComponent className="h-7 w-7" />
                      </div>
                      <h4 className="mb-2 font-velista text-lg font-bold text-faq-ocean">
                        {right.title}
                      </h4>
                      <p className="font-body text-sm text-faq-ink/70">
                        {right.description}
                      </p>
                    </div>
                  );
                })}
              </div>
              <InfoBox type="success" className="mt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                  <div>
                    <p className="font-body text-sm font-medium">
                      Para ejercer cualquiera de estos derechos, contactanos a:{" "}
                      <strong>daluzalkimya@gmail.com</strong>
                    </p>
                    <p className="mt-1 font-body text-sm">
                      Responderemos tu solicitud dentro de los 30 días hábiles
                      establecidos por ley.
                    </p>
                  </div>
                </div>
              </InfoBox>
            </CollapsibleSection>

            {/* 6. Cookies */}
            <CollapsibleSection
              {...sections[5]}
              isOpen={isOpen("cookies")}
              onToggle={() => toggle("cookies")}
            >
              <p className="font-body text-faq-ink/90">
                Nuestro sitio utiliza cookies y tecnologías similares para
                mejorar tu experiencia de navegación:
              </p>
              <ul className="space-y-3">
                {[
                  "Recordar tus preferencias y ajustes",
                  "Analizar el tráfico y rendimiento del sitio",
                  "Personalizar el contenido según tus intereses",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                    <span className="font-body text-faq-ink/90">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="font-body text-faq-ink/90">
                <strong>Gestionar cookies:</strong> Podés configurar tu
                navegador para rechazar todas las cookies o para indicar cuándo
                se envía una cookie. Sin embargo, algunas funciones del sitio
                pueden no funcionar correctamente sin cookies.
              </p>
            </CollapsibleSection>

            {/* 7. Contacto */}
            <CollapsibleSection
              {...sections[6]}
              isOpen={isOpen("contacto")}
              onToggle={() => toggle("contacto")}
            >
              <p className="font-body text-faq-ink/90">
                Si tenés alguna pregunta sobre esta política de privacidad o
                querés ejercer tus derechos, contactanos:
              </p>
              <div className="rounded-xl border border-faq-ink/10 bg-white/70 p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-faq-ocean/10">
                      <Shield className="h-5 w-5 text-faq-ocean" />
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-faq-ocean">
                        DA LUZ CONSCIENTE
                      </h4>
                      <p className="font-body text-sm text-faq-ink/70">
                        Tu privacidad, nuestra prioridad
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-faq-ink/10 pt-4">
                    <p className="font-body text-faq-ink/90">
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:daluzalkimya@gmail.com"
                        className="text-faq-ocean hover:underline"
                      >
                        daluzalkimya@gmail.com
                      </a>
                    </p>
                    <p className="font-body text-faq-ink/90">
                      <strong>Ubicación:</strong> Córdoba, Argentina
                    </p>
                  </div>
                </div>
              </div>
            </CollapsibleSection>
          </motion.div>
        </div>
      </section>

      {/* Related Links */}
      <section className="border-t border-white/10 px-6 py-12">
        <div className="container mx-auto max-w-4xl">
          <h3 className="mb-8 text-center font-velista text-xl font-bold text-text-inverse">
            También te puede interesar
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/politicas/terminos" className={btnOutlineLight}>
              Términos y Condiciones
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/politicas/envio" className={btnOutlineLight}>
              Políticas de Envío
            </Link>
            <Link href="/politicas/arrepentimiento" className={btnOutlineLight}>
              Derecho de Arrepentimiento
            </Link>
            <Link href="/faq" className={btnSolid}>
              Preguntas Frecuentes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer legal */}
      <section className="border-t border-white/10 px-6 py-8">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="font-body text-sm text-white/70">
            Fecha de última actualización:{" "}
            {new Date().toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="mt-2 font-body text-xs text-white/50">
            © {new Date().getFullYear()} DA LUZ CONSCIENTE. Todos los derechos
            reservados.
          </p>
        </div>
      </section>
    </div>
  );
}
