"use client";

import {
  Shield,
  FileText,
  CreditCard,
  Truck,
  AlertTriangle,
  Heart,
  Lock,
  Eye,
  Scale,
  ChevronRight,
  ChevronDown,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Estilo de botón azul (aplicado directo al Link; el componente Button con
// asChild no propaga clases sobre un Fragment de icono + texto).
const btnSolid =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-white bg-faq-bright shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-light";
const btnOutline =
  "inline-flex items-center justify-center gap-2 h-11 rounded-md px-6 text-sm font-title uppercase tracking-wider text-faq-ocean border-2 border-faq-ocean transition-all duration-300 hover:-translate-y-0.5 hover:bg-faq-ocean hover:text-white";

const generalidadesContent = [
  "Este sitio web es operado por Da Luz Consciente (en adelante, 'la Titular').",
  "Al navegar y comprar en este sitio, el usuario acepta los presentes términos y condiciones.",
  "Estos términos constituyen un acuerdo legal entre el usuario y Da Luz Consciente.",
  "Si no acepta estos términos, por favor no utilice nuestro sitio web.",
];

const propiedadIntelectualContent = [
  {
    title: "Contenido protegido",
    text: "Todo el contenido de este sitio web, incluyendo textos, logos, fotografías, videos, 'Reducozando' y el Ebook 'Renacernos', es propiedad exclusiva de Da Luz Consciente.",
  },
  {
    title: "Prohibición",
    text: "Queda prohibida su reproducción total o parcial sin autorización escrita previa.",
    type: "warning",
  },
];

const compraPagosContent = [
  {
    label: "Precios",
    text: "Expresados en Pesos Argentinos (ARS). Pueden ser modificados sin previo aviso.",
  },
  {
    label: "Métodos de Pago",
    text: "Procesados a través de Mercado Pago / PayPal. No almacenamos información de pago.",
  },
  {
    label: "Confirmación",
    text: "Recibirás un correo electrónico con la confirmación y detalles del pedido.",
  },
];

const enviosContent = [
  {
    label: "Opciones",
    text: "Correo Argentino o Andreani, a elección del usuario.",
  },
  {
    label: "Tiempos",
    text: "Estimativos según logística. Generalmente 3-7 días hábiles.",
  },
  {
    label: "Responsabilidad",
    text: "No nos responsabilizamos por demoras una vez entregado al correo.",
  },
  {
    label: "Seguimiento",
    text: "Recibirás número de seguimiento para monitorear tu envío.",
  },
];

const exencionContent = [
  "Nuestros productos acompañan procesos de bienestar y no reemplazan la consulta médica ni diagnósticos profesionales.",
  "Recomendamos consultar con un profesional de la salud antes de iniciar cualquier tratamiento.",
  "Los productos cosméticos son de venta libre y cumplen con normativas ANMAT. No testamos en animales (Cruelty Free).",
];

const privacidadContent = [
  {
    label: "Datos recopilados",
    text: "Nombre, email, dirección, DNI (facturación), teléfono.",
  },
  {
    label: "Finalidad",
    text: "Gestión de compras, envíos, comunicación y facturación AFIP.",
  },
  {
    label: "Compartición",
    text: "Solo con terceros necesarios para logística y pago.",
  },
];

const derechosArcoContent = [
  { label: "ACCESO", text: "Consultá qué datos tenemos tuyos" },
  { label: "RECTIFICACIÓN", text: "Corregí datos incorrectos" },
  { label: "ELIMINACIÓN", text: "Solicitá eliminación de tus datos" },
];

const seguridadContent = [
  "Protocolos de seguridad SSL para transmisión de datos",
  "Datos almacenados en servidores seguros con acceso controlado",
  "No compartimos datos con terceros para marketing no relacionado",
];

// Índice de secciones (cada una es un panel desplegable)
const sections = [
  { id: "generalidades", number: "1", title: "Generalidades", icon: FileText },
  {
    id: "propiedad-intelectual",
    number: "2",
    title: "Propiedad Intelectual",
    icon: Lock,
  },
  {
    id: "compra-pagos",
    number: "3",
    title: "Proceso de Compra y Pagos",
    icon: CreditCard,
  },
  { id: "envios", number: "4", title: "Política de Envíos", icon: Truck },
  {
    id: "arrepentimiento",
    number: "5",
    title: "Derecho de Arrepentimiento",
    icon: AlertTriangle,
  },
  {
    id: "exencion",
    number: "6",
    title: "Exención de Responsabilidad",
    icon: Shield,
  },
  { id: "privacidad", number: "7", title: "Política de Privacidad", icon: Lock },
  { id: "derechos-arco", number: "8", title: "Derechos ARCO", icon: Eye },
  { id: "seguridad", number: "9", title: "Seguridad", icon: Scale },
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
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "bg-faq-ocean/10 border-faq-ocean/25 text-faq-ink",
    warning: "bg-amber-500/10 border-amber-500/40 text-amber-800",
    success: "bg-faq-bright/10 border-faq-bright/30 text-faq-ink",
  };

  return (
    <div className={`rounded-lg border p-4 ${styles[type]}`}>{children}</div>
  );
}

function LabeledItem({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-faq-ocean" />
      <div>
        <h4 className="font-heading font-semibold text-faq-ocean">{label}</h4>
        <p className="font-body text-faq-ink/90">{text}</p>
      </div>
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

export default function TerminosPage() {
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
              Términos y Condiciones
            </h1>

            <p className="mx-auto mb-8 max-w-3xl font-subtitle text-xl italic text-white/90 md:text-2xl">
              Condiciones generales de uso y compra en nuestro sitio web
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
            {/* 1. Generalidades */}
            <CollapsibleSection
              {...sections[0]}
              isOpen={isOpen("generalidades")}
              onToggle={() => toggle("generalidades")}
            >
              {generalidadesContent.map((text, index) => (
                <p key={index} className="font-body text-faq-ink/90">
                  {text}
                </p>
              ))}
            </CollapsibleSection>

            {/* 2. Propiedad Intelectual */}
            <CollapsibleSection
              {...sections[1]}
              isOpen={isOpen("propiedad-intelectual")}
              onToggle={() => toggle("propiedad-intelectual")}
            >
              {propiedadIntelectualContent.map((item, index) => (
                <div key={index}>
                  <h4 className="mb-2 font-heading font-semibold text-faq-ocean">
                    {item.title}
                  </h4>
                  {item.type === "warning" ? (
                    <InfoBox type="warning">
                      <p className="font-body text-sm">
                        <strong>Importante:</strong> {item.text}
                      </p>
                    </InfoBox>
                  ) : (
                    <p className="font-body text-faq-ink/90">{item.text}</p>
                  )}
                </div>
              ))}
            </CollapsibleSection>

            {/* 3. Proceso de Compra y Pagos */}
            <CollapsibleSection
              {...sections[2]}
              isOpen={isOpen("compra-pagos")}
              onToggle={() => toggle("compra-pagos")}
            >
              {compraPagosContent.map((item, index) => (
                <LabeledItem key={index} label={item.label} text={item.text} />
              ))}
            </CollapsibleSection>

            {/* 4. Política de Envíos */}
            <CollapsibleSection
              {...sections[3]}
              isOpen={isOpen("envios")}
              onToggle={() => toggle("envios")}
            >
              {enviosContent.map((item, index) => (
                <LabeledItem key={index} label={item.label} text={item.text} />
              ))}
              <div className="pt-2">
                <Link href="/politicas/envio" className={btnOutline}>
                  Ver políticas de envío completas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </CollapsibleSection>

            {/* 5. Derecho de Arrepentimiento */}
            <CollapsibleSection
              {...sections[4]}
              isOpen={isOpen("arrepentimiento")}
              onToggle={() => toggle("arrepentimiento")}
            >
              <p className="font-body text-faq-ink/90">
                Según la <strong>Ley 24.240</strong> de Defensa del Consumidor,
                el cliente tiene <strong>10 días corridos</strong> para revocar
                su compra online.
              </p>
              <InfoBox type="info">
                <h4 className="mb-2 font-heading font-semibold">
                  Condiciones aplicables:
                </h4>
                <ul className="list-disc space-y-1 pl-5 font-body text-sm">
                  <li>
                    Aplicable a productos físicos no abiertos/en su estado
                    original
                  </li>
                  <li>El producto debe estar en perfecto estado, sin uso</li>
                  <li>Debe presentarse el comprobante de compra</li>
                  <li>
                    Los costos de devolución corren por cuenta del comprador
                  </li>
                </ul>
              </InfoBox>
              <InfoBox type="warning">
                <p className="font-body text-sm">
                  <strong>Importante:</strong> En productos digitales
                  descargables (Ebooks), el acceso es inmediato y{" "}
                  <strong>no admite devolución</strong> una vez enviado el
                  enlace de descarga.
                </p>
              </InfoBox>
              <p className="font-body text-faq-ink/90">
                Para ejercer este derecho, contactanos a:{" "}
                <strong>daluzalkimya@gmail.com</strong>
              </p>
            </CollapsibleSection>

            {/* 6. Exención de Responsabilidad */}
            <CollapsibleSection
              {...sections[5]}
              isOpen={isOpen("exencion")}
              onToggle={() => toggle("exencion")}
            >
              {exencionContent.map((text, index) => (
                <p key={index} className="font-body text-faq-ink/90">
                  {text}
                </p>
              ))}
              <InfoBox type="success">
                <div className="flex items-start gap-3">
                  <Heart className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                  <p className="font-body text-sm">
                    Los productos cosméticos son de venta libre y cumplen con
                    las normativas vigentes de ANMAT. No testamos en animales
                    (Cruelty Free).
                  </p>
                </div>
              </InfoBox>
            </CollapsibleSection>

            {/* 7. Política de Privacidad */}
            <CollapsibleSection
              {...sections[6]}
              isOpen={isOpen("privacidad")}
              onToggle={() => toggle("privacidad")}
            >
              <p className="font-body text-faq-ink/90">
                En cumplimiento con la <strong>Ley 25.326</strong> de Protección
                de Datos Personales, recolectamos datos únicamente para los
                siguientes fines:
              </p>
              {privacidadContent.map((item, index) => (
                <LabeledItem key={index} label={item.label} text={item.text} />
              ))}
            </CollapsibleSection>

            {/* 8. Derechos ARCO */}
            <CollapsibleSection
              {...sections[7]}
              isOpen={isOpen("derechos-arco")}
              onToggle={() => toggle("derechos-arco")}
            >
              <p className="font-body text-faq-ink/90">
                Podés solicitar en cualquier momento el <strong>Acceso</strong>,{" "}
                <strong>Rectificación</strong> o <strong>Eliminación</strong> de
                tus datos personales.
              </p>
              <div className="grid gap-4 md:grid-cols-3">
                {derechosArcoContent.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-faq-ink/10 bg-white/70 p-4 text-center"
                  >
                    <h4 className="mb-2 font-velista text-lg font-bold text-faq-ocean">
                      {item.label}
                    </h4>
                    <p className="font-body text-sm text-faq-ink/70">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="font-body text-faq-ink/90">
                Para ejercer estos derechos, enviá un email a:{" "}
                <strong>daluzalkimya@gmail.com</strong>
              </p>
            </CollapsibleSection>

            {/* 9. Seguridad */}
            <CollapsibleSection
              {...sections[8]}
              isOpen={isOpen("seguridad")}
              onToggle={() => toggle("seguridad")}
            >
              <ul className="space-y-3">
                {seguridadContent.map((text, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-faq-ocean" />
                    <span className="font-body text-faq-ink/90">{text}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 rounded-2xl bg-faq-surface p-8 text-center shadow-soft"
          >
            <h3 className="mb-1 font-velista text-xl font-bold text-faq-ink">
              ¿Tenés dudas?
            </h3>
            <p className="mb-5 font-body text-faq-ink/70">
              Contactanos y te ayudamos con cualquier consulta legal o de tu
              compra.
            </p>
            <Link href="mailto:daluzalkimya@gmail.com" className={btnSolid}>
              <Mail className="h-4 w-4" />
              Escribir email
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer legal */}
      <section className="border-t border-white/10 px-6 py-12">
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
