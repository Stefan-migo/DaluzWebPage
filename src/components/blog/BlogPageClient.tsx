"use client";

import { useState, useMemo } from "react";
import { BentoBlogGrid } from "@/components/ui/brand/BentoBlogGrid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { BookOpen, Search, Filter, Heart } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  author: {
    name: string;
    image?: { asset: { url: string } };
  };
  categories?: Array<{ title: string; color?: string }>;
  estimatedReadingTime?: number;
  featured?: boolean;
}

interface Category {
  _id: string;
  title: string;
  description?: string;
  color?: string;
}

interface BlogPageClientProps {
  posts: BlogPost[];
  categories: Category[];
}

function filterPosts(
  posts: BlogPost[],
  searchQuery: string,
  selectedCategory: string | null
): BlogPost[] {
  return posts.filter((post) => {
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesCategory =
      !selectedCategory ||
      post.categories?.some(
        (cat) => cat.title.toLowerCase() === selectedCategory.toLowerCase()
      );

    return matchesSearch && matchesCategory;
  });
}

export function BlogPageClient({ posts, categories }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(
    () => filterPosts(posts, searchQuery, selectedCategory),
    [posts, searchQuery, selectedCategory]
  );

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            backgroundImage: "url('/svg/blog/blogbg.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        {/* Gradient overlay for text readability */}
        <div
          className="absolute inset-0 pointer-events-none bg-gradient-to-br from-[var(--color-brand-primary)]/85 via-[var(--color-brand-secondary)]/75 to-[var(--color-brand-primary)]/90"
          aria-hidden
        />
        <div className="relative container mx-auto text-center text-white max-w-4xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-[var(--color-highlight)]" />
            <Badge className="bg-[var(--color-highlight)] text-[var(--color-text-primary)] font-semibold px-4 py-2 font-caption uppercase tracking-wider">
              Blog DA LUZ CONSCIENTE
            </Badge>
          </div>
          <h1 className="font-title text-4xl md:text-5xl lg:text-6xl mb-6 text-white">
            Conocimiento para una vida consciente
          </h1>
          <p className="font-text text-lg md:text-xl mb-8 leading-relaxed opacity-95 max-w-2xl mx-auto">
            Descubre artículos sobre biocosmética natural, transformación
            personal y bienestar holístico. Comparte el camino hacia una vida
            más plena.
          </p>

          {/* Search Bar - functional */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[var(--color-text-primary)]/60" />
            <Input
              placeholder="Buscar artículos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 bg-white/95 backdrop-blur-sm border-0 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-primary)]/60 font-text"
              aria-label="Buscar artículos por título o descripción"
            />
          </div>
        </div>
      </section>

      {/* Grid section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute inset-0 opacity-[5.05]"
            style={{
              backgroundImage: "url('/svg/blog/BlogBackground.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center top",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        <div className="container mx-auto px-6 py-12 max-w-6xl relative z-10">
          {/* Categories Filter - functional */}
          {categories.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-4 mb-6">
                <Filter className="h-5 w-5 text-[var(--color-brand-primary)]" />
                <h2 className="font-title text-lg text-[var(--color-text-primary)]">
                  Filtrar por categoría
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => setSelectedCategory(null)}
                  className={`font-caption uppercase tracking-wider ${
                    selectedCategory === null
                      ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                      : "border-[var(--color-brand-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white"
                  }`}
                >
                  Todos los artículos
                </Button>
                {categories.map((category) => {
                  const isSelected = selectedCategory === category.title;
                  return (
                    <Button
                      key={category._id}
                      variant="outline"
                      onClick={() =>
                        setSelectedCategory(isSelected ? null : category.title)
                      }
                      className={`font-caption ${
                        isSelected
                          ? "bg-[var(--color-brand-primary)] text-white border-[var(--color-brand-primary)]"
                          : "border-[var(--color-bg-light)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-light)]/80"
                      }`}
                      style={
                        !isSelected && category.color
                          ? {
                              borderColor: category.color,
                              color: category.color,
                            }
                          : undefined
                    }
                    >
                      {category.title}
                    </Button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Bento Grid */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="h-16 w-16 text-[var(--color-brand-primary)]/40 mx-auto mb-4" />
              <h3 className="font-subtitle italic text-xl text-[var(--color-text-primary)] mb-2">
                {searchQuery || selectedCategory
                  ? "No se encontraron artículos"
                  : "Próximamente nuevos artículos"}
              </h3>
              <p className="font-text text-[var(--color-text-primary)]/70 mb-6">
                {searchQuery || selectedCategory
                  ? "Prueba con otros términos de búsqueda o selecciona otra categoría."
                  : "Estamos preparando contenido valioso para ti. ¡Mantente atento!"}
              </p>
              <Link
                href="/blog/guardados"
                className="inline-flex items-center gap-2 text-sm font-caption text-[var(--color-brand-primary)] hover:underline"
              >
                <Heart className="h-4 w-4" />
                Ver artículos guardados
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h2 className="font-title text-2xl text-[var(--color-text-primary)]">
                  Artículos
                </h2>
                <div className="flex items-center gap-4">
                  <Link
                    href="/blog/guardados"
                    className="inline-flex items-center gap-2 text-sm font-caption text-[var(--color-brand-primary)] hover:underline"
                  >
                    <Heart className="h-4 w-4" />
                    Ver guardados
                  </Link>
                  <Badge
                    variant="secondary"
                    className="bg-[var(--color-bg-light)]/80 text-[var(--color-text-primary)] font-caption"
                  >
                    {filteredPosts.length} artículo
                    {filteredPosts.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </div>

              <BentoBlogGrid posts={filteredPosts} />
            </>
          )}
        </div>
      </section>
    </>
  );
}
