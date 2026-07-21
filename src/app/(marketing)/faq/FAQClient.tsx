"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  Leaf,
  Sparkles,
  Gift,
  Shield,
  Truck,
  MessageCircle,
  Mail,
  Phone,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FAQ_DATA, FAQ_CONTACT_CTA } from "./data/faqs";

// Mapeo de nombres de iconos a componentes
const iconMap = {
  Leaf,
  Sparkles,
  Gift,
  Shield,
  Truck,
  HelpCircle,
} as const;

type IconName = keyof typeof iconMap;

// Color palette for categories
const categoryColors = [
  "bg-alma-primary",
  "bg-ecos-primary",
  "bg-jade-primary",
  "bg-umbral-primary",
  "bg-brand-primary",
];

// Estilo de las píldoras inactivas sobre el fondo oscuro (glass claro)
const pillInactiveClasses =
  "!border-white/25 !bg-white/5 !text-white/90 hover:!bg-white/15 hover:!text-white";

// Botón de acción para las tarjetas del CTA (se aplica directo al Link/anchor
// porque el `asChild` del componente Button no propaga clases sobre un Fragment).
const ctaButtonBase =
  "inline-flex w-full items-center justify-center gap-2 h-11 rounded-md px-4 text-sm font-btn uppercase tracking-wider transition-all duration-300 hover:-translate-y-0.5";

