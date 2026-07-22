"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { usePublicConfig } from "@/hooks/usePublicConfig";

// Default values as fallbacks (used until config is loaded or if not set in DB)
const DEFAULT_CONTACT_EMAIL = "contacto@daluzconsciente.com";
const DEFAULT_PHONE = "+54 9 3512 344580";
const DEFAULT_ADDRESS = "Córdoba, Argentina";
const DEFAULT_WHATSAPP = "5493512344580";
const DEFAULT_INSTAGRAM = "https://instagram.com/daluzconsciente";
const DEFAULT_FACEBOOK = "https://facebook.com/daluzconsciente";

/* Procesos pages: green theme matching page background */
const PROCESOS_BG = "#011f18";
const PROCESOS_BORDER = "#093123";
const isProcesosPage = (pathname: string) =>
  pathname === "/servicios/procesos" ||
  pathname.startsWith("/servicios/procesos/");

/* Raíces & Filosofía pages: blue theme */
const RAICES_BG = "#0f3460";
const RAICES_BORDER = "#1a4a7a";
const isRaicesPage = (pathname: string) =>
  pathname === "/raices" || pathname === "/filosofia-proposito";

/* FAQ, Ayuda y Envíos: enlaza con el final del degradado azul de la página */
const FAQ_BG = "#005080";
const FAQ_BORDER = "#0085B1";
const isFaqPage = (pathname: string) =>
  pathname === "/faq" ||
  pathname === "/ayuda" ||
  pathname === "/politicas/envio";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  MessageCircle,
  Heart,
  Leaf,
  Sparkles,
} from "lucide-react";

