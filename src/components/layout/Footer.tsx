"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  MessageCircle,
  Heart,
  Leaf,
  Sparkles 
} from "lucide-react";

export default function Footer() {
  const { currentLine } = useTheme();
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Productos",
      links: [
        { name: "Cremas Faciales", href: "/productos/cremas-faciales" },
        { name: "Aceites Corporales", href: "/productos/aceites" },
        { name: "Hidrolatos", href: "/productos/hidrolatos" },
        { name: "Jabones Artesanales", href: "/productos/jabones" },
        { name: "Kits Especiales", href: "/productos/kits" },
      ]
    },
    {
      title: "Membresía",
      links: [
        { name: "Programa Completo", href: "/membresia/programa" },
        { name: "Módulos Semanales", href: "/membresia/modulos" },
        { name: "Comunidad", href: "/membresia/comunidad" },
        { name: "Coaching Personal", href: "/membresia/coaching" },
        { name: "Testimonios", href: "/membresia/testimonios" },
      ]
    },
    {
      title: "Servicios",
      links: [
        { name: "Consultas Individuales", href: "/servicios/consultas" },
        { name: "Terapias Grupales", href: "/servicios/grupos" },
        { name: "Talleres", href: "/servicios/talleres" },
        { name: "Retiros", href: "/servicios/retiros" },
        { name: "Formaciones", href: "/servicios/formaciones" },
      ]
    },
    {
      title: "Soporte",
      links: [
        { name: "Centro de Ayuda", href: "/ayuda" },
        { name: "Preguntas Frecuentes", href: "/faq" },
        { name: "Políticas de Envío", href: "/politicas/envio" },
        { name: "Términos y Condiciones", href: "/politicas/terminos" },
        { name: "Política de Privacidad", href: "/politicas/privacidad" },
      ]
    },
  ];

  return (
    <footer 
      className="border-t transition-all duration-300"
      style={{
        backgroundColor: '#AE0000',
        borderTopColor: '#C70000',
        borderTopWidth: '2px',
        borderTopStyle: 'solid'
      }}
    >
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-normal" style={{ color: '#FFF4B3' }}>
                DA LUZ CONSCIENTE
              </h3>
              <div className="text-xs font-caption" style={{ color: '#FFF4B3', opacity: 0.8 }}>
                Alkimyas para alma y cuerpo
              </div>
            </div>
            
            <p className="text-sm font-text leading-relaxed" style={{ color: '#FFF4B3', opacity: 0.9 }}>
              Transformamos vidas a través de la biocosmética artesanal y terapias holísticas. 
              Acompañamos tu camino hacia el bienestar integral con productos naturales y 
              un programa de transformación personal de 7 meses.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm font-text" style={{ color: '#FFF4B3', opacity: 0.9 }}>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" style={{ color: '#F8D794' }} />
                <a href="mailto:contacto@daluzconsciente.com" className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded">
                  contacto@daluzconsciente.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" style={{ color: '#F8D794' }} />
                <a href="tel:+5491112345678" className="transition-colors duration-300 hover:bg-white/10 hover:text-white px-2 py-1 rounded">
                  +54 9 11 1234-5678
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" style={{ color: '#F8D794' }} />
                <span>Córdoba, Argentina</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/daluzconsciente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                style={{ color: '#FFF4B3' }}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/daluzconsciente" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                style={{ color: '#FFF4B3' }}
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/5493511234567" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300"
                style={{ color: '#FFF4B3' }}
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="font-title font-medium" style={{ color: '#FFF4B3' }}>{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href as any}
                      className="text-sm font-text transition-colors duration-300 block px-2 py-1 rounded hover:bg-white/10 hover:text-white"
                      style={{ color: '#FFF4B3', opacity: 0.9 }}
                    >
                      {link.name}
                    </Link>
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
          <div className="flex items-center space-x-4 text-sm font-text" style={{ color: '#FFF4B3', opacity: 0.8 }}>
            <span>© {currentYear} DA LUZ CONSCIENTE</span>
            <span>•</span>
            <span>Todos los derechos reservados</span>
          </div>

          {/* Values Icons */}
          <div className="flex items-center space-x-6 font-caption" style={{ color: '#FFF4B3', opacity: 0.9 }}>
            <div className="flex items-center space-x-1 text-xs">
              <Leaf className="h-4 w-4" style={{ color: '#F8D794' }} />
              <span>100% Natural</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Heart className="h-4 w-4" style={{ color: '#F8D794' }} />
              <span>Cruelty Free</span>
            </div>
            <div className="flex items-center space-x-1 text-xs">
              <Sparkles className="h-4 w-4" style={{ color: '#F8D794' }} />
              <span>Artesanal</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex items-center space-x-2 text-xs font-caption" style={{ color: '#FFF4B3', opacity: 0.9 }}>
            <span>Aceptamos:</span>
            <Badge variant="outline" className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300">
              Mercado Pago
            </Badge>
            <Badge variant="outline" className="text-xs border-white/30 text-white/90 hover:bg-white/10 transition-all duration-300">
              Transferencia
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
} 