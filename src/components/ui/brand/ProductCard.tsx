"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Leaf, 
  Sparkles, 
  Eye,
  Plus,
  Minus 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isNatural?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  stock: number;
  size?: string;
  className?: string;
  variant?: 'default' | 'elegant' | 'artisanal' | 'glass';
  lineTheme?: 'alma-terra' | 'ecos' | 'jade-ritual' | 'umbral' | 'utopica' | 'default';
  onAddToCart?: (productId: string, quantity: number) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

const cardVariants = {
  default: "bg-white border-border",
  elegant: "bg-gradient-to-br from-white to-gray-50 border-gold-200 shadow-elegant",
  artisanal: "bg-cream border-earth-200 shadow-artisanal",
  glass: "bg-white/80 backdrop-blur-md border-white/20 shadow-glass"
};

const lineThemeClasses = {
  'alma-terra': {
    accent: 'text-alma-primary',
    badge: 'bg-alma-primary/10 text-alma-primary border-alma-primary/20',
    button: 'bg-alma-primary hover:bg-alma-primary/90 text-white',
    star: 'fill-alma-secondary text-alma-secondary'
  },
  'ecos': {
    accent: 'text-ecos-primary',
    badge: 'bg-ecos-primary/10 text-ecos-primary border-ecos-primary/20',
    button: 'bg-ecos-primary hover:bg-ecos-primary/90 text-white',
    star: 'fill-ecos-secondary text-ecos-secondary'
  },
  'jade-ritual': {
    accent: 'text-jade-primary',
    badge: 'bg-jade-primary/10 text-jade-primary border-jade-primary/20',
    button: 'bg-jade-primary hover:bg-jade-primary/90 text-white',
    star: 'fill-jade-secondary text-jade-secondary'
  },
  'umbral': {
    accent: 'text-umbral-primary',
    badge: 'bg-umbral-primary/10 text-umbral-primary border-umbral-primary/20',
    button: 'bg-umbral-primary hover:bg-umbral-primary/90 text-white',
    star: 'fill-umbral-secondary text-umbral-secondary'
  },
  'utopica': {
    accent: 'text-utopica-primary',
    badge: 'bg-utopica-primary/10 text-utopica-primary border-utopica-primary/20',
    button: 'bg-utopica-primary hover:bg-utopica-primary/90 text-white',
    star: 'fill-utopica-secondary text-utopica-secondary'
  },
  'default': {
    accent: 'text-brand-primary',
    badge: 'bg-brand-primary/10 text-brand-primary border-brand-primary/20',
    button: 'bg-brand-primary hover:bg-brand-primary/90 text-white',
    star: 'fill-gold-500 text-gold-500'
  }
};

export default function ProductCard({
  id,
  name,
  description,
  price,
  originalPrice,
  category,
  imageUrl,
  rating,
  reviewCount,
  isNatural = true,
  isNew = false,
  isOnSale = false,
  stock,
  size,
  className = "",
  variant = 'default',
  lineTheme = 'default',
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const theme = lineThemeClasses[lineTheme];

  const handleAddToCart = () => {
    if (onAddToCart && stock > 0) {
      onAddToCart(id, quantity);
    }
  };

  const handleToggleFavorite = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 transition-colors ${
          index < Math.floor(rating)
            ? theme.star
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden transition-all duration-500",
        "hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]",
        cardVariants[variant],
        // Add shimmer effect for elegant variant
        variant === 'elegant' && "before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer before:z-10",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-bg-light to-bg-cream">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          <Image
            src={imageUrl}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-110 group-hover:brightness-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <Badge className={cn(theme.badge, "font-semibold shadow-md animate-pulse-gentle")}>
                <Sparkles className="h-3 w-3 mr-1" />
                Nuevo
              </Badge>
            )}
            {isOnSale && (
              <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md">
                <span className="font-bold">Oferta</span>
              </Badge>
            )}
            {isNatural && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 shadow-md">
                <Leaf className="h-3 w-3 mr-1" />
                Natural
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className={cn(
            "absolute top-3 right-3 flex flex-col gap-2 transition-all duration-500",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
          )}>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-white/20 transition-all duration-300 hover:scale-110"
              onClick={handleToggleFavorite}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
                )}
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-white/20 transition-all duration-300 hover:scale-110"
              asChild
            >
              <Link href={`/productos/${id}`}>
                <Eye className="h-4 w-4 text-gray-600 hover:text-gray-800" />
              </Link>
            </Button>
          </div>

          {/* Stock Warning */}
          {stock <= 5 && stock > 0 && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="outline" className="bg-white/95 text-orange-600 border-orange-300 shadow-md backdrop-blur-sm animate-pulse-gentle">
                ¡Solo {stock} disponibles!
              </Badge>
            </div>
          )}

          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Badge variant="secondary" className="bg-white text-gray-800 shadow-xl px-4 py-2 text-base">
                Sin Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <CardContent className="p-5 space-y-4">
          {/* Category */}
          <div className="text-xs text-text-secondary uppercase tracking-widest font-medium">
            {category}
          </div>

          {/* Name */}
          <Link href={`/productos/${id}`} className="block group/link">
            <h3 className="font-bold text-lg text-text-primary line-clamp-2 group-hover/link:text-brand-primary transition-colors duration-300 leading-tight">
              {name}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Size */}
          {size && (
            <div className="flex items-center text-xs text-text-secondary">
              <Sparkles className="h-3 w-3 mr-1 text-gold-500" />
              <span className="font-medium">{size}</span>
            </div>
          )}

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {renderStars(rating)}
            </div>
            <span className="text-sm text-text-secondary font-medium">
              ({reviewCount} reseñas)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className={cn("text-xl font-bold", theme.accent)}>
                {formatPrice(price)}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {originalPrice && originalPrice > price && (
              <div className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md inline-block">
                Ahorrás {formatPrice(originalPrice - price)}
              </div>
            )}
          </div>

          {/* Add to Cart */}
          <div className="space-y-3 pt-2">
            {stock > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-lg bg-white shadow-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-gray-50 rounded-l-lg"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-gray-50 rounded-r-lg"
                    onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  className={cn(
                    "flex-1 font-semibold shadow-md transition-all duration-300",
                    "hover:shadow-lg hover:scale-105 active:scale-95",
                    theme.button
                  )}
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar
                </Button>
              </div>
            )}
            
            {stock === 0 && (
              <Button
                disabled
                variant="secondary"
                className="w-full opacity-60"
                size="sm"
              >
                Sin Stock
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
} 