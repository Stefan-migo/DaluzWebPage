"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  Video,
  Users,
  HelpCircle,
  ArrowRight,
  ChevronRight,
  Clock,
  MapPin,
  ExternalLink,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const helpCategories = [
  {
    title: "Guías de Productos",
    description:
      "Aprende a usar correctamente cada producto de nuestras líneas Alkimya",
    icon: BookOpen,
    color: "alma",
    bgColor: "bg-alma-primary",
    hoverColor: "hover:bg-alma-light",
    items: [
      { text: "Guías de aplicación", href: "/alkimya/tu-ceremonia" },
      { text: "Ingredientes y beneficios", href: "/alkimya/activos-origen" },
      { text: "Combinaciones recomendadas", href: "/alkimya/biotipos-doshas" },
    ],
    cta: "Explorar guías",
  },
  {
    title: "Soporte Técnico",
    description: "Ayuda con tu cuenta, pagos y problemas técnicos",
    icon: HelpCircle,
    color: "ecos",
    bgColor: "bg-ecos-primary",
    hoverColor: "hover:bg-ecos-light",
    items: [
      { text: "Problemas de acceso", href: "/faq" },
      { text: "Errores de pago", href: "/faq" },
      { text: "Actualizaciones de cuenta", href: "/configuracion" },
    ],
    cta: "Ver FAQ",
  },
  {
    title: "Programa de Membresía",
    description:
      "Todo lo que necesitas saber sobre tu membresía de transformación",
    icon: Users,
    color: "jade",
    bgColor: "bg-jade-primary",
    hoverColor: "hover:bg-jade-light",
    items: [
      { text: "Acceso a contenido", href: "/membresia" },
      { text: "Calendario de módulos", href: "/membresia/programa" },
      { text: "Beneficios exclusivos", href: "/membresia/comunidad" },
    ],
    cta: "Conocer más",
  },
  {
    title: "Envíos y Devoluciones",
    description:
      "Información sobre envíos, seguimiento y políticas de devolución",
    icon: FileText,
    color: "umbral",
    bgColor: "bg-umbral-primary",
    hoverColor: "hover:bg-umbral-light",
    items: [
      { text: "Estado de pedidos", href: "/mis-pedidos" },
      { text: "Políticas de devolución", href: "/politicas/arrepentimiento" },
      { text: "Tiempos de entrega", href: "/politicas/envio" },
    ],
    cta: "Ver políticas",
  },
];

const popularResources = [
  {
    title: "Preguntas Frecuentes",
    description: "Respuestas rápidas a las consultas más comunes",
    icon: HelpCircle,
    href: "/faq",
    color: "bg-brand-primary",
  },
  {
    title: "Políticas de Envío",
    description: "Tiempos, costos y zonas de entrega",
    icon: MapPin,
    href: "/politicas/envio",
    color: "bg-ecos-primary",
  },
  {
    title: "Términos y Condiciones",
    description: "Condiciones generales de compra",
    icon: FileText,
    href: "/politicas/terminos",
    color: "bg-jade-primary",
  },
  {
    title: "Política de Privacidad",
    description: "Cómo protegemos tus datos",
    icon: Shield,
    href: "/politicas/privacidad",
    color: "bg-umbral-primary",
  },
];

const contactMethods = [
  {
    title: "Soporte por Email",
    description: "Te respondemos en menos de 24 horas",
    icon: Mail,
    href: "mailto:info@daluzconsciente.com",
    color: "alma",
    badge: "info@daluzconsciente.com",
  },
  {
    title: "WhatsApp",
    description: "Lunes a Viernes: 9:00 - 18:00 hs",
    icon: Phone,
    href: "https://wa.me/5493512344580",
    color: "jade",
    badge: "+54 9 3512 344580",
  },
];

