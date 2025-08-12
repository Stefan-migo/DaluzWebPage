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
    <div className="min-h-screen" style={{backgroundColor: '#F6FBD6'}}>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="alkimya-hero absolute inset-0 opacity-80"></div>
        <div className="relative container-alkimya text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6">
            Alkimyas para alma y cuerpo
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Productos biocosmecéticos artesanales y servicios holísticos cuidadosamente seleccionados 
            para tu transformación consciente
          </p>
          <button className="alkimya-btn-primary text-lg px-8 py-4">
            PRODUCTOS
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="container-alkimya">
          <h2 className="font-serif text-4xl text-center text-gray-800 mb-12">
            Nuestras Líneas Artesanales
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="alkimya-card p-6">
              <h3 className="font-serif text-2xl text-brand-primary mb-4">
                ALKIMYA DA LUZ
              </h3>
              <p className="alkimya-text-elegante">
                Cosméticos botánicos artesanales presentados en recipientes personalizados de cerámica y vidrio, 
                con productores cuidadosamente seleccionados.
              </p>
            </div>
            <div className="alkimya-card p-6">
              <h3 className="font-serif text-2xl text-brand-primary mb-4">
                DA LUZ ALKIMYA CONSCIENTE
              </h3>
              <p className="alkimya-text-elegante">
                Servicios holísticos y programa transformacional de 7 meses para el desarrollo de una vida consciente.
              </p>
            </div>
            <div className="alkimya-card p-6">
              <h3 className="font-serif text-2xl text-brand-primary mb-4">
                Flores y Follaje de Temporada
              </h3>
              <p className="alkimya-text-elegante">
                Selección de flores silvestres y follaje estacional de viveros especializados, 
                honrando los ciclos naturales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts Section */}
      {featuredPosts.length > 0 && (
        <section className="py-16 px-6 bg-gradient-to-br from-verde-suave/10 via-white to-turquesa-claro/10">
          <div className="container-alkimya">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen className="h-8 w-8 text-azul-profundo" />
                <Badge className="bg-dorado text-azul-profundo font-semibold px-4 py-2">
                  Blog DA LUZ CONSCIENTE
                </Badge>
              </div>
              <h2 className="font-serif text-4xl text-azul-profundo mb-4">
                Conocimiento para una vida consciente
              </h2>
              <p className="text-xl text-tierra-media max-w-2xl mx-auto leading-relaxed">
                Descubre artículos sobre transformación personal, biocosmética natural y bienestar holístico
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
              {featuredPosts.map((post) => (
                <BlogCard
                  key={post._id}
                  id={post._id}
                  title={post.title}
                  excerpt={post.excerpt || ""}
                  slug={post.slug.current}
                  publishedAt={post.publishedAt}
                  mainImage={post.mainImage}
                  author={post.author}
                  categories={post.categories}
                  estimatedReadingTime={post.estimatedReadingTime}
                  featured={post.featured}
                />
              ))}
            </div>

            <div className="text-center">
              <Button asChild className="bg-dorado hover:bg-dorado/90 text-azul-profundo px-8 py-3">
                <Link href="/blog" className="flex items-center gap-2">
                  Ver todos los artículos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="container-alkimya text-center">
          <div className="font-serif text-3xl font-bold mb-4">
            DA LUZ CONSCIENTE
          </div>
          <p className="text-lg opacity-90">
            Alkimyas para alma y cuerpo
          </p>
        </div>
      </footer>
    </div>
  )
} 