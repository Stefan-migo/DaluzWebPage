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
  Lock,
  Shield,
  FileText,
  Mail,
  Eye,
  Trash2,
  Database,
  CheckCircle,
  ChevronRight,
  User,
  MapPin,
  Phone,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Metadata is handled by the parent layout or through generateMetadata in server components
// For client components, we use useEffect to set document title if needed

const tableOfContents = [
  { id: "compromiso", title: "Nuestro Compromiso", icon: Heart },
  { id: "informacion", title: "Información que Recopilamos", icon: Database },
  { id: "finalidad", title: "Cómo Usamos tu Información", icon: FileText },
  { id: "proteccion", title: "Seguridad y Protección", icon: Lock },
  { id: "derechos", title: "Tus Derechos (Ley 25.326)", icon: Eye },
  { id: "cookies", title: "Cookies", icon: Database },
  { id: "contacto", title: "Contacto", icon: Mail },
];

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

const colorVariants = {
  alma: {
    bg: "bg-alma-primary",
    light: "bg-alma-lightest",
    text: "text-alma-primary",
  },
  ecos: {
    bg: "bg-ecos-primary",
    light: "bg-ecos-lightest",
    text: "text-ecos-primary",
  },
  jade: {
    bg: "bg-jade-primary",
    light: "bg-jade-lightest",
    text: "text-jade-primary",
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
  className = "",
}: {
  children: React.ReactNode;
  type?: "info" | "warning" | "success";
  className?: string;
}) {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`border rounded-lg p-4 ${styles[type]} ${className}`}>
      {children}
    </div>
  );
}

