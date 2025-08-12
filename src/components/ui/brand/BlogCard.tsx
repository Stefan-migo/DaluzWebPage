"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen,
  Heart,
  Share2
} from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  slug: string;
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
  className?: string;
  onToggleFavorite?: (postId: string) => void;
  onShare?: (postId: string) => void;
  isFavorite?: boolean;
}

export default function BlogCard({
  id,
  title,
  excerpt,
  slug,
  publishedAt,
  mainImage,
  author,
  categories = [],
  estimatedReadingTime = 5,
  featured = false,
  className = "",
  onToggleFavorite,
  onShare,
  isFavorite = false,
}: BlogCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(id);
  };

  const getImageUrl = () => {
    if (mainImage?.asset?.url) {
      return mainImage.asset.url;
    }
    // Using a placeholder from a reliable service
    return "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center";
  };

  const getAuthorImageUrl = () => {
    if (author?.image?.asset?.url) {
      return author.image.asset.url;
    }
    // Using a placeholder for author
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
  };

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/blog/${slug}`}>
        <div className="relative">
          {/* Blog Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-verde-suave/10">
            <Image
              src={getImageUrl()}
              alt={mainImage?.alt || title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Featured Badge */}
            {featured && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-dorado text-azul-profundo font-semibold">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Destacado
                </Badge>
              </div>
            )}

            {/* Categories */}
            {categories && categories.length > 0 && (
              <div className="absolute top-4 right-4 flex flex-wrap gap-1">
                {categories.slice(0, 2).map((category, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="bg-white/90 text-azul-profundo text-xs"
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

            {/* Quick Actions */}
            <div className={`absolute bottom-4 right-4 flex gap-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              {onToggleFavorite && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleToggleFavorite}
                >
                  <Heart 
                    className={`h-4 w-4 ${
                      isFavorite ? 'fill-coral-suave text-coral-suave' : 'text-tierra-media'
                    }`}
                  />
                </Button>
              )}
              {onShare && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 text-tierra-media" />
                </Button>
              )}
            </div>

            {/* Reading Time */}
            <div className="absolute bottom-4 left-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                <Clock className="h-3 w-3 text-tierra-media" />
                <span className="text-xs text-tierra-media font-medium">
                  {estimatedReadingTime || 5} min
                </span>
              </div>
            </div>
          </div>

          {/* Blog Content */}
          <CardContent className="p-6">
            {/* Publication Date */}
            <div className="flex items-center gap-2 text-sm text-tierra-media mb-3">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(publishedAt)}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-azul-profundo line-clamp-2 mb-3 hover:text-azul-profundo/80 transition-colors">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-tierra-media line-clamp-3 mb-4 leading-relaxed">
              {excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-verde-suave/20">
                  <Image
                    src={getAuthorImageUrl()}
                    alt={author?.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-azul-profundo">
                    {author?.name || "Autor desconocido"}
                  </div>
                </div>
              </div>

              {/* Read More */}
              <div className="flex items-center gap-1 text-sm text-azul-profundo group-hover:text-dorado transition-colors">
                <span className="font-medium">Leer más</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
} 