interface CollapsibleFAQProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function CollapsibleFAQ({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: CollapsibleFAQProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card
        variant="brand-subtle"
        className="overflow-hidden rounded-none border-l-4 border-l-brand-primary !bg-bg-cream shadow-soft"
      >
        <button
          onClick={onToggle}
          className="w-full p-6 text-left hover:bg-bg-light transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
          aria-expanded={isOpen}
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-lg font-semibold text-brand-primary md:text-xl">
              {question}
            </h3>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5 text-brand-primary" />
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
              <CardContent className="px-6 pb-6 pt-0">
                <div
                  className="font-body text-[#791010] prose prose-sm max-w-none prose-headings:font-heading prose-headings:text-brand-primary prose-p:text-[#791010] prose-li:text-[#791010] prose-strong:text-brand-primary"
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

export default function FAQClient() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) =>
      prev.includes(id) ? prev.filter((cat) => cat !== id) : [...prev, id],
    );
  };

  // Al filtrar por una categoría (píldora), la mostramos abierta para no
  // dejar solo el título; "Todas" (null) no fuerza ninguna apertura.
  const selectCategory = (id: string | null) => {
    setActiveCategory(id);
    if (id && !openCategories.includes(id)) {
      setOpenCategories((prev) => [...prev, id]);
    }
  };

  const filteredData = activeCategory
    ? FAQ_DATA.filter((cat) => cat.id === activeCategory)
    : FAQ_DATA;

  return (
    <div className="min-h-screen bg-faq-gradient">
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden py-24 px-6 md:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-brand-highlight/20 rounded-full blur-2xl" />
        </div>

        {/* Golden line decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-brand-highlight to-transparent" />

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-brand-highlight/20 text-brand-highlight border-brand-highlight/30 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Centro de Ayuda
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Preguntas Frecuentes
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-white/90 mb-8 italic max-w-3xl mx-auto">
              Todo lo que necesitas saber sobre nuestras Alquimias y servicios
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-brand-highlight/50" />
              <div className="w-12 h-px bg-brand-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="py-8 px-6 bg-white/5 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={activeCategory === null ? "brand" : "brand-outline"}
              size="sm"
              onClick={() => selectCategory(null)}
              className={`font-btn uppercase tracking-wider ${activeCategory === null ? "" : pillInactiveClasses
                }`}
            >
              Todas
            </Button>
            {FAQ_DATA.map((category) => {
              const IconComponent = iconMap[category.icon as IconName];
              const isActive = activeCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "brand" : "brand-outline"}
                  size="sm"
                  onClick={() => selectCategory(category.id)}
                  className={`font-btn uppercase tracking-wider ${isActive ? "" : pillInactiveClasses
                    }`}
                >
                  {IconComponent && <IconComponent className="w-4 h-4 mr-2" />}
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="relative overflow-hidden py-16 px-6">
        {/* Decorative background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-20 left-1/4 w-72 h-72 bg-[#0085B1]/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-16 w-80 h-80 bg-[#1A3F71]/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#2A2543]/40 rounded-full blur-3xl" />
        </div>

        {/* Golden line decoration */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-brand-highlight/60 to-transparent" />

        <div className="container relative mx-auto max-w-4xl">
          {filteredData.map((category, categoryIndex) => {
            const IconComponent = iconMap[category.icon as IconName];
            const accentColor =
              categoryColors[categoryIndex % categoryColors.length];
            const isCategoryOpen = openCategories.includes(category.id);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className="mb-6"
              >
                {/* Category Header - Collapsible toggle */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  aria-expanded={isCategoryOpen}
                  className="group w-full rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition-colors duration-300 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-highlight/60"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-full ${accentColor} text-white flex-shrink-0`}
                    >
                      {IconComponent && <IconComponent className="w-6 h-6" />}
                    </div>
                    <h2 className="font-velista text-2xl md:text-3xl font-bold text-text-inverse tracking-wide text-left">
                      {category.name}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-brand-highlight/40 to-transparent" />
                    <motion.div
                      animate={{ rotate: isCategoryOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-6 h-6 text-brand-highlight" />
                    </motion.div>
                  </div>
                </button>

                {/* FAQ Items */}
                <AnimatePresence initial={false}>
                  {isCategoryOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pt-4">
                        {category.items.map((item, index) => {
                          const itemId = `${category.id}-${index}`;
                          return (
                            <CollapsibleFAQ
                              key={itemId}
                              question={item.question}
                              answer={item.answer}
                              isOpen={openItems.includes(itemId)}
                              onToggle={() => toggleItem(itemId)}
                              index={index}
                            />
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Contact Support CTA - Redesigned */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#0085B1]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#2A2543]/40 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-white/10 text-brand-highlight border-brand-highlight/30 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              ¿Necesitas ayuda personalizada?
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-text-inverse">
              {FAQ_CONTACT_CTA.title}
            </h2>
            <p className="font-body text-lg text-white/80 max-w-2xl mx-auto">
              {FAQ_CONTACT_CTA.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6"
          >
            {/* Chat Card */}
            <Card variant="glass" className="text-center p-8 backdrop-blur-md border-white/15">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#3FB6E0]" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-text-inverse">
                Chat en Vivo
              </h3>
              <p className="font-body text-sm text-white/70 mb-6">
                Respuesta inmediata de nuestro equipo
              </p>
              <button
                disabled
                className={`${ctaButtonBase} cursor-not-allowed border border-white/15 bg-white/10 text-white/50 hover:translate-y-0`}
              >
                Próximamente
              </button>
            </Card>

            {/* Email Card */}
            <Card variant="glass" className="text-center p-8 backdrop-blur-md border-white/15">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Mail className="w-8 h-8 text-brand-highlight" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-text-inverse">
                Email
              </h3>
              <p className="font-body text-sm text-white/70 mb-6">
                Te respondemos en menos de 24hs
              </p>
              <Link
                href="mailto:daluzconsciente@gmail.com"
                className={`${ctaButtonBase} bg-brand-highlight text-brand-primary shadow-soft hover:bg-brand-highlight/90`}
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </Link>
            </Card>

            {/* WhatsApp Card */}
            <Card variant="glass" className="text-center p-8 backdrop-blur-md border-white/15">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Phone className="w-8 h-8 text-emerald-300" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-text-inverse">
                WhatsApp
              </h3>
              <p className="font-body text-sm text-white/70 mb-6">
                Atención personalizada e inmediata
              </p>
              <Link
                href={FAQ_CONTACT_CTA.buttonLink}
                className={`${ctaButtonBase} bg-emerald-500 text-white shadow-soft hover:bg-emerald-400`}
              >
                <Phone className="w-4 h-4" />
                {FAQ_CONTACT_CTA.buttonText}
              </Link>
            </Card>
          </motion.div>

          {/* Additional CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="font-body text-white/70 mb-4">
              También puedes explorar nuestros recursos
            </p>
            <Link
              href="/ayuda"
              className="inline-flex items-center justify-center gap-2 h-11 rounded-md border-2 border-white/40 px-6 text-sm font-btn uppercase tracking-wider text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              Visitar Centro de Ayuda
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
