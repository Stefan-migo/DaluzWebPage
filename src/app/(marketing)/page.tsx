import Link from "next/link";
import { client, queries } from "@/lib/sanity/client";
import BlogCard from "@/components/ui/brand/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight } from "lucide-react";

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
    <div className="min-h-screen">
      {/* Hero Section - Green foliage background with logo overlay */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image - Your botanical hero image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/hero-botanical-background.jpg')",
            filter: "brightness(0.7) saturate(1.2)"
          }}
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Logo and Content */}
        <div className="relative z-10 text-center text-white px-6">
          <div className="font-malisha text-6xl md:text-8xl lg:text-9xl font-bold mb-4 drop-shadow-2xl">
            DA LUZ
          </div>
          <div className="font-malisha text-4xl md:text-6xl lg:text-7xl font-bold mb-8 drop-shadow-2xl">
            CONSCIENTE
          </div>
          <div className="font-velista text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            Alkimyas para alma y cuerpo
          </div>
        </div>
      </section>

      {/* About Section - "SOBRE DA LUZ" */}
      <section className="py-20 px-6 bg-cream">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-velista text-4xl md:text-5xl text-brand-primary mb-8">
                SOBRE DA LUZ
              </h2>
              <div className="space-y-6 text-lg leading-relaxed text-gray-700">
                <p>
                  DA LUZ CONSCIENTE nace de la profunda conexión entre la sabiduría ancestral 
                  y la ciencia moderna, creando puentes entre el alma y el cuerpo a través 
                  de alkimyas transformadoras.
                </p>
                <p>
                  Trabajamos con productores cuidadosamente seleccionados, honrando los 
                  ciclos naturales y presentando nuestros productos en recipientes 
                  personalizados de cerámica y vidrio que celebran la belleza de lo artesanal.
                </p>
                <p>
                  Cada línea de productos representa un viaje único hacia el bienestar 
                  integral, acompañado de servicios holísticos y programas de transformación 
                  personal que nutren tanto el cuerpo como el espíritu.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Decorative element - Replace with your design element */}
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-brand-primary to-brand-secondary opacity-20" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - "NUESTROS SERVICIOS" */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-velista text-4xl md:text-5xl text-brand-primary text-center mb-16">
            NUESTROS SERVICIOS
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-bg-cream to-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="font-velista text-2xl text-brand-primary mb-4">Biología De Luz</h3>
              <p className="text-gray-600 leading-relaxed">
                Terapias energéticas que trabajan con la luz interior de cada ser, 
                activando procesos naturales de sanación y equilibrio.
              </p>
            </div>
            <div className="bg-gradient-to-br from-bg-cream to-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="font-velista text-2xl text-brand-primary mb-4">Sesiones</h3>
              <p className="text-gray-600 leading-relaxed">
                Acompañamiento personalizado en procesos de transformación, 
                integrando técnicas ancestrales y enfoques contemporáneos.
              </p>
            </div>
            <div className="bg-gradient-to-br from-bg-cream to-white p-8 rounded-lg shadow-lg text-center">
              <h3 className="font-velista text-2xl text-brand-primary mb-4">Coaching</h3>
              <p className="text-gray-600 leading-relaxed">
                Programa de 7 meses de transformación consciente, diseñado para 
                el desarrollo integral del ser humano.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section - "NUESTRA FILOSOFÍA" */}
      <section className="py-20 px-6" style={{ backgroundColor: '#AE0000' }}>
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-velista text-4xl md:text-5xl text-white text-center mb-16">
            NUESTRA FILOSOFÍA
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Consciencia",
                description: "Vivir con plena consciencia de nuestros actos y su impacto en el mundo."
              },
              {
                title: "Naturaleza",
                description: "Honrar y trabajar en armonía con los ciclos y sabiduría de la naturaleza."
              },
              {
                title: "Transformación",
                description: "Facilitar procesos profundos de cambio y crecimiento personal."
              },
              {
                title: "Integridad",
                description: "Mantener coherencia entre nuestros valores, palabras y acciones."
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-velista text-xl text-white mb-4">{item.title}</h3>
                <p className="text-white/90 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Lines Sections */}
      {/* ALKIMYA DA LUZ */}
      <section className="py-20 px-6" style={{ backgroundColor: '#F0EACE' }}>
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="font-velista text-4xl md:text-5xl text-gray-800 mb-8">
            ALKIMYA DA LUZ
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Cosméticos botánicos artesanales presentados en recipientes personalizados 
            de cerámica y vidrio, con productores cuidadosamente seleccionados.
          </p>
        </div>
      </section>

      {/* LÍNEA ECOS */}
      <section 
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#12406F' }}
      >
        {/* Background Texture */}
        <div 
          className="absolute inset-0 bg-fit bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/textures/texture-ecos-ocean.jpg')",
            filter: "brightness(0.8)"
          }}
        />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h2 className="font-velista text-4xl md:text-5xl text-white mb-8 drop-shadow-lg">
            LÍNEA ECOS
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Ritmos naturales que conectan con la fluidez del agua y los ciclos oceánicos, 
            productos que honran la pureza y el movimiento constante de la vida.
          </p>
        </div>
      </section>

      {/* LÍNEA UMBRAL */}
      <section 
        className="relative py-20 px-6 overflow-hidden"
        style={{ backgroundColor: '#EA4F12' }}
      >
        {/* Background Texture */}
        <div 
          className="absolute inset-0 bg-fit bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/images/textures/texture-umbral-desert.jpg')",
            filter: "brightness(0.8)"
          }}
        />
        <div className="relative z-10 container mx-auto max-w-6xl text-center">
          <h2 className="font-velista text-4xl md:text-5xl text-white mb-8 drop-shadow-lg">
            LÍNEA UMBRAL
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
            Transformación interior a través del fuego sagrado, productos que facilitan 
            procesos profundos de cambio y renovación personal.
          </p>
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

      {/* Featured Blog Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-20 px-6" style={{ backgroundColor: '#AE0000' }}>
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-velista text-4xl md:text-5xl text-white text-center mb-16">
              BLOG DE LA COMUNIDAD
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg p-6 shadow-lg">
                  <h3 className="font-velista text-xl text-brand-primary mb-4">{post.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {post.excerpt || "Descubre más contenido de transformación y consciencia."}
                  </p>
                  <Link 
                    href={`/blog/${post.slug.current}`}
                    className="text-brand-primary font-semibold hover:underline"
                  >
                    Leer más →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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