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
  Shield,
  FileText,
  CreditCard,
  Truck,
  AlertTriangle,
  Heart,
  Lock,
  Eye,
  Scale,
  Gavel,
  ChevronRight,
  Mail,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Metadata is handled by the parent layout or through generateMetadata in server components

const tableOfContents = [
  { id: "generalidades", title: "1. Generalidades", icon: FileText },
  {
    id: "propiedad-intelectual",
    title: "2. Propiedad Intelectual",
    icon: Lock,
  },
  {
    id: "compra-pagos",
    title: "3. Proceso de Compra y Pagos",
    icon: CreditCard,
  },
  { id: "envios", title: "4. Política de Envíos", icon: Truck },
  {
    id: "arrepentimiento",
    title: "5. Derecho de Arrepentimiento",
    icon: AlertTriangle,
  },
  { id: "exencion", title: "6. Exención de Responsabilidad", icon: Shield },
  { id: "privacidad", title: "7. Política de Privacidad", icon: Lock },
  { id: "derechos-arco", title: "8. Derechos ARCO", icon: Eye },
  { id: "seguridad", title: "9. Seguridad", icon: Scale },
];

const generalidadesContent = [
  "Este sitio web es operado por Da Luz Consciente (en adelante, 'la Titular').",
  "Al navegar y comprar en este sitio, el usuario acepta los presentes términos y condiciones.",
  "Estos términos constituyen un acuerdo legal entre el usuario y Da Luz Consciente.",
  "Si no acepta estos términos, por favor no utilize nuestro sitio web.",
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

const arrepentimientoContent = [
  {
    label: "Plazo",
    text: "10 días corridos según Ley 24.240 de Defensa del Consumidor.",
  },
  {
    label: "Condiciones",
    text: "Producto sin abrir, en perfecto estado, con comprobante de compra.",
  },
  {
    label: "Costos",
    text: "Los costos de devolución corren por cuenta del comprador.",
  },
  {
    label: "Excepciones",
    text: "Productos digitales descargables no admiten devolución una vez enviado el enlace.",
    type: "warning",
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
  { label: "RECTIFICACIÓN", text: "Correct datos incorrectos" },
  { label: "ELIMINACIÓN", text: "Solicitá eliminación de tus datos" },
];

const seguridadContent = [
  "Protocolos de seguridad SSL para transmisión de datos",
  "Datos almacenados en servidores seguros con acceso controlado",
  "No compartimos datos con terceros para marketing no relacionado",
];

const colorVariants = {
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

function InfoBox({
  children,
  type = "info",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]}`}>{children}</div>
  );
}

function SectionCard({
  id,
  title,
  icon: Icon,
  children,
  number,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  number: string;
}) {
  return (
    <motion.section id={id} style={{ scrollMarginTop: "100px" }}>
      <Card variant="brand" className="overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-brand-primary to-brand-secondary" />
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center">
              <Icon className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <Badge
                variant="outline"
                className="mb-2 text-brand-primary border-brand-primary/30"
              >
                Sección {number}
              </Badge>
              <CardTitle className="font-velista text-xl md:text-2xl font-bold">
                {title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
      </Card>
    </motion.section>
  );
}

export default function TerminosPage() {
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
              Términos y Condiciones
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary py-24 px-6 md:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-1/4 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 right-20 w-24 h-24 border border-white/20 rounded-full" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-highlight/20 text-highlight border-highlight/30 backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              Legales
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Términos y Condiciones
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-text-inverse/90 mb-8 italic max-w-3xl mx-auto">
              Condiciones generales de uso y compra en nuestro sitio web
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-highlight/50" />
              <div className="w-2 h-2 bg-highlight rounded-full" />
              <div className="w-12 h-px bg-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-12">
            {/* Table of Contents - Sticky Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <div className="lg:sticky lg:top-24">
                <Card variant="brand" className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-brand-primary" />
                      <CardTitle className="font-velista text-lg font-bold">
                        Índice
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <nav className="space-y-2">
                      {tableOfContents.map((item) => {
                        const IconComponent = item.icon;
                        return (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-cream transition-colors group"
                          >
                            <IconComponent className="w-4 h-4 text-brand-primary/60 group-hover:text-brand-primary transition-colors" />
                            <span className="text-sm text-[#791010]/70 group-hover:text-brand-primary transition-colors font-body">
                              {item.title}
                            </span>
                          </a>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>

                {/* Contact Card */}
                <Card variant="brand-subtle" className="p-6 mt-6">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="font-velista text-lg font-bold text-brand-primary">
                      ¿Tenés dudas?
                    </CardTitle>
                    <CardDescription className="font-body text-sm text-[#791010]/70">
                      Contactanos y te ayudamos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Button
                      variant="brand"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <Link href="mailto:daluzalkimya@gmail.com">
                        <Mail className="w-4 h-4 mr-2" />
                        Escribir email
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.aside>

            {/* Main Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="lg:col-span-9 space-y-8"
            >
              {/* 1. Generalidades */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="generalidades"
                  title="Generalidades"
                  icon={FileText}
                  number="1"
                >
                  <div className="space-y-4">
                    {generalidadesContent.map((text, index) => (
                      <p key={index} className="font-body text-[#791010]">
                        {text}
                      </p>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 2. Propiedad Intelectual */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="propiedad-intelectual"
                  title="Propiedad Intelectual"
                  icon={Lock}
                  number="2"
                >
                  <div className="space-y-4">
                    {propiedadIntelectualContent.map((item, index) => (
                      <div key={index}>
                        <h4 className="font-heading font-semibold text-brand-primary mb-2">
                          {item.title}
                        </h4>
                        <p className="font-body text-[#791010]">{item.text}</p>
                        {item.type === "warning" && (
                          <InfoBox type="warning">
                            <p className="font-body text-sm">
                              <strong>Importante:</strong> {item.text}
                            </p>
                          </InfoBox>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 3. Proceso de Compra y Pagos */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="compra-pagos"
                  title="Proceso de Compra y Pagos"
                  icon={CreditCard}
                  number="3"
                >
                  <div className="space-y-4">
                    {compraPagosContent.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary">
                            {item.label}
                          </h4>
                          <p className="font-body text-[#791010]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 4. Política de Envíos */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="envios"
                  title="Política de Envíos y Entregas"
                  icon={Truck}
                  number="4"
                >
                  <div className="space-y-4">
                    {enviosContent.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary">
                            {item.label}
                          </h4>
                          <p className="font-body text-[#791010]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button variant="brand-outline" size="sm" asChild>
                      <Link href="/politicas/envio">
                        Ver políticas de envío completas
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </SectionCard>
              </motion.div>

              {/* 5. Derecho de Arrepentimiento */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="arrepentimiento"
                  title="Derecho de Arrepentimiento"
                  icon={AlertTriangle}
                  number="5"
                >
                  <p className="font-body text-[#791010]">
                    Según la <strong>Ley 24.240</strong> de Defensa del
                    Consumidor, el cliente tiene{" "}
                    <strong>10 días corridos</strong> para revocar su compra
                    online.
                  </p>
                  <InfoBox type="info">
                    <h4 className="font-heading font-semibold mb-2">
                      Condiciones aplicables:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 font-body text-sm">
                      <li>
                        Aplicable a productos físicos no abiertos/en su estado
                        original
                      </li>
                      <li>
                        El producto debe estar en perfecto estado, sin uso
                      </li>
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
                  <p className="font-body text-[#791010]">
                    Para ejercer este derecho, contactanos a:{" "}
                    <strong>daluzalkimya@gmail.com</strong>
                  </p>
                </SectionCard>
              </motion.div>

              {/* 6. Exención de Responsabilidad */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="exencion"
                  title="Exención de Responsabilidad"
                  icon={Shield}
                  number="6"
                >
                  <div className="space-y-4">
                    {exencionContent.map((text, index) => (
                      <p key={index} className="font-body text-[#791010]">
                        {text}
                      </p>
                    ))}
                  </div>
                  <InfoBox type="success">
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm">
                        Los productos cosméticos son de venta libre y cumplen
                        con las normativas vigentes de ANMAT. No testamos en
                        animales (Cruelty Free).
                      </p>
                    </div>
                  </InfoBox>
                </SectionCard>
              </motion.div>

              {/* Divider */}
              <div className="flex items-center gap-4 py-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
                <Badge className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
                  <Lock className="w-4 h-4 mr-2" />
                  Política de Privacidad
                </Badge>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
              </div>

              {/* 7. Política de Privacidad */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="privacidad"
                  title="Política de Privacidad"
                  icon={Lock}
                  number="7"
                >
                  <p className="font-body text-[#791010]">
                    En cumplimiento con la <strong>Ley 25.326</strong> de
                    Protección de Datos Personales, recolectamos datos
                    únicamente para los siguientes fines:
                  </p>
                  <div className="space-y-4">
                    {privacidadContent.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="w-2 h-2 rounded-full bg-brand-primary mt-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary">
                            {item.label}
                          </h4>
                          <p className="font-body text-[#791010]">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 8. Derechos ARCO */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="derechos-arco"
                  title="Derechos ARCO"
                  icon={Eye}
                  number="8"
                >
                  <p className="font-body text-[#791010] mb-6">
                    Podés solicitar en cualquier momento el{" "}
                    <strong>Acceso</strong>, <strong>Rectificación</strong> o{" "}
                    <strong>Eliminación</strong> de tus datos personales.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {derechosArcoContent.map((item, index) => (
                      <Card
                        key={index}
                        variant="brand-subtle"
                        className="text-center p-4"
                      >
                        <CardTitle className="font-velista text-lg font-bold text-brand-primary mb-2">
                          {item.label}
                        </CardTitle>
                        <p className="font-body text-sm text-[#791010]/70">
                          {item.text}
                        </p>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-6">
                    <p className="font-body text-[#791010]">
                      Para ejercer estos derechos, envía un email a:{" "}
                      <strong>daluzalkimya@gmail.com</strong>
                    </p>
                  </div>
                </SectionCard>
              </motion.div>

              {/* 9. Seguridad */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="seguridad"
                  title="Seguridad"
                  icon={Scale}
                  number="9"
                >
                  <ul className="space-y-3">
                    {seguridadContent.map((text, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="font-body text-[#791010]">{text}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-12 px-6 bg-bg-cream border-t border-brand-primary/10">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="font-body text-[#791010]/70 text-sm">
            Fecha de última actualización:{" "}
            {new Date().toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="font-body text-[#791010]/50 text-xs mt-2">
            © {new Date().getFullYear()} DA LUZ CONSCIENTE. Todos los derechos
            reservados.
          </p>
        </div>
      </section>
    </div>
  );
}
