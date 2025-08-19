import Link from "next/link";
import { client, queries } from "@/lib/sanity/client";
import BlogCard from "@/components/ui/brand/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Sparkles, Leaf, Heart, Star, Users, Zap } from "lucide-react";
import { 
  AnimatedBackground, 
  WaveDivider, 
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
    const allPosts = await client.fetch(queries.allPosts);
    // Get featured posts, limit to 3 for homepage
    const featuredPosts = allPosts.filter((post: BlogPost) => post.featured).slice(0, 3);
    return featuredPosts || [];
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
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          {/* Enhanced Logo with Animation */}
          <div className="space-y-6 mb-12">
            <div className="relative">
              <div className="hero-logo-text font-malisha text-6xl md:text-8xl lg:text-9xl font-bold leading-none tracking-wider drop-shadow-2xl">
                <span className="inline-block transform hover:scale-105 transition-transform duration-700">
                  DA LUZ
                </span>
              </div>
              <div className="hero-logo-text font-malisha text-4xl md:text-6xl lg:text-7xl font-bold leading-none tracking-wider drop-shadow-2xl mt-2">
                <span className="inline-block transform hover:scale-105 transition-transform duration-700 delay-100">
                  CONSCIENTE
                </span>
              </div>
            </div>
            
            {/* Enhanced Tagline */}
            <div className="relative">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mb-6" />
              <div className="font-velista text-xl md:text-2xl opacity-95 max-w-2xl mx-auto leading-relaxed tracking-wide">
                Alkimyas para alma y cuerpo
              </div>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-6" />
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
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✨ ENHANCED ABOUT SECTION */}
      <section className="section-enhanced relative py-24 px-6 bg-gradient-to-br from-bg-cream via-bg-light to-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #AE0000 2px, transparent 2px), radial-gradient(circle at 80% 50%, #AE0000 2px, transparent 2px)`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Enhanced Section Header */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-brand-primary to-transparent" />
                  <Badge variant="outline" className="border-brand-primary/20 text-brand-primary px-4 py-1">
                    Nuestra Esencia
                  </Badge>
                </div>
                <h2 className="text-enhanced-heading font-velista text-5xl md:text-6xl leading-tight">
                  SOBRE DA LUZ
                </h2>
              </div>
              
              {/* Enhanced Content */}
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p className="text-xl font-medium text-gray-800 leading-relaxed">
                  DA LUZ CONSCIENTE nace de la profunda conexión entre la sabiduría ancestral 
                  y la ciencia moderna, creando puentes entre el alma y el cuerpo a través 
                  de alkimyas transformadoras.
                </p>
                <p className="leading-loose">
                  Trabajamos con productores cuidadosamente seleccionados, honrando los 
                  ciclos naturales y presentando nuestros productos en recipientes 
                  personalizados de cerámica y vidrio que celebran la belleza de lo artesanal.
                </p>
                <p className="leading-loose">
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
                        <div className="font-velista text-2xl text-brand-primary">Alkimya</div>
                        <div className="font-velista text-lg text-brand-primary/70">Consciente</div>
                        <div className="w-16 h-0.5 bg-brand-primary/30 mx-auto my-4" />
                        <div className="text-sm text-gray-600 space-y-1">
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

      {/* Wave Divider */}
      <WaveDivider fromColor="#ffffff" toColor="#ffffff" />

      {/* ✨ ENHANCED SERVICES SECTION */}
      <section className="section-enhanced relative py-24 px-6 bg-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(90deg, #AE0000 1px, transparent 1px), linear-gradient(0deg, #AE0000 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Enhanced Section Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-brand-primary" />
              <Badge variant="outline" className="border-brand-primary/20 text-brand-primary px-6 py-2">
                Nuestros Servicios
              </Badge>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-brand-primary" />
            </div>
            <h2 className="text-enhanced-heading font-velista text-5xl md:text-6xl mb-6 leading-tight">
              NUESTROS SERVICIOS
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Descubre nuestras modalidades de acompañamiento holístico, diseñadas para tu transformación integral
            </p>
          </div>

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
                <h3 className="font-velista text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Biología De Luz
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
                <h3 className="font-velista text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
                  Sesiones
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
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
                <h3 className="font-velista text-2xl text-brand-primary group-hover:text-brand-secondary transition-colors duration-300">
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

      {/* Wave Divider */}
      <WaveDivider fromColor="#ffffff" toColor="#AE0000" />

      {/* ✨ ENHANCED PHILOSOPHY SECTION */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#AE0000' }}>
        {/* Enhanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-primary opacity-90" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px), radial-gradient(circle at 75% 75%, white 2px, transparent 2px)`,
              backgroundSize: '80px 80px'
            }} />
          </div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-white/60" />
              <Badge variant="outline" className="border-white/30 text-white px-6 py-2 glass-card">
                Nuestra Filosofía
              </Badge>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-white/60" />
            </div>
            <h2 className="font-velista text-5xl md:text-6xl text-white mb-6 leading-tight">
              NUESTRA FILOSOFÍA
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Los valores fundamentales que guían cada aspecto de nuestro trabajo consciente
            </p>
          </div>

          {/* Enhanced Philosophy Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                  <h3 className="font-velista text-xl text-white group-hover:text-white/90 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fromColor="#AE0000" toColor="#F0EACE" />

      {/* ✨ ENHANCED PRODUCT LINES SECTIONS */}
      {/* ALKIMYA DA LUZ */}
      <section className="section-enhanced relative py-24 px-6 overflow-hidden" style={{ backgroundColor: '#F0EACE' }}>
        {/* Background Texture */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23AE0000' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            {/* Enhanced Header */}
            <div className="space-y-6 mb-16">
              <Badge variant="outline" className="border-brand-primary/30 text-brand-primary px-6 py-2">
                Biocosmética Artesanal
              </Badge>
              <h2 className="text-enhanced-heading font-velista text-5xl md:text-6xl leading-tight">
                ALKIMYA DA LUZ
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent mx-auto" />
            </div>
            
            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-2xl text-gray-800 max-w-4xl mx-auto leading-relaxed font-light">
                Cosméticos botánicos artesanales presentados en recipientes personalizados 
                de cerámica y vidrio, con productores cuidadosamente seleccionados.
              </p>
              
              {/* Features Grid */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
                <div className="card-enhanced p-6 text-center">
                  <Leaf className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-brand-primary mb-2">Ingredientes Naturales</h3>
                  <p className="text-gray-600 text-sm">Cuidadosamente seleccionados</p>
                </div>
                <div className="card-enhanced p-6 text-center">
                  <Sparkles className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-brand-primary mb-2">Proceso Artesanal</h3>
                  <p className="text-gray-600 text-sm">Elaborado con dedicación</p>
                </div>
                <div className="card-enhanced p-6 text-center">
                  <Heart className="w-12 h-12 text-brand-primary mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-brand-primary mb-2">Recipientes Únicos</h3>
                  <p className="text-gray-600 text-sm">Cerámica personalizada</p>
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
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fromColor="#F0EACE" toColor="#12406F" />

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
              <Badge variant="outline" className="border-white/30 text-white px-6 py-2 glass-card">
                Ritmos Oceánicos
              </Badge>
              <h2 className="font-velista text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
                LÍNEA ECOS
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
            </div>
            
            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Ritmos naturales que conectan con la fluidez del agua y los ciclos oceánicos, 
                productos que honran la pureza y el movimiento constante de la vida.
              </p>
              
              {/* Ocean Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
                <div className="glass-card p-6 text-center border border-white/20">
                  <div className="w-12 h-12 text-white mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="font-velista text-lg text-white mb-2">Pureza</h3>
                  <p className="text-white/80 text-sm">Cristalina como el agua</p>
                </div>
                <div className="glass-card p-6 text-center border border-white/20">
                  <div className="w-12 h-12 text-white mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                  <h3 className="font-velista text-lg text-white mb-2">Fluidez</h3>
                  <p className="text-white/80 text-sm">Movimiento constante</p>
                </div>
                <div className="glass-card p-6 text-center border border-white/20">
                  <Users className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-white mb-2">Ciclos</h3>
                  <p className="text-white/80 text-sm">Ritmos oceánicos</p>
                </div>
              </div>
              
              {/* Enhanced CTA */}
              <div className="pt-8">
                <Button className="group glass-card px-12 py-4 text-lg text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white hover:text-blue-900 transition-all duration-500">
                  <Heart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Descubre Ecos
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wave Divider */}
      <WaveDivider fromColor="#12406F" toColor="#EA4F12" />

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
              <Badge variant="outline" className="border-white/30 text-white px-6 py-2 glass-card">
                Fuego Sagrado
              </Badge>
              <h2 className="font-velista text-5xl md:text-6xl text-white leading-tight drop-shadow-2xl">
                LÍNEA UMBRAL
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto" />
            </div>
            
            {/* Enhanced Content */}
            <div className="space-y-8">
              <p className="text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg">
                Transformación interior a través del fuego sagrado, productos que facilitan 
                procesos profundos de cambio y renovación personal.
              </p>
              
              {/* Fire Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
                <div className="glass-card p-6 text-center border border-white/20">
                  <Zap className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-white mb-2">Transformación</h3>
                  <p className="text-white/80 text-sm">Interior profunda</p>
                </div>
                <div className="glass-card p-6 text-center border border-white/20">
                  <Star className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-white mb-2">Fuego Sagrado</h3>
                  <p className="text-white/80 text-sm">Energía renovadora</p>
                </div>
                <div className="glass-card p-6 text-center border border-white/20">
                  <Heart className="w-12 h-12 text-white mx-auto mb-4" />
                  <h3 className="font-velista text-lg text-white mb-2">Renovación</h3>
                  <p className="text-white/80 text-sm">Personal y profunda</p>
                </div>
              </div>
              
              {/* Enhanced CTA */}
              <div className="pt-8">
                <Button className="group glass-card px-12 py-4 text-lg text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white hover:text-orange-900 transition-all duration-500">
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                  Explora Umbral
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </div>
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
          <h2 className="font-velista text-4xl md:text-5xl text-white mb-8 drop-shadow-lg">
            LÍNEA JADE RITUAL
          </h2>
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
          <h2 className="font-velista text-4xl md:text-5xl text-white mb-8 drop-shadow-lg">
            LÍNEA UTÓPICA
          </h2>
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
          <h2 className="font-velista text-4xl md:text-5xl text-white mb-8 drop-shadow-lg">
            LÍNEA ALMA TERRA
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Conexión profunda con la tierra madre, brumas aromáticas y pociones 
            de aromaterapia que nutren el alma.
          </p>
        </div>
      </section>

      {/* PROCESOS Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-velista text-4xl md:text-5xl text-brand-primary mb-8">
                PROCESOS
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
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
                    <div className="font-velista text-2xl text-brand-primary mb-2">Proceso</div>
                    <div className="font-velista text-lg text-brand-primary/70">Integral</div>
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
      <section className="py-20 px-6 bg-cream">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="font-velista text-4xl md:text-5xl text-brand-primary mb-12">
            SESIONES
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <p className="text-xl leading-relaxed text-gray-700">
              Nuestras sesiones individuales están diseñadas para crear un espacio sagrado 
              de encuentro contigo mismo, donde puedas explorar, sanar y expandir tu consciencia 
              en un ambiente de total confianza y respeto.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
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

      {/* BLOG DE LA COMUNIDAD Section - Redesigned to match reference */}
      <section className="py-20 px-6" style={{ backgroundColor: '#AE0000' }}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-velista text-4xl md:text-5xl text-white text-center mb-16">
            BLOG DE LA COMUNIDAD
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* SABIDURÍA 1 Category */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="font-velista text-2xl text-brand-primary mb-4">SABIDURÍA 1</h3>
                <div className="w-16 h-0.5 bg-brand-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Conocimiento Ancestral y Biocosmética Natural</p>
              </div>
              
              {featuredPosts.length > 0 ? (
                <div className="space-y-4">
                  {featuredPosts.slice(0, 2).map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`} className="block">
                      <div className="border-l-4 border-brand-primary pl-4 py-2 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-800 mb-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.excerpt || "Descubre más sobre sabiduría ancestral..."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-gray-600">
                  <div className="border-l-4 border-brand-primary pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">Los Secretos de la Alkimia Botánica</h4>
                    <p className="text-sm">Descubre cómo nuestros ancestros utilizaban las plantas para la sanación...</p>
                  </div>
                  <div className="border-l-4 border-brand-primary pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">Rituales de Belleza Consciente</h4>
                    <p className="text-sm">Transforma tu rutina de cuidado personal en un acto sagrado...</p>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-6">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-brand-primary font-semibold hover:underline"
                >
                  Ver más artículos →
                </Link>
              </div>
            </div>

            {/* SABIDURÍA 2 Category */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <div className="text-center mb-6">
                <h3 className="font-velista text-2xl text-brand-primary mb-4">SABIDURÍA 2</h3>
                <div className="w-16 h-0.5 bg-brand-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Transformación Personal y Bienestar Holístico</p>
              </div>
              
              {featuredPosts.length > 0 ? (
                <div className="space-y-4">
                  {featuredPosts.slice(2, 4).map((post) => (
                    <Link key={post._id} href={`/blog/${post.slug.current}`} className="block">
                      <div className="border-l-4 border-brand-primary pl-4 py-2 hover:bg-gray-50 transition-colors">
                        <h4 className="font-semibold text-gray-800 mb-1">{post.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {post.excerpt || "Explora herramientas de transformación..."}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 text-gray-600">
                  <div className="border-l-4 border-brand-primary pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">El Poder de los Chakras en el Cuidado Personal</h4>
                    <p className="text-sm">Aprende a equilibrar tu energía mientras cuidas tu piel...</p>
                  </div>
                  <div className="border-l-4 border-brand-primary pl-4 py-2">
                    <h4 className="font-semibold text-gray-800 mb-1">Meditación y Belleza Interior</h4>
                    <p className="text-sm">Descubre cómo la práctica contemplativa transforma tu ser...</p>
                  </div>
                </div>
              )}
              
              <div className="text-center mt-6">
                <Link 
                  href="/blog" 
                  className="inline-flex items-center text-brand-primary font-semibold hover:underline"
                >
                  Ver más contenido →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#AE0000' }}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-velista text-4xl md:text-5xl text-white text-center mb-16">
            GALERÍA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
                <div className="bg-white/20 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-velista text-xl">IMAGEN {i}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-cream">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-velista text-4xl md:text-5xl text-brand-primary text-center mb-16">
            PONTE EN CONTACTO
          </h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <textarea rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
              <Button 
                className="w-full py-3 text-lg font-semibold"
                style={{ backgroundColor: '#AE0000', color: 'white' }}
              >
                Enviar Mensaje
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div 
                className="w-full h-80 rounded-lg bg-cover bg-center shadow-lg"
                style={{ 
                  backgroundImage: "url('/images/hero-botanical-background.jpg')",
                  filter: "brightness(0.9) saturate(1.1)"
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 