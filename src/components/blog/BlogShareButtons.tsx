"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Link2 } from "lucide-react";
import { toast } from "sonner";

const SAVED_POSTS_KEY = "daluz-saved-posts";

export const SAVED_POSTS_STORAGE_KEY = SAVED_POSTS_KEY;

export interface SavedPost {
  id: string;
  slug: string;
  title: string;
}

interface BlogShareButtonsProps {
  postId: string;
  postSlug: string;
  postTitle: string;
}

export function BlogShareButtons({
  postId,
  postSlug,
  postTitle,
}: BlogShareButtonsProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(SAVED_POSTS_KEY) || "[]";
      const parsed = JSON.parse(raw);
      const ids = Array.isArray(parsed)
        ? parsed.map((p: string | SavedPost) => (typeof p === "string" ? p : p.id))
        : (parsed as SavedPost[]).map((p) => p.id);
      setIsSaved(ids.includes(postId));
    } catch {
      setIsSaved(false);
    }
  }, [postId]);

  const getShareUrl = () => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/blog/${postSlug}`;
  };

  const shareText = `Te comparto este artículo de DA LUZ CONSCIENTE: ${postTitle}`;

  const handleNativeShare = async () => {
    const url = getShareUrl();
    const shareData = {
      title: postTitle,
      text: shareText,
      url,
    };

    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        toast.success("¡Artículo compartido exitosamente!");
      } else {
        await handleCopyLink();
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Enlace copiado al portapapeles");
    } catch {
      toast.error("No se pudo copiar. Intenta manualmente.");
    }
  };

  const handleSaveForLater = () => {
    try {
      const raw = localStorage.getItem(SAVED_POSTS_KEY) || "[]";
      const parsed = JSON.parse(raw);
      const saved: SavedPost[] = Array.isArray(parsed)
        ? parsed.map((p: string | SavedPost) =>
            typeof p === "string" ? { id: p, slug: postSlug, title: postTitle } : p
          )
        : [];

      if (isSaved) {
        const updated = saved.filter((p) => p.id !== postId);
        localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updated));
        setIsSaved(false);
        toast.success("Artículo eliminado de guardados");
      } else {
        const existing = saved.find((p) => p.id === postId);
        const updated = existing
          ? saved
          : [...saved, { id: postId, slug: postSlug, title: postTitle }];
        localStorage.setItem(SAVED_POSTS_KEY, JSON.stringify(updated));
        setIsSaved(true);
        toast.success("Artículo guardado para después");
      }
    } catch {
      toast.error("Error al guardar. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center gap-3 flex-wrap">
        <Button
          onClick={handleNativeShare}
          className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-secondary)] text-white font-caption uppercase tracking-wider px-5 py-2.5"
          style={{ borderRadius: "0 12px" }}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Compartir
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="font-caption uppercase tracking-wider px-5 py-2.5 border-[var(--color-brand-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white"
          style={{ borderRadius: "0 12px" }}
        >
          <Link2 className="h-4 w-4 mr-2" />
          Copiar enlace
        </Button>
      </div>
      <div className="flex flex-col items-center gap-3">
        <Button
          variant="outline"
          onClick={handleSaveForLater}
          className={`font-caption uppercase tracking-wider px-6 py-3 transition-colors ${
            isSaved
              ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]"
              : "border-[var(--color-brand-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-brand-primary)] hover:text-white"
          }`}
          style={{ borderRadius: "0 12px" }}
        >
          <Heart
            className={`h-4 w-4 mr-2 ${isSaved ? "fill-current" : ""}`}
          />
          {isSaved ? "Guardado" : "Guardar para después"}
        </Button>
        <a
          href="/blog/guardados"
          className="text-sm font-caption text-[var(--color-brand-primary)] hover:underline"
        >
          Ver artículos guardados
        </a>
      </div>
    </div>
  );
}
