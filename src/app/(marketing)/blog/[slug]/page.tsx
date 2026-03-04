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
  BookOpen,
} from "lucide-react";
import { BlogShareButtons } from "@/components/blog/BlogShareButtons";
import type { Metadata } from "next";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  content: any;
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author: {
    name: string;
    bio?: any;
    image?: string;
    socialLinks?: {
      instagram?: string;
      website?: string;
    };
  };
  categories?: Array<{ title: string; color?: string }>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  estimatedReadingTime?: number;
}

interface BlogPostPageProps {
  params: { slug: string };
}

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const post = await client.fetch(
      queries.postBySlug,
      { slug },
      {
        cache: "no-store",
        next: {
          revalidate: 30,
          tags: ["blog-posts", "sanity-content", `post-${slug}`],
        },
      }
    );
    return post || null;
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { title: "Artículo no encontrado" };
  }

  const title = post.seo?.title || post.title;
  const description =
    post.seo?.description ||
    post.excerpt ||
    "Artículo del blog DA LUZ CONSCIENTE";

  return {
    title: `${title} | Blog DA LUZ CONSCIENTE`,
    description,
    keywords: post.seo?.keywords || [
      "vida consciente",
      "biocosmética natural",
      "transformación personal",
      "bienestar holístico",
    ],
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.mainImage?.asset?.url
        ? [
            {
              url: post.mainImage.asset.url,
              alt: post.mainImage.alt || post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.mainImage?.asset?.url ? [post.mainImage.asset.url] : [],
    },
  };
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&auto=format";
const PLACEHOLDER_AUTHOR =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&auto=format";

// Portable Text components - DA LUZ brand palette
const portableTextComponents = {
  types: {
    image: ({ value }: any) => (
      <div className="my-8">
        <Image
          src={value.asset.url}
          alt={value.alt || "Imagen del artículo"}
          width={800}
          height={600}
          className="rounded-xl shadow-medium w-full h-auto object-cover"
        />
        {value.caption && (
          <p className="font-caption text-sm text-[var(--color-text-primary)]/70 italic text-center mt-2">
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
        className="text-[var(--color-brand-primary)] hover:text-[var(--color-brand-secondary)] underline transition-colors"
      >
        {children}
      </a>
    ),
  },
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-[var(--color-text-primary)] font-text text-lg">
        {children}
      </p>
    ),
    h1: ({ children }: any) => (
      <h1 className="font-title text-3xl text-[var(--color-text-primary)] mb-6 mt-8">
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="font-title text-2xl text-[var(--color-text-primary)] mb-4 mt-8">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="font-subtitle italic text-xl text-[var(--color-text-primary)] mb-4 mt-6">
        {children}
      </h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[var(--color-brand-primary)] bg-[var(--color-bg-light)]/30 pl-6 py-4 my-6 italic">
        <div className="text-[var(--color-text-primary)] font-text">
          {children}
        </div>
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside mb-6 space-y-2 text-[var(--color-text-primary)] font-text">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside mb-6 space-y-2 text-[var(--color-text-primary)] font-text">
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

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const imageUrl = post.mainImage?.asset?.url || PLACEHOLDER_IMAGE;
  const authorImageUrl = post.author.image || PLACEHOLDER_AUTHOR;

  return (
    <div className="min-h-screen bg-[var(--color-bg-cream)]/30">
      {/* Hero Section - Featured image with overlay + BlogBackground */}
      <section className="relative">
        {/* Featured Image Hero */}
        <div className="relative h-[280px] md:h-[400px] lg:h-[480px] w-full">
          <Image
            src={imageUrl}
            alt={post.mainImage?.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Gradient overlay - burgundy like main blog */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(96, 16, 16, 0.85) 0%, rgba(174, 0, 0, 0.4) 40%, transparent 70%)",
            }}
          />
          {/* BlogBackground texture - subtle */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            aria-hidden
            style={{
              backgroundImage: "url('/svg/blog/BlogBackground.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Back link + Title overlay */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container mx-auto px-6 pb-8 md:pb-12 max-w-4xl">
              <div className="mb-6 w-fit">
                <Button variant="ghost" asChild size="sm" className="-ml-2 w-fit">
                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-white font-caption uppercase tracking-wider transition-colors rounded-lg px-3 py-2 bg-white/10 hover:bg-white/15"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Volver al blog
                  </Link>
                </Button>
              </div>
              {post.categories && post.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories.map((category, index) => (
                    <Badge
                      key={index}
                      className="bg-white/20 backdrop-blur-sm text-white border-white/30 font-subtitle italic text-xs"
                      style={
                        category.color
                          ? {
                              backgroundColor: `${category.color}40`,
                              borderColor: category.color,
                            }
                          : undefined
                      }
                    >
                      {category.title}
                    </Badge>
                  ))}
                </div>
              )}
              <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight drop-shadow-md">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-white/90 text-sm font-caption">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(post.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.estimatedReadingTime || 5} min de lectura
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Por {post.author.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section - Same background as blog grid */}
      <section className="relative overflow-hidden">
        {/* BlogBackground - subtle texture */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute inset-0 opacity-[5.07]"
            style={{
              backgroundImage: "url('/svg/blog/BlogBackground.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <article className="container mx-auto px-6 py-12 max-w-4xl relative z-10">
          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-text text-xl text-[var(--color-text-primary)]/90 mb-10 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {post.content &&
            Array.isArray(post.content) &&
            post.content.length > 0 ? (
              <PortableText
                value={post.content}
                components={portableTextComponents}
              />
            ) : (
              <div className="bg-[var(--color-bg-light)]/50 p-6 rounded-xl text-[var(--color-text-primary)]/80 font-text">
                <p>El contenido de este artículo no está disponible en este momento.</p>
                <p className="text-sm mt-2 opacity-80">
                  Puede que el artículo aún esté siendo editado o haya un problema
                  con el contenido.
                </p>
              </div>
            )}
          </div>

          <Separator className="my-12 border-[var(--color-brand-primary)]/20" />

          {/* Author Section */}
          <section className="mb-12">
            <h3 className="font-subtitle italic text-xl text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
              <User className="h-5 w-5" />
              Sobre el autor
            </h3>
            <div className="bg-[var(--color-bg-light)]/50 rounded-xl p-6 flex flex-col md:flex-row items-start gap-6">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-[var(--color-bg-cream)] flex-shrink-0">
                <Image
                  src={authorImageUrl}
                  alt={post.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-subtitle italic text-lg text-[var(--color-text-primary)] mb-2">
                  {post.author.name}
                </h4>
                {post.author.bio &&
                  Array.isArray(post.author.bio) &&
                  post.author.bio.length > 0 && (
                    <div className="text-[var(--color-text-primary)]/80 leading-relaxed mb-4 font-text">
                      <PortableText
                        value={post.author.bio}
                        components={{
                          block: {
                            normal: ({ children }: any) => (
                              <p className="mb-2">{children}</p>
                            ),
                          },
                        }}
                      />
                    </div>
                  )}
                {post.author.socialLinks && (
                  <div className="flex gap-4">
                    {post.author.socialLinks.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-[var(--color-brand-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white font-caption uppercase tracking-wider"
                      >
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
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="border-[var(--color-brand-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white font-caption uppercase tracking-wider"
                      >
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
            <div
              className="rounded-xl p-6 text-center"
              style={{
                background: `linear-gradient(to right, var(--color-brand-primary)/5, var(--color-highlight)/10)`,
              }}
            >
              <h3 className="font-subtitle italic text-lg text-[var(--color-text-primary)] mb-4">
                ¿Te gustó este artículo?
              </h3>
              <p className="text-[var(--color-text-primary)]/80 mb-6 font-text">
                Compártelo con tu comunidad y ayuda a más personas en su camino
                hacia una vida consciente.
              </p>
              <BlogShareButtons
                postId={post._id}
                postSlug={post.slug.current}
                postTitle={post.title}
              />
            </div>
          </section>

          {/* CTA - Ver más artículos */}
          <section className="flex flex-col items-center gap-6 pt-8 pb-4">
            <Link
              href="/blog"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-caption uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-lg"
              style={{ borderRadius: "0 15px" }}
            >
              <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Ver más artículos
            </Link>
          </section>
        </article>
      </section>
    </div>
  );
}
