import Link from "next/link";
import Image from "next/image";
import { client, queries } from "@/lib/sanity/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BlurText from "@/components/ui/BlurText";
import {
  ArrowRight,
  Sparkles,
  Leaf,
  Heart,
  Star,
  Zap,
  Calendar,
  BookOpen,
} from "lucide-react";
import {
  AnimatedBackground,
  SobreNosotrosBackground,
  AlkimyaNeurocosmeticaBackground,
  NuestraFilosofiaBackground,

  BlogBackground,
  GaleriaBackground,
  ContactoBackground,
  ValorYConfianzaBackground,
  ServiciosHolisticosBackground,

  SesionesIcon,
  ProcesosIntegrativosIcon,
  MembresiaIcon,
  AncestralidadNaturalezaIcon,
  VisionIntegralIcon,
  CeremoniaPresenciaIcon,
  PlacerCreatividadIcon,

} from "@/components/svg/SVGComponents";
import InteractiveGallery from "@/components/InteractiveGallery";
import LineasCarousel from "@/components/marketing/LineasCarousel";
import ContactForm from "@/components/ContactForm";

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
          tags: ["blog-posts", "homepage-posts"],
        },
      },
    );
    // Get recent posts for homepage bento grid, limit to 4
    const recentPosts = posts?.slice(0, 4) || [];
    console.log(
      "🏠 Homepage: Fetched posts for blog section:",
      recentPosts.length,
    );
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
              filter: "brightness(0.6) saturate(1.1) contrast(1.1)",
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
                      fontFamily: "VELISTA, var(--font-velista), serif",
                      fontWeight: "normal",
                      fontStyle: "normal",
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
                    fontFamily: "Malisha, var(--font-malisha), cursive",
                    fontWeight: "300",
                    letterSpacing: "0.05em",
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
              <Link href="/productos">
                <Button
                  className="group relative px-10 py-4 text-lg font-semibold glass-card text-white hover:bg-white hover:text-gray-900 transition-all duration-500 transform hover:scale-105"
                  style={{ borderRadius: "50px" }}
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Descubre Nuestras Alkimyas
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>

              <Link href="/filosofia-proposito">
                <Button
                  variant="ghost"
                  className="group px-8 py-4 text-lg font-medium text-white border-2 border-white/40 hover:bg-white glass-card transition-all duration-500"
                  style={{ borderRadius: "50px" }}
                >
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Conoce Nuestra Historia
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ MANIFIESTO DA LUZ SECTION */}
      {/* Section height adapts to SVG aspect ratio (1922.91 / 1080.08 ≈ 1.779) */}
      <section
        className="relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-manifiesto"
        style={{
          minHeight: "550px", // Minimum height for mobile
          marginBottom: 0, // Ensure no gap between sections
        }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
          }}
        />

        {/* SVG Background - Desktop Only */}
        <div
          className="hidden xl:block absolute inset-0"
          style={{ aspectRatio: "1922.91 / 1080.08" }}
        >
          <SobreNosotrosBackground
            bgColor="#F6FBD6" // Default theme background color
            waveColor="#AE0000" // Brand red wine color
            className="opacity-100"
          />
        </div>

        {/* Title Section - Positioned in upper wave area */}
        {/* Responsive padding that adjusts with zoom: smaller values keep title higher at higher zoom */}
        <div
          className="text-center relative z-10 flex-shrink-0"
          style={{
            paddingTop: "clamp(1.25rem, 3%, 2.5rem)",
            paddingBottom: "clamp(0.5rem, 1.5%, 1rem)",
          }}
        >
          <div className="lg:mb-8 xl:mb-0"></div>
          {/* Top gradient divider - Desktop shows #F6FBD6, Mobile shows #AE0000 */}
          <div
            className="hidden xl:block w-32 h-0.5 mx-auto mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #F6FBD6, transparent)",
            }}
          />
          <div
            className="xl:hidden w-32 h-0.5 mx-auto mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-6xl leading-tight text-[#AE0000] xl:text-[#FFF4B3]">
            MANIFIESTO DA LUZ
          </h2>
          <p className="font-subtitle text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl 2xl:text-2xl mt-[0.3rem] text-[#AE0000] xl:text-[#FFF4B3]">
            Viví en Presencia, Creá con Placer.
          </p>
          {/* Bottom gradient divider - Desktop shows #F6FBD6, Mobile shows #AE0000 */}
          <div
            className="hidden xl:block w-32 h-0.5 mx-auto mt-4"
            style={{
              background:
                "linear-gradient(to right, transparent, #F6FBD6, transparent)",
            }}
          />
          <div
            className="xl:hidden w-32 h-0.5 mx-auto mt-4"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
        </div>

        {/* Main Content - Vertically Centered */}
        {/* Adjusts position to maintain centering at different zoom levels */}
        <div
          className="flex-1 flex items-center justify-center relative z-10 py-4 lg:py-8 xl:py-0"
          style={{
            paddingTop: "clamp(0.5rem, 1vh, 1rem)",
            paddingBottom: "clamp(0.5rem, 1vh, 1rem)",
          }}
        >
          <div className="container mx-auto max-w-7xl w-full lg:-mt-12 xl:-mt-36">
            {/* Mobile-First Responsive Grid */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-8 xl:gap-16 items-center">
              {/* Visual Element - Shows first on mobile for impact */}
              <div className="flex justify-center lg:justify-end order-1 lg:order-2 w-full">
                <div className="relative">
                  {/* Main image container with custom border radius */}
                  <div
                    className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-72 lg:h-72 xl:w-96 xl:h-96 overflow-hidden"
                    style={{
                      borderRadius: "0px 100px",
                      border: "2px solid #AE0000",
                    }}
                  >
                    {/* Image container */}
                    <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
                      {/* DA LUZ Main Image */}
                      <Image
                        src="/images/sobre-daluz/sobre-daluz-main.jpg"
                        alt="DA LUZ CONSCIENTE - Alkimyas para alma y cuerpo"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        className="object-cover"
                        style={{ borderRadius: "0px 100px" }}
                      />

                      {/* Fallback content when image is not available */}
                      <div
                        className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                        style={{ display: "none" }}
                      >
                        <div className="text-center space-y-3 lg:space-y-4 px-4">
                          <div className="w-16 h-16 lg:w-20 lg:h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Sparkles className="w-8 h-8 lg:w-10 lg:h-10 text-brand-primary animate-pulse" />
                          </div>
                          <div className="space-y-1 lg:space-y-2">
                            <div className="font-title text-lg lg:text-2xl text-brand-primary drop-shadow-sm">
                              Alkimya
                            </div>
                            <div className="font-title text-sm lg:text-lg text-brand-primary/80 drop-shadow-sm">
                              Consciente
                            </div>
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
                </div>
              </div>

              {/* Content - Shows second on mobile */}
              <div className="order-2 lg:order-1 w-full">
                {/* Content Card with mobile-optimized spacing */}
                <div className="rounded-2xl p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 text-left">
                  {/* Enhanced Content with mobile-friendly text sizing */}
                  <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-4 xl:space-y-6 text-sm sm:text-base md:text-base lg:text-base xl:text-lg leading-relaxed">
                    <p className="font-text text-gray-800">
                      Deseamos que experimentes la profunda conexión con tu Ser esencial.
                      La vida es tu mayor acto de creación:
                      te invitamos a un viaje donde tu cuerpo es el templo
                      y el Placer es el verdadero pase hacia tu Poder Creador
                    </p>
                  </div>

                  {/* Enhanced CTA with responsive sizing */}
                  <div className="pt-3 sm:pt-4 md:pt-5 lg:pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <Link href="/productos">
                      <Button className="group btn-enhanced px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 text-white font-semibold text-xs sm:text-sm md:text-sm lg:text-base xl:text-base w-full sm:w-auto">
                        VER PRODUCTOS
                      </Button>
                    </Link>
                    <Link href="/servicios/procesos">
                      <Button className="group btn-enhanced px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 text-white font-semibold text-xs sm:text-sm md:text-sm lg:text-base xl:text-base w-full sm:w-auto">
                        PROCESOS
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ALKIMYA DA LUZ: NEUROCOSMÉTICA SECTION */}
      {/* Section height adapts to SVG aspect ratio (1920.19 / 1080.18 ≈ 1.779) */}
      {/* Negative margin to ensure seamless connection with previous section */}
      <section
        className="relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-neurocosmetica"
        style={{
          minHeight: "550px", // Minimum height for mobile
          marginTop: "-4px", // Larger overlap to eliminate any visible line
        }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
          }}
        />

        {/* SVG Background - Desktop Only */}
        <div
          className="hidden xl:block absolute inset-0"
          style={{ aspectRatio: "1920.19 / 1080.18" }}
        >
          <AlkimyaNeurocosmeticaBackground
            bgColor="#F6FBD6" // Default theme background color
            waveColor="#AE0000" // Brand red wine color
            className="opacity-100"
          />
        </div>

        {/* Title Section - Positioned in upper wave area */}
        {/* Responsive padding that adjusts with zoom: smaller values keep title higher at higher zoom */}
        <div
          className="text-center relative z-10 flex-shrink-0"
          style={{
            paddingTop: "clamp(0.25rem, 1%, 1rem)",
            paddingBottom: "clamp(0.5rem, 1.5%, 1rem)",
          }}
        >
          <div className="lg:mb-4 xl:mb-0"></div>
          {/* Top gradient divider - Desktop shows #F6FBD6, Mobile shows #AE0000 */}
          <div
            className="hidden xl:block w-32 h-0.5 mx-auto mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #F6FBD6, transparent)",
            }}
          />
          <div
            className="xl:hidden w-32 h-0.5 mx-auto mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl 2xl:text-6xl leading-tight text-[#AE0000] xl:text-[#FFF4B3]">
            ALKIMYA DA LUZ
          </h2>
          <p className="font-subtitle text-base sm:text-lg md:text-xl lg:text-lg xl:text-2xl 2xl:text-2xl mt-[0.3rem] text-[#AE0000] xl:text-[#FFF4B3]">
            Neurocosmética que Transforma
          </p>
          {/* Bottom gradient divider - Desktop shows #F6FBD6, Mobile shows #AE0000 */}
          <div
            className="hidden xl:block w-32 h-0.5 mx-auto mt-4"
            style={{
              background:
                "linear-gradient(to right, transparent, #F6FBD6, transparent)",
            }}
          />
          <div
            className="xl:hidden w-32 h-0.5 mx-auto mt-4"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
        </div>

        {/* Main Content - Vertically Centered */}
        {/* Adjusts position to maintain centering at different zoom levels */}
        <div
          className="flex-1 flex items-center justify-center relative z-10 py-4 lg:py-8 xl:py-0"
          style={{
            paddingTop: "clamp(1.5rem, 3vh, 3rem)",
            paddingBottom: "clamp(0.5rem, 1vh, 1rem)",
          }}
        >
          <div className="container mx-auto max-w-4xl w-full lg:mt-0 xl:-mt-12">
            {/* Content */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-5 xl:space-y-8 text-center">
              {/* Main Description */}
              <div className="space-y-3 sm:space-y-4">
                <p
                  className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed"
                  style={{ color: "#1C1B1A" }}
                >
                  Una fusión entre saberes ancestrales y biotecnología consciente, creada para quienes buscan ir más allá de la cosmética convencional.

                </p>
                <p
                  className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed"
                  style={{ color: "#1C1B1A" }}
                >
                  Nuestra alquimia es una invitación a potenciar y honrar la
                  comunicación entre tu piel y tu mente, usando tus Sentidos
                  como un canal a tu favor.
                </p>
              </div>

              {/* Biotipo y Dosha Section */}
              <div className="space-y-3 sm:space-y-4 pt-3 sm:pt-4">
                <h3
                  className="font-title text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-3xl leading-tight"
                  style={{ color: "#AE0000" }}
                >
                  TU BIOTIPO Y DOSHA
                </h3>
                <p
                  className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed"
                  style={{ color: "#1C1B1A" }}
                >
                  Tu Alkimya Comienza con la Consciencia.
                </p>
                <p
                  className="font-text text-base sm:text-lg md:text-lg lg:text-base xl:text-xl leading-relaxed"
                  style={{ color: "#1C1B1A" }}
                >
                  ¿Sabés qué necesita realmente tu piel para alcanzar su
                  bioequilibrio?
                </p>
              </div>

              {/* CTA Button */}
              <div className="pt-4 sm:pt-5 md:pt-6">
                <Link href="/alkimya/biotipos-doshas">
                  <Button className="group btn-enhanced px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 lg:px-7 lg:py-3.5 xl:px-8 xl:py-4 text-white font-semibold text-xs sm:text-sm md:text-sm lg:text-base xl:text-base">
                    CONOCE TU BIOTIPO Y DOSHA
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CARRUSEL DE LÍNEAS */}
      <LineasCarousel />


      {/* VALOR Y CONFIANZA DA LUZ */}
      <section
        className="section-enhanced relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-valor-confianza"
        style={{
          minHeight: "400px",
          backgroundColor: "#F6FBD6",
          position: "relative",
          zIndex: 1,
          marginTop: "-4px", // Overlap to eliminate any visible line between sections
        }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
            zIndex: 0,
          }}
        />

        {/* Custom SVG Background - Desktop Only */}
        {/* SVG viewBox: 0 0 1920.07 1080.12 - Aspect ratio: 1920.07 / 1080.12 ≈ 1.777657 */}
        <div
          className="hidden xl:block absolute inset-0"
          style={{
            aspectRatio: "1920.07 / 1080.12",
            minHeight: "100%",
            zIndex: 0,
          }}
        >
          <ValorYConfianzaBackground
            bgColor="#F6FBD6" // Default theme background color
            waveColor="#AE0000" // Brand red wave
            className="opacity-100"
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 flex flex-col justify-center h-full py-12 pt-8 sm:pt-10 md:pt-12 lg:pt-6">
          {/* Title */}
          <div className="text-center mb-4 sm:mb-5 md:mb-6 lg:mb-8">
            {/* Top gradient divider */}
            <div
              className="w-32 h-0.5 mx-auto mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(to right, transparent, #AE0000, transparent)",
              }}
            />
            <h2
              className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-4 sm:mb-5 md:mb-6 leading-tight"
              style={{ color: "#AE0000" }}
            >
              VALOR Y CONFIANZA DA LUZ
            </h2>
            {/* Bottom gradient divider */}
            <div
              className="w-32 h-0.5 mx-auto mt-3 sm:mt-4"
              style={{
                background:
                  "linear-gradient(to right, transparent, #AE0000, transparent)",
              }}
            />
          </div>

          {/* Intro Text */}
          <div className="max-w-4xl mx-auto text-center px-4 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <p className="font-text text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl text-gray-800 leading-relaxed">
              Compromiso con la pureza y la eficacia biológica. También, un
              compromiso con tu Soberanía: te entregamos información y rituales
              para que seas la guía de tu propio proceso.
            </p>
          </div>

          {/* Features Grid - Text Only Cards - Taller and better spaced */}
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 lg:gap-7 xl:gap-8">
            <div className="card-enhanced border-0 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 text-center flex flex-col justify-between h-full">
              <div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-brand-primary mb-3 sm:mb-4">
                  TRANSPARENCIA TOTAL
                </h3>
                <p className="font-caption text-gray-600 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  Accede a toda la información sobre la materia prima que usamos
                  para nutrir tu piel.
                </p>
              </div>
              <Link href="/alkimya/activos-origen" className="w-full">
                <Button
                  variant="outline"
                  className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300"
                  style={{ borderRadius: "0px 15px" }}
                >
                  Ver más
                  <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            <div className="card-enhanced border-0 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 text-center flex flex-col justify-between h-full">
              <div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-brand-primary mb-3 sm:mb-4">
                  CEREMONIA DIARIA
                </h3>
                <p className="font-caption text-gray-600 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  Conoce los pasos y rituales para transformar tu rutina en un
                  verdadero acto de amor y presencia.
                </p>
              </div>
              <Link href="/alkimya/tu-ceremonia" className="w-full">
                <Button
                  variant="outline"
                  className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{ borderRadius: "0px 15px" }}
                >
                  Ver más
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            <div className="card-enhanced border-0 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 text-center flex flex-col justify-between h-full">
              <div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-brand-primary mb-3 sm:mb-4">
                  TESOROS DA LUZ
                </h3>
                <p className="font-caption text-gray-600 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  ¡Descubrí los regalos alkímicos a los que accederás con cada
                  una de tus compras!
                </p>
              </div>
              <Link href="/alkimya/tesoros-daluz" className="w-full">
                <Button
                  variant="outline"
                  className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{ borderRadius: "0px 15px" }}
                >
                  Ver más
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
            <div className="card-enhanced border-0 p-5 sm:p-6 md:p-7 lg:p-8 xl:p-10 text-center flex flex-col justify-between h-full">
              <div>
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-2xl text-brand-primary mb-3 sm:mb-4">
                  MANIFIESTO Y VISIÓN
                </h3>
                <p className="font-caption text-gray-600 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                  Conoce la filosofía en la que nos basamos para entregarte
                  productos expansivos y amorosos.
                </p>
              </div>
              <Link href="/alkimya" className="w-full">
                <Button
                  variant="outline"
                  className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 text-xs sm:text-sm md:text-sm lg:text-base"
                  style={{ borderRadius: "0px 15px" }}
                >
                  Ver más
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ SERVICIOS HOLÍSTICOS SECTION */}
      {/* Section height adapts to SVG aspect ratio (1920.23 / 1080.23 ≈ 1.777657) */}
      <section
        className="section-enhanced relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0 section-servicios"
        style={{
          minHeight: "400px", // Minimum height for mobile
          backgroundColor: "#F6FBD6",
          position: "relative",
          zIndex: 10,
          marginTop: "-4px", // Overlap to eliminate any visible line between sections
        }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
            zIndex: 0,
          }}
        />

        {/* Custom SVG Background - Desktop Only */}
        {/* SVG viewBox: 0 0 1920.23 1080.23 - Aspect ratio: 1920.23 / 1080.23 ≈ 1.777657 */}
        <div
          className="hidden xl:block absolute inset-0"
          style={{
            aspectRatio: "1920.23 / 1080.23",
            minHeight: "100%",
            zIndex: 0,
          }}
        >
          <ServiciosHolisticosBackground
            bgColor="#F6FBD6" // Default theme background color
            waveColor="#AE0000" // Brand red wave
            className="opacity-100"
          />
        </div>
        <div className="container mx-auto max-w-7xl relative z-20 flex flex-col justify-center h-full py-12 pt-16 sm:pt-20 md:pt-24 lg:pt-12 servicios-holisticos-container">
          {/* Centered Title */}
          <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12">
            {/* Top gradient divider */}
            <div
              className="xl:hidden w-32 h-0.5 mx-auto mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(to right, transparent, #AE0000, transparent)",
              }}
            />
            <div
              className="hidden xl:block w-32 h-0.5 mx-auto mb-4 sm:mb-5"
              style={{
                background:
                  "linear-gradient(to right, transparent, #FFF4B3, transparent)",
              }}
            />
            <h2 className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-3 sm:mb-4 leading-tight text-[#AE0000] xl:text-[#FFF4B3]">
              SERVICIOS HOLÍSTICOS
            </h2>
            {/* Bottom gradient divider */}
            <div
              className="xl:hidden w-32 h-0.5 mx-auto mt-3 sm:mt-4"
              style={{
                background:
                  "linear-gradient(to right, transparent, #AE0000, transparent)",
              }}
            />
            <div
              className="hidden xl:block w-32 h-0.5 mx-auto mt-3 sm:mt-4"
              style={{
                background:
                  "linear-gradient(to right, transparent, #FFF4B3, transparent)",
              }}
            />
          </div>
          {/* Enhanced Service Cards with Your Custom SVG Icons */}
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 pt-6 sm:pt-8 md:pt-10 lg:pt-12">
            {/* PROCESOS INTEGRATIVOS */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col">
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-brand-primary transition-all duration-300 mx-auto">
                  <ProcesosIntegrativosIcon
                    size={48}
                    className="sm:w-14 sm:h-14 md:w-16 md:h-16"
                  />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Procesos Cíclicos
                </h3>

                {/* Description */}
                <div className="font-text text-gray-600 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed group-hover:text-gray-700 transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>
                    Programas cíclicos para que te re-conectes con tu
                    naturaleza.
                  </p>
                  <p>
                    Aprendé a escuchar tu cuerpo y a crear mayor consciencia
                    sobre tus acciones.
                  </p>
                  <p>
                    Explorá ejercicios reflexivos, corporales y energéticos para
                    reprogramarte y sentir tu poder creador.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/servicios/procesos/ciclos-alquimicos" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px" }}
                    >
                      <span className="text-center text-sm leading-tight flex-1">
                        EXPLORAR LOS PROCESOS DE TRANSFORMACIÓN
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* SESIONES HOLÍSTICAS PARA TU BIENESTAR */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col">
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-brand-primary transition-all duration-300 mx-auto">
                  <SesionesIcon
                    size={48}
                    className="sm:w-14 sm:h-14 md:w-16 md:h-16"
                  />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Sesiones Integrales
                </h3>

                {/* Description */}
                <div className="font-text text-gray-600 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed group-hover:text-gray-700 transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>3 propuestas para potenciar tu claridad y armonía.</p>
                  <p>
                    Conectá con el aquí y ahora. Utilizamos herramientas
                    ancestrales como Reiki Usui y Karuna, Cuencos Sonoros,
                    Aromaterapia, Flores de Bach y más.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/servicios/procesos/sesiones-integrales" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px" }}
                    >
                      <span className="text-center text-sm leading-tight flex-1">
                        ¡CONOCE NUESTRAS PROPUESTAS!
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* MEMBRESÍA: TU ESPACIO DE CRECIMIENTO */}
            <div className="group card-enhanced p-5 sm:p-6 md:p-7 lg:p-8 text-center flex flex-col">
              <div className="relative z-10 space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col">
                {/* Your Custom SVG Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 text-brand-primary transition-all duration-300 mx-auto">
                  <MembresiaIcon
                    size={48}
                    className="sm:w-14 sm:h-14 md:w-16 md:h-16"
                  />
                </div>

                {/* Title */}
                <h3 className="font-subtitle text-lg sm:text-xl md:text-xl lg:text-xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Experiencias: Programas y Membresías
                </h3>

                {/* Description */}
                <div className="font-text text-gray-600 text-sm sm:text-sm md:text-[0.95rem] text-left leading-relaxed group-hover:text-gray-700 transition-colors duration-300 space-y-2 sm:space-y-3 flex-1">
                  <p>
                    Un espacio para introducirte en el mundo de Da Luz, con
                    videos, meditaciones, ejercicios y biblioteca virtual.
                  </p>
                </div>

                {/* CTA */}
                <div className="flex justify-center mt-6 w-full">
                  <Link href="/programa-transformacion" className="w-full">
                    <Button
                      variant="outline"
                      className="group/btn w-full text-brand-primary hover:text-white hover:bg-brand-primary transition-all duration-300 whitespace-normal break-words h-auto py-2 px-4 flex items-center justify-center gap-2"
                      style={{ borderRadius: "0px 15px" }}
                    >
                      <span className="text-center text-sm leading-tight flex-1">
                        SÉ PARTE DEL RITUAL
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300 flex-shrink-0" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED PHILOSOPHY SECTION */}
      <section
        className="section-enhanced relative py-6 md:py-8 lg:py-16 px-6 overflow-hidden"
        style={{ marginTop: "-3rem" }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #AE0000 0%, rgba(174, 0, 0, 0.9) 25%, #AE0000 50%, rgba(174, 0, 0, 0.95) 75%, #AE0000 100%)",
          }}
        />

        {/* Custom SVG Background - Desktop Only */}
        <div className="hidden xl:block absolute inset-0">
          <NuestraFilosofiaBackground
            bgColor="#AE0000" // Brand red wine background
            className="opacity-100"
          />
        </div>

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[6rem] relative z-20">
          {/* Top gradient divider */}
          <div
            className="w-32 h-0.5 mx-auto mb-4 sm:mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #FFF4B3, transparent)",
            }}
          />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-4 sm:mb-5 md:mb-6 leading-tight"
            style={{ color: "#F0EACE" }}
          >
            HONRAMOS NUESTRAS RAÍCES
          </h2>
          {/* bottom gradient divider */}
          <div
            className="w-32 h-0.5 mx-auto mt-4 sm:mt-5 mb-4 sm:mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #FFF4B3, transparent)",
            }}
          />

          <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed px-4">
            Descubrí la visión integral que impulsa a Da Luz y la historia
            detrás de nuestra filosofía: Viví en Presencia, Creá con Placer,
            Honrá tus Raíces.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20">
          {/* Enhanced Philosophy Cards */}
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 mt-[-2rem]">
            {[
              {
                title: "Naturaleza y Ancestralidad",
                description: (
                  <>
                    <p>
                      Vivimos y creamos en armonía con la Madre Tierra,
                      respetando toda forma de vida.
                    </p>
                    <p>
                      Conectamos con la sabiduría de las hierbas medicinales y
                      las técnicas ancestrales para potenciar tu bienestar en
                      resonancia con el ritmo natural de tu Ser.
                    </p>
                    <p>
                      Te invitamos a Reconocer tus raíces, y a semillar con
                      intención para nutrir tus frutos.
                    </p>
                  </>
                ),
                icon: <AncestralidadNaturalezaIcon size={50} className="" />,
              },
              {
                title: "Visión Integral y Autogestión",
                description: (
                  <>
                    <p>
                      Abrazamos una Visión Integral del bienestar que abarca tu
                      ser físico, emocional, mental y energético.
                    </p>
                    <p>
                      Todas nuestras propuestas son creadas con conciencia de
                      las diversas bio-individualidades.
                    </p>
                    <p>
                      Conectá con la autogestión de tu Ser integral eligiendo
                      conscientemente a qué destinar energía y atención,
                      priorizando tus verdaderas necesidades y deseos.
                    </p>
                  </>
                ),
                icon: <VisionIntegralIcon size={50} className="" />,
              },
              {
                title: "Ceremonia y Presencia",
                description: (
                  <>
                    <p>
                      Creemos que vivir cada día como una nueva ceremonia nos
                      recuerda lo valioso y sagrado que es Ser y habitar la
                      Tierra.
                    </p>
                    <p>
                      Da Luz es un llamado a la presencia; para que re-conozcas
                      tus cuerpos y experimentes tus sentidos y sentires de
                      manera consciente.
                    </p>
                    <p>
                      Regalate tiempo de calidad para crear tu hogar, mirarte y
                      conectar con tu propia Alquimia Viva.
                    </p>
                  </>
                ),
                icon: <CeremoniaPresenciaIcon size={50} className="" />,
              },
              {
                title: "Placer y Creación Consciente",
                description: (
                  <>
                    <p>Crear desde el Placer es nuestro mantra.</p>
                    <p>
                      Creemos que la forma más expansiva de vincularte con tus
                      cuerpos y procesos es dándote tiempo para explorar con tus
                      propios recursos —tu voz, tu cuerpo, tus sentidos— desde
                      el goce.
                    </p>
                    <p>
                      Nuestro propósito es que re-conectes con tu Sacralidad: el
                      verdadero pase hacia tu poder Creador.
                    </p>
                  </>
                ),
                icon: <PlacerCreatividadIcon size={50} className="" />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group glass-card p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:bg-white/30 transition-colors duration-300 text-white">
                    {item.icon}
                  </div>
                  <h3 className="font-subtitle text-lg sm:text-xl md:text-xl text-white group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <div className="font-caption text-white/80 text-xs sm:text-sm md:text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300 space-y-2">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED BLOG DE LA COMUNIDAD Section - Bento Grid Design */}
      <section
        className="relative px-6 overflow-hidden flex flex-col py-12 md:py-16 lg:py-0"
        style={{
          minHeight: "400px",
          backgroundColor: "#F0EACE",
          position: "relative",
        }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
          }}
        />

        {/* Custom SVG Background - Bottom edge wave only - Desktop Only */}
        <div
          className="hidden xl:block absolute inset-0"
          style={{ minHeight: "1080px", height: "1080px" }}
        >
          <BlogBackground
            bgColor="#F0EACE" // Default theme background color
            waveColor="#AE0000" // Brand red wave
            className="opacity-100"
          />
        </div>

        {/* Centered Title */}
        <div className="container mx-auto max-w-7xl text-center relative z-20 py-12">
          {/* Top gradient divider */}
          <div
            className="w-32 h-0.5 mx-auto mb-5"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-6xl mb-3 sm:mb-4 leading-tight"
            style={{ color: "#AE0000" }}
          >
            BLOG DA LUZ
          </h2>
          {/* bottom gradient divider */}
          <div
            className="w-32 h-0.5 mx-auto mt-3 sm:mt-4 mb-4 sm:mb-5 md:mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <p className="text-base sm:text-lg md:text-lg lg:text-xl xl:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed px-4">
            Un espacio donde fusionamos teorías, reflexión e introspección con herramientas para la autogestión y la presencia.
          </p>
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 pb-12">
          {/* Enhanced Bento Grid Layout for Blog Posts - Left/Right Mirror Design */}
          {featuredPosts.length > 0 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* LEFT SIDE */}
              <div className="space-y-6 lg:mr-[5rem]">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
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
                                alt={
                                  featuredPosts[0].mainImage.alt ||
                                  featuredPosts[0].title
                                }
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
                              <Badge
                                className="bg-white/20 border-white/30 mb-2 text-[#AE0000] hover:bg-[#AE0000] hover:text-[#F0EACE]"
                                variant="default"
                              >
                                Post
                              </Badge>
                              <h3 className="font-subtitle text-lg text-[#AE0000] group-hover:text-[#AE0000]/75 transition-colors duration-300 line-clamp-3 mb-2">
                                {featuredPosts[0].title}
                              </h3>
                              <p className="font-text text-[#AE0000]/80 text-sm leading-relaxed group-hover:text-[#AE0000]/90 transition-colors duration-300 line-clamp-2">
                                {featuredPosts[0].excerpt ||
                                  "Descubre más sobre este fascinante tema..."}
                              </p>
                            </div>
                            <div className="flex items-center text-[#AE0000]/60 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                featuredPosts[0].publishedAt,
                              ).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
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
                              alt={
                                featuredPosts[2].mainImage.alt ||
                                featuredPosts[2].title
                              }
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
                          {new Date(
                            featuredPosts[2].publishedAt,
                          ).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
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
                              alt={
                                featuredPosts[3].mainImage.alt ||
                                featuredPosts[3].title
                              }
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
                          {new Date(
                            featuredPosts[3].publishedAt,
                          ).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Mirror of Left */}
              <div className="space-y-6 lg:ml-[5rem]">
                <div className="grid grid-cols-2 grid-rows-2 gap-3 sm:gap-4">
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
                              alt={
                                featuredPosts[0].mainImage.alt ||
                                featuredPosts[0].title
                              }
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-[#AE0000] xl:text-white group-hover:text-[#AE0000]/75 xl:group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[0].title}
                        </h4>
                        <div className="flex items-center text-[#AE0000]/60 xl:text-white/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(
                            featuredPosts[0].publishedAt,
                          ).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
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
                              alt={
                                featuredPosts[1].mainImage.alt ||
                                featuredPosts[1].title
                              }
                              fill
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <Leaf className="w-6 h-6 text-white/50" />
                          )}
                        </div>
                        <h4 className="font-subtitle text-sm text-[#AE0000] xl:text-white group-hover:text-[#AE0000]/75 xl:group-hover:text-white/90 transition-colors duration-300 line-clamp-2 mb-2">
                          {featuredPosts[1].title}
                        </h4>
                        <div className="flex items-center text-[#AE0000]/60 xl:text-white/60 text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(
                            featuredPosts[1].publishedAt,
                          ).toLocaleDateString("es-ES", {
                            month: "short",
                            day: "numeric",
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
                              <Badge className="bg-white/20 text-[#AE0000] xl:text-white border-white/30 mb-2 hover:bg-[#AE0000] xl:hover:bg-[#AE0000] hover:text-[#F0EACE] xl:hover:text-[#F0EACE]">
                                Post
                              </Badge>
                              <h3 className="font-subtitle text-lg text-[#AE0000] xl:text-white group-hover:text-[#AE0000]/75 xl:group-hover:text-white/90 transition-colors duration-300 line-clamp-3 mb-2">
                                {featuredPosts[1].title}
                              </h3>
                              <p className="font-text text-[#AE0000]/80 xl:text-white/80 text-sm leading-relaxed group-hover:text-[#AE0000]/90 xl:group-hover:text-white/90 transition-colors duration-300 line-clamp-2">
                                {featuredPosts[1].excerpt ||
                                  "Explora este contenido fascinante..."}
                              </p>
                            </div>
                            <div className="flex items-center text-[#AE0000]/60 xl:text-white/60 text-xs">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(
                                featuredPosts[1].publishedAt,
                              ).toLocaleDateString("es-ES", {
                                month: "short",
                                day: "numeric",
                              })}
                            </div>
                          </div>

                          {/* Image Section */}
                          <div className="bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300 overflow-hidden relative">
                            {featuredPosts[1].mainImage?.asset?.url ? (
                              <Image
                                src={featuredPosts[1].mainImage.asset.url}
                                alt={
                                  featuredPosts[1].mainImage.alt ||
                                  featuredPosts[1].title
                                }
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
                  Descubre cómo nuestros ancestros utilizaban las plantas para
                  la sanación y cómo estos conocimientos ancestrales se aplican
                  en nuestros productos modernos.
                </p>
              </div>

              {/* Smaller Cards */}
              {[
                {
                  title: "Rituales de Belleza Consciente",
                  excerpt:
                    "Transforma tu rutina de cuidado personal en un acto sagrado de conexión contigo mismo.",
                },
                {
                  title: "El Poder de los Chakras",
                  excerpt:
                    "Aprende a equilibrar tu energía mientras cuidas tu piel con nuestras técnicas holísticas.",
                },
                {
                  title: "Meditación y Belleza Interior",
                  excerpt:
                    "Descubre cómo la práctica contemplativa transforma tu ser desde adentro hacia afuera.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="glass-card p-6 rounded-2xl border border-white/20"
                >
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

          {/* Enhanced CTA - Blog button with BookOpen icon */}
          <div className="flex flex-col items-center gap-4 mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-3 px-6 py-3 sm:px-8 sm:py-4 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-title uppercase tracking-wider transition-all duration-300"
              style={{ borderRadius: "0 15px" }}
              aria-label="Ir al blog"
            >
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm sm:text-base">Ir al blog</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED GALERÍA Section - Rolling Gallery Carousel */}
      <section className="section-enhanced relative py-12 md:py-16 lg:py-24 px-6 overflow-hidden">
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
          }}
        />

        {/* Custom SVG Background - Desktop Only */}
        <div className="hidden xl:block absolute inset-0">
          <GaleriaBackground
            bgColor="#F0EACE" // Cream background
            waveColor="#F0EACE" // Brand red wave
            className="opacity-95"
          />
        </div>

        {/* Centered Title */}
        <div className="text-center pb-5 mt-[-2rem] mb-[3rem] relative z-20 px-4">
          {/* Top gradient divider */}
          <div
            className="w-24 sm:w-32 h-0.5 mx-auto mb-3"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3 leading-tight"
            style={{ color: "#AE0000" }}
          >
            GALERÍA
          </h2>
          {/* bottom gradient divider */}
          <div
            className="w-24 sm:w-32 h-0.5 mx-auto mt-3 mb-3"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-16">
          {/* Enhanced Interactive Gallery Carousel */}
          <InteractiveGallery />
          {/* Enhanced CTA */}
          <div className="text-center mt-16">
            <div className="space-y-4">
              <h3 className="font-subtitle text-2xl text-brand-primary">
                FRAGMENTOS DE UN RITUAL VIVO
              </h3>
              <p className="font-text max-w-2xl mx-auto text-brand-primary">
                Cada imagen cuenta una historia de transformación, belleza
                consciente y conexión con la naturaleza.
              </p>
              <a
                href="https://instagram.com/daluzconsciente"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="group btn-enhanced px-8 py-4 text-lg text-white font-semibold rounded-full">
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Seguinos en Instagram
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED CONTACTO Section */}
      <section
        className="section-enhanced relative py-6 md:py-8 lg:py-16 px-6 overflow-hidden"
        style={{ marginTop: "-3rem" }}
      >
        {/* Mobile/Tablet Gradient Background */}
        <div
          className="absolute inset-0 xl:hidden"
          style={{
            background:
              "linear-gradient(135deg, #F0EACE 0%, #F6FBD6 25%, #F0EACE 50%, rgba(174, 0, 0, 0.15) 75%, #F0EACE 100%)",
          }}
        />

        {/* Custom SVG Background - Desktop Only */}
        <div className="hidden xl:block absolute inset-0">
          <ContactoBackground
            bgColor="#F0EACE" // Cream background
            waveColor="#AE0000" // Brand red wave
            className="opacity-95"
          />
        </div>

        {/* Centered Title */}
        <div className="container mx-auto max-w-7xl text-left pb-[3rem] sm:pb-[5rem] mt-[0rem] mb-[0rem] relative z-20 px-4">
          {/* Top gradient divider */}
          <div
            className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mb-2"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
          <h2
            className="font-title text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-6xl leading-tight"
            style={{ color: "#AE0000" }}
          >
            CONTACTO
          </h2>
          {/* bottom gradient divider */}
          <div
            className="w-24 sm:w-32 h-0.5 mx-4 sm:mx-10 mt-2"
            style={{
              background:
                "linear-gradient(to right, transparent, #AE0000, transparent)",
            }}
          />
        </div>

        <div className="container mx-auto max-w-7xl relative z-20 px-4">
          <p
            className="text-xl sm:text-2xl lg:text-3xl italic max-w-3xl mx-auto leading-relaxed text-center text-[#AE0000] xl:text-[#F0EACE]"
            style={{
              fontFamily:
                "var(--font-playfair), 'Playfair Display', Georgia, serif",
            }}
          >
            Iniciá tu transformación: enviame tu consulta
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 pt-[3rem] lg:pt-[4rem] xl:pt-[5rem] gap-8 lg:gap-8 xl:gap-16 items-center">
            {/* Enhanced Contact Form */}
            <div className="space-y-8 order-2 lg:order-1">
              <ContactForm />
            </div>

            {/* Enhanced Visual Element with Custom Border Radius Contact Image */}
            <div className="flex items-center justify-center lg:justify-end order-1 lg:order-2 mb-8 lg:mb-0">
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-md xl:max-w-lg h-[300px] sm:h-[400px] lg:h-[400px] xl:h-[500px] lg:mr-[-2rem] xl:mr-[-5rem]">
                {/* Custom Border Radius Image Container */}
                <div
                  className="w-full h-full shadow-2xl relative overflow-hidden"
                  style={{
                    borderRadius: "0px 100px",
                    background:
                      "linear-gradient(135deg, rgba(174, 0, 0, 0.1) 0%, rgba(240, 234, 206, 0.1) 100%)",
                    border: "2px solid #F0EACE",
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
                      borderRadius: "0px 100px",
                    }}
                  />

                  {/* Fallback content when contact image is not available */}
                  <div
                    className="absolute inset-0 w-full h-full hidden items-center justify-center bg-gradient-to-br from-brand-primary/30 to-brand-secondary/20"
                    style={{ display: "none" }}
                  >
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-12 h-12 opacity-80" />
                      </div>
                      <h3 className="font-title text-2xl mb-4">
                        Imagen de Contacto
                      </h3>
                      <p className="font-caption opacity-80">
                        Lugar para tu imagen
                        <br />
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
  );
}
