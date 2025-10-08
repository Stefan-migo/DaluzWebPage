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
import { useLike } from "@/contexts/LikeContext";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

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
}

const cardVariants = {
  default: "bg-white border-border",
  elegant: "bg-gradient-to-br from-[#f6fbd6] to-[white] border-gold-200 shadow-elegant",
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
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Use LikeContext for like functionality
  const { toggleLike, isLiked, isLoading: likeLoading } = useLike();
  const isFavorite = isLiked(id);

  const theme = lineThemeClasses[lineTheme];

  const handleAddToCart = () => {
    console.log('Add to cart clicked for product:', id, 'quantity:', quantity);
    if (onAddToCart && stock > 0) {
      onAddToCart(id, quantity);
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  };

  const handleToggleFavorite = async () => {
    console.log('Toggle favorite clicked for product:', id);
    await toggleLike(id);
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
        "hover:shadow-xl",
        // "hover:-translate-y-2 hover:scale-[1.02]", // Temporarily disabled for debugging
        cardVariants[variant],
        // Add shimmer effect for elegant variant - temporarily disabled for debugging
        // variant === 'elegant' && "before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-shimmer before:pointer-events-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => console.log('Card clicked for product:', id)}
      style={{ pointerEvents: 'auto' }}
    >
      <div className="relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-bg-light to-bg-cream">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          <Image
            src={imageUrl && !imageUrl.startsWith('file://') ? imageUrl : '/images/placeholder-product.jpg'}
            alt={name}
            fill
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-110 group-hover:brightness-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />
          
          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          
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

          {/* Like Button - Always visible in top-right */}
          <div className="absolute top-3 right-3 z-20">
            <Button
              variant="secondary"
              size="sm"
              className="h-9 w-9 p-0 bg-white/95 hover:bg-white shadow-lg backdrop-blur-sm border-white/20 transition-all duration-300 hover:scale-110"
              onClick={handleToggleFavorite}
              disabled={likeLoading}
            >
              <Heart 
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500",
                  likeLoading && "opacity-50"
                )}
              />
            </Button>
          </div>

          {/* Hover Overlay - Ver Producto */}
          <div className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <Link href={`/productos/${id}`} className="block">
              <div className="bg-white/90 text-gray-800 px-6 py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all duration-300">
                Ver producto
              </div>
            </Link>
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
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
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
          <div className="space-y-3">
            <Link href={`/productos/${id}`} className="block group/link">
              <h3 
                className="font-normal text-lg text-text-primary line-clamp-2 group-hover/link:text-brand-primary transition-colors duration-300 leading-tight"
                style={{
                  fontFamily: 'VELISTA, var(--font-velista), serif',
                  fontWeight: 'normal',
                  fontStyle: 'normal'
                }}
              >
                {name}
              </h3>
            </Link>
          </div>

          {/* Description */}
          <div className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
            <RichTextDisplay 
              content={description} 
              className="text-sm text-text-secondary line-clamp-2 leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_p]:m-0 [&_p]:p-0"
            />
          </div>

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
              ({reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'})
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
                    className="h-9 w-9 p-0 hover:bg-gray-50 rounded-l-lg disabled:opacity-50"
                    onClick={() => {
                      console.log('Minus clicked, current quantity:', quantity);
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-sm min-w-[3rem] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-gray-50 rounded-r-lg disabled:opacity-50"
                    onClick={() => {
                      console.log('Plus clicked, current quantity:', quantity, 'stock:', stock);
                      setQuantity(Math.min(stock, quantity + 1));
                    }}
                    disabled={quantity >= stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={cn(
                    "flex-1 font-semibold shadow-md transition-all duration-300",
                    "hover:shadow-lg hover:scale-105 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    theme.button
                  )}
                  size="sm"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {stock > 0 ? 'Agregar' : 'Sin Stock'}
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