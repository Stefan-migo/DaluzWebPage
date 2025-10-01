import Link from "next/link";
import Image from "next/image";
import { client, queries } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import { ArrowRight, Sparkles, Leaf, Heart, Star, Zap, Calendar } from "lucide-react";
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
  AlkimyaDaLuzIcon,
  SesionesIcon,
  ProcesosIntegrativosIcon,
  MembresiaIcon,
  AncestralidadNaturalezaIcon,
  VisionIntegralIcon,
  CeremoniaPresenciaIcon,
  PlacerCreatividadIcon,
  EcologicaVeganaIcon,
  PoderBotanicoIcon,
  TransmutacionCoherenciaIcon,
  NeurocosmeticaIcon
} from "@/components/svg/SVGComponents";
import InteractiveGallery from "@/components/InteractiveGallery";
import ProcesosImage from "@/components/ProcesosImage";
import SesionesImage from "@/components/SesionesImage";

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
        next: {
          revalidate: 60, // Cache and revalidate every 60 seconds
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
                className="group px-8 py-4 text-lg font-medium text-white border-2 border-white/40 hover:bg-white glass-card transition-all duration-500"
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
            MANIFIESTO DA LUZ
          </h2>
          {/* Bottom gradient divider */}
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-4 mb-5" />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Mobile-First Responsive Grid */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Visual Element - Shows first on mobile for impact */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full">
              <div className="relative">
                {/* Main image container with custom border radius */}
                <div className="w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 card-enhanced shadow-2xl overflow-hidden" style={{ borderRadius: '0px 100px', border: '2px solid #AE0000' }}>
                  {/* Image container */}
                  <div className="w-full h-full bg-gradient-to-br from-white via-bg-cream to-bg-light shadow-inner flex items-center justify-center overflow-hidden relative">
                    {/* DA LUZ Main Image */}
                    <Image
                      src="/images/sobre-daluz/sobre-daluz-main.jpg"
                      alt="DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      className="object-cover"
                      style={{ borderRadius: '0px 100px' }}
                    />
                    
                    {/* Fallback content when image is not available */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center" style={{ display: 'none' }}>
                      <div className="text-center space-y-3 lg:space-y-4 px-4">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary animate-pulse" />
                        </div>
                        <div className="space-y-1 lg:space-y-2">
                          <div className="font-title text-lg lg:text-2xl text-brand-primary drop-shadow-sm">Alkimya</div>
                          <div className="font-title text-sm lg:text-lg text-brand-primary/80 drop-shadow-sm">Consciente</div>
                          <div className="w-12 lg:w-16 h-0.5 bg-brand-primary/40 mx-auto my-2 lg:my-4" />
                          <div className="text-xs lg:text-sm text-gray-800 space-y-1 drop-shadow-sm">
                            <div>Alma • Cuerpo</div>
                            <div>Transformación</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements - responsive sizing */}
                <div className="absolute -top-4 -right-4 lg:-top-6 lg:-right-6 w-8 h-8 lg:w-12 lg:h-12 bg-brand-primary/10 rounded-full animate-pulse" />
                <div className="absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 w-6 h-6 lg:w-8 lg:h-8 bg-brand-secondary/10 rounded-full animate-pulse delay-1000" />
                <div className="absolute top-1/2 -left-6 lg:-left-8 w-4 h-4 lg:w-6 lg:h-6 bg-accent/10 rounded-full animate-pulse delay-500" />
              </div>
            </div>

            {/* Content - Shows second on mobile */}
            <div className="order-2 lg:order-1 w-full">
              {/* Content Card with mobile-optimized spacing */}
              <div className="card-enhanced backdrop-blur-sm rounded-2xl p-6 lg:p-8 text-center shadow-lg border border-white/20">
                {/* Enhanced Content with mobile-friendly text sizing */}
                <div className="space-y-4 lg:space-y-6 text-base lg:text-lg leading-relaxed">
                  <p className="font-text text-gray-800">
                    Te damos la bienvenida a Da Luz, 
                  </p>
                  <p className="font-text text-gray-800">
                    <u>Un espacio dedicado a la alquimia de nuestra naturaleza y al despertar de la profunda conexión con tu Ser auténtico.</u>
                    <br/>
                    <br/>
                    <strong>Nuestra intención es facilitarte una nueva forma de habitarte. Te invitamos a sumergirte en un viaje alquímico hacia tu interior, donde tu cuerpo es tratado como un templo.</strong>
                    <br/><strong>Deseamos que tomarte momentos de pausa para percibir y nutrir tu Ser se convierta en un ritual diario 
                    donde la atención plena, la gratitud y la presencia te acompañen en tu sendero.</strong>  
                  </p>
                  <p className="font-text text-gray-800">
                  Nuestro propósito fundamental es acompañarte en la construcción de <u>un equilibrio más completo</u>, donde <strong>el amor por vos misma y por la Tierra sean las raíces de cada elección que realices.</strong>
                  </p>
                </div>

                {/* Enhanced CTA with responsive sizing */}
                <div className="pt-4 lg:pt-6">
                  <Button
                    className="group btn-enhanced px-6 py-3 lg:px-8 lg:py-4 text-white font-semibold text-sm lg:text-base w-full sm:w-auto"
                  >
                    Explora Nuestra Filosofía
                  </Button>
                </div>
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
          Nuestras Propuestas
          </h2>
          {/* Bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-2 mb-3" style={{ background: 'linear-gradient(to right, transparent, #FFF4B3, transparent)' }} />
          <p className="text-xl font-text text-gray-600 max-w-3xl mx-auto leading-relaxed" style={{ color: '#F0EACE' }}>
            Descubre nuestras modalidades de acompañamiento holístico, diseñadas para tu transformación integral
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Service Cards with Your Custom SVG Icons */}
          <div className="grid md:grid-cols-4 gap-4">
            {/* Biología De Luz */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">


                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-[#F0EACE] group-hover:bg-opacity-95 group-hover:text-brand-primary transition-all duration-300">
                  <AlkimyaDaLuzIcon size={64} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                ALKIMYA DA LUZ 
                </h3>

                {/* Description */}
                <ul className="font-text text-gray-600 text-[1rem] text-left leading-relaxed group-hover:text-gray-700 transition-colors duration-300 space-y-1">
                  <li>5 líneas de productos creados para nutrir tu cuerpo y tu alma.</li>
                  <li>Fórmulas con aceites esenciales que despiertan tus sentidos.</li>
                  <li>Rituales de uso que te invitan a conectar con tu presencia y con tu cuerpo.</li>
                </ul>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Descubrí nuestras Alkimyas.
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* Sesiones */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">

                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-[#F0EACE] group-hover:bg-opacity-95 group-hover:text-brand-primary transition-all duration-300">
                  <SesionesIcon size={64} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                SESIONES HOLÍSTICAS
                </h3>

                {/* Description */}
                <ul className="font-text text-gray-600 text-[0.95rem] text-left leading-relaxed group-hover:text-gray-700 transition-colors duration-300 space-y-1">
                  <li>3 propuestas para potenciar tu claridad y armonía.</li>
                  <li>Conecta con el aquí y ahora.</li>
                  <li>Utilizamos herramientas ancestrales como Reiki Usui y Karuna, sonidos curativos con cuencos, aromaterapia, Flores de Bach y más.</li>
                </ul>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  ¡Conoce nuestras propuestas!
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

              {/* procesos integrativos */}
              <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">

                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-[#F0EACE] group-hover:bg-opacity-95 group-hover:text-brand-primary transition-all duration-300">
                  <ProcesosIntegrativosIcon size={64} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-[1.15rem] text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                PROCESOS INTEGRATIVOS
                </h3>

                {/* Description */}
                <ul className="font-text text-gray-600 leading-relaxed text-[0.9rem] text-left group-hover:text-gray-700 transition-colors duration-300 space-y-1">
                  <li>Procesos de Transformación Profunda</li>
                  <li>3 programas cíclicos para que te reconectes con tu naturaleza.</li>
                  <li>Aprende a escuchar tu cuerpo y a crear mayor consciencia sobre tus acciones.</li>
                  <li>Explora ejercicios reflexivos, corporales y energéticos para reprogramarte y sentir tu poder creador.</li>
                </ul>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Descubrí nuestros procesos 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>

            {/* Membresía */}
            <div className="group card-enhanced p-8 text-center">
              <div className="relative z-10 space-y-6">

                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-primary/10 rounded-full text-brand-primary group-hover:bg-[#F0EACE] group-hover:bg-opacity-95 group-hover:text-brand-primary transition-all duration-300">
                  <MembresiaIcon size={64} />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                MEMBRESÍAS
                </h3>

                {/* Description */}
                <ul className="text-gray-600 leading-relaxed text-[0.9rem] text-left group-hover:text-gray-700 transition-colors duration-300 space-y-1">
                  <li>Un espacio para introducirte en el mundo de Da Luz.</li>
                  <li>Nutre tu alma y aprende a usar herramientas que potenciarán tu bienestar.</li>
                  <li>Encuentra videos, meditaciones guiadas, ejercicios y una biblioteca virtual.</li>
                  <li>Accede a descuentos exclusivos.</li>
                </ul>

                {/* CTA */}
                <Button
                  variant="ghost"
                  className="group/btn mt-6 text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                >
                  Sé parte del Ritual
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
          Los valores que nos impulsan a crear y que deseamos que sientas.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Philosophy Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-[-2rem]">
            {[
              {
                title: "Naturaleza y Ancestralidad",
                description: (
                  <>
                  Vivimos y creamos en <strong>armoníacon la Madre Tierra.</strong> Honramos nuestras raíces y respetamos toda forma de vida. Este es nuestro compromiso universal.
                  </>
                ),
                icon: <AncestralidadNaturalezaIcon size={50} className="" />
              },
              {
                title: "Visión Integral y Autogestión",
                description: (
                <>
                El equilibrio es <strong>integral:</strong> no solo atendemos al cuerpo físico, sino también a tus emociones, pensamientos y energía. Te ofrecemos un sendero para que aprendas a <strong>autogestionar tu Ser</strong> a través de elecciones conscientes.
                </>
                ),  
                icon: <VisionIntegralIcon size={50} className="" />
              },
              {
                title: "Ceremonia y Presencia",
                description: (
                  <>
                Te invitamos a vivir la vida como una <strong>ceremonia diaria.</strong> Date tiempo para <strong>conectar con tus sentires</strong>, tu cuerpo, las sensaciones y cada parte de tu Ser en <strong>plena presencia.</strong>
                  </>
                ),
                icon: <CeremoniaPresenciaIcon size={50} className="" />
              },
              {
                title: "Placer y Creatividad Consciente",
                description: (
                <> 
                <strong>Crear desde el placer es nuestro mantra.</strong> Exploramos nuevas formas de vincularnos con nuestros cuerpos, con el acto de <strong>Crear</strong> y con el Universo entero desde el goce.
                </>
                ),
                icon: <PlacerCreatividadIcon size={50} className="" />
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
          <div className="w-32 h-0.5 mx-auto mt-4 mb-8" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
        
          {/* Main Description */}
          <div className="max-w-4xl mx-auto text-center mb-8">
            <p className="text-2xl font-text text-gray-800 leading-relaxed font-light mb-6">
              <strong>Neurocosmética que Transforma:</strong> una fusión entre los saberes ancestrales y la química moderna.
            </p>
            <p className="text-xl font-text text-gray-800 leading-relaxed font-light">
              Creada para quienes buscan ir más allá de la cosmética, deseando una experiencia de transformación genuina. En nuestra sección de Alkimya, encontrarás todo lo que necesitas para tu ceremonia diaria:
            </p>
          </div>

          {/* Features List */}
          <div className="max-w-3xl mx-auto">
            <ul className="space-y-4 text-left">
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                <span className="text-lg font-text text-gray-800 leading-relaxed">
                  <strong>Bio-tipos de piel:</strong> Conocé mejor tu piel para elegir los productos ideales.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                <span className="text-lg font-text text-gray-800 leading-relaxed">
                  <strong>Ceremonia Ideal:</strong> Tips para tu cuidado en el día a día.
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                <span className="text-lg font-text text-gray-800 leading-relaxed">
                  <strong>Tesoros Da Luz:</strong> Descubrí los regalos a los que accederás con tu compra Alkimya!
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-brand-primary rounded-full mt-3 flex-shrink-0"></div>
                <span className="text-lg font-text text-gray-800 leading-relaxed">
                  <strong>Transparencia:</strong> El listado completo de la materia prima que usamos. Porque saber lo que nutre tu piel es un acto de amor y confianza.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Content */}
          <div className="space-y-8">
            {/* Features Grid */}
            <div className="grid md:grid-cols-4 gap-6 mt-12 mb-12">
              <div className="card-enhanced p-6 text-center">
                <EcologicaVeganaIcon size={48} className="mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Ecológica y Vegana</h3>
                <p className="font-caption text-gray-600 text-sm"> <strong>Un Compromiso con el Planeta.</strong> Respetamos toda forma de vida. Por eso, elegimos ingredientes <strong>sostenibles</strong> y envases <strong>conscientes</strong> en cada paso, asegurando la protección de la Madre Tierra.</p>
              </div>
              <div className="card-enhanced p-6 text-center">
                <PoderBotanicoIcon size={48} className="mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Poder botánico y Natural</h3>
                <p className="font-caption text-gray-600 text-sm"><strong>La Naturaleza a tu favor.</strong> Nuestras <strong>alquimias</strong> aprovechan el poder concentrado de las plantas para nutrir y promover tu <strong>bienestar integral</strong> de manera profunda.</p>
              </div>
              <div className="card-enhanced p-6 text-center">
                <TransmutacionCoherenciaIcon size={48} className="mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Transmutación y coherencia</h3>
                <p className="font-caption text-gray-600 text-sm"><strong>Fórmulas para tu Bioequilibrio.</strong> Cada producto tiene una intención clara, combinando la sabiduría de las hierbas medicinales con activos vegetales. Creamos para catalizar la transformación que tu equilibrio necesita.</p>
              </div>
              <div className="card-enhanced p-6 text-center">
                <NeurocosmeticaIcon size={48} className="mx-auto mb-4" />
                <h3 className="font-subtitle text-lg text-brand-primary mb-2">Neurocosmética Vibracional</h3>
                <p className="font-caption text-gray-600 text-sm">La cosmética es lo que sentís, <strong>porque tu piel es un canal que afecta tu cuerpo y mente.</strong> Nuestras alquimias son una invitación a una <strong>ceremonia de conexión diaria</strong>, protegiendo tu equilibrio hormonal y emocional.</p>
              </div>
            </div>

            {/* Enhanced CTA */}
            <div className="pt-8 text-center">
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
      <Link href="/categorias/linea-ecos" className="block group">
      <section
          className="section-enhanced relative py-24 px-6 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
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
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              <strong>Limpieza Consciente:</strong> Alquimias que activan el chakra laríngeo y te invitan a relajar el sistema nervioso con el sonido del agua.
              </p>
            </div>

              {/* Product Image Containers */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/ecos/ecos-producto-1.jpg"
                    alt="Línea ECOS - Producto 1"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                    </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/ecos/ecos-producto-2.jpg"
                    alt="Línea ECOS - Producto 2"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                  </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/ecos/ecos-producto-3.jpg"
                    alt="Línea ECOS - Producto 3"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                </div>
              </div>
          </div>
        </div>
      </section>
      </Link>



      {/* ✨ ENHANCED LÍNEA UMBRAL */}
      <Link href="/categorias/linea-umbral" className="block group">
      <section
          className="section-enhanced relative py-24 px-6 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
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
                LÍNEA UMBRAL SENS
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
            </div>

            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
              <strong>Nutrición y Placer:</strong> Alquimias que activan el chakra sacro, diseñadas para que mimes tu cuerpo y disfrutes del placer de sentirte.
              </p>
            </div>

              {/* Product Image Containers */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-16">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/umbral/umbral-producto-1.jpg"
                    alt="Línea UMBRAL - Producto 1"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                    </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/umbral/umbral-producto-2.jpg"
                    alt="Línea UMBRAL - Producto 2"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                  </div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                  <Image
                    src="/images/lineas/umbral/umbral-producto-3.jpg"
                    alt="Línea UMBRAL - Producto 3"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                    style={{ borderRadius: '0px 15px' }}
                  />
                </div>
              </div>
          </div>
        </div>
      </section>
      </Link>


      {/* LÍNEA JADE RITUAL */}
      <Link href="/categorias/linea-jade-ritual" className="block group">
      <section
          className="relative py-20 px-6 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
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
          <strong>Sanación Integral:</strong> Alquimias que activan los chakras cardíaco y Ajna. Te ayudan a transformar de forma consciente dolencias y desequilbrios del Ser.
          </p>

            {/* Product Image Containers */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/jade-ritual/jade-producto-1.jpg"
                  alt="Línea JADE RITUAL - Producto 1"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                  </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/jade-ritual/jade-producto-2.jpg"
                  alt="Línea JADE RITUAL - Producto 2"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/jade-ritual/jade-producto-3.jpg"
                  alt="Línea JADE RITUAL - Producto 3"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
              </div>
            </div>
        </div>
      </section>
      </Link>



      {/* LÍNEA UTÓPICA */}
      <Link href="/categorias/linea-utopica" className="block group">
      <section
          className="relative py-20 px-6 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
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
          <strong>Maquillaje Intencionado:</strong> Colores y brillos de origen vegetal y mineral que respetan y cuidan la salud de tu piel.
          </p>

            {/* Product Image Containers */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/utopica/utopica-producto-1.jpg"
                  alt="Línea UTÓPICA - Producto 1"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                  </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/utopica/utopica-producto-2.jpg"
                  alt="Línea UTÓPICA - Producto 2"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/utopica/utopica-producto-3.jpg"
                  alt="Línea UTÓPICA - Producto 3"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
              </div>
            </div>
        </div>
      </section>
      </Link>



      {/* LÍNEA ALMA TERRA */}
      <Link href="/categorias/linea-alma-terra" className="block group">
      <section
          className="relative py-20 px-6 overflow-hidden cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
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
          <strong>Aromaterapia y Conexión:</strong> Aromas que activan el chakra raíz, invitándote a habitar el presente y a conectar con tu materia desde la calma.
          </p>

            {/* Product Image Containers */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-16">
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/alma-terra/alma-terra-producto-1.jpg"
                  alt="Línea ALMA TERRA - Producto 1"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                  </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/alma-terra/alma-terra-producto-2.jpg"
                  alt="Línea ALMA TERRA - Producto 2"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
                </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 card-enhanced shadow-2xl overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-300" style={{ borderRadius: '0px 15px' }}>
                <Image
                  src="/images/lineas/alma-terra/alma-terra-producto-3.jpg"
                  alt="Línea ALMA TERRA - Producto 3"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                  style={{ borderRadius: '0px 15px' }}
                />
              </div>
            </div>
        </div>
      </section>
      </Link>



      {/* PROCESOS Section */}
      <section className="section-enhanced relative py-20 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <ProcesosBackground
          bgColor="#F0EACE"  // creme background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="container mx-auto max-w-6xl text-left mt-[0rem] mb-[0rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-10 mb-3" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-gray-400xl md:text-5xl leading-tight" style={{ color: '#AE0000' }}>
                PROCESOS
              </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-10 mt-2 mb-10" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
        </div>

        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="px-4 lg:px-0">
              <div className="space-y-8 mt-8 lg:mt-14">
                {/* Introduction */}
                <div className="text-base lg:text-lg leading-relaxed" style={{ color: '#F0EACE' }}>
                  <p>
                    Nuestros procesos integrales están diseñados para acompañarte en
                    cada etapa de tu transformación personal. Combinamos técnicas ancestrales
                    con enfoques contemporáneos para crear un camino único hacia el bienestar.
                  </p>
                </div>

                {/* Processes Grid */}
                <div className="space-y-6">
                  {/* GENESIS */}
                  
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-primary font-bold text-lg" style={{ color: '#F0EACE' }}>•</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#F0EACE' }}>
                          GENESIS <span className="text-sm font-normal text-white/80">(Personalizado)</span>
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          <strong>¿Qué es?</strong> Un proceso 100% personalizado, asistido con Flores de Bach, 
                          Péndulo y otras herramientas según tus necesidades.
                        </p>
                      </div>
                    </div>

                  {/* OASIS */}
                
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-primary font-bold text-lg" style={{ color: '#F0EACE' }}>•</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#F0EACE' }}>
                          OASIS <span className="text-sm font-normal text-white/80">(4 meses)</span>
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          <strong>¿Qué es?</strong> Un proceso Individual en grupo, de Depuración Integral con 
                          hierbas medicinales. Incluye archivos descargables para cada ciclo.
                        </p>
                      </div>
                    </div>

                  {/* METAMORFOSIS */}
                
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-brand-primary font-bold text-lg" style={{ color: '#F0EACE' }}>•</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#F0EACE' }}>
                          METAMORFOSIS <span className="text-sm font-normal text-white/80">(6 meses)</span>
                        </h3>
                        <p className="text-white/90 leading-relaxed">
                          <strong>¿Qué es?</strong> Depuración integral con hierbas medicinales. Incluye archivos 
                          descargables semanales y una sesión mensual uno a uno.
                        </p>
                      </div>
                    </div>

                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 lg:mt-0">
              <ProcesosImage />
            </div>
          </div>

          {/* Horizontally centered button relative to screen width */}
          <div className="flex justify-center mt-[5rem] pt-8 lg:pt-12">
            <Button
              className="group relative overflow-hidden px-6 py-3 lg:px-8 lg:py-4 font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                backgroundColor: '#F0EACE',
                color: '#AE0000',
                border: '2px solid #AE0000',
                borderRadius: '0px 15px'
              }}
            >
              <span className="relative z-10">Ver más</span>
              {/* Hover effect overlay */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                style={{ backgroundColor: '#AE0000' }}
              ></div>
                Inicia el Proceso que pide tu Alma
            </Button>
          </div>
        </div>
      </section>



      {/* SESIONES Section */}
      <section className="section-enhanced relative pt-[3rem] pb-[5rem] px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <SesionesBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#AE0000"  // Brand red wave
          className="opacity-95"
        />
        {/* Centered Title */}
        <div className="text-center pb-[2rem] mt-[0rem] mr-[10rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 ml-auto mb-2 mr-[2rem]" style={{ background: 'linear-gradient(to right, transparent, #F0EACE, transparent)' }} />
          <h2 className="font-title text-right md:text-5xl leading-tight" style={{ color: '#F0EACE' }}>
            SESIONES
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 ml-auto mt-2 mb-2 mr-[2rem]" style={{ background: 'linear-gradient(to right, transparent, #F0EACE, transparent)' }} />
        </div>

        <div className="container mb-[0rem] mt-[0rem] mx-auto max-w-6xl relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex justify-center order-2 lg:order-1 mt-8 lg:mt-0">
              <SesionesImage />
            </div>
            <div className="px-4 lg:px-0 order-1 lg:order-2">
              <div className="space-y-8 mt-8 lg:mt-[6rem]">
                {/* Introduction */}
                <div className="text-base lg:text-lg leading-relaxed" style={{ color: '#AE0000' }}>
                  <p>
                    Nuestras sesiones individuales están diseñadas para crear un espacio sagrado
                    de encuentro contigo mismo, donde puedas explorar, sanar y expandir tu consciencia
                    en un ambiente de total confianza y respeto.
                  </p>
                </div>

                {/* Sessions Grid */}
                <div className="space-y-6">
                  {/* Sesión Armonía/Pacifica */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-brand-primary font-bold text-lg" style={{ color: '#AE0000' }}>•</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#AE0000' }}>
                        Sesión Armonía/Pacifica: Reiki Usui y Karuna
                      </h3>
                      <div className="text-gray-700 leading-relaxed">
                        <p><strong>Duración:</strong> 60 min.</p>
                        <p><strong>Ideal para:</strong> Relajación, calma, insomnio, ansiedad y nerviosismo.</p>
                        <p><strong>Beneficio:</strong> Equilibra chakras y aura para activar tu capacidad de autosanación.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sesión Reprogramación Integral */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-brand-primary font-bold text-lg" style={{ color: '#AE0000' }}>•</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#AE0000' }}>
                        Sesión Reprogramación Integral: Chamanismo y Péndulo
                      </h3>
                      <div className="text-gray-700 leading-relaxed">
                        <p><strong>Duración:</strong> 75 min.</p>
                        <p><strong>Beneficio:</strong> Descifra tu subconsciente con el péndulo y reprograma tu energía a través de diversas técnicas Ancestrales.</p>
                        <p><strong>Incluye:</strong> Mapa pendular y ejercicios para potenciar nuevas conexiones neuronales.</p>
                      </div>
                    </div>
                  </div>

                  {/* Sesión Bioequilibrio Integral */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-brand-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-brand-primary font-bold text-lg" style={{ color: '#AE0000' }}>•</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-subtitle text-xl text-brand-primary mb-2" style={{ color: '#AE0000' }}>
                        Sesión Bioequilibrio Integral: Reiki y Chamanismo
                      </h3>
                      <div className="text-gray-700 leading-relaxed">
                        <p><strong>Duración:</strong> 90 min.</p>
                        <p><strong>Beneficio:</strong> Armoniza y equilibra tu energía con Reiki Usui y técnicas chamánicas.</p>
                        <p><strong>Incluye:</strong> Elixir floral o aromático para mantener el equilibrio.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Horizontally centered button relative to screen width */}
          <div className="flex justify-center pt-[4rem] lg:pt-12">
            <Button
              className="group btn-enhanced pb-[0rem] px-6 py-3 lg:px-8 lg:py-4 font-semibold text-sm lg:text-base text-white"
              style={{ backgroundColor: '#AE0000' }}
            >
              Reserva la sesión que necesita tu cuerpo
            </Button>
          </div>
        </div>
      </section>



      {/* ✨ ENHANCED BLOG DE LA COMUNIDAD Section - Bento Grid Design */}
      <section className=" relative pt-[3rem] pb-[5rem] px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <BlogComunidadBackground
          bgColor="#F0EACE"  // Brand red background
          waveColor="#AE0000"  // Slightly lighter red for wave
          className="opacity-95"
        />

        {/* Left-aligned Title */}
        <div className="container mx-auto max-w-7xl text-center pb-[5rem] mt-[0rem] mb-[0rem] relative z-20">
          {/* Top gradient divider */}
          <div className="w-32 h-0.5 mx-auto mb-2" style={{ background: 'linear-gradient(to right, #AE0000, transparent)' }} />
          <h2 className="font-title text-5xl md:text-6xl  leading-tight" style={{ color: '#AE0000' }}>
            BLOG DE LA COMUNIDAD
          </h2>
          {/* bottom gradient divider */}
          <div className="w-32 h-0.5 mx-auto mt-2" style={{ background: 'linear-gradient(to right, #AE0000, transparent)' }} />
              </div>

        <div className="container mx-auto max-w-7xl relative z-20">

          {/* Enhanced Bento Grid Layout for Blog Posts - Left/Right Mirror Design */}
              {featuredPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div className="space-y-6">
                {/* Section Title */}
                <div className="text-center mb-6 pb-[3rem] pt-[1rem]">
                  <h3 className="font-title text-3xl md:text-4xl leading-tight" style={{ color: '#AE0000' }}>
                    NEUROCOSMETICA
                  </h3>
                  <div className="w-24 h-0.5 mx-auto mt-2" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
                </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  {/* Big Post 1 - Top (2x1 spanning 2 columns) */}
                  {featuredPosts[0] && (
                    <Link
                      href={`/blog/${featuredPosts[0].slug.current}`}
                      className="group col-span-2 row-span-1"
                    >
                      <div className="glass-card h-full p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="grid grid-cols-2 gap-4 h-full">
                          {/* Image Section */}
                          <div className="bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                            {featuredPosts[0].mainImage?.asset?.url ? (
                              <Image
                                src={featuredPosts[0].mainImage.asset.url}
                                alt={featuredPosts[0].mainImage.alt || featuredPosts[0].title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover rounded-lg"
                              />
                            ) : (
                              <Sparkles className="w-12 h-12 text-white/50" />
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="flex flex-col justify-between">
                            <div>
                              <Badge className="bg-white/20 border-white/30 mb-2 text-[#AE0000] hover:bg-[#AE0000] hover:text-[#F0EACE]" variant="default">Post</Badge>
                              <h3 className="font-subtitle text-lg text-[#AE0000] group-hover:text-[#AE0000]/75 transition-colors duration-300 line-clamp-3 mb-2">
                                {featuredPosts[0].title}
                              </h3>
                              <p className="font-text text-[#AE0000]/80 text-sm leading-relaxed group-hover:text-[#AE0000]/90 transition-colors duration-300 line-clamp-2">
                                {featuredPosts[0].excerpt || "Descubre más sobre este fascinante tema..."}
                        </p>
                      </div>
                            <div className="flex items-center text-[#AE0000]/60 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(featuredPosts[0].publishedAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                              })}
                </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Small Post 3 - Bottom Left */}
                  {featuredPosts[2] && (
                    <Link
                      href={`/blog/${featuredPosts[2].slug.current}`}
                      className="group col-span-1 row-span-1"
                    >
                      <div className="glass-card h-full p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="bg-white/10 rounded-lg h-20 mb-3 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                          {featuredPosts[2].mainImage?.asset?.url ? (
                            <Image
                              src={featuredPosts[2].mainImage.asset.url}
                              alt={featuredPosts[2].mainImage.alt || featuredPosts[2].title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                  </div>
                        <h4 className="font-subtitle text-sm text-[#AE0000] group-hover:text-[#AE0000]/75 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[2].title}
                        </h4>
                        <div className="flex items-center text-[#AE0000]/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[2].publishedAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                  </div>
                </div>
                    </Link>
              )}

                  {/* Small Post 4 - Bottom Right */}
                  {featuredPosts[3] && (
                <Link
                      href={`/blog/${featuredPosts[3].slug.current}`}
                      className="group col-span-1 row-span-1"
                    >
                      <div className="glass-card h-full p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="bg-white/10 rounded-lg h-20 mb-3 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                          {featuredPosts[3].mainImage?.asset?.url ? (
                            <Image
                              src={featuredPosts[3].mainImage.asset.url}
                              alt={featuredPosts[3].mainImage.alt || featuredPosts[3].title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-[#AE0000] group-hover:text-[#AE0000]/75 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[3].title}
                        </h4>
                        <div className="flex items-center text-[#AE0000]/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[3].publishedAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                </Link>
                  )}
              </div>
            </div>

              {/* RIGHT SIDE - Mirror of Left */}
              <div className="space-y-6">
                {/* Section Title */}
                <div className="text-center mb-6 pb-[3rem] pt-[1rem]">
                  <h3 className="font-title text-3xl md:text-4xl leading-tight" style={{ color: '#F0EACE' }}>
                    SER INTEGRAL
                  </h3>
                  <div className="w-24 h-0.5 mx-auto mt-2" style={{ background: 'linear-gradient(to right, transparent, #F0EACE, transparent)' }} />
              </div>
                <div className="grid grid-cols-2 grid-rows-2 gap-4">
                  {/* Small Post 1 - Top Left */}
                  {featuredPosts[0] && (
                    <Link
                      href={`/blog/${featuredPosts[0].slug.current}`}
                      className="group col-span-1 row-span-1"
                    >
                      <div className="glass-card h-full p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="bg-white/10 rounded-lg h-20 mb-3 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                          {featuredPosts[0].mainImage?.asset?.url ? (
                            <Image
                              src={featuredPosts[0].mainImage.asset.url}
                              alt={featuredPosts[0].mainImage.alt || featuredPosts[0].title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                      </div>
                        <h4 className="font-subtitle text-sm text-white group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[0].title}
                        </h4>
                        <div className="flex items-center text-white/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[0].publishedAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                </div>
                      </div>
                    </Link>
                  )}

                  {/* Small Post 2 - Top Right */}
                  {featuredPosts[1] && (
                    <Link
                      href={`/blog/${featuredPosts[1].slug.current}`}
                      className="group col-span-1 row-span-1"
                    >
                      <div className="glass-card h-full p-4 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="bg-white/10 rounded-lg h-20 mb-3 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                          {featuredPosts[1].mainImage?.asset?.url ? (
                            <Image
                              src={featuredPosts[1].mainImage.asset.url}
                              alt={featuredPosts[1].mainImage.alt || featuredPosts[1].title}
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                  </div>
                        <h4 className="font-subtitle text-sm text-white group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[1].title}
                        </h4>
                        <div className="flex items-center text-white/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(featuredPosts[1].publishedAt).toLocaleDateString('es-ES', {
                            month: 'short',
                            day: 'numeric'
                          })}
                  </div>
                </div>
                    </Link>
              )}

                  {/* Big Post 2 - Bottom (2x1 spanning 2 columns) */}
                  {featuredPosts[1] && (
                <Link
                      href={`/blog/${featuredPosts[1].slug.current}`}
                      className="group col-span-2 row-span-1"
                    >
                      <div className="glass-card h-full p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2">
                        <div className="grid grid-cols-2 gap-4 h-full">
                          {/* Content Section */}
                          <div className="flex flex-col justify-between">
                            <div>
                              <Badge className="bg-white/20 text-white border-white/30 mb-2">Post</Badge>
                              <h3 className="font-subtitle text-lg text-white group-hover:text-white/90 transition-colors duration-300 line-clamp-3 mb-2">
                                {featuredPosts[1].title}
                              </h3>
                              <p className="font-text text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                                {featuredPosts[1].excerpt || "Explora este contenido fascinante..."}
                              </p>
                            </div>
                            <div className="flex items-center text-white/60 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(featuredPosts[1].publishedAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </div>

                          {/* Image Section */}
                          <div className="bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                            {featuredPosts[1].mainImage?.asset?.url ? (
                              <Image
                                src={featuredPosts[1].mainImage.asset.url}
                                alt={featuredPosts[1].mainImage.alt || featuredPosts[1].title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover rounded-lg"
                              />
                            ) : (
                              <Sparkles className="w-12 h-12 text-white/50" />
                            )}
                          </div>
                        </div>
                      </div>
                </Link>
                  )}
              </div>
            </div>
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
            <Button className="group btn-enhanced py-4 text-lg text-white font-semibold rounded-full">
              Ver Todos los Artículos
            </Button>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED GALERÍA Section - Rolling Gallery Carousel */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden">
        {/* Custom SVG Background */}
        <GaleriaBackground
          bgColor="#F0EACE"  // Cream background
          waveColor="#F0EACE"  // Brand red wave
          className="opacity-95"
        />

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[3rem] relative z-20 px-4">
          {/* Top gradient divider */}
          <div className="w-24 sm:w-32 h-0.5 mx-auto mb-3" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 leading-tight" style={{ color: '#AE0000' }}>
            GALERÍA
          </h2>
          {/* bottom gradient divider */}
          <div className="w-24 sm:w-32 h-0.5 mx-auto mt-3 mb-3" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <p className="text-base sm:text-lg lg:text-xl font-text text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Descubre la belleza de nuestros productos artesanales y los momentos únicos de transformación
          </p>
                </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Interactive Gallery Carousel */}
          <InteractiveGallery />
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
        <div className="container mx-auto max-w-7xl text-left pb-[3rem] sm:pb-[5rem] mt-[0rem] mb-[0rem] relative z-20 px-4">
          {/* Top gradient divider */}
          <div className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mb-2" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight" style={{ color: '#AE0000' }}>
            CONTACTO
          </h2>
          {/* bottom gradient divider */}
          <div className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mt-2" style={{ background: 'linear-gradient(to right, transparent, #AE0000, transparent)' }} />

        </div>

        <div className="container mx-auto max-w-7xl relative z-20 px-4">
          <p className="text-base sm:text-lg lg:text-xl font-text max-w-3xl mx-auto leading-relaxed" style={{ color: '#F0EACE' }}>
            Estamos aquí para acompañarte en tu camino hacia el bienestar consciente
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-[3rem] lg:pt-[5rem] gap-8 lg:gap-16 items-center">
            {/* Enhanced Contact Form */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="card-enhanced p-4 sm:p-6 lg:p-8 rounded-2xl">
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
            </div>

            {/* Enhanced Visual Element with Custom Border Radius Contact Image */}
            <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg h-[300px] sm:h-[400px] lg:h-[500px] lg:mr-[-5rem]">
                {/* Custom Border Radius Image Container */}
                <div
                  className="w-full h-full shadow-2xl relative overflow-hidden"
                style={{
                    borderRadius: '0px 100px',
                    background: 'linear-gradient(135deg, rgba(174, 0, 0, 0.1) 0%, rgba(240, 234, 206, 0.1) 100%)',
                    border: '2px solid #F0EACE'
                  }}
                >
                  <Image
                    src="/images/contact-background.jpg"
                    alt="Contacto DA LUZ CONSCIENTE"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                    className="object-cover"
                    style={{
                      filter: "brightness(0.85) saturate(1.1) contrast(1.05)",
                      borderRadius: '0px 100px'
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