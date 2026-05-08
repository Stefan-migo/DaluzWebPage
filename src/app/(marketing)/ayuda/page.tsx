"use client";

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
  Shield,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import styles from "./ayuda.module.css";

type LineColor = "alma" | "ecos" | "jade" | "umbral";
type ResourceColor = LineColor | "brand";

const helpCategories: Array<{
  title: string;
  description: string;
  icon: typeof BookOpen;
  color: LineColor;
  items: { text: string; href: string }[];
  cta: string;
}> = [
    {
      title: "Guías de Productos",
      description:
        "Aprende a usar correctamente cada producto de nuestras líneas Alkimya",
      icon: BookOpen,
      color: "alma",
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
      items: [
        { text: "Estado de pedidos", href: "/mis-pedidos" },
        { text: "Políticas de devolución", href: "/politicas/arrepentimiento" },
        { text: "Tiempos de entrega", href: "/politicas/envio" },
      ],
      cta: "Ver políticas",
    },
  ];

const popularResources: Array<{
  title: string;
  description: string;
  icon: typeof HelpCircle;
  href: string;
  color: ResourceColor;
}> = [
    {
      title: "Preguntas Frecuentes",
      description: "Respuestas rápidas a las consultas más comunes",
      icon: HelpCircle,
      href: "/faq",
      color: "brand",
    },
    {
      title: "Políticas de Envío",
      description: "Tiempos, costos y zonas de entrega",
      icon: MapPin,
      href: "/politicas/envio",
      color: "ecos",
    },
    {
      title: "Términos y Condiciones",
      description: "Condiciones generales de compra",
      icon: FileText,
      href: "/politicas/terminos",
      color: "jade",
    },
    {
      title: "Política de Privacidad",
      description: "Cómo protegemos tus datos",
      icon: Shield,
      href: "/politicas/privacidad",
      color: "umbral",
    },
  ];

