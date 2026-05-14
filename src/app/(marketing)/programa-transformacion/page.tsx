import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import {
  CalendarDays,
  Clock,
  Users,
  Sparkles,
  Flame,
  Leaf,
  Moon,
  Sun,
  Heart,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Programa de Transformación | DA LUZ CONSCIENTE",
  description:
    "Un viaje alquímico de 7 meses con contenido exclusivo, rituales y productos para tu despertar consciente.",
};

const modulos = [
  {
    month: 1,
    title: "Despertar Interior",
    theme: "bg-alma-primary",
    Icon: Sparkles,
    description:
      "Encuentro con tu Ser esencial. Prácticas iniciáticas para sostener la presencia.",
  },
  {
    month: 2,
    title: "Conexión Elemental",
    theme: "bg-ecos-primary",
    Icon: Leaf,
    description:
      "Tierra, agua, fuego y aire como aliados en tu proceso de transformación.",
  },
  {
    month: 3,
    title: "Transformación",
    theme: "bg-umbral-primary",
    Icon: Flame,
    description:
      "Atravesar el umbral. Trabajo con sombra, fuego interior y liberación.",
  },
  {
    month: 4,
    title: "Rituales Sagrados",
    theme: "bg-jade-primary",
    Icon: Moon,
    description:
      "Ceremonia y ritmo lunar. Diseño de tu propio altar y prácticas devocionales.",
  },
  {
    month: 5,
    title: "Visión Elevada",
    theme: "bg-utopica-primary",
    Icon: Sun,
    description:
      "Claridad de propósito. Herramientas para ver con el corazón abierto.",
  },
  {
    month: 6,
    title: "Integración",
    theme: "bg-brand-primary",
    Icon: Heart,
    description:
      "Hilvanar lo vivido. Tejer cuerpo, alma y vida cotidiana en una sola coherencia.",
  },
  {
    month: 7,
    title: "Manifestación",
    theme: "bg-brand-secondary",
    Icon: Star,
    description:
      "Florecer afuera lo cultivado adentro. Tu vida como obra alquímica.",
  },
];

const WHATSAPP_URL =
  "https://wa.me/543512344580?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Programa%20de%20Transformaci%C3%B3n";
const INSCRIPCION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeSoAkZu-gNpExCbs4JKg-0zaqO8JRU_kL3off0NHHPHSVylQ/viewform?usp=publish-editor";

