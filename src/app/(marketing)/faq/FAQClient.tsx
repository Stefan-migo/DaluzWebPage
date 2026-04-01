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
        className="overflow-hidden rounded-none border-l-4 border-l-brand-primary"
      >
        <button
          onClick={onToggle}
          className="w-full p-6 text-left hover:bg-bg-cream/50 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/50"
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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredData = activeCategory
    ? FAQ_DATA.filter((cat) => cat.id === activeCategory)
    : FAQ_DATA;

  return (
    <div className="min-h-screen">
      {/* Hero Section - Redesigned */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary py-24 px-6 md:py-32">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white/30 rounded-full" />
          <div className="absolute bottom-20 right-20 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-highlight/20 rounded-full blur-2xl" />
        </div>

        {/* Golden line decoration */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-highlight to-transparent" />

        <div className="container relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-highlight/20 text-highlight border-highlight/30 backdrop-blur-sm">
              <HelpCircle className="w-4 h-4 mr-2" />
              Centro de Ayuda
            </Badge>

            <h1 className="font-velista text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-text-inverse tracking-wide">
              Preguntas Frecuentes
            </h1>

            <p className="font-subtitle text-xl md:text-2xl text-text-inverse/90 mb-8 italic max-w-3xl mx-auto">
              Todo lo que necesitas saber sobre nuestras Alquimias y servicios
            </p>

            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-px bg-highlight/50" />
              <div className="w-2 h-2 bg-highlight rounded-full" />
              <div className="w-12 h-px bg-highlight/50" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Pills Navigation */}
      <section className="py-8 px-6 bg-bg-cream border-b border-brand-primary/10">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={activeCategory === null ? "brand" : "brand-outline"}
              size="sm"
              onClick={() => setActiveCategory(null)}
              className="font-btn uppercase tracking-wider"
            >
              Todas
            </Button>
            {FAQ_DATA.map((category, index) => {
              const IconComponent = iconMap[category.icon as IconName];
              return (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "brand" : "brand-outline"
                  }
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="font-btn uppercase tracking-wider"
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
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          {filteredData.map((category, categoryIndex) => {
            const IconComponent = iconMap[category.icon as IconName];
            const accentColor =
              categoryColors[categoryIndex % categoryColors.length];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: categoryIndex * 0.1 }}
                className="mb-16"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-full ${accentColor} text-white`}>
                    {IconComponent && <IconComponent className="w-6 h-6" />}
                  </div>
                  <h2 className="font-velista text-2xl md:text-3xl font-bold text-brand-primary tracking-wide">
                    {category.name}
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-brand-primary/30 to-transparent" />
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
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
            );
          })}
        </div>
      </section>

      {/* Contact Support CTA - Redesigned */}
      <section className="py-20 px-6 bg-bg-cream relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-alma-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-jade-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Badge className="mb-4 bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              <MessageCircle className="w-4 h-4 mr-2" />
              ¿Necesitas ayuda personalizada?
            </Badge>
            <h2 className="font-velista text-3xl md:text-4xl font-bold mb-4 text-brand-primary">
              {FAQ_CONTACT_CTA.title}
            </h2>
            <p className="font-body text-lg text-[#791010] max-w-2xl mx-auto">
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
            <Card variant="glass" className="text-center p-8 backdrop-blur-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-ecos-primary/10 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-ecos-primary" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                Chat en Vivo
              </h3>
              <p className="font-body text-sm text-[#791010]/70 mb-6">
                Respuesta inmediata de nuestro equipo
              </p>
              <Button variant="ecos" className="w-full" disabled>
                Próximamente
              </Button>
            </Card>

            {/* Email Card */}
            <Card variant="glass" className="text-center p-8 backdrop-blur-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-alma-primary/10 flex items-center justify-center">
                <Mail className="w-8 h-8 text-alma-primary" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                Email
              </h3>
              <p className="font-body text-sm text-[#791010]/70 mb-6">
                Te respondemos en menos de 24hs
              </p>
              <Button variant="alma" className="w-full" asChild>
                <Link href="mailto:info@daluzconsciente.com">
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar Email
                </Link>
              </Button>
            </Card>

            {/* WhatsApp Card */}
            <Card variant="glass" className="text-center p-8 backdrop-blur-md">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-jade-primary/10 flex items-center justify-center">
                <Phone className="w-8 h-8 text-jade-primary" />
              </div>
              <h3 className="font-velista text-xl font-bold mb-2 text-brand-primary">
                WhatsApp
              </h3>
              <p className="font-body text-sm text-[#791010]/70 mb-6">
                Atención personalizada e inmediata
              </p>
              <Button variant="jade" className="w-full" asChild>
                <Link href={FAQ_CONTACT_CTA.buttonLink}>
                  <Phone className="w-4 h-4 mr-2" />
                  {FAQ_CONTACT_CTA.buttonText}
                </Link>
              </Button>
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
            <p className="font-body text-[#791010]/70 mb-4">
              También puedes explorar nuestros recursos
            </p>
            <Button variant="brand-outline" asChild>
              <Link href="/ayuda">
                Visitar Centro de Ayuda
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