const contactMethods: Array<{
  title: string;
  description: string;
  icon: typeof Mail;
  href: string;
  color: "alma" | "jade";
  data: string;
  cta: string;
}> = [
    {
      title: "Soporte por Email",
      description: "Te respondemos en menos de 24 horas",
      icon: Mail,
      href: "mailto:info@daluzconsciente.com",
      color: "alma",
      data: "info@daluzconsciente.com",
      cta: "Enviar Email",
    },
    {
      title: "WhatsApp",
      description: "Lunes a Viernes: 9:00 - 18:00 hs",
      icon: Phone,
      href: "https://wa.me/5493512344580",
      color: "jade",
      data: "+54 9 3512 344580",
      cta: "Contactar",
    },
  ];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const heroVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function AyudaPage() {
  return (
    <div className={styles.page}>
      {/* ===== HERO ===== */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground} aria-hidden="true" />
        <div className={styles.heroNoise} aria-hidden="true" />
        <div className={styles.heroBlob1} aria-hidden="true" />
        <div className={styles.heroBlob2} aria-hidden="true" />

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="show"
          className={styles.heroContent}
        >
          <motion.div variants={heroItemVariants} className={styles.heroEyebrow}>
            <span className={styles.heroEyebrowLine} aria-hidden="true" />
            <span className={styles.heroEyebrowIcon} aria-hidden="true">
              <Sparkles />
            </span>
            <span>Estamos aquí para ayudarte</span>
          </motion.div>

          <motion.h1 variants={heroItemVariants} className={styles.heroTitle}>
            Centro de Ayuda
          </motion.h1>

          <motion.p variants={heroItemVariants} className={styles.heroSubtitle}>
            Encuentra respuestas, guías y soporte completo para tu experiencia
            con DA LUZ CONSCIENTE
          </motion.p>

          <motion.div
            variants={heroItemVariants}
            className={styles.heroDivider}
            aria-hidden="true"
          >
            <span className={styles.heroDividerDot} />
            <span className={styles.heroDividerLine} />
            <span className={styles.heroDividerDiamond}>◆</span>
            <span className={styles.heroDividerLine} />
            <span className={styles.heroDividerDot} />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== CATEGORÍAS ===== */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <h2 className={styles.sectionHeading}>¿Cómo podemos ayudarte?</h2>
            <p className={styles.sectionDescription}>
              Selecciona la categoría que mejor describe tu consulta
            </p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.categoriesGrid}
          >
            {helpCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.article
                  key={category.title}
                  variants={itemVariants}
                  className={styles.categoryCard}
                  data-line={category.color}
                >
                  <span className={styles.categoryAccent} aria-hidden="true" />

                  <div className={styles.categoryHeader}>
                    <span className={styles.categoryIcon} aria-hidden="true">
                      <Icon />
                    </span>
                    <h3 className={styles.categoryTitle}>{category.title}</h3>
                    <p className={styles.categoryDescription}>
                      {category.description}
                    </p>
                  </div>

                  <ul className={styles.categoryList}>
                    {category.items.map((item) => (
                      <li key={item.text} className={styles.categoryListItem}>
                        <Link href={item.href} className={styles.categoryItemLink}>
                          <span
                            className={styles.categoryItemDot}
                            aria-hidden="true"
                          />
                          <span>{item.text}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.categoryCta}>
                    <Button variant={category.color} className="w-full" asChild>
                      <Link href={category.items[0].href}>
                        {category.cta}
                        <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== RECURSOS POPULARES ===== */}
      <section className={styles.section}>
        <span className={styles.sectionBlobs} aria-hidden="true" />

        <div className={styles.sectionInner}>
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionEyebrow}>
              <span className={styles.sectionEyebrowIcon} aria-hidden="true">
                <FileText />
              </span>
              Recursos útiles
            </span>
            <h2 className={styles.sectionHeading}>Recursos Populares</h2>
            <p className={styles.sectionDescription}>
              Los recursos más consultados por nuestra comunidad
            </p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.resourcesGrid}
          >
            {popularResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <motion.div
                  key={resource.title}
                  variants={itemVariants}
                  className={styles.resourceCard}
                  data-line={resource.color}
                >
                  <span className={styles.resourceAccent} aria-hidden="true" />
                  <span className={styles.resourceIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3 className={styles.resourceTitle}>{resource.title}</h3>
                  <p className={styles.resourceDescription}>
                    {resource.description}
                  </p>
                  <Link href={resource.href} className={styles.resourceLink}>
                    Ver más
                    <ChevronRight />
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== QUICK LINKS — FAQ destacada + Próximamente ===== */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.quickGrid}
          >
            {/* FAQ — Destacada */}
            <motion.article
              variants={itemVariants}
              className={`${styles.quickCard} ${styles.quickCardFeatured}`}
            >
              <span className={styles.quickIcon} aria-hidden="true">
                <HelpCircle />
              </span>
              <h3 className={styles.quickTitle}>Preguntas Frecuentes</h3>
              <p className={styles.quickDescription}>
                Respuestas rápidas a las consultas más comunes sobre productos,
                envíos y servicios.
              </p>
              <div className={styles.quickAction}>
                <Button variant="alma" asChild>
                  <Link href="/faq">
                    Consultar FAQ
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </motion.article>

            {/* Tutoriales en Video — Próximamente */}
            <motion.article
              variants={itemVariants}
              className={`${styles.quickCard} ${styles.quickCardComing}`}
              data-line="ecos"
            >
              <span className={styles.quickEyebrowComing}>Próximamente</span>
              <span className={styles.quickIcon} aria-hidden="true">
                <Video />
              </span>
              <h3 className={styles.quickTitle}>Tutoriales en Video</h3>
              <p className={styles.quickDescription}>
                Aprende con nuestras guías visuales paso a paso sobre el uso de
                productos.
              </p>
              <span className={styles.quickComingAction}>
                <Clock />
                Disponible pronto
              </span>
            </motion.article>

            {/* Guías Descargables — Próximamente */}
            <motion.article
              variants={itemVariants}
              className={`${styles.quickCard} ${styles.quickCardComing}`}
              data-line="jade"
            >
              <span className={styles.quickEyebrowComing}>Próximamente</span>
              <span className={styles.quickIcon} aria-hidden="true">
                <BookOpen />
              </span>
              <h3 className={styles.quickTitle}>Guías Descargables</h3>
              <p className={styles.quickDescription}>
                PDFs con información detallada sobre ingredientes, rituales y
                beneficios.
              </p>
              <span className={styles.quickComingAction}>
                <Clock />
                Disponible pronto
              </span>
            </motion.article>
          </motion.div>
        </div>
      </section>

      {/* ===== CONTACT — Cierre minimalista ===== */}
      <section className={styles.contactSection}>
        <div className={styles.contactInner}>
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.sectionHeader}
          >
            <span className={styles.sectionEyebrow}>
              <span className={styles.sectionEyebrowIcon} aria-hidden="true">
                <MessageCircle />
              </span>
              Contactate con nuestro equipo
            </span>
            <h2 className={styles.sectionHeading}>
              ¿No encontraste lo que buscabas?
            </h2>
            <p className={styles.sectionDescription}>
              Si no encontraste lo que buscas, nuestro equipo está listo para
              ayudarte personalmente
            </p>
          </motion.header>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className={styles.contactGrid}
          >
            {contactMethods.map((method) => {
              const Icon = method.icon;
              return (
                <motion.article
                  key={method.title}
                  variants={itemVariants}
                  className={styles.contactCard}
                  data-line={method.color}
                >
                  <span className={styles.contactCardIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <div className={styles.contactCardBody}>
                    <h3 className={styles.contactCardTitle}>{method.title}</h3>
                    <p className={styles.contactCardDescription}>
                      {method.description}
                    </p>
                    <span className={styles.contactCardData}>{method.data}</span>
                    <div className={styles.contactCardCta}>
                      <Button variant={method.color} asChild>
                        <Link href={method.href}>
                          <Icon />
                          {method.cta}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={styles.contactFooter}
          >
            <p className={styles.contactFooterText}>
              <Clock />
              Lunes a Viernes: 9:00 - 18:00 hs (Argentina)
            </p>
            <p className={styles.contactFooterNote}>
              Para consultas sobre productos específicos, te recomendamos
              contactar por WhatsApp para una asesoría personalizada.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
