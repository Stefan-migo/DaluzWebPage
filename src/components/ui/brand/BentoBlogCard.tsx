"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

export type BentoCardVariant = "lead" | "medium-left" | "medium-right" | "small" | "bottom";

interface BentoBlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  mainImage?: {
    asset: { url: string };
    alt?: string;
  };
  variant: BentoCardVariant;
  className?: string;
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getImageUrl(mainImage?: BentoBlogCardProps["mainImage"]) {
  return mainImage?.asset?.url && mainImage.asset.url.trim()
    ? mainImage.asset.url
    : PLACEHOLDER_IMAGE;
}

function hasValidImage(mainImage?: BentoBlogCardProps["mainImage"]) {
  return mainImage?.asset?.url && mainImage.asset.url.trim() !== "";
}

const baseCardClasses =
  "group relative overflow-hidden rounded-xl bg-[var(--color-bg-light)]/90 border border-[var(--color-brand-primary)]/10 shadow-soft hover:shadow-medium transition-all duration-300 motion-safe:hover:-translate-y-1";

export function BentoBlogCard({
  title,
  excerpt,
  slug,
  publishedAt,
  mainImage,
  variant,
  className = "",
}: BentoBlogCardProps) {
  const imageUrl = getImageUrl(mainImage);
  const showImage = hasValidImage(mainImage) || variant !== "small";

  return (
    <Link href={`/blog/${slug}`} className={`block h-full ${className}`}>
      <article
        className={`${baseCardClasses} flex flex-col ${
          variant === "lead" ? "min-h-[380px] md:min-h-[420px]" : ""
        } ${variant === "medium-left" || variant === "medium-right" ? "min-h-[320px]" : ""} ${
          variant === "small" ? "min-h-[220px]" : ""
        } ${variant === "bottom" ? "min-h-[260px]" : ""}`}
      >
        {variant === "lead" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 md:p-8 h-full">
            <div className="flex flex-col justify-between order-2 md:order-1">
              <div>
                <span className="font-caption text-sm text-[var(--color-text-primary)]/70">
                  {formatDate(publishedAt)}
                </span>
                <h2 className="font-title text-2xl md:text-3xl text-[var(--color-text-primary)] mt-2 mb-3 group-hover:text-[var(--color-brand-primary)] transition-colors">
                  {title}
                </h2>
                <p className="font-subtitle italic text-lg text-[var(--color-text-primary)]/90 mb-2">
                  {excerpt.split(".")[0]}.
                </p>
                <p className="font-text text-lg text-[var(--color-text-primary)]/80 line-clamp-3 leading-relaxed">
                  {excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-caption text-sm uppercase tracking-wider text-[var(--color-brand-primary)] font-medium">
                  Leer más
                </span>
                <div className="w-8 h-8 rounded bg-[var(--color-brand-primary)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[340px] rounded-lg overflow-hidden order-1 md:order-2 bg-[var(--color-bg-cream)]/50">
              {showImage ? (
                <Image
                  src={imageUrl}
                  alt={mainImage?.alt || title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-[var(--color-brand-primary)]/30" />
                </div>
              )}
            </div>
          </div>
        )}

        {(variant === "medium-left" || variant === "medium-right") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 h-full">
            <div
              className={`relative aspect-[4/3] sm:aspect-auto sm:min-h-[240px] rounded-lg overflow-hidden bg-[var(--color-bg-cream)]/50 ${
                variant === "medium-right" ? "sm:order-2" : ""
              }`}
            >
              {showImage ? (
                <Image
                  src={imageUrl}
                  alt={mainImage?.alt || title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-[var(--color-brand-primary)]/30" />
                </div>
              )}
            </div>
            <div
              className={`flex flex-col justify-between ${
                variant === "medium-right" ? "sm:order-1" : ""
              }`}
            >
              <div>
                <span className="font-caption text-xs text-[var(--color-text-primary)]/70">
                  {formatDate(publishedAt)}
                </span>
                <h3 className="font-subtitle italic text-lg text-[var(--color-text-primary)] mt-1 mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="font-text text-base text-[var(--color-text-primary)]/80 line-clamp-2 leading-relaxed">
                  {excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className="font-caption text-xs uppercase tracking-wider text-[var(--color-brand-primary)] font-medium">
                  Leer más
                </span>
                <div className="w-6 h-6 rounded bg-[var(--color-brand-primary)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        )}

        {variant === "small" && (
          <div className="p-5 h-full flex flex-col justify-between">
            <div>
              <span className="font-caption text-xs text-[var(--color-text-primary)]/70">
                {formatDate(publishedAt)}
              </span>
              <h3 className="font-subtitle italic text-lg text-[var(--color-text-primary)] mt-1 mb-2 group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                {title}
              </h3>
              <p className="font-text text-base text-[var(--color-text-primary)]/80 line-clamp-3 leading-relaxed">
                {excerpt}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="font-caption text-xs uppercase tracking-wider text-[var(--color-brand-primary)] font-medium">
                Leer más
              </span>
              <div className="w-6 h-6 rounded bg-[var(--color-brand-primary)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <ArrowRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        )}

        {variant === "bottom" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 h-full">
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <span className="font-caption text-sm text-[var(--color-text-primary)]/70">
                  {formatDate(publishedAt)}
                </span>
                <h3 className="font-subtitle italic text-xl text-[var(--color-text-primary)] mt-2 mb-3 group-hover:text-[var(--color-brand-primary)] transition-colors line-clamp-2">
                  {title}
                </h3>
                <p className="font-text text-lg text-[var(--color-text-primary)]/80 line-clamp-2 leading-relaxed">
                  {excerpt}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="font-caption text-sm uppercase tracking-wider text-[var(--color-brand-primary)] font-medium">
                  Leer más
                </span>
                <div className="w-8 h-8 rounded bg-[var(--color-brand-primary)] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
            <div className="relative aspect-[3/4] md:aspect-auto md:min-h-[180px] rounded-lg overflow-hidden bg-[var(--color-bg-cream)]/50">
              {showImage ? (
                <Image
                  src={imageUrl}
                  alt={mainImage?.alt || title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-[var(--color-brand-primary)]/30" />
                </div>
              )}
            </div>
          </div>
        )}
      </article>
    </Link>
  );
}