export default function Footer() {
  const { currentLine } = useTheme();
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Fetch public contact config from system_config table
  const { config: contactConfig } = usePublicConfig({
    keys: [
      "contact_email",
      "phone_number",
      "whatsapp_phone",
      "address",
      "city",
      "country",
      "social_instagram",
      "social_facebook",
      "social_whatsapp",
    ],
  });

  // Derive contact values from config with fallbacks
  const contactEmail = contactConfig?.contact_email || DEFAULT_CONTACT_EMAIL;
  const contactPhone = contactConfig?.phone_number || DEFAULT_PHONE;
  const contactWhatsApp = contactConfig?.whatsapp_phone || DEFAULT_WHATSAPP;
  const contactAddress =
    [contactConfig?.address, contactConfig?.city, contactConfig?.country]
      .filter(Boolean)
      .join(", ") || DEFAULT_ADDRESS;

  // Social media from config (ensure string type for phone numbers)
  const socialInstagram = contactConfig?.social_instagram || DEFAULT_INSTAGRAM;
  const socialFacebook = contactConfig?.social_facebook || DEFAULT_FACEBOOK;
  const socialWhatsApp = String(
    contactConfig?.social_whatsapp || DEFAULT_WHATSAPP,
  );

  const footerBg = isRaicesPage(pathname ?? "")
    ? RAICES_BG
    : isProcesosPage(pathname ?? "")
      ? PROCESOS_BG
      : isFaqPage(pathname ?? "")
        ? FAQ_BG
        : "#AE0000";
  const footerBorder = isRaicesPage(pathname ?? "")
    ? RAICES_BORDER
    : isProcesosPage(pathname ?? "")
      ? PROCESOS_BORDER
      : isFaqPage(pathname ?? "")
        ? FAQ_BORDER
        : "#C70000";

  const footerSections = [
    {
      title: "Productos",
      links: [
        { name: "Cremas Faciales", href: "/productos/cremas-faciales" },
        { name: "Aceites Corporales", href: "/productos/aceites" },
        { name: "Hidrolatos", href: "/productos/hidrolatos" },
        { name: "Jabones Artesanales", href: "/productos/jabones" },
        { name: "Kits Especiales", href: "/productos/kits" },
      ],
    },
    {
      title: "Membresía",
      links: [
        { name: "Programa Completo", href: "/membresia/programa" },
        { name: "Módulos Semanales", href: "/membresia/modulos" },
        { name: "Comunidad", href: "/membresia/comunidad" },
        { name: "Coaching Personal", href: "/membresia/coaching" },
        { name: "Testimonios", href: "/membresia/testimonios" },
      ],
    },
    {
      title: "Servicios",
      links: [
        { name: "Consultas Individuales", href: "/servicios/consultas" },
        { name: "Terapias Grupales", href: "/servicios/grupos" },
        { name: "Talleres", href: "/servicios/talleres" },
        { name: "Retiros", href: "/servicios/retiros" },
        { name: "Formaciones", href: "/servicios/formaciones" },
      ],
    },
    {
      title: "Soporte",
      links: [
        { name: "Centro de Ayuda", href: "/ayuda" },
        { name: "Preguntas Frecuentes", href: "/faq" },
        { name: "Políticas de Envío", href: "/politicas/envio" },
        { name: "Términos y Condiciones", href: "/politicas/terminos" },
        { name: "Política de Privacidad", href: "/politicas/privacidad" },
        {
          name: "Botón de Arrepentimiento",
          href: "/politicas/arrepentimiento",
          isSpecial: true,
        },
      ],
    },
  ];

  return (
    <footer
      className="border-t transition-all duration-300 z-30"
      style={{
        backgroundColor: footerBg,
        borderTopColor: footerBorder,
        borderTopWidth: "2px",
        borderTopStyle: "solid",
      }}
    >
      {/* 📱 MOBILE FOOTER - Simplified Design */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-6 py-8 min-w-0 z-30">
          {/* Brand Section - Mobile */}
          <div className="text-center space-y-4 mb-8">
            <h3
              className="text-xl font-display font-normal"
              style={{ color: "#FFFFFF" }}
            >
              DA LUZ CONSCIENTE
            </h3>
            <div
              className="text-xs font-caption"
              style={{ color: "#FFFFFF", opacity: 0.8 }}
            >
              Alkimyas para alma y cuerpo
            </div>
          </div>

          {/* Contact Info - Mobile Optimized */}
          <div className="space-y-4 mb-8">
            <h4
              className="font-title font-medium text-center text-lg"
              style={{ color: "#FFFFFF" }}
            >
              Contacto
            </h4>
            <div
              className="space-y-4 font-text"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              {/* Email */}
              <div className="flex items-center justify-center space-x-3 px-4">
                <Mail
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#F8D794" }}
                />
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm hover:text-white transition-colors duration-300 flex-1 text-center"
                  style={{ wordBreak: "normal", overflowWrap: "break-word" }}
                >
                  {contactEmail}
                </a>
              </div>
              {/* Phone / WhatsApp */}
              <div className="flex items-center justify-center space-x-3 px-4">
                <MessageCircle
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#F8D794" }}
                />
                <a
                  href={`https://wa.me/${contactWhatsApp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition-colors duration-300 flex-1 text-center"
                >
                  {contactPhone}
                </a>
              </div>
              {/* Address */}
              <div className="flex items-center justify-center space-x-3 px-4">
                <MapPin
                  className="h-4 w-4 flex-shrink-0 lucide"
                  style={{ color: "#F8D794" }}
                />
                <span className="text-sm flex-1 text-center">
                  {contactAddress}
                </span>
              </div>
            </div>
          </div>

          {/* Social Media - Mobile */}
          <div className="flex justify-center space-x-6 mb-8">
            <a
              href={socialInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 lucide" />
            </a>
            <a
              href={socialFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 lucide" />
            </a>
            <a
              href={`https://wa.me/${socialWhatsApp.replace(/\s+/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
              style={{ color: "#FFFFFF" }}
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5 lucide" />
            </a>
          </div>

          {/* Quick Links - Mobile Simplified */}
          <div className="grid grid-cols-2 gap-6 mb-8 text-center">
            <div>
              <h4
                className="font-title font-medium mb-3 text-sm"
                style={{ color: "#FFFFFF" }}
              >
                Productos
              </h4>
              <div className="space-y-2">
                <Link
                  href="/productos"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Ver Todo
                </Link>
                <Link
                  href="/productos/kits"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Kits Especiales
                </Link>
              </div>
            </div>
            <div>
              <h4
                className="font-title font-medium mb-3 text-sm"
                style={{ color: "#FFFFFF" }}
              >
                Membresía
              </h4>
              <div className="space-y-2">
                <Link
                  href="/membresia"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Programa
                </Link>
                <Link
                  href="/membresia/comunidad"
                  className="block text-xs font-text"
                  style={{ color: "#FFFFFF", opacity: 0.9 }}
                >
                  Comunidad
                </Link>
              </div>
            </div>
          </div>

          {/* Values - Mobile */}
          <div
            className="flex justify-center space-x-4 mb-6 font-caption"
            style={{ color: "#FFFFFF", opacity: 0.9 }}
          >
            <div className="flex items-center space-x-1">
              <Leaf className="h-3 w-3 lucide" style={{ color: "#F8D794" }} />
              <span className="text-xs">Natural</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3 lucide" style={{ color: "#F8D794" }} />
              <span className="text-xs">Cruelty Free</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles
                className="h-3 w-3 lucide"
                style={{ color: "#F8D794" }}
              />
              <span className="text-xs">Artesanal</span>
            </div>
          </div>

          {/* Copyright - Mobile */}
          <div
            className="text-center text-xs font-text pt-4 border-t border-white/20"
            style={{ color: "#FFFFFF", opacity: 0.8 }}
          >
            <div>© {currentYear} DA LUZ CONSCIENTE</div>
            <div className="mt-1">Todos los derechos reservados</div>
          </div>
        </div>
      </div>

      {/* 💻 DESKTOP FOOTER - Full Design */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <h3
                  className="text-2xl font-display font-normal"
                  style={{ color: "#FFFFFF" }}
                >
                  DA LUZ CONSCIENTE
                </h3>
                <div
                  className="text-xs font-caption"
                  style={{ color: "#FFFFFF", opacity: 0.8 }}
                >
                  Alkimyas para alma y cuerpo
                </div>
              </div>

              <p
                className="text-sm font-text leading-relaxed"
                style={{ color: "#FFFFFF", opacity: 0.9 }}
              >
                Transformamos vidas a través de la biocosmética artesanal y
                terapias holísticas. Acompañamos tu camino hacia el bienestar
                integral con productos naturales y un programa de transformación
                personal de 7 meses.
              </p>

              {/* Contact Info */}
              <div
                className="space-y-2 text-sm font-text"
                style={{ color: "#FFFFFF", opacity: 0.9 }}
              >
                <div className="flex items-center space-x-2">
                  <Mail
                    className="h-4 w-4 lucide"
                    style={{ color: "#F8D794" }}
                  />
                  <a
                    href={`mailto:${contactEmail}`}
                    className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded"
                  >
                    {contactEmail}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle
                    className="h-4 w-4 lucide"
                    style={{ color: "#F8D794" }}
                  />
                  <a
                    href={`https://wa.me/${contactWhatsApp.replace(/\s+/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded"
                  >
                    {contactPhone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin
                    className="h-4 w-4 lucide"
                    style={{ color: "#F8D794" }}
                  />
                  <span>{contactAddress}</span>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex space-x-4">
                <a
                  href={socialInstagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5 lucide" />
                </a>
                <a
                  href={socialFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5 lucide" />
                </a>
                <a
                  href={`https://wa.me/${socialWhatsApp.replace(/\s+/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                  style={{ color: "#FFFFFF" }}
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="h-5 w-5 lucide" />
                </a>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4
                  className="font-title font-medium"
                  style={{ color: "#FFFFFF" }}
                >
                  {section.title}
                </h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      {(link as any).isSpecial ? (
                        <Link
                          href={link.href as any}
                          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg hover:scale-105 hover:shadow-lg"
                          style={{
                            backgroundColor: "#F59E0B",
                            color: "#1c1b1a",
                            boxShadow: "0 2px 8px rgba(245, 158, 11, 0.4)",
                          }}
                        >
                          🔔 {link.name}
                        </Link>
                      ) : (
                        <Link
                          href={link.href as any}
                          className="text-sm font-text transition-colors duration-300 block px-2 py-1 rounded hover:bg-white/10 hover:text-white"
                          style={{ color: "#FFFFFF", opacity: 0.9 }}
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px mx-4 my-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60" />

        {/* Bottom Footer */}
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col items-center md:items-start space-y-2">
              <div
                className="flex items-center space-x-4 text-sm font-text"
                style={{ color: "#FFFFFF", opacity: 0.8 }}
              >
                <span>© {currentYear} DA LUZ CONSCIENTE</span>
                <span>•</span>
                <span>Todos los derechos reservados</span>
              </div>
              {/* Aviso Legal / Disclaimer */}
              <p
                className="text-xs font-text"
                style={{ color: "#FFFFFF", opacity: 0.6, maxWidth: "600px" }}
              >
                Aviso legal: Nuestros productos son cosméticos de venta libre
                que acompañan procesos de bienestar. No reemplazan la consulta
                médica ni diagnósticos profesionales.
              </p>
            </div>

            {/* Values Icons */}
            <div
              className="flex items-center space-x-6 font-caption"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              <div className="flex items-center space-x-1 text-xs">
                <Leaf className="h-4 w-4 lucide" style={{ color: "#F8D794" }} />
                <span>100% Natural</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Heart
                  className="h-4 w-4 lucide"
                  style={{ color: "#F8D794" }}
                />
                <span>Cruelty Free</span>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                <Sparkles
                  className="h-4 w-4 lucide"
                  style={{ color: "#F8D794" }}
                />
                <span>Artesanal</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div
              className="flex items-center space-x-2 text-xs font-caption"
              style={{ color: "#FFFFFF", opacity: 0.9 }}
            >
              <span>Aceptamos:</span>
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300"
              >
                Mercado Pago
              </Badge>
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300"
              >
                Transferencia
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