const colorVariants = {
  alma: {
    bg: "bg-alma-primary",
    light: "bg-alma-lightest",
    text: "text-alma-primary",
    border: "border-alma-primary/20",
    hover: "hover:shadow-alma",
  },
  ecos: {
    bg: "bg-ecos-primary",
    light: "bg-ecos-lightest",
    text: "text-ecos-primary",
    border: "border-ecos-primary/20",
    hover: "hover:shadow-ecos",
  },
  jade: {
    bg: "bg-jade-primary",
    light: "bg-jade-lightest",
    text: "text-jade-primary",
    border: "border-jade-primary/20",
    hover: "hover:shadow-jade",
  },
  umbral: {
    bg: "bg-umbral-primary",
    light: "bg-umbral-lightest",
    text: "text-umbral-primary",
    border: "border-umbral-primary/20",
    hover: "hover:shadow-umbral",
  },
  brand: {
    bg: "bg-brand-primary",
    light: "bg-bg-cream",
    text: "text-brand-primary",
    border: "border-brand-primary/20",
    hover: "hover:shadow-alkimya",
  },
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function AyudaPage() {
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
            <span className="text-brand-primary font-medium">
              Centro de Ayuda
            </span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary py-24 px-6 md:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-40 h-40 border border-white/30 rounded-full" />
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-highlight/20 rounded-full blur-2xl" />
        </div>

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-highlight/20 text-highlight border-highlight/30 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Estamos Aquí para Ayudarte
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Centro de Ayuda
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-text-inverse/90 mb-8 italic max-w-3xl mx-auto">
              Encuentra respuestas, guías y soporte completo para tu experiencia
              con DA LUZ CONSCIENTE
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-px bg-highlight/50" />
              <div className="w-2 h-2 bg-highlight rounded-full" />
              <div className="w-12 h-px bg-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="font-body text-lg text-[#791010]/70 max-w-2xl mx-auto">
              Selecciona la categoría que mejor describe tu consulta
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid md:grid-cols-2 gap-8"
          >
            {helpCategories.map((category) => {
              const colors =
                colorVariants[category.color as keyof typeof colorVariants];
              const IconComponent = category.icon;

              return (
                <motion.div key={category.title} variants={itemVariants}>
                  <Card
                    variant="brand"
                    className={`h-full group ${colors.hover} transition-all duration-300`}
                  >
                    {/* Color accent bar */}
                    <div className={`h-1 ${colors.bg} rounded-t-xl`} />

                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto mb-6 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                      >
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <CardTitle className="font-velista text-xl md:text-2xl font-bold mb-2">
                        {category.title}
                      </CardTitle>
                      <CardDescription className="font-body text-[#791010]/70">
                        {category.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <ul className="space-y-3 mb-6">
                        {category.items.map((item, index) => (
                          <li key={index}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-3 text-[#791010] hover:text-brand-primary transition-colors group/item"
                            >
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${colors.bg} group-hover/item:scale-125 transition-transform`}
                              />
                              <span className="font-body text-sm">
                                {item.text}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant={
                          category.color as
                            | "alma"
                            | "ecos"
                            | "jade"
                            | "umbral"
                            | "utopica"
                        }
                        className="w-full group/btn"
                        asChild
                      >
                        <Link href={category.items[0].href}>
                          {category.cta}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Popular Resources */}
      <section className="py-20 px-6 bg-bg-cream relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-jade-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-alma-primary/10 rounded-full blur-3xl" />
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
              <FileText className="w-4 h-4 mr-2" />
              Recursos Útiles
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              Recursos Populares
            </h2>
            <p className="font-body text-lg text-[#791010]/70 max-w-2xl mx-auto">
              Los recursos más consultados por nuestra comunidad
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {popularResources.map((resource) => {
              const IconComponent = resource.icon;
              const colorKey = resource.color
                .replace("bg-", "")
                .replace("-primary", "") as keyof typeof colorVariants;
              const colors = colorVariants[colorKey] || colorVariants.brand;

              return (
                <motion.div key={resource.title} variants={itemVariants}>
                  <Card
                    variant="interactive"
                    className={`text-center h-full border-t-4 border-t-${resource.color}`}
                  >
                    <CardHeader className="pb-2">
                      <div
                        className={`w-12 h-12 mx-auto mb-4 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <CardTitle className="font-velista text-lg font-bold">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="font-body text-sm text-[#791010]/70">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button
                        variant="brand-ghost"
                        size="sm"
                        className="font-btn"
                        asChild
                      >
                        <Link href={resource.href}>
                          Ver más
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* FAQ Card */}
            <Card
              variant="brand"
              className="text-center p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-alma-lightest flex items-center justify-center text-alma-primary">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                  Preguntas Frecuentes
                </h3>
                <p className="font-body text-sm text-[#791010]/70 mb-6">
                  Respuestas rápidas a las consultas más comunes sobre
                  productos, envíos y servicios.
                </p>
                <Button variant="alma" asChild>
                  <Link href="/faq">
                    Consultar FAQ
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* Video Tutorials Card */}
            <Card
              variant="brand"
              className="text-center p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ecos-lightest flex items-center justify-center text-ecos-primary">
                  <Video className="w-8 h-8" />
                </div>
                <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                  Tutoriales en Video
                </h3>
                <p className="font-body text-sm text-[#791010]/70 mb-6">
                  Aprende con nuestras guías visuales paso a paso sobre el uso
                  de productos.
                </p>
                <Button variant="ecos" disabled>
                  Próximamente
                </Button>
              </div>
            </Card>

            {/* Guides Card */}
            <Card
              variant="brand"
              className="text-center p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-5" />
              <div className="relative">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jade-lightest flex items-center justify-center text-jade-primary">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                  Guías Descargables
                </h3>
                <p className="font-body text-sm text-[#791010]/70 mb-6">
                  PDFs con información detallada sobre ingredientes, rituales y
                  beneficios.
                </p>
                <Button variant="jade" disabled>
                  Próximamente
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 px-6 bg-gradient-to-br from-brand-primary to-brand-secondary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full" />
        </div>

        <div className="container relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contacta Nuestro Equipo
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-text-inverse">
              ¿No encontraste lo que buscabas?
            </h2>
            <p className="font-body text-lg text-text-inverse/80 max-w-2xl mx-auto">
              Si no encontraste lo que buscas, nuestro equipo está listo para
              ayudarte personalmente
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {contactMethods.map((method) => {
              const IconComponent = method.icon;
              const colors =
                colorVariants[method.color as keyof typeof colorVariants];

              return (
                <Card
                  key={method.title}
                  variant="glass"
                  className="p-8 text-center backdrop-blur-md border-white/20"
                >
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full ${colors.light} flex items-center justify-center ${colors.text}`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                    {method.title}
                  </h3>
                  <p className="font-body text-sm text-[#791010]/70 mb-6">
                    {method.description}
                  </p>
                  <div className="mb-4">
                    <Badge
                      variant="outline"
                      className={`${colors.text} border-current`}
                    >
                      {method.badge}
                    </Badge>
                  </div>
                  <Button
                    variant={
                      method.color as "alma" | "ecos" | "jade" | "umbral"
                    }
                    className="w-full"
                    asChild
                  >
                    <Link href={method.href}>
                      <IconComponent className="w-4 h-4 mr-2" />
                      {method.color === "alma" ? "Enviar Email" : "Contactar"}
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </motion.div>

          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <div className="flex items-center justify-center gap-2 text-text-inverse/70 mb-4">
              <Clock className="w-4 h-4" />
              <span className="font-caption text-sm">
                Lunes a Viernes: 9:00 - 18:00 hs (Argentina)
              </span>
            </div>
            <p className="font-body text-sm text-text-inverse/60">
              Para consultas sobre productos específicos, te recomendamos
              contactar por WhatsApp para una asesoría personalizada.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
