"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type SavedPost } from "@/components/blog/BlogShareButtons";

const STORAGE_KEY = "daluz-saved-posts";

export default function BlogGuardadosPage() {
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "[]";
      const parsed = JSON.parse(raw);
      const posts: SavedPost[] = Array.isArray(parsed)
        ? parsed.map((p: string | SavedPost) =>
            typeof p === "string" ? { id: p, slug: "", title: "Artículo guardado" } : p
          )
        : [];
      setSavedPosts(posts.filter((p) => p.slug));
    } catch {
      setSavedPosts([]);
    }
  }, []);

  const removeFromSaved = (id: string) => {
    const updated = savedPosts.filter((p) => p.id !== id);
    setSavedPosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-cream)]/30 flex items-center justify-center">
        <div className="animate-pulse text-[var(--color-text-primary)]/60 font-text">
          Cargando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-cream)]/30">
      <section className="relative py-12 md:py-16 px-6">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          aria-hidden
          style={{
            backgroundImage: "url('/svg/blog/BlogBackground.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="container mx-auto max-w-2xl relative z-10">
          <Button variant="ghost" asChild size="sm" className="mb-6 -ml-2">
            <Link
              href="/blog"
              className="flex items-center gap-2 text-[var(--color-text-primary)] hover:text-[var(--color-brand-primary)] font-caption"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al blog
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-brand-primary)]/15 border border-[var(--color-brand-primary)]/30"
              style={{ color: "#AE0000" }}
            >
              <Heart className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h1 className="font-title text-2xl md:text-3xl text-[var(--color-text-primary)]">
                Artículos guardados
              </h1>
              <p className="font-text text-[var(--color-text-primary)]/70 text-sm">
                Tus lecturas pendientes
              </p>
            </div>
          </div>

          {savedPosts.length === 0 ? (
            <div className="text-center py-16 rounded-xl bg-[var(--color-bg-light)]/50">
              <BookOpen className="h-16 w-16 text-[var(--color-brand-primary)]/40 mx-auto mb-4" />
              <h3 className="font-subtitle italic text-xl text-[var(--color-text-primary)] mb-2">
                Aún no tienes artículos guardados
              </h3>
              <p className="font-text text-[var(--color-text-primary)]/70 mb-6">
                Cuando guardes un artículo para leer después, aparecerá aquí.
              </p>
              <Button asChild className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-caption uppercase tracking-wider" style={{ borderRadius: "0 15px" }}>
                <Link href="/blog" className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Explorar el blog
                </Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {savedPosts.map((post) => (
                <li
                  key={post.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[var(--color-bg-light)]/50 hover:bg-[var(--color-bg-light)]/70 transition-colors"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex-1 min-w-0 group"
                  >
                    <h3 className="font-subtitle italic text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-brand-primary)] transition-colors truncate">
                      {post.title || "Artículo"}
                    </h3>
                    <span className="text-sm font-caption text-[var(--color-text-primary)]/60">
                      Leer artículo →
                    </span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromSaved(post.id)}
                    className="text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary)]/10 shrink-0"
                    aria-label="Quitar de guardados"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
