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
  Minus,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLike } from "@/contexts/LikeContext";
import RichTextDisplay from "@/components/ui/RichTextDisplay";

interface ProductCardProps {
  id: string;
  slug?: string;
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
  variant?: "default" | "elegant" | "artisanal" | "glass";
  lineTheme?:
  | "alma-terra"
  | "ecos"
  | "jade-ritual"
  | "umbral"
  | "utopica"
  | "kits-experiencia"
  | "default";
  onAddToCart?: (productId: string, quantity: number) => void;
  // New fields from migration 20260325000000
  promotionalTag?:
  | "none"
  | "lanzamiento"
  | "descuento"
  | "ultimas_unidades"
  | null;
  discountTransferPercent?: number | null;
  discountCashPercent?: number | null;
  installments3Enabled?: boolean;
  installments6Enabled?: boolean;
}

const cardVariants = {
  default: "bg-white border-border",
  elegant:
    "bg-gradient-to-br from-[#f6fbd6] to-[white] border-gold-200 shadow-elegant",
  artisanal: "bg-cream border-earth-200 shadow-artisanal",
  glass: "bg-white/80 backdrop-blur-md border-white/20 shadow-glass",
};

const lineThemeClasses = {
  "alma-terra": {
    accent: "text-alma-primary",
    badge: "bg-alma-primary/10 text-alma-primary border-alma-primary/20",
    button: "bg-alma-primary hover:bg-alma-primary/90 text-white",
    star: "fill-alma-secondary text-alma-secondary",
    background:
      "linear-gradient(145deg, #FFEFCC 0%, #FFEFC6 50%, #FFD699 100%)",
    backgroundEnd: "#FFD699",
    border: "#9B201A",
  },
  ecos: {
    accent: "text-ecos-primary",
    badge: "bg-ecos-primary/10 text-ecos-primary border-ecos-primary/20",
    button: "bg-ecos-primary hover:bg-ecos-primary/90 text-white",
    star: "fill-ecos-secondary text-ecos-secondary",
    background:
      "linear-gradient(145deg, #B7DFE5 0%, #A5D4DB 50%, #8FC9D1 100%)",
    backgroundEnd: "#8FC9D1",
    border: "#12406F",
  },
  "jade-ritual": {
    accent: "text-jade-primary",
    badge: "bg-jade-primary/10 text-jade-primary border-jade-primary/20",
    button: "bg-jade-primary hover:bg-jade-primary/90 text-white",
    star: "fill-jade-secondary text-jade-secondary",
    background:
      "linear-gradient(145deg, #D3E1BE 0%, #C5D6AD 50%, #B7CB9C 100%)",
    backgroundEnd: "#B7CB9C",
    border: "#04412D",
  },
  umbral: {
    accent: "text-umbral-primary",
    badge: "bg-umbral-primary/10 text-umbral-primary border-umbral-primary/20",
    button: "bg-umbral-primary hover:bg-umbral-primary/90 text-white",
    star: "fill-umbral-secondary text-umbral-secondary",
    background:
      "linear-gradient(145deg, #FFF2DB 0%, #FFE8C2 50%, #FFDEA9 100%)",
    backgroundEnd: "#FFDEA9",
    border: "#EA4F12",
  },
  utopica: {
    accent: "text-utopica-primary",
    badge:
      "bg-utopica-primary/10 text-utopica-primary border-utopica-primary/20",
    button: "bg-utopica-primary hover:bg-utopica-primary/90 text-white",
    star: "fill-utopica-secondary text-utopica-secondary",
    background:
      "linear-gradient(145deg, #F9F5C5 0%, #F7F1B5 50%, #F5EDA5 100%)",
    backgroundEnd: "#F5EDA5",
    border: "#392E13",
  },
  "kits-experiencia": {
    accent: "text-brand-primary",
    badge: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    button: "bg-brand-primary hover:bg-brand-primary/90 text-white",
    star: "fill-gold-500 text-gold-500",
    background:
      "linear-gradient(145deg, #F6FBD6 0%, #F3F9C4 50%, #F0F7B2 100%)",
    backgroundEnd: "#F0F7B2",
    border: "#AE0000",
  },
  default: {
    accent: "text-brand-primary",
    badge: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    button: "bg-brand-primary hover:bg-brand-primary/90 text-white",
    star: "fill-gold-500 text-gold-500",
    background:
      "linear-gradient(145deg, #FFFFFF 0%, #F8F8F8 50%, #F5F5F5 100%)",
    backgroundEnd: "#F5F5F5",
    border: "hsl(var(--border))",
  },
};