function SectionCard({
  id,
  title,
  icon: Icon,
  badge,
  children,
}: {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
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
              {badge && (
                <Badge
                  variant="outline"
                  className="mb-2 text-brand-primary border-brand-primary/30"
                >
                  {badge}
                </Badge>
              )}
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

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

export default function PrivacidadPage() {
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
              Política de Privacidad
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
              <Shield className="w-4 h-4 mr-2" />
              Legales
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Política de Privacidad
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-text-inverse/90 mb-8 italic max-w-3xl mx-auto">
              Cómo protegemos y usamos tus datos personales
            </p>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-highlight/50" />
              <div className="w-2 h-2 bg-highlight rounded-full" />
              <div className="w-12 h-px bg-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-8 px-6 bg-bg-cream border-b border-brand-primary/10">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-6 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-6 h-6 text-brand-primary" />
              <span className="font-body text-sm font-medium text-[#791010]">
                Datos encriptados
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-brand-primary" />
              <span className="font-body text-sm font-medium text-[#791010]">
                Ley 25.326
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-brand-primary" />
              <span className="font-body text-sm font-medium text-[#791010]">
                Sin spam
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
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
                      Estamos para ayudarte
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
              {/* 1. Nuestro Compromiso */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="compromiso"
                  title="Nuestro Compromiso"
                  icon={HeartIcon}
                  badge="Introducción"
                >
                  <p className="font-body text-[#791010]">
                    En <strong>DA LUZ CONSCIENTE</strong> respetamos tu
                    privacidad y nos comprometemos a proteger tus datos
                    personales. Esta política de privacidad describe cómo
                    recopilamos, usamos, divulgamos y protegemos tu información.
                  </p>
                  <InfoBox type="success">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm">
                        Cumplimos con la <strong>Ley 25.326</strong> de
                        Protección de Datos Personales de Argentina y normativas
                        equivalentes en otras jurisdicciones.
                      </p>
                    </div>
                  </InfoBox>
                </SectionCard>
              </motion.div>

              {/* 2. Información que Recopilamos */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="informacion"
                  title="Información que Recopilamos"
                  icon={Database}
                >
                  <p className="font-body text-[#791010]">
                    Recopilamos los siguientes tipos de información de forma
                    segura:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    {dataTypes.map((data, index) => {
                      const colors =
                        colorVariants[data.color as keyof typeof colorVariants];
                      const IconComponent = data.icon;
                      return (
                        <Card
                          key={index}
                          variant="brand-subtle"
                          className="p-4"
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${colors.light} flex items-center justify-center ${colors.text} mb-3`}
                          >
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <h4 className="font-heading font-semibold text-brand-primary mb-2">
                            {data.category}
                          </h4>
                          <ul className="space-y-1">
                            {data.items.map((item, i) => (
                              <li
                                key={i}
                                className="flex items-center gap-2 text-sm text-[#791010] font-body"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${colors.bg}`}
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </Card>
                      );
                    })}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 3. Cómo Usamos tu Información */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="finalidad"
                  title="Cómo Usamos tu Información"
                  icon={FileText}
                >
                  <p className="font-body text-[#791010]">
                    Utilizamos tu información exclusivamente para los siguientes
                    fines:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {purposeItems.map((item, index) => {
                      const colorKeys = [
                        "alma",
                        "ecos",
                        "jade",
                        "brand",
                      ] as const;
                      const colors = colorVariants[colorKeys[index]];
                      const IconComponent = item.icon;
                      return (
                        <Card
                          key={index}
                          variant="brand-subtle"
                          className="p-4"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`w-10 h-10 rounded-full ${colors.light} flex items-center justify-center ${colors.text} flex-shrink-0`}
                            >
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-heading font-semibold text-brand-primary mb-1">
                                {item.title}
                              </h4>
                              <p className="font-body text-sm text-[#791010]/70">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <InfoBox type="info" className="mt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <p className="font-body text-sm">
                        <strong>Importante:</strong> No utilizamos tus datos
                        para spam ni compartimos con terceros para fines de
                        marketing no relacionado con nuestros productos.
                      </p>
                    </div>
                  </InfoBox>
                </SectionCard>
              </motion.div>

              {/* 4. Seguridad y Protección */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="proteccion"
                  title="Seguridad y Protección"
                  icon={Lock}
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {securityItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 bg-bg-cream/50 rounded-lg"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary mb-1">
                            {item.title}
                          </h4>
                          <p className="font-body text-sm text-[#791010]/70">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>

              {/* 5. Tus Derechos */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="derechos"
                  title="Tus Derechos (Ley 25.326)"
                  icon={Eye}
                >
                  <p className="font-body text-[#791010]">
                    Tenés los siguientes derechos sobre tus datos personales:
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mt-6">
                    {rightsArco.map((right, index) => {
                      const colors =
                        colorVariants[
                          right.color as keyof typeof colorVariants
                        ];
                      const IconComponent = right.icon;
                      return (
                        <Card
                          key={index}
                          variant="brand"
                          className="text-center p-6 relative overflow-hidden"
                        >
                          <div
                            className={`absolute top-0 left-0 right-0 h-1 ${colors.bg}`}
                          />
                          <div
                            className={`w-14 h-14 mx-auto mb-4 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                          >
                            <IconComponent className="w-7 h-7" />
                          </div>
                          <h4 className="font-velista text-lg font-bold text-brand-primary mb-2">
                            {right.title}
                          </h4>
                          <p className="font-body text-sm text-[#791010]/70">
                            {right.description}
                          </p>
                        </Card>
                      );
                    })}
                  </div>
                  <InfoBox type="success" className="mt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-body text-sm font-medium">
                          Para ejercer cualquiera de estos derechos, contactanos
                          a: <strong>daluzalkimya@gmail.com</strong>
                        </p>
                        <p className="font-body text-sm mt-1">
                          Responderemos tu solicitud dentro de los 30 días
                          hábiles establecidos por ley.
                        </p>
                      </div>
                    </div>
                  </InfoBox>
                </SectionCard>
              </motion.div>

              {/* 6. Cookies */}
              <motion.div variants={itemVariants}>
                <SectionCard
                  id="cookies"
                  title="Cookies y Tecnologías Similares"
                  icon={Database}
                >
                  <p className="font-body text-[#791010]">
                    Nuestro sitio utiliza cookies y tecnologías similares para
                    mejorar tu experiencia de navegación:
                  </p>
                  <ul className="mt-4 space-y-3">
                    {[
                      "Recordar tus preferencias y ajustes",
                      "Analizar el tráfico y rendimiento del sitio",
                      "Personalizar el contenido según tus intereses",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="font-body text-[#791010]">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="font-body text-[#791010] mt-4">
                    <strong>Gestionar cookies:</strong> Podés configurar tu
                    navegador para rechazar todas las cookies o para indicar
                    cuándo se envía una cookie. Sin embargo, algunas funciones
                    del sitio pueden no funcionar correctamente sin cookies.
                  </p>
                </SectionCard>
              </motion.div>

              {/* 7. Contacto */}
              <motion.div variants={itemVariants}>
                <SectionCard id="contacto" title="Contacto" icon={Mail}>
                  <p className="font-body text-[#791010]">
                    Si tenés alguna pregunta sobre esta política de privacidad o
                    querés ejercer tus derechos, contactanos:
                  </p>
                  <Card variant="brand-subtle" className="p-6 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center">
                          <Shield className="w-5 h-5 text-brand-primary" />
                        </div>
                        <div>
                          <h4 className="font-heading font-semibold text-brand-primary">
                            DA LUZ CONSCIENTE
                          </h4>
                          <p className="font-body text-sm text-[#791010]/70">
                            Tu privacidad, nuestra prioridad
                          </p>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-brand-primary/10 space-y-2">
                        <p className="font-body text-[#791010]">
                          <strong>Email:</strong>{" "}
                          <a
                            href="mailto:daluzalkimya@gmail.com"
                            className="text-brand-primary hover:underline"
                          >
                            daluzalkimya@gmail.com
                          </a>
                        </p>
                        <p className="font-body text-[#791010]">
                          <strong>Ubicación:</strong> Córdoba, Argentina
                        </p>
                      </div>
                    </div>
                  </Card>
                </SectionCard>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 px-6 bg-bg-cream border-t border-brand-primary/10">
        <div className="container mx-auto max-w-4xl">
          <h3 className="font-velista text-xl font-bold text-brand-primary text-center mb-8">
            También te puede interesar
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button variant="brand-outline" asChild>
              <Link href="/politicas/terminos">
                Términos y Condiciones
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button variant="brand-outline" asChild>
              <Link href="/politicas/envio">Políticas de Envío</Link>
            </Button>
            <Button variant="brand-outline" asChild>
              <Link href="/politicas/arrepentimiento">
                Derecho de Arrepentimiento
              </Link>
            </Button>
            <Button variant="brand-outline" asChild>
              <Link href="/faq">Preguntas Frecuentes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 px-6 border-t border-brand-primary/10">
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
