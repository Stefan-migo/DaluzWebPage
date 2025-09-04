import Link from "next/link";
import Image from "next/image";
import { client, queries } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import { ArrowRight, Sparkles, Leaf, Heart, Star, Users, Zap, ChevronLeft, ChevronRight, Clock, Calendar } from "lucide-react";
import {
  AnimatedBackground,
  SobreNosotrosBackground,
  NuestrosServiciosBackground,
  NuestraFilosofiaBackground,
  AlkimyaBackground,
  ProcesosBackground,
  SesionesBackground,
  BlogComunidadBackground,
  GaleriaBackground,
  ContactoBackground,
  BiologiaLuzIcon,
  SesionesIcon,
  CoachingIcon
} from "@/components/svg/SVGComponents";

// Blog post type
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  author: {
    name: string;
    image?: {
      asset: {
        url: string;
      };
    };
  };
  categories?: Array<{
    title: string;
    color?: string;
  }>;
  estimatedReadingTime?: number;
  featured?: boolean;
}

async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const posts = await client.fetch(
      queries.allPosts,
      {},
      {
        cache: 'no-store', // Always fetch fresh data
        next: { 
          revalidate: 30, // Revalidate every 30 seconds
          tags: ['blog-posts', 'homepage-posts'] 
        }
      }
    );
    // Get recent posts for homepage bento grid, limit to 4
    const recentPosts = posts?.slice(0, 4) || [];
    console.log('🏠 Homepage: Fetched posts for blog section:', recentPosts.length);
    return recentPosts;
  } catch (error) {
    console.error("Error fetching featured posts:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ✨ ENHANCED HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Multiple Background Layers for Depth */}
        <div className="absolute inset-0">
          {/* Primary botanical background */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero-botanical-background.jpg')",
              filter: "brightness(0.6) saturate(1.1) contrast(1.1)"
            }}
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
          </div>
        </div>

        {/* Your Custom SVG Floating Background Elements */}
        <AnimatedBackground />

        {/* Main Content with Enhanced Typography */}
        <div className="relative z-10 text-center text-white px-6 max-w-6xl mx-auto">
          {/* Enhanced Logo with BlurText Animation */}
          <div className="space-y-8 mb-16">
            {/* Main Logo with Magical Hover Effect + BlurText - VELISTA Font */}
            <div className="relative group cursor-pointer">
              <div className="relative transition-all duration-700 ease-out group-hover:scale-105 group-hover:-translate-y-2">
                {/* Background Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute inset-0 blur-2xl bg-gradient-to-r from-yellow-400/30 via-orange-400/30 to-red-400/30 animate-pulse"></div>
                </div>

                {/* Main Text with BlurText + Shimmer Effect - VELISTA Font */}
                <div className="relative z-10">
                  <BlurText
                    text="DA LUZ CONSCIENTE"
                    as="h1"
                    className="text-5xl md:text-7xl lg:text-[8rem] font-normal leading-none tracking-wider drop-shadow-2xl group-hover:drop-shadow-[0_0_30px_rgba(255,255,255,0.8)] transition-all duration-700 group-hover:text-yellow-100"
                    style={{
                      fontFamily: 'VELISTA, var(--font-velista), serif',
                      fontWeight: 'normal',
                      fontStyle: 'normal'
                    }}
                    delay={150}
                    direction="top"
                    animateBy="words"
                    stepDuration={0.4}
                  />

                  {/* Shimmer Overlay on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"></div>
                  </div>
                </div>

                {/* Floating Sparkles */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-ping delay-100"></div>
                  <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-orange-300 rounded-full animate-ping delay-300"></div>
                  <div className="absolute top-1/2 left-1/3 w-1 h-1 bg-red-300 rounded-full animate-ping delay-500"></div>
                  <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-700"></div>
                  <div className="absolute top-1/3 right-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full animate-ping delay-200"></div>
                </div>

                {/* Subtle Border Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-lg border border-gradient-to-r from-yellow-400/20 via-orange-400/20 to-red-400/20 blur-sm"></div>
              </div>
            </div>

            {/* Enhanced Tagline with BlurText + Hover Effect */}
            <div className="relative group cursor-pointer">
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-8" />
              <div className="relative transition-all duration-500 ease-out group-hover:scale-105">
                {/* Background Glow for Tagline */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 blur-xl bg-gradient-to-r from-white/20 via-yellow-200/20 to-white/20"></div>
                </div>

                <BlurText
                  text="Alkimyas para alma y cuerpo"
                  as="div"
                  className="text-1xl md:text-2xl lg:text-3xl opacity-95 max-w-4xl mx-auto leading-relaxed tracking-wide group-hover:text-yellow-50 transition-colors duration-500"
                  style={{
                    fontFamily: 'var(--font-caption), Inter, sans-serif',
                    fontWeight: '300',
                    letterSpacing: '0.05em'
                  }}
                  delay={100}
                  direction="bottom"
                  animateBy="words"
                  stepDuration={0.3}
                />

                {/* Subtle shimmer for tagline */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
                </div>
              </div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8" />
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                className="group relative px-10 py-4 text-lg font-semibold glass-card text-white hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105"
                style={{ borderRadius: '50px' }}
              >
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Descubre Nuestras Alkimyas
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>

              <Button
                variant="ghost"
                className="group px-8 py-4 text-lg font-medium text-white border-2 border-white/40 hover:bg-white/10 glass-card transition-all duration-500"
                style={{ borderRadius: '50px' }}
              >
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Conoce Nuestra Historia
              </Button>
            </div>

          </div>
        </div>
      </section>

      {/* ✨ ENHANCED ABOUT SECTION - WITH CUSTOM SVG BACKGROUND */}
      <section className="section-enhanced relative py-14 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <SobreNosotrosBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="text-center pb-5 relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-5" />
          <h2 className="font-title text-5xl md:text-6xl leading-tight drop-shadow-lg" style={{ color: '#FFF4B3' }}>
            SOBRE DA LUZ
          </h2>
          {/* Bottom gradient divider */}
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4 mb-5" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Content Card with Transparency */}
              <div className="card-enhanced backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
                {/* Enhanced Content */}
                <div className="space-y-6 text-lg leading-relaxed">
                  <p className="font-text text-gray-800 leading-loose">
                    DA LUZ CONSCIENTE nace de la profunda conexión entre la sabiduría ancestral
                    y la ciencia moderna, creando puentes entre el alma y el cuerpo a través
                    de alkimyas transformadoras.
                  </p>
                  <p className="font-text leading-loose text-gray-800">
                    Trabajamos con productores cuidadosamente seleccionados, honrando los
                    ciclos naturales y presentando nuestros productos en recipientes
                    personalizados de cerámica y vidrio que celebran la belleza de lo artesanal.
                  </p>
                  <p className="font-text leading-loose text-gray-800">
                    Cada línea de productos representa un viaje único hacia el bienestar
                    integral, acompañado de servicios holísticos y programas de transformación
                    personal que nutren tanto el cuerpo como el espíritu.
                  </p>
                </div>

                {/* Enhanced CTA */}
                <div className="pt-6">
                  <Button
                    className="group btn-enhanced px-8 py-4 text-white font-semibold rounded-full"
                  >
                    <Leaf className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    Explora Nuestra Filosofía
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Visual Element */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main circle with enhanced styling */}
                <div className="w-96 h-96 rounded-full card-enhanced shadow-2xl flex items-center justify-center">
                  {/* Inner circle */}
                  <div className="w-80 h-80 rounded-full bg-gradient-to-br from-white via-bg-cream to-bg-light shadow-inner flex items-center justify-center">
                    {/* Content */}
                    <div className="text-center space-y-4">
                      <Sparkles className="w-16 h-16 text-brand-primary mx-auto animate-pulse" />
                      <div className="space-y-2">
                        <div className="font-title text-2xl text-brand-primary drop-shadow-sm">Alkimya</div>
                        <div className="font-title text-lg text-brand-primary/80 drop-shadow-sm">Consciente</div>
                        <div className="w-16 h-0.5 bg-brand-primary/40 mx-auto my-4" />
                        <div className="text-sm text-gray-800 space-y-1 drop-shadow-sm">
                          <div>Alma • Cuerpo</div>
                          <div>Transformación</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements around the circle */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand-primary/10 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-brand-secondary/10 rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/2 -left-8 w-6 h-6 bg-accent/10 rounded-full animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED SERVICES SECTION */}
      <section className="section-enhanced relative py-14 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <NuestrosServiciosBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-3rem] mb-[7rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-2 " style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-3 leading-tight" style={{ color: '#FFF4B3' }}>
            NUESTROS SERVICIOS
          </h2>
          {/* Bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-2 mb-3" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <p className="text-xl font-text text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ color: '#F0EACE' }}>
            Descubre nuestras modalidades de acompañamiento holístico, diseñadas para tu transformación integral
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Service Cards with Your Custom SVG Icons */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Biología De Luz */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <BiologiaLuzIcon size={48} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Biología De Luz
                </h3>

                {/* Description */}
                <p className="font-text text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Terapias energéticas que trabajan con la luz interior de cada ser,
                  activando procesos naturales de sanación y equilibrio.
                </p>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Conoce Más
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* Sesiones */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <SesionesIcon size={48} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Sesiones
                </h3>

                {/* Description */}
                <p className="font-text text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Acompañamiento personalizado en procesos de transformación,
                  integrando técnicas ancestrales y enfoques contemporáneos.
                </p>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Conoce Más
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* Coaching */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                  <CoachingIcon size={48} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Coaching
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                  Programa de 7 meses de transformación consciente, diseñado para
                  el desarrollo integral del ser humano.
                </p>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Conoce Más
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED PHILOSOPHY SECTION */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <NuestraFilosofiaBackground
          bgColor="#AE0000"  // Brand red background
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[6rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-6 leading-tight" style={{ color: '#F0EACE' }}>
            NUESTRA FILOSOFÍA
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-5 mb-5" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />

          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Los valores fundamentales que guían cada aspecto de nuestro trabajo consciente
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Philosophy Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[-2rem]">
            {[
              {
                title: "Consciencia",
                description: "Vivir con plena consciencia de nuestros actos y su impacto en el mundo.",
                icon: <Star className="w-8 h-8" />
              },
              {
                title: "Naturaleza",
                description: "Honrar y trabajar en armonía con los ciclos y sabiduría de la naturaleza.",
                icon: <Leaf className="w-8 h-8" />
              },
              {
                title: "Transformación",
                description: "Facilitar procesos profundos de cambio y crecimiento personal.",
                icon: <Zap className="w-8 h-8" />
              },
              {
                title: "Integridad",
                description: "Mantener coherencia entre nuestros valores, palabras y acciones.",
                icon: <Heart className="w-8 h-8" />
              }
            ].map((item, index) => (
              <div
                key={index}
                className="group glass-card p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors duration-300 text-white">
                    {item.icon}
                  </div>
                  <h3 className="font-subtitle text-xl text-white group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="font-caption text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALKIMYA DA LUZ */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <AlkimyaBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center mt-[2rem] mb-[5rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-6 leading-tight" style={{ color: '#AE0000' }}>
            ALKIMYA DA LUZ
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-4 mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <p className="text-2xl font-text text-gray-800 max-w-4xl mx-auto leading-relaxed font-light">
            Cosméticos botánicos artesanales presentados en recipientes personalizados
            de cerámica y vidrio, con productores cuidadosamente seleccionados.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Content */}
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
              <div className="card-enhanced p-6 text-center">
                <Leaf className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Ingredientes Naturales</h3>
                <p className="font-caption text-gray-600 text-sm">Cuidadosamente seleccionados</p>
              </div>
              <div className="card-enhanced p-6 text-center">
                <Sparkles className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Proceso Artesanal</h3>
                <p className="font-caption text-gray-600 text-sm">Elaborado con dedicación</p>
              </div>
              <div className="card-enhanced p-6 text-center">
                <Heart className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Recipientes Únicos</h3>
                <p className="font-caption text-gray-600 text-sm">Cerámica personalizada</p>
              </div>
            </div>

            {/* Enhanced CTA */}
            <div className="pt-8">
              <Button className="group btn-enhanced px-12 py-4 text-lg text-white font-semibold rounded-full">
                <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Explora Productos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED LÍNEA ECOS */}
      <section
        className="section-enhanced relative py-24 px-6 overflow-hidden"
        style={{ backgroundColor: '#12406F' }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('/images/textures/texture-ecos-ocean.jpg')",
              filter: "brightness(0.7) contrast(1.1)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-blue-800/30 to-blue-900/50" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 30% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} />
          </div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Header */}
            <div className="space-y-6 mb-16">
              <h2 className="font-title text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
                LÍNEA ECOS
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
            </div>

            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-2xl font-text text-white/90 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Ritmos naturales que conectan con la fluidez del agua y los ciclos oceánicos,
                productos que honran la pureza y el movimiento constante de la vida.
              </p>
            </div>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED LÍNEA UMBRAL */}
      <section
        className="section-enhanced relative py-24 px-6 overflow-hidden"
        style={{ backgroundColor: '#EA4F12' }}
      >
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('/images/textures/texture-umbral-desert.jpg')",
              filter: "brightness(0.7) contrast(1.1)"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/50 via-red-800/30 to-orange-900/50" />
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Header */}
            <div className="space-y-6 mb-16">
              <h2 className="font-title text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
                LÍNEA UMBRAL
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
            </div>

            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-2xl font-text text-white/90 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Transformación interior a través del fuego sagrado, productos que facilitan
                procesos profundos de cambio y renovación personal.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* LÍNEA JADE RITUAL */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#04412D' }}
      >
        {/* Background Texture */}
        <div
          className="absolute inset-0 bg-fit bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/textures/texture-jade-forest.jpg')",
            filter: "brightness(0.8)"
          }}
        />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          {/* Enhanced Header */}
          <div className="space-y-6 mb-16">
            <h2 className="font-title text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
              LÍNEA JADE RITUAL
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Ceremonias sagradas que conectan con la sabiduría ancestral de la tierra,
            tinturas madre y flores de Bach para el equilibrio orgánico.
          </p>
        </div>
      </section>



      {/* LÍNEA UTÓPICA */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#392E13' }}
      >
        {/* Background Texture */}
        <div
          className="absolute inset-0 bg-fit bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/textures/texture-utopica-golden.jpg')",
            filter: "brightness(0.8)"
          }}
        />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          {/* Enhanced Header */}
          <div className="space-y-6 mb-16">
            <h2 className="font-title text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
              LÍNEA UTÓPICA
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Visión elevada que trasciende lo cotidiano, cosméticos naturales que
            realzan la belleza auténtica del ser.
          </p>
        </div>
      </section>



      {/* LÍNEA ALMA TERRA */}
      <section
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#9B201A' }}
      >
        {/* Background Texture */}
        <div
          className="absolute inset-0 bg-fit bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/textures/texture-alma-terra-earth.jpg')",
            filter: "brightness(0.8)"
          }}
        />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          {/* Enhanced Header */}
          <div className="space-y-6 mb-16">
            <h2 className="font-title text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
              LÍNEA ALMA TERRA
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
          </div>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Conexión profunda con la tierra madre, brumas aromáticas y pociones
            de aromaterapia que nutren el alma.
          </p>
        </div>
      </section>



      {/* PROCESOS Section */}
      <section className="section-enhanced relative py-20 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <ProcesosBackground
          bgColor="#F0EACE"  // creme background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="container mx-auto max-w-6xl text-left mt-[-2rem] mb-[4rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-10 mb-3" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-gray-400xl md:text-5xl leading-tight" style={{ color: '#AE0000' }}>
                PROCESOS
              </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-10 mt-2 mb-10" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-3 text-lg mt-14 leading-relaxed" style={{ color: '#F0EACE' }}>
                <p>
                  Nuestros procesos integrales están diseñados para acompañarte en
                  cada etapa de tu transformación personal. Combinamos técnicas ancestrales
                  con enfoques contemporáneos para crear un camino único hacia el bienestar.
                </p>
                <p>
                  Cada proceso es personalizado según tus necesidades específicas,
                  honrando tu ritmo natural y respetando los ciclos de transformación
                  que requiere todo crecimiento auténtico.
                </p>
                <p>
                  Desde la primera consulta hasta el seguimiento posterior,
                  te acompañamos con presencia consciente y herramientas efectivas
                  para que puedas integrar los cambios de manera sostenible.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Large white circle for process visualization */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-white to-bg-cream border-4 border-brand-primary/20 shadow-2xl flex items-center justify-center">
                <div className="w-60 h-60 rounded-full bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-title text-2xl text-brand-primary mb-2">Proceso</div>
                    <div className="font-title text-lg text-brand-primary/70">Integral</div>
                    <div className="w-16 h-0.5 bg-brand-primary/50 mx-auto my-4"></div>
                    <div className="text-sm text-gray-600">Transformación</div>
                    <div className="text-sm text-gray-600">Consciente</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* SESIONES Section */}
      <section className="section-enhanced relative py-20 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <SesionesBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[6rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 ml-auto mb-2" style={{ background: 'linear-gradient(to right, transparent, #F0EACE, transparent)' }} />
          <h2 className="font-title text-right md:text-5xl leading-tight" style={{ color: '#F0EACE' }}>
            SESIONES
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 ml-auto mt-2 mb-2" style={{ background: 'linear-gradient(to right, transparent, #F0EACE, transparent)' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-20">
          {/* Enhanced Content */}
          <div className="max-w-4xl mx-auto mt-16 space-y-8">
            <p className="text-xl leading-relaxed text-gray-700">
              Nuestras sesiones individuales están diseñadas para crear un espacio sagrado
              de encuentro contigo mismo, donde puedas explorar, sanar y expandir tu consciencia
              en un ambiente de total confianza y respeto.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="font-velista text-2xl text-brand-primary mb-4">
                  Sesiones de Reiki
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Equilibrio energético a través de la canalización de energía universal,
                  promoviendo la auto-sanación natural del cuerpo.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-velista text-2xl text-brand-primary mb-4">
                  Armonización con Cuencos
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Terapia sonora que utiliza las frecuencias sagradas para armonizar
                  los chakras y liberar bloqueos energéticos.
                </p>
              </div>
              <div className="text-center">
                <h3 className="font-velista text-2xl text-brand-primary mb-4">
                  Lectura de Aura
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Exploración del campo energético personal para comprender patrones,
                  potenciales y áreas de crecimiento espiritual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED BLOG DE LA COMUNIDAD Section - Bento Grid Design */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <BlogComunidadBackground
          bgColor="#AE0000"  // Brand red background
          waveColor="#C70000"  // Slightly lighter red for wave
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[8rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-6 leading-tight" style={{ color: '#F0EACE' }}>
            BLOG DE LA COMUNIDAD
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-5 mb-5" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Descubre nuestros artículos sobre alkimyas, transformación personal y bienestar consciente
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Bento Grid Layout for Blog Posts */}
          {featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Featured Main Post (Takes 2 columns) */}
              {featuredPosts[0] && (
                <Link 
                  href={`/blog/${featuredPosts[0].slug.current}`} 
                  className="group lg:col-span-2 lg:row-span-2"
                >
                  <div className="glass-card h-full p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                    {/* Featured Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        Destacado
                      </Badge>
                      <div className="flex items-center text-white/70 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(featuredPosts[0].publishedAt).toLocaleDateString('es-ES', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>

                    {/* Main Image Placeholder */}
                    <div className="bg-white/10 rounded-lg h-48 lg:h-64 mb-6 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden">
                      {featuredPosts[0].mainImage?.asset?.url ? (
                        <Image 
                          src={featuredPosts[0].mainImage.asset.url} 
                          alt={featuredPosts[0].mainImage.alt || featuredPosts[0].title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-2" />
                          <span className="text-white/40 text-sm">Sin imagen</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className="font-subtitle text-xl lg:text-2xl text-white group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                        {featuredPosts[0].title}
                      </h3>
                      <p className="font-text text-white/80 text-sm lg:text-base leading-relaxed group-hover:text-white/90 transition-colors duration-300 line-clamp-3">
                        {featuredPosts[0].excerpt || "Descubre más sobre este fascinante tema en nuestro artículo completo..."}
                      </p>
                      
                      {/* Author and Reading Time */}
                      <div className="flex items-center justify-between pt-4">
                        <div className="flex items-center text-white/60 text-sm">
                          <span>{featuredPosts[0].author?.name || "DA LUZ Team"}</span>
                        </div>
                        {featuredPosts[0].estimatedReadingTime && (
                          <div className="flex items-center text-white/60 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            {featuredPosts[0].estimatedReadingTime} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Secondary Posts (Smaller cards) */}
              {featuredPosts.slice(1, 4).map((post, index) => (
                <Link 
                  key={post._id} 
                  href={`/blog/${post.slug.current}`} 
                  className="group"
                >
                  <div className="glass-card h-full p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                    {/* Small Image */}
                    <div className="bg-white/10 rounded-lg h-32 mb-4 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                      {post.mainImage?.asset?.url ? (
                        <Image 
                          src={post.mainImage.asset.url} 
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-center">
                          <Leaf className="w-8 h-8 text-white/50 mx-auto mb-1" />
                          <span className="text-white/30 text-xs">Sin imagen</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h4 className="font-subtitle text-lg text-white group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="font-text text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                        {post.excerpt || "Explora este contenido único..."}
                      </p>
                      
                      {/* Meta */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-white/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(post.publishedAt).toLocaleDateString('es-ES', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                        {post.estimatedReadingTime && (
                          <div className="flex items-center text-white/60 text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {post.estimatedReadingTime} min
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Fallback Bento Grid with Placeholder Content */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Main Featured Card */}
              <div className="lg:col-span-2 lg:row-span-2 glass-card p-8 rounded-2xl border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Destacado
                  </Badge>
                </div>
                <div className="bg-white/10 rounded-lg h-48 lg:h-64 mb-6 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 text-white/50" />
                </div>
                <h3 className="font-subtitle text-xl lg:text-2xl text-white mb-4">
                  Los Secretos de la Alkimia Botánica
                </h3>
                <p className="font-text text-white/80 text-sm lg:text-base leading-relaxed">
                  Descubre cómo nuestros ancestros utilizaban las plantas para la sanación y cómo estos conocimientos ancestrales se aplican en nuestros productos modernos.
                </p>
              </div>

              {/* Smaller Cards */}
              {[
                {
                  title: "Rituales de Belleza Consciente",
                  excerpt: "Transforma tu rutina de cuidado personal en un acto sagrado de conexión contigo mismo."
                },
                {
                  title: "El Poder de los Chakras",
                  excerpt: "Aprende a equilibrar tu energía mientras cuidas tu piel con nuestras técnicas holísticas."
                },
                {
                  title: "Meditación y Belleza Interior",
                  excerpt: "Descubre cómo la práctica contemplativa transforma tu ser desde adentro hacia afuera."
                }
              ].map((item, index) => (
                <div key={index} className="glass-card p-6 rounded-2xl border border-white/20">
                  <div className="bg-white/10 rounded-lg h-32 mb-4 flex items-center justify-center">
                    <Leaf className="w-8 h-8 text-white/50" />
                  </div>
                  <h4 className="font-subtitle text-lg text-white mb-3">
                    {item.title}
                  </h4>
                  <p className="font-text text-white/80 text-sm leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Enhanced CTA */}
          <div className="text-center mt-12">
            <Button className="group btn-enhanced px-8 py-4 text-lg text-white font-semibold rounded-full">
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              Ver Todos los Artículos
              <Sparkles className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED GALERÍA Section - Rolling Gallery Carousel */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <GaleriaBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[8rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-6 leading-tight" style={{ color: '#AE0000' }}>
            GALERÍA
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-5 mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <p className="text-xl font-text text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Descubre la belleza de nuestros productos artesanales y los momentos únicos de transformación
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Rolling Gallery Carousel */}
          <div className="relative">
            {/* Gallery Container with Infinite Scroll Effect */}
            <div className="overflow-hidden rounded-2xl">
              <div className="flex space-x-6 animate-marquee">
                {/* First Set of Images */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={`set1-${i}`} className="flex-shrink-0 group">
                    <div className="card-enhanced w-80 h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="relative h-full">
                        {/* Gallery Image */}
                        <img 
                          src={`/images/gallery/gallery-${i}.jpg`}
                          alt={`Galería DA LUZ ${i}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Fallback content when image is not available */}
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" style={{ display: 'none' }}>
                          <div className="text-center text-white">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-60" />
                            <div className="font-title text-xl mb-2">Imagen {i}</div>
                            <div className="font-caption text-sm opacity-80">Próximamente</div>
                          </div>
                        </div>

                        {/* Elegant Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-subtitle text-lg mb-2">Momento Alkimya</h3>
                          <p className="font-caption text-sm opacity-90">Descubre la magia en cada detalle</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Duplicate Set for Seamless Loop */}
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={`set2-${i}`} className="flex-shrink-0 group">
                    <div className="card-enhanced w-80 h-96 rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                      <div className="relative h-full">
                        {/* Gallery Image */}
                        <img 
                          src={`/images/gallery/gallery-${i}.jpg`}
                          alt={`Galería DA LUZ ${i}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Fallback content when image is not available */}
                        <div className="w-full h-full hidden items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20" style={{ display: 'none' }}>
                          <div className="text-center text-white">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-60" />
                            <div className="font-title text-xl mb-2">Imagen {i}</div>
                            <div className="font-caption text-sm opacity-80">Próximamente</div>
                          </div>
                        </div>

                        {/* Elegant Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h3 className="font-subtitle text-lg mb-2">Momento Alkimya</h3>
                          <p className="font-caption text-sm opacity-90">Descubre la magia en cada detalle</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Controls (Optional) */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-brand-primary/30 hover:bg-brand-primary transition-colors duration-300 cursor-pointer"
                    />
                  ))}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced CTA */}
          <div className="text-center mt-16">
            <div className="space-y-4">
              <h3 className="font-subtitle text-2xl text-brand-primary">
                Vive la Experiencia DA LUZ
              </h3>
              <p className="font-text text-gray-600 max-w-2xl mx-auto">
                Cada imagen cuenta una historia de transformación, belleza consciente y conexión con la naturaleza.
              </p>
              <Button className="group btn-enhanced px-8 py-4 text-lg text-white font-semibold rounded-full">
                <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Síguenos en Instagram
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED CONTACTO Section */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <ContactoBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[8rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl mb-6 leading-tight" style={{ color: '#AE0000' }}>
            PONTE EN CONTACTO
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-5 mb-5" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <p className="text-xl font-text text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Estamos aquí para acompañarte en tu camino hacia el bienestar consciente
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Contact Form */}
            <div className="space-y-8">
              <div className="card-enhanced p-8 rounded-2xl">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
                      Nombre Completo
                    </label>
                    <input 
                      type="text" 
                      className="form-enhanced w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text"
                      placeholder="Tu nombre completo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
                      Correo Electrónico
                    </label>
                    <input 
                      type="email" 
                      className="form-enhanced w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-subtitle font-medium text-gray-700 mb-3">
                      ¿En qué podemos ayudarte?
                    </label>
                    <textarea 
                      rows={5} 
                      className="form-enhanced w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-all duration-300 font-text resize-none"
                      placeholder="Cuéntanos sobre tu consulta, dudas sobre productos, servicios o cualquier otra pregunta..."
                    />
                  </div>
                  <Button
                    className="group btn-enhanced w-full py-4 text-lg text-white font-semibold rounded-xl"
                  >
                    <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    Enviar Mensaje
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="font-subtitle text-lg text-brand-primary mb-2">Atención Personal</h3>
                  <p className="font-caption text-gray-600 text-sm">
                    Lunes a Viernes<br />
                    9:00 - 18:00 hs
                  </p>
                </div>
                <div className="text-center p-6 glass-card rounded-xl">
                  <div className="w-12 h-12 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-6 h-6 text-brand-primary" />
                  </div>
                  <h3 className="font-subtitle text-lg text-brand-primary mb-2">Respuesta Rápida</h3>
                  <p className="font-caption text-gray-600 text-sm">
                    Contestamos en<br />
                    24 - 48 horas
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Visual Element with New Contact Image */}
            <div className="flex items-center justify-center">
              <div className="relative">
                {/* Main Contact Image */}
                <div className="card-enhanced w-full h-[500px] rounded-2xl shadow-2xl overflow-hidden relative">
                  <img 
                    src="/images/contact-background.jpg"
                    alt="Contacto DA LUZ CONSCIENTE"
                    className="w-full h-full object-cover"
                    style={{
                      filter: "brightness(0.85) saturate(1.1) contrast(1.05)"
                    }}
                  />

                  {/* Fallback content when contact image is not available */}
                  <div className="absolute inset-0 w-full h-full hidden items-center justify-center bg-gradient-to-br from-brand-primary/30 to-brand-secondary/20" style={{ display: 'none' }}>
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 opacity-80" />
                      </div>
                      <h3 className="font-title text-2xl mb-4">Imagen de Contacto</h3>
                      <p className="font-caption opacity-80">
                        Lugar para tu imagen<br />
                        de contacto personalizada
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-brand-primary/10 rounded-full animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-brand-secondary/10 rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/2 -left-8 w-8 h-8 bg-accent/10 rounded-full animate-pulse delay-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 