export default function ProgramaTransformacionPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F6FBD6]">
      {/* HERO */}
      <section
        id="hero"
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-botanical-background.jpg')",
              filter: "brightness(0.55) saturate(1.1) contrast(1.1)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />
          <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto py-24">
          <Badge className="mb-8 bg-white/20 text-white border-white/30 backdrop-blur-sm px-4 py-1.5 text-xs tracking-widest uppercase">
            Programa Completo
          </Badge>

          <div className="space-y-8 mb-12">
            <BlurText
              text="PROGRAMA DE TRANSFORMACIÓN"
              as="h1"
              className="text-4xl md:text-6xl lg:text-7xl font-normal leading-none tracking-wider drop-shadow-2xl"
              style={{
                fontFamily: "VELISTA, var(--font-velista), serif",
                fontWeight: "normal",
              }}
              delay={120}
              direction="top"
              animateBy="words"
              stepDuration={0.4}
            />

            <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />

            <BlurText
              text="Un viaje alquímico de 7 meses para alma y cuerpo"
              as="div"
              className="text-xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed tracking-wide"
              style={{
                fontFamily: "Malisha, var(--font-malisha), cursive",
                fontWeight: "300",
                letterSpacing: "0.05em",
              }}
              delay={100}
              direction="bottom"
              animateBy="words"
              stepDuration={0.3}
            />
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <CalendarDays className="w-5 h-5" />
              7 Meses de Contenido
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <Clock className="w-5 h-5" />
              Acceso de por Vida
            </div>
            <div className="glass-card flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium">
              <Users className="w-5 h-5" />
              Comunidad Exclusiva
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={INSCRIPCION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="group relative px-10 py-4 text-lg font-semibold glass-card text-white hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105"
                style={{ borderRadius: "50px" }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Inscribirme al Programa
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="ghost"
                className="group px-8 py-4 text-lg font-medium text-white border-2 border-white/40 hover:bg-white hover:text-gray-900 glass-card transition-all duration-500"
                style={{ borderRadius: "50px" }}
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Hablar por WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* MANIFIESTO INTRO */}
      <section
        id="manifiesto"
        className="relative px-6 py-16 md:py-24 overflow-hidden"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2
                className="font-title text-3xl md:text-5xl text-[#AE0000] leading-tight mb-6"
                style={{
                  fontFamily: "VELISTA, var(--font-velista), serif",
                  letterSpacing: "0.04em",
                }}
              >
                UN PORTAL DE 7 LUNAS
              </h2>
              <p
                className="text-xl md:text-2xl text-[#AE0000]/80 mb-6"
                style={{
                  fontFamily: "Malisha, var(--font-malisha), cursive",
                }}
              >
                Para encontrarte con tu Ser esencial
              </p>
              <div className="space-y-5 text-base md:text-lg text-[#1C1B1A] leading-relaxed font-text">
                <p>
                  Este programa es una invitación a recorrer un viaje
                  alquímico estructurado en siete módulos. Cada mes una nueva
                  capa: prácticas, rituales, productos seleccionados y
                  contenidos para acompañar tu transformación.
                </p>
                <p>
                  Caminamos desde el despertar inicial hasta la manifestación
                  consciente de tu vida como obra creadora. Un proceso
                  pensado para habitarse con presencia, sin prisa.
                </p>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
              <div
                className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 overflow-hidden"
                style={{
                  borderRadius: "0px 100px",
                  border: "2px solid #AE0000",
                }}
              >
                <Image
                  src="/images/hero-botanical-background.jpg"
                  alt="Programa de Transformación Da Luz Consciente"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  style={{ borderRadius: "0px 100px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODULOS */}
      <section
        id="modulos"
        className="relative px-6 py-16 md:py-24 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 50%, #F0EACE 100%)",
        }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <div
              className="w-32 h-0.5 mx-auto mb-5"
              style={{
                background:
                  "linear-gradient(to right, transparent, #AE0000, transparent)",
              }}
            />
            <h2
              className="font-title text-3xl md:text-5xl text-[#AE0000] mb-4"
              style={{
                fontFamily: "VELISTA, var(--font-velista), serif",
                letterSpacing: "0.04em",
              }}
            >
              MÓDULOS DEL PROGRAMA
            </h2>
            <p
              className="text-lg md:text-xl text-[#AE0000]/80 max-w-3xl mx-auto"
              style={{ fontFamily: "Malisha, var(--font-malisha), cursive" }}
            >
              Siete pasos para tu despertar consciente
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {modulos.map((mod) => {
              const ModIcon = mod.Icon;
              return (
                <div
                  key={mod.month}
                  className="glass-card group relative overflow-hidden p-7 transition-all duration-500 hover:scale-[1.03] hover:shadow-xl"
                  style={{ borderRadius: "0px 35px" }}
                >
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${mod.theme}`}
                  />
                  <div className="flex items-center justify-between mb-5">
                    <Badge
                      variant="outline"
                      className="border-[#AE0000]/40 text-[#AE0000] text-xs tracking-widest uppercase"
                    >
                      Mes {mod.month}
                    </Badge>
                    <div className="w-12 h-12 rounded-full bg-[#AE0000]/10 flex items-center justify-center transition-transform duration-500 group-hover:rotate-12">
                      <ModIcon className="w-6 h-6 text-[#AE0000]" />
                    </div>
                  </div>
                  <h3
                    className="font-title text-2xl text-[#1C1B1A] mb-3"
                    style={{
                      fontFamily: "VELISTA, var(--font-velista), serif",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {mod.title}
                  </h3>
                  <p className="text-sm text-[#1C1B1A]/75 leading-relaxed font-text">
                    {mod.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        id="cta-final"
        className="relative px-6 py-20 md:py-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #F0EACE 0%, rgba(174, 0, 0, 0.12) 50%, #F0EACE 100%)",
        }}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2
            className="font-title text-3xl md:text-5xl text-[#AE0000] mb-6 leading-tight"
            style={{
              fontFamily: "VELISTA, var(--font-velista), serif",
              letterSpacing: "0.04em",
            }}
          >
            EL VIAJE COMIENZA CON UN PASO
          </h2>
          <p
            className="text-xl md:text-2xl text-[#AE0000]/80 mb-10"
            style={{ fontFamily: "Malisha, var(--font-malisha), cursive" }}
          >
            Sumate al programa o escribinos para conocer más
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href={INSCRIPCION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                className="group btn-enhanced px-10 py-4 text-lg font-semibold text-white transition-all duration-500 hover:scale-105"
                style={{ borderRadius: "0px 15px" }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Inscribirme al Programa
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="group px-8 py-4 text-lg font-medium border-2 border-[#AE0000] text-[#AE0000] hover:bg-[#AE0000] hover:text-white transition-all duration-500 hover:scale-105"
                style={{ borderRadius: "0px 15px" }}
              >
                <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Más Información
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
