import { client, queries } from "@/lib/sanity/client";
import BlogCard from "@/components/ui/brand/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Search, 
  Filter,
  Calendar,
  TrendingUp 
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Artículos sobre Vida Consciente",
  description: "Descubre artículos sobre biocosmética natural, transformación personal, bienestar holístico y vida consciente. Comparte el conocimiento para una vida más plena.",
  keywords: [
    "blog vida consciente",
    "artículos biocosmética",
    "transformación personal",
    "bienestar holístico",
    "productos naturales",
    "autoconocimiento"
  ],
  openGraph: {
    title: "Blog - DA LUZ CONSCIENTE",
    description: "Artículos sobre vida consciente, biocosmética natural y transformación personal",
    type: "website",
  },
};

// Blog post type based on Sanity schema
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

// Category type
interface Category {
  _id: string;
  title: string;
  description?: string;
  color?: string;
}

async function getAllPosts(): Promise<BlogPost[]> {
  try {
    console.log('Fetching posts from Sanity...');
    const posts = await client.fetch(queries.allPosts);
    console.log('Posts fetched:', posts?.length || 0);
    return posts || [];
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}

async function getAllCategories(): Promise<Category[]> {
  try {
    console.log('Fetching categories from Sanity...');
    const categories = await client.fetch(queries.allCategories);
    console.log('Categories fetched:', categories?.length || 0);
    return categories || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(),
    getAllCategories()
  ]);

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde-suave/10 via-white to-turquesa-claro/10">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-r from-azul-profundo to-azul-profundo/80">
        <div className="absolute inset-0 bg-[url('/images/blog-hero-pattern.svg')] opacity-10"></div>
        <div className="relative container mx-auto text-center text-white max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-dorado" />
            <Badge className="bg-dorado text-azul-profundo font-semibold px-4 py-2">
              Blog DA LUZ CONSCIENTE
            </Badge>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
            Conocimiento para una vida consciente
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-90">
            Descubre artículos sobre biocosmética natural, transformación personal 
            y bienestar holístico. Comparte el camino hacia una vida más plena.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-tierra-media" />
            <Input 
              placeholder="Buscar artículos..." 
              className="pl-10 pr-4 py-3 bg-white/95 backdrop-blur-sm border-0 text-azul-profundo placeholder:text-tierra-media"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-12">
        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <Filter className="h-5 w-5 text-azul-profundo" />
              <h2 className="text-lg font-semibold text-azul-profundo">
                Filtrar por categoría
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="border-dorado text-azul-profundo hover:bg-dorado hover:text-azul-profundo">
                Todos los artículos
              </Button>
              {categories.map((category) => (
                <Button 
                  key={category._id}
                  variant="outline"
                  className="border-verde-suave text-azul-profundo hover:bg-verde-suave hover:text-azul-profundo"
                  style={{
                    borderColor: category.color || undefined,
                    color: category.color || undefined
                  }}
                >
                  {category.title}
                </Button>
              ))}
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <TrendingUp className="h-6 w-6 text-dorado" />
              <h2 className="text-2xl font-serif font-bold text-azul-profundo">
                Artículos Destacados
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </section>
        )}

        {/* All Posts */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-6 w-6 text-azul-profundo" />
            <h2 className="text-2xl font-serif font-bold text-azul-profundo">
              {featuredPosts.length > 0 ? "Más Artículos" : "Todos los Artículos"}
            </h2>
            <Badge variant="secondary" className="bg-verde-suave/20 text-azul-profundo">
              {posts.length} artículos
            </Badge>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-tierra-media mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-azul-profundo mb-2">
                Próximamente nuevos artículos
              </h3>
              <p className="text-tierra-media">
                Estamos preparando contenido valioso para ti. ¡Mantente atento!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(featuredPosts.length > 0 ? regularPosts : posts).map((post) => (
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
                  featured={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* Load More */}
        {posts.length > 9 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-dorado text-azul-profundo hover:bg-dorado hover:text-azul-profundo px-8 py-3"
            >
              Cargar más artículos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 