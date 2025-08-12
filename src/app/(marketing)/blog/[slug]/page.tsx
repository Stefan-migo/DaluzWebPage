import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { client, queries } from "@/lib/sanity/client";
import { PortableText } from "@portabletext/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowLeft, 
  Share2,
  Heart,
  BookOpen,
  Eye
} from "lucide-react";
import type { Metadata } from "next";

// Blog post type
interface BlogPost {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  content: any; // Portable Text content (was body)
  publishedAt: string;
  mainImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  author: {
    name: string;
    bio?: any; // PortableText content
    image?: string; // Direct URL now
    socialLinks?: {
      instagram?: string;
      website?: string;
    };
  };
  categories?: Array<{
    title: string;
    color?: string;
  }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  estimatedReadingTime?: number;
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch(queries.postBySlug, { slug });
    
    // Debug query to see all fields
    const debugPost = await client.fetch(queries.debugPostBySlug, { slug });
    console.log("🔍 DEBUG - All fields:", debugPost);
    console.log("🔍 DEBUG - Possible content fields:", {
      body: debugPost?.body,
      contenido: debugPost?.contenido,
      content: debugPost?.content,
    });
    
    return post || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const title = post.seo?.title || post.title;
  const description = post.seo?.description || post.excerpt || "Artículo del blog DA LUZ CONSCIENTE";

  return {
    title: `${title} | Blog DA LUZ CONSCIENTE`,
    description,
    keywords: post.seo?.keywords || [
      "vida consciente",
      "biocosmética natural",
      "transformación personal",
      "bienestar holístico"
    ],
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.mainImage?.asset?.url ? [
        {
          url: post.mainImage.asset.url,
          alt: post.mainImage.alt || post.title,
        }
      ] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.mainImage?.asset?.url ? [post.mainImage.asset.url] : [],
    },
  };
}

// Portable Text components for rich content rendering
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={value.asset.url}
          alt={value.alt || "Imagen del artículo"}
          width={800}
          height={600}
          className="rounded-lg shadow-lg w-full h-auto"
        />
        {value.caption && (
          <p className="text-sm text-tierra-media italic text-center mt-2">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-azul-profundo hover:text-dorado underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-tierra-media">{children}</p>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-serif font-bold text-azul-profundo mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-serif font-bold text-azul-profundo mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold text-azul-profundo mb-4 mt-6">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-dorado bg-verde-suave/10 pl-6 py-4 my-6 italic">
        <div className="text-azul-profundo">{children}</div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-tierra-media">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-tierra-media">
        {children}
      </ol>
    ),
  },
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getImageUrl = () => {
    if (post.mainImage?.asset?.url) {
      return post.mainImage.asset.url;
    }
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&auto=format";
  };

  const getAuthorImageUrl = () => {
    if (post.author.image) {
      return post.author.image;  // Direct URL now
    }
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="container mx-auto px-6 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/blog" className="flex items-center gap-2 text-azul-profundo hover:text-dorado">
            <ArrowLeft className="h-4 w-4" />
            Volver al blog
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <article className="container mx-auto px-6 max-w-4xl">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((category, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-verde-suave/20 text-azul-profundo"
                style={{ 
                  backgroundColor: category.color ? `${category.color}20` : undefined,
                  color: category.color || undefined 
                }}
              >
                {category.title}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-azul-profundo mb-6 leading-tight">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xl text-tierra-media mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm text-tierra-media">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{post.estimatedReadingTime || 5} min de lectura</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Por {post.author.name}</span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative h-96 md:h-[500px] mb-12 rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={getImageUrl()}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-azul-profundo/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {(() => {
            // Debug logging in render
            console.log("🔍 RENDER DEBUG", Date.now(), {
              hasPost: !!post,
              contentExists: !!post.content,
              contentType: typeof post.content,
              contentIsArray: Array.isArray(post.content),
              contentLength: post.content?.length,
              contentData: post.content,
              fullPost: post
            });
            
            if (post.content && Array.isArray(post.content) && post.content.length > 0) {
              console.log("🔍 RENDERING PORTABLE TEXT");
              return (
                <PortableText 
                  value={post.content} 
                  components={portableTextComponents}
                />
              );
            } else {
              console.log("🔍 SHOWING FALLBACK MESSAGE");
              return (
                <div className="text-tierra-media bg-verde-suave/10 p-6 rounded-lg">
                  <p>El contenido de este artículo no está disponible en este momento.</p>
                  <p className="text-sm mt-2 opacity-75">
                    Puede que el artículo aún esté siendo editado o haya un problema con el contenido.
                  </p>
                  <p className="text-xs mt-2 opacity-50">
                    Debug: content={post.content ? 'exists' : 'null'}, 
                    type={typeof post.content}, 
                    isArray={Array.isArray(post.content)}, 
                    length={post.content?.length || 'N/A'}
                  </p>
                </div>
              );
            }
          })()}
        </div>

        <Separator className="my-12" />

        {/* Author Section */}
        <section className="mb-12">
          <h3 className="text-xl font-semibold text-azul-profundo mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Sobre el autor
          </h3>
          <div className="bg-verde-suave/10 rounded-xl p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden bg-verde-suave/20 flex-shrink-0">
              <Image
                src={getAuthorImageUrl()}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-semibold text-azul-profundo mb-2">
                {post.author.name}
              </h4>
              {post.author.bio && Array.isArray(post.author.bio) && post.author.bio.length > 0 && (
                <div className="text-tierra-media leading-relaxed mb-4">
                  <PortableText 
                    value={post.author.bio} 
                    components={{
                      block: {
                        normal: ({ children }: any) => <p className="mb-2">{children}</p>,
                      },
                    }}
                  />
                </div>
              )}
              {post.author.socialLinks && (
                <div className="flex gap-4">
                  {post.author.socialLinks.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={post.author.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Instagram
                      </a>
                    </Button>
                  )}
                  {post.author.socialLinks.website && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={post.author.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitio web
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sharing Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-azul-profundo/5 to-dorado/5 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-azul-profundo mb-4">
              ¿Te gustó este artículo?
            </h3>
            <p className="text-tierra-media mb-6">
              Compártelo con tu comunidad y ayuda a más personas en su camino hacia una vida consciente.
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-dorado hover:bg-dorado/90 text-azul-profundo">
                <Share2 className="h-4 w-4 mr-2" />
                Compartir artículo
              </Button>
              <Button variant="outline" className="border-azul-profundo text-azul-profundo hover:bg-azul-profundo hover:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Guardar para después
              </Button>
            </div>
          </div>
        </section>

        {/* Related Articles CTA */}
        <section className="text-center">
          <Button asChild variant="outline" className="border-dorado text-azul-profundo hover:bg-dorado hover:text-azul-profundo">
            <Link href="/blog">
              <BookOpen className="h-4 w-4 mr-2" />
              Ver más artículos
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
} 