export default function ProductCard({
  id,
  slug,
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
  variant = "default",
  lineTheme = "default",
  onAddToCart,
  promotionalTag = "none",
  discountTransferPercent,
  discountCashPercent,
  installments3Enabled = false,
  installments6Enabled = false,
}: ProductCardProps) {
  const productHref = `/productos/${slug || id}`;
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use LikeContext for like functionality
  const { toggleLike, isLiked, isLoading: likeLoading } = useLike();
  const isFavorite = isLiked(id);

  const theme = lineThemeClasses[lineTheme];

  const handleAddToCart = () => {
    console.log("Add to cart clicked for product:", id, "quantity:", quantity);
    if (onAddToCart && stock > 0) {
      onAddToCart(id, quantity);
      // Reset quantity to 1 after adding to cart
      setQuantity(1);
    }
  };

  const handleToggleFavorite = async () => {
    console.log("Toggle favorite clicked for product:", id);
    await toggleLike(id);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  const formatInstallment = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(Math.round(amount));
  };

  // Get discount price based on percentage
  const getDiscountPrice = (basePrice: number, discountPercent: number) => {
    if (!discountPercent || discountPercent <= 0) return null;
    return basePrice * (1 - discountPercent / 100);
  };

  // Render promotional tag badge with DaLuz style (beige background, bordó text)
  const renderPromotionalTagBadge = () => {
    if (!promotionalTag || promotionalTag === "none") return null;

    const tagConfig = {
      lanzamiento: { label: "Lanzamiento", icon: Sparkles },
      descuento: { label: "Descuento", icon: Leaf },
      ultimas_unidades: { label: "Últimas Unidades", icon: AlertCircle },
    };

    const config = tagConfig[promotionalTag as keyof typeof tagConfig];
    if (!config) return null;

    const Icon = config.icon;

    return (
      <Badge
        className="shadow-md text-sm px-2 py-1"
        style={{
          backgroundColor: "#FFF2DB",
          color: "#791010",
          fontFamily: "EB Garamond, var(--font-text), serif",
          fontStyle: "italic",
          fontWeight: 500,
          border: "none",
        }}
      >
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Calculate discounted prices
  const transferDiscountPrice = discountTransferPercent
    ? getDiscountPrice(price, discountTransferPercent)
    : null;
  const cashDiscountPrice = discountCashPercent
    ? getDiscountPrice(price, discountCashPercent)
    : null;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 transition-colors ${index < Math.floor(rating) ? theme.star : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-500 flex flex-col box-border",
        "hover:shadow-xl h-[480px] sm:h-[520px] lg:h-[540px]",
        lineTheme === "default" ? cardVariants[variant] : "",
        className,
      )}
      style={{
        pointerEvents: "auto",
        borderRadius: "0px 15px",
        background: lineTheme !== "default" ? theme.background : undefined,
        borderColor: lineTheme !== "default" ? `${theme.border}33` : undefined,
        borderWidth: lineTheme !== "default" ? "1px" : undefined,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex flex-col h-full box-border">
        {/* Product Image - Fixed height for consistency */}
        <div className="relative h-32 sm:h-36 lg:h-40 overflow-hidden bg-gradient-to-br from-bg-light to-bg-cream flex-shrink-0">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          )}
          <Image
            src={
              imageUrl && !imageUrl.startsWith("file://")
                ? imageUrl
                : "/images/placeholder-product.jpg"
            }
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-700",
              "group-hover:scale-110 group-hover:brightness-105",
              imageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />

          {/* Top Left Overlay Badges */}
          <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1 max-w-[calc(100%-3rem)]">
            {promotionalTag && promotionalTag !== "none" && renderPromotionalTagBadge()}
            {isOnSale && (
              <Badge
                variant="destructive"
                className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md text-xs px-2 py-0.5"
              >
                <span className="font-bold">OFERTA</span>
              </Badge>
            )}
            {isNew && (
              <Badge
                className={cn(
                  theme.badge,
                  "font-semibold shadow-md animate-pulse-gentle text-xs px-2 py-0.5",
                )}
              >
                <Sparkles className="h-2.5 w-2.5 mr-1" />
                Nuevo
              </Badge>
            )}
          </div>

          {/* Like Button */}
          <div className="absolute top-2 right-2 z-20">
            <Heart
              className={cn(
                "h-4 w-4 sm:h-5 sm:w-5 cursor-pointer transition-all duration-300 hover:scale-110",
                isFavorite
                  ? "fill-red-500 text-red-500"
                  : "text-white/80 hover:text-red-500 hover:fill-red-500",
                likeLoading && "opacity-50",
              )}
              onClick={handleToggleFavorite}
            />
          </div>

          {/* Hover Overlay - Ver Producto */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center transition-all duration-300 z-10",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Link href={productHref} className="block">
              <div className="bg-white/90 text-gray-800 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-lg hover:bg-white hover:scale-105 transition-all duration-300 text-xs sm:text-sm">
                Ver producto
              </div>
            </Link>
          </div>

          {/* Stock Warning */}
          {stock <= 5 && stock > 0 && (
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <Badge
                variant="outline"
                className="bg-white/95 text-orange-600 border-orange-300 shadow-md backdrop-blur-sm animate-pulse-gentle text-[10px] sm:text-xs px-1.5 py-0.5"
              >
                ¡Solo {stock}!
              </Badge>
            </div>
          )}

          {stock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm pointer-events-none">
              <Badge
                variant="secondary"
                className="bg-white text-gray-800 shadow-xl px-4 py-2 text-base"
              >
                Sin Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info - scrollable content */}
        <CardContent
          padding="none"
          className="p-2 sm:p-3 flex-1 flex flex-col overflow-visible"
        >
          {/* Desktop Layout */}
          <div className="hidden lg:flex lg:flex-col h-full">
            {/* Top Content - scrollable if too tall */}
            <div className="space-y-2 lg:space-y-3 overflow-y-auto flex-1 pr-1">

              {/* Name */}
              <Link href={productHref} className="block group/link">
                <h3
                  className="font-semibold text-base lg:text-lg text-[#791010] line-clamp-2 group-hover/link:text-brand-primary transition-colors duration-300 leading-tight"
                  style={{
                    fontFamily: "Playfair Display, var(--font-playfair), serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                  }}
                >
                  {name}
                </h3>
              </Link>

              {/* Rating - Hidden on small screens */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {renderStars(rating)}
                </div>
                <span className="text-xs text-text-secondary font-medium">
                  ({reviewCount})
                </span>
              </div>

              {/* Price */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn("text-lg lg:text-xl font-bold", theme.accent)}
                  >
                    {formatPrice(price)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-text-secondary line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                {originalPrice && originalPrice > price && (
                  <div className="text-sm text-[#791010] font-semibold bg-green-50 px-2 py-1 rounded-md inline-block">
                    Ahorrás {formatPrice(originalPrice - price)}
                  </div>
                )}
                {(installments3Enabled || installments6Enabled) && (
                  <div className="flex flex-col gap-1.5">
                    {installments3Enabled && (
                      <div
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border whitespace-nowrap"
                        style={{
                          backgroundColor: "#ECFDF5",
                          borderColor: "#A7F3D0",
                          color: "#15803D",
                        }}
                      >
                        <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          3 cuotas sin interés de {formatInstallment(price / 3)}
                        </span>
                      </div>
                    )}
                    {installments6Enabled && (
                      <div
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border whitespace-nowrap"
                        style={{
                          backgroundColor: "#ECFDF5",
                          borderColor: "#A7F3D0",
                          color: "#15803D",
                        }}
                      >
                        <CreditCard className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-semibold">
                          6 cuotas sin interés de {formatInstallment(price / 6)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Discount prices for transfer/cash */}
                {(transferDiscountPrice || cashDiscountPrice) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {transferDiscountPrice && (
                      <div
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: "#FFF2DB", color: "#791010" }}
                      >
                        <span
                          style={{
                            fontFamily: "EB Garamond, var(--font-text), serif",
                            fontStyle: "italic",
                          }}
                        >
                          Transferencia: {formatPrice(transferDiscountPrice)}
                          {discountTransferPercent &&
                            ` (-${discountTransferPercent}%)`}
                        </span>
                      </div>
                    )}
                    {cashDiscountPrice && (
                      <div
                        className="px-2 py-1 rounded-md"
                        style={{ backgroundColor: "#FFF2DB", color: "#791010" }}
                      >
                        <span
                          style={{
                            fontFamily: "EB Garamond, var(--font-text), serif",
                            fontStyle: "italic",
                          }}
                        >
                          Efectivo: {formatPrice(cashDiscountPrice)}
                          {discountCashPercent && ` (-${discountCashPercent}%)`}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description - Hidden on mobile to save space */}
              <div className="hidden sm:block text-xs lg:text-sm text-text-secondary line-clamp-1 lg:line-clamp-2 leading-relaxed">
                <RichTextDisplay
                  content={description}
                  className="text-xs lg:text-sm text-text-secondary line-clamp-1 lg:line-clamp-2 leading-relaxed [&_strong]:font-semibold [&_em]:italic [&_u]:underline [&_p]:m-0 [&_p]:p-0"
                />
              </div>

              {/* Size */}
              {size && (
                <div className="flex items-center text-xs text-text-secondary">
                  <Sparkles className="h-3 w-3 mr-1 text-gold-500" />
                  <span className="font-medium">{size}</span>
                </div>
              )}
            </div>

            {/* Bottom Content - Always at bottom */}
            <div className="mt-auto pt-3 lg:pt-4 flex-shrink-0">
              {/* Desktop Add to Cart */}
              <div className="w-full">
                {stock > 0 && (
                  <div className="flex items-center gap-1 min-w-0">
                    {/* Desktop: Compact quantity selector */}
                    <div className="flex items-center border border-border rounded-md lg:rounded-lg bg-white shadow-sm flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 lg:h-9 lg:w-9 p-0 hover:bg-gray-50 rounded-l-md lg:rounded-l-lg disabled:opacity-50"
                        onClick={() => {
                          setQuantity(Math.max(1, quantity - 1));
                        }}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                      <span className="px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm min-w-[2rem] lg:min-w-[2.5rem] text-center font-medium">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 lg:h-9 lg:w-9 p-0 hover:bg-gray-50 rounded-r-md lg:rounded-r-lg disabled:opacity-50"
                        onClick={() => {
                          setQuantity(Math.min(stock, quantity + 1));
                        }}
                        disabled={quantity >= stock}
                      >
                        <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                      </Button>
                    </div>

                    {/* Desktop: Add button */}
                    <Button
                      onClick={handleAddToCart}
                      disabled={stock === 0}
                      className={cn(
                        "flex-1 font-semibold shadow-md transition-all duration-300 uppercase tracking-wide",
                        "hover:shadow-lg hover:scale-105 active:scale-95",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                        "text-[9px] lg:text-[10px] h-8 lg:h-9 px-1 lg:px-2",
                        theme.button,
                      )}
                      size="sm"
                    >
                      <ShoppingCart className="h-3 w-3 lg:h-4 lg:w-4 mr-0.5 flex-shrink-0" />
                      <span className="truncate">Añadir</span>
                    </Button>
                  </div>
                )}

                {stock === 0 && (
                  <Button
                    disabled
                    variant="secondary"
                    className="w-full opacity-60 h-9"
                    size="sm"
                  >
                    Sin Stock
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout - Flex column with scrollable content */}
          <div className="lg:hidden flex flex-col h-full">
            {/* Top Content - scrollable if too tall */}
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">

              {/* Name - Smaller, Left aligned */}
              <Link href={productHref} className="block group/link">
                <h3
                  className="font-semibold text-sm text-[#791010] line-clamp-2 group-hover/link:text-brand-primary transition-colors duration-300 leading-tight text-left"
                  style={{
                    fontFamily: "Playfair Display, var(--font-playfair), serif",
                    fontWeight: 600,
                    fontStyle: "normal",
                  }}
                >
                  {name}
                </h3>
              </Link>

              {/* Rating - Compact, Left aligned */}
              <div className="flex items-center gap-1 text-left">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      className={`h-2.5 w-2.5 transition-colors ${index < Math.floor(rating)
                          ? theme.star
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-secondary">
                  ({reviewCount})
                </span>
              </div>

              {/* Price - Prominent, Left aligned */}
              <div className="flex flex-col gap-1 text-left">
                <div className="flex items-center gap-2">
                  <span className={cn("text-base font-bold", theme.accent)}>
                    {formatPrice(price)}
                  </span>
                  {originalPrice && originalPrice > price && (
                    <span className="text-xs text-text-secondary line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  )}
                </div>
                {(installments3Enabled || installments6Enabled) && (
                  <div className="flex flex-col gap-1">
                    {installments3Enabled && (
                      <div
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded border whitespace-nowrap"
                        style={{
                          backgroundColor: "#ECFDF5",
                          borderColor: "#A7F3D0",
                          color: "#15803D",
                        }}
                      >
                        <CreditCard className="h-3 w-3 flex-shrink-0" />
                        <span className="text-[10px] font-semibold">
                          3 cuotas sin interés de {formatInstallment(price / 3)}
                        </span>
                      </div>
                    )}
                    {installments6Enabled && (
                      <div
                        className="flex items-center gap-1.5 px-1.5 py-1 rounded border whitespace-nowrap"
                        style={{
                          backgroundColor: "#ECFDF5",
                          borderColor: "#A7F3D0",
                          color: "#15803D",
                        }}
                      >
                        <CreditCard className="h-3 w-3 flex-shrink-0" />
                        <span className="text-[10px] font-semibold">
                          6 cuotas sin interés de {formatInstallment(price / 6)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {/* Discount prices for transfer/cash - Mobile */}
                {(transferDiscountPrice || cashDiscountPrice) && (
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {transferDiscountPrice && (
                      <div
                        className="px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#FFF2DB", color: "#791010" }}
                      >
                        <span
                          style={{
                            fontFamily: "EB Garamond, var(--font-text), serif",
                            fontStyle: "italic",
                          }}
                        >
                          Transf: {formatPrice(transferDiscountPrice)}
                        </span>
                      </div>
                    )}
                    {cashDiscountPrice && (
                      <div
                        className="px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: "#FFF2DB", color: "#791010" }}
                      >
                        <span
                          style={{
                            fontFamily: "EB Garamond, var(--font-text), serif",
                            fontStyle: "italic",
                          }}
                        >
                          Efectivo: {formatPrice(cashDiscountPrice)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Low Stock Alert - Mobile only */}
              {stock <= 5 && stock > 0 && (
                <div>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-600 border-orange-300 text-[10px] px-1 py-0.5"
                  >
                    ¡Solo {stock} disponibles!
                  </Badge>
                </div>
              )}
            </div>

            {/* Bottom Content - Always at bottom */}
            <div className="mt-auto pt-2 flex-shrink-0">
              {stock > 0 ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={stock === 0}
                  className={cn(
                    "w-full font-semibold shadow-md transition-all duration-300",
                    "hover:shadow-lg hover:scale-105 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                    "text-xs h-8",
                    theme.button,
                  )}
                  size="sm"
                >
                  <ShoppingCart className="h-3 w-3 mr-1" />
                  Agregar
                </Button>
              ) : (
                <Button
                  disabled
                  variant="secondary"
                  className="w-full opacity-60 h-8"
                  size="sm"
                >
                  Sin Stock
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
