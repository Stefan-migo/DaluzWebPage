"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCart } from "@/contexts/CartContext";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  Star, 
  Heart, 
  Share2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  Shield, 
  Leaf,
  ArrowLeft,
  Check,
  AlertCircle,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";
import RichTextDisplay from "@/components/ui/RichTextDisplay";
import ProductCard from "@/components/ui/brand/ProductCard";
import { ReviewList } from "@/components/ui/reviews/ReviewList";
import { ReviewForm } from "@/components/ui/reviews/ReviewForm";
import { StarDisplay } from "@/components/ui/reviews/StarRating";
import { ArrowLeftSVG, ArrowRightSVG } from "@/components/svg/SVGComponents";

interface ProductVariant {
  id: string;
  title: string;
  price: number;
  compare_at_price?: number;
  inventory_quantity: number;
  weight?: number;
  barcode?: string;
  image_url?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  position: number;
  is_default: boolean;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  gallery?: string[];
  video_url?: string;
  inventory_quantity: number;
  ingredients?: any[];
  skin_type: string[];
  benefits: string[];
  usage_instructions?: string;
  precautions?: string;
  certifications: string[];
  shelf_life_months?: number;
  weight?: number;
  dimensions?: any;
  package_characteristics?: string;
  tags: string[];
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  categories?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
  };
  product_variants?: ProductVariant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const { addItem } = useCart();
  const { user } = useAuthContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);

  // Get current user ID from auth context
  useEffect(() => {
    if (user?.id) {
      setCurrentUserId(user.id);
    } else {
      setCurrentUserId(null);
    }
  }, [user]);

  // Fetch product details
  useEffect(() => {
    async function fetchProduct() {
      if (!params.slug) return;
      
      setLoading(true);
      try {
        // First try to find by slug, if not found try by ID
        let response = await fetch(`/api/products/by-slug/${params.slug}`);
        
        if (!response.ok && response.status === 404) {
          // Fallback to ID search if slug not found
          response = await fetch(`/api/products/${params.slug}`);
        }

        if (response.ok) {
          const data = await response.json();
          setProduct(data.product);
          
          // Set default variant and image
          const defaultVariant = data.product.product_variants?.find((v: ProductVariant) => v.is_default) 
            || data.product.product_variants?.[0];
          setSelectedVariant(defaultVariant);
          setSelectedImage(defaultVariant?.image_url || data.product.featured_image);
          
          // Fetch related products from the same line
          fetchRelatedProducts(data.product);
        } else {
          toast.error('Producto no encontrado');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug]);

  // Fetch related products from the same line
  const fetchRelatedProducts = async (currentProduct: Product) => {
    setRelatedLoading(true);
    try {
      // Determine the product line based on category or product name
      const productLine = determineProductLine(currentProduct);
      
      if (productLine) {
        const response = await fetch(`/api/products?limit=8&in_stock=true`);
        const data = await response.json();
        
        if (response.ok) {
          // Filter products from the same line, excluding current product
          const related = (data.products || []).filter((product: Product) => {
            if (product.id === currentProduct.id) return false;
            
            const name = product.name?.toLowerCase() || '';
            const description = product.description?.toLowerCase() || '';
            const shortDescription = product.short_description?.toLowerCase() || '';
            const categoryName = product.categories?.name?.toLowerCase() || '';
            const categorySlug = product.categories?.slug?.toLowerCase() || '';
            const lineName = productLine.name.toLowerCase();
            const lineId = productLine.id.toLowerCase();
            
            return (
              categoryName.includes(lineName) ||
              categoryName.includes(lineId) ||
              categorySlug.includes(lineId) ||
              name.includes(lineName) ||
              name.includes(lineId) ||
              description.includes(lineName) ||
              description.includes(lineId) ||
              shortDescription.includes(lineName) ||
              shortDescription.includes(lineId)
            );
          }).slice(0, 4);
          
          setRelatedProducts(related);
        }
      }
    } catch (error) {
      console.error('Error fetching related products:', error);
    } finally {
      setRelatedLoading(false);
    }
  };

  // Determine product line based on product data
  const determineProductLine = (product: Product) => {
    const productLines = [
      { 
        id: 'alma-terra', 
        name: 'Alma Terra',
        primaryColor: '#9B201A',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-[#9B201A] hover:bg-[#9B201A]/90 text-white',
        outlineColor: 'border-[#9B201A]/20 text-[#9B201A] hover:bg-[#9B201A]/5'
      },
      { 
        id: 'ecos', 
        name: 'Ecos',
        primaryColor: '#12406F',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-[#12406F] hover:bg-[#12406F]/90 text-white',
        outlineColor: 'border-[#12406F]/20 text-[#12406F] hover:bg-[#12406F]/5'
      },
      { 
        id: 'jade-ritual', 
        name: 'Jade Ritual',
        primaryColor: '#04412D',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-[#04412D] hover:bg-[#04412D]/90 text-white',
        outlineColor: 'border-[#04412D]/20 text-[#04412D] hover:bg-[#04412D]/5'
      },
      { 
        id: 'umbral', 
        name: 'Umbral',
        primaryColor: '#EA4F12',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-[#EA4F12] hover:bg-[#EA4F12]/90 text-white',
        outlineColor: 'border-[#EA4F12]/20 text-[#EA4F12] hover:bg-[#EA4F12]/5'
      },
      { 
        id: 'utopica', 
        name: 'Utópica',
        primaryColor: '#392E13',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-[#392E13] hover:bg-[#392E13]/90 text-white',
        outlineColor: 'border-[#392E13]/20 text-[#392E13] hover:bg-[#392E13]/5'
      }
    ];

    const name = product.name?.toLowerCase() || '';
    const description = product.description?.toLowerCase() || '';
    const categoryName = product.categories?.name?.toLowerCase() || '';
    
    return productLines.find(line => 
      name.includes(line.name.toLowerCase()) ||
      name.includes(line.id) ||
      description.includes(line.name.toLowerCase()) ||
      description.includes(line.id) ||
      categoryName.includes(line.name.toLowerCase()) ||
      categoryName.includes(line.id)
    );
  };

  // Get color palette for current product
  const getColorPalette = () => {
    if (!product) {
      // Default color palette from main landing page
      return {
        id: 'default',
        name: 'Default',
        primaryColor: '#AE0000',
        secondaryColor: '#F0EACE',
        buttonColor: 'bg-dorado hover:bg-dorado/90 text-azul-profundo',
        outlineColor: 'border-azul-profundo/20 text-azul-profundo hover:bg-azul-profundo/5'
      };
    }
    
    const productLine = determineProductLine(product);
    if (productLine) {
      return productLine;
    }
    
    // Default color palette from main landing page
    return {
      id: 'default',
      name: 'Default',
      primaryColor: '#AE0000',
      secondaryColor: '#F0EACE',
      buttonColor: 'bg-dorado hover:bg-dorado/90 text-azul-profundo',
      outlineColor: 'border-azul-profundo/20 text-azul-profundo hover:bg-azul-profundo/5'
    };
  };

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.image_url || product?.featured_image || '');
    setQuantity(1);
  };

  // Image navigation functions
  const nextImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setSelectedImage(images[(currentImageIndex + 1) % images.length]);
  };

  const prevImage = () => {
    const images = getImages();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setSelectedImage(images[(currentImageIndex - 1 + images.length) % images.length]);
  };

  const selectImage = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const variant = selectedVariant || product.product_variants?.[0];
    const currentPrice = variant?.price || product.price;
    const currentStock = variant?.inventory_quantity || product.inventory_quantity;

    if (currentStock < quantity) {
      toast.error('Stock insuficiente');
      return;
    }

    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      price: currentPrice,
      originalPrice: product.compare_at_price,
      image: selectedImage,
      stock: currentStock,
      size: variant?.option1,
      sku: product.slug,
      quantity,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!currentUserId) return;
    
    try {
      const response = await fetch(
        `/api/products/${product?.id}/reviews/${reviewId}?user_id=${currentUserId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la reseña');
      }

      toast.success('Reseña eliminada exitosamente');
      // The ReviewList component will automatically refresh
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Error al eliminar la reseña. Por favor intenta de nuevo.');
    }
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    // The ReviewList component will automatically refresh
  };

  const getCurrentPrice = () => {
    return selectedVariant?.price || product?.price || 0;
  };

  const getCurrentStock = () => {
    return selectedVariant?.inventory_quantity || product?.inventory_quantity || 0;
  };

  const getImages = () => {
    if (!product) return [];
    const images = [product.featured_image];
    if (product.gallery) {
      images.push(...product.gallery);
    }
    // Add variant images
    product.product_variants?.forEach(variant => {
      if (variant.image_url && !images.includes(variant.image_url)) {
        images.push(variant.image_url);
      }
    });
    
    // Return all available images (no minimum requirement)
    return images.filter(Boolean);
  };

  // Calculate intelligent thumbnail sizing based on number of images
  const getThumbnailSize = (imageCount: number) => {
    if (imageCount <= 3) {
      return { size: 'h-20', container: 'max-h-80' };
    } else if (imageCount === 4) {
      return { size: 'h-16', container: 'max-h-80' };
    } else {
      return { size: 'h-14', container: 'max-h-80' };
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-200 rounded" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-azul-profundo mb-4">Producto no encontrado</h1>
        <Link href="/productos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Button>
        </Link>
      </div>
    );
  }

  const images = getImages();
  const currentStock = getCurrentStock();
  const currentPrice = getCurrentPrice();
  const isInStock = currentStock > 0;

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background */}
      <div 
        className="fixed inset-0 w-full h-full opacity-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/svg/backgrounds/tienda-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-tierra-media">
            <li><Link href="/" className="hover:text-azul-profundo">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/productos" className="hover:text-azul-profundo">Productos</Link></li>
            {product.categories && (
              <>
                <li>/</li>
                <li><Link href={`/productos?category=${product.categories.id}`} className="hover:text-azul-profundo">
                  {product.categories.name}
                </Link></li>
              </>
            )}
            <li>/</li>
            <li className="text-azul-profundo font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images */}
          <div className="space-y-4">
            {/* Thumbnail Navigation - Left Side */}
            <div className="flex gap-4 items-center">
              {/* Thumbnail Column */}
              <div className="flex flex-col gap-2 w-auto justify-center">
                {/* Up Arrow */}
                {images.length > 3 && (
                  <button
                    onClick={() => {
                      const newIndex = Math.max(0, currentImageIndex - 1);
                      selectImage(images[newIndex], newIndex);
                    }}
                    className="w-full h-8 flex items-center justify-center transition-colors"
                    disabled={currentImageIndex === 0}
                  >
                    <ArrowLeftSVG className="h-4 w-4 text-azul-profundo drop-shadow-lg rotate-90" />
                  </button>
                )}
                
                {/* Thumbnails with intelligent sizing - vertically centered */}
                <div className={`flex flex-col justify-center gap-2 ${getThumbnailSize(images.length).container} overflow-hidden`}>
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => selectImage(image, index)}
                      className={`w-16 ${getThumbnailSize(images.length).size} relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                        selectedImage === image 
                          ? 'border-dorado shadow-lg scale-105' 
                          : 'border-gray-200 hover:border-gray-300 hover:scale-105'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
                
                {/* Down Arrow */}
                {images.length > 3 && (
                  <button
                    onClick={() => {
                      const newIndex = Math.min(images.length - 1, currentImageIndex + 1);
                      selectImage(images[newIndex], newIndex);
                    }}
                    className="w-full h-8 flex items-center justify-center transition-colors"
                    disabled={currentImageIndex >= images.length - 1}
                  >
                    <ArrowRightSVG className="h-4 w-4 text-azul-profundo drop-shadow-lg rotate-90" />
                  </button>
                )}
              </div>

              {/* Main Image Display */}
              <div className="flex-1">
                <div 
                  className="aspect-square relative overflow-hidden rounded-lg bg-white shadow-lg cursor-pointer group"
                  onClick={() => setShowImageModal(true)}
                >
                  <Image
                    src={selectedImage || product.featured_image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                  
                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <ArrowLeftSVG className="h-8 w-8 text-azul-profundo drop-shadow-lg" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      >
                        <ArrowRightSVG className="h-8 w-8 text-azul-profundo drop-shadow-lg" />
                      </button>
                    </>
                  )}
                  
                  {/* Click to enlarge indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Click para ampliar
                  </div>
                  
                  {/* Badges */}
                  {product.compare_at_price && product.compare_at_price > currentPrice && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                      -{Math.round(((product.compare_at_price - currentPrice) / product.compare_at_price) * 100)}%
                    </Badge>
                  )}
                  {product.is_featured && (
                    <Badge className="absolute top-4 right-4 bg-dorado text-azul-profundo">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Destacado
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Product Information */}
          <div className="space-y-6 px-[4rem]">
            {/* Header */}
            <div>
              
              <h1 className="text-3xl font-bold text-azul-profundo mb-2">{product.name}</h1>
              
              {product.short_description && (
                <div className="text-tierra-media text-lg leading-relaxed">
                  <RichTextDisplay content={product.short_description} />
                </div>
              )}

<div className="flex items-center gap-2 mt-2 mb-4">
                {product.categories && (
                  <Badge variant="outline" className="border-azul-profundo/20 text-azul-profundo">
                    {product.categories.name}
                  </Badge>
                )}
                {product.certifications.includes('organic') && (
                  <Badge variant="secondary" className="bg-verde-suave/20 text-verde-suave border-verde-suave/30">
                    <Leaf className="h-3 w-3 mr-1" />
                    Orgánico
                  </Badge>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => {
                    const rating = product?.averageRating || 0;
                    const isFilled = i < Math.floor(rating);
                    const isHalfFilled = i === Math.floor(rating) && rating % 1 >= 0.5;
                    return (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          isFilled || isHalfFilled 
                            ? 'fill-dorado text-dorado' 
                            : 'text-gray-300'
                        }`} 
                      />
                    );
                  })}
                </div>
                <span className="text-sm text-tierra-media">({product?.reviewCount || 0} {product?.reviewCount === 1 ? 'reseña' : 'reseñas'})</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-azul-profundo">
                  ${currentPrice.toLocaleString('es-AR')}
                </span>
                {product.compare_at_price && product.compare_at_price > currentPrice && (
                  <span className="text-lg text-tierra-media line-through">
                    ${product.compare_at_price.toLocaleString('es-AR')}
                  </span>
                )}
              </div>
              <p className="text-sm text-tierra-media">Precio en pesos argentinos</p>
            </div>

            {/* Variants */}
            {product.product_variants && product.product_variants.length > 1 && (
              <div className="space-y-3">
                <h3 className="font-semibold" style={{ color: getColorPalette().primaryColor }}>Presentación:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.product_variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                      onClick={() => handleVariantSelect(variant)}
                      className={`h-auto p-3 text-left transition-all duration-300 ${
                        selectedVariant?.id === variant.id 
                          ? `${getColorPalette().buttonColor} border-current` 
                          : getColorPalette().outlineColor
                      }`}
                    >
                      <div>
                        <div className="font-medium">{variant.title}</div>
                        <div className="text-sm opacity-75">
                          ${variant.price.toLocaleString('es-AR')}
                        </div>
                        {variant.inventory_quantity <= 5 && (
                          <div className="text-xs text-amber-600">
                            Últimas {variant.inventory_quantity} unidades
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isInStock ? (
                <>
                  <Check className="h-4 w-4 text-verde-suave" />
                  <span className="text-verde-suave font-medium">En stock</span>
                  {currentStock <= 10 && (
                    <span className="text-amber-600 text-sm">
                      (Solo quedan {currentStock})
                    </span>
                  )}
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-red-500 font-medium">Sin stock</span>
                </>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {isInStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg" style={{ borderColor: `${getColorPalette().primaryColor}20` }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 p-0 hover:opacity-50 transition-opacity duration-200"
                      style={{ 
                        color: getColorPalette().primaryColor,
                        backgroundColor: 'transparent'
                      }}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 text-center min-w-[3rem] font-medium" style={{ color: getColorPalette().primaryColor }}>{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="h-10 w-10 p-0 hover:opacity-50 transition-opacity duration-200"
                      style={{ 
                        color: getColorPalette().primaryColor,
                        backgroundColor: 'transparent'
                      }}
                      disabled={quantity >= currentStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleAddToCart}
                    className={`flex-1 font-semibold h-10 transition-all duration-300 hover:scale-105 ${getColorPalette().buttonColor}`}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Agregar al carrito
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`flex-1 ${getColorPalette().outlineColor} ${
                      isFavorite ? 'bg-red-50 border-red-200 text-red-600' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                    {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={getColorPalette().outlineColor}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="space-y-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-azul-profundo/10">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-verde-suave" />
                <span className="text-sm text-tierra-media">Envío gratis en compras superiores a $50.000</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-azul-profundo" />
                <span className="text-sm text-tierra-media">Garantía de calidad y satisfacción</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="h-4 w-4 text-verde-suave" />
                <span className="text-sm text-tierra-media">Productos naturales y artesanales</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
              <TabsTrigger 
                value="description"
                className="data-[state=active]:text-white hover:opacity-80 transition-all duration-300"
                style={{ 
                  color: getColorPalette().primaryColor,
                  backgroundColor: 'transparent'
                }}
                data-state-active-style={{
                  backgroundColor: getColorPalette().primaryColor,
                  color: 'white'
                }}
              >
                Descripción
              </TabsTrigger>
              <TabsTrigger 
                value="ingredients"
                className="data-[state=active]:text-white hover:opacity-80 transition-all duration-300"
                style={{ 
                  color: getColorPalette().primaryColor,
                  backgroundColor: 'transparent'
                }}
                data-state-active-style={{
                  backgroundColor: getColorPalette().primaryColor,
                  color: 'white'
                }}
              >
                Ingredientes
              </TabsTrigger>
              <TabsTrigger 
                value="usage"
                className="data-[state=active]:text-white hover:opacity-80 transition-all duration-300"
                style={{ 
                  color: getColorPalette().primaryColor,
                  backgroundColor: 'transparent'
                }}
                data-state-active-style={{
                  backgroundColor: getColorPalette().primaryColor,
                  color: 'white'
                }}
              >
                Modo de uso
              </TabsTrigger>
              <TabsTrigger 
                value="physical"
                className="data-[state=active]:text-white hover:opacity-80 transition-all duration-300"
                style={{ 
                  color: getColorPalette().primaryColor,
                  backgroundColor: 'transparent'
                }}
                data-state-active-style={{
                  backgroundColor: getColorPalette().primaryColor,
                  color: 'white'
                }}
              >
                Detalles Físicos
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="data-[state=active]:text-white hover:opacity-80 transition-all duration-300"
                style={{ 
                  color: getColorPalette().primaryColor,
                  backgroundColor: 'transparent'
                }}
                data-state-active-style={{
                  backgroundColor: getColorPalette().primaryColor,
                  color: 'white'
                }}
              >
                Reseñas
              </TabsTrigger>
            </TabsList>
          
            <TabsContent value="description" className="mt-6">
              <Card className="bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                <CardHeader>
                  <CardTitle style={{ color: getColorPalette().primaryColor }}>Descripción del producto</CardTitle>
                </CardHeader>
                <CardContent>
                  <RichTextDisplay content={product.description} />
                  
                  {product.benefits && product.benefits.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2" style={{ color: getColorPalette().primaryColor }}>Beneficios:</h4>
                      <ul className="list-disc list-inside space-y-1 text-tierra-media">
                        {product.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {product.skin_type && product.skin_type.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2" style={{ color: getColorPalette().primaryColor }}>Ideal para:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.skin_type.map((type, index) => {
                          // Translate skin type names to Spanish
                          const skinTypeTranslations: { [key: string]: string } = {
                            'oily': 'Grasa',
                            'combination': 'Mixta',
                            'normal': 'Normal',
                            'sensitive': 'Sensible',
                            'dry': 'Seca'
                          };
                          
                          const translatedType = skinTypeTranslations[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
                          
                          return (
                            <Badge key={index} variant="outline" style={{ 
                              borderColor: `${getColorPalette().primaryColor}20`,
                              color: getColorPalette().primaryColor
                            }}>
                              {translatedType}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            <TabsContent value="ingredients" className="mt-6">
              <Card className="bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                <CardHeader>
                  <CardTitle style={{ color: getColorPalette().primaryColor }}>Ingredientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <div className="space-y-2">
                      {product.ingredients.map((ingredient: any, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-tierra-media">{ingredient.name}</span>
                          {ingredient.percentage && (
                            <Badge variant="outline" style={{ 
                              borderColor: `${getColorPalette().primaryColor}20`,
                              color: getColorPalette().primaryColor
                            }}>
                              {ingredient.percentage}%
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-tierra-media">Información de ingredientes no disponible.</p>
                  )}
                  
                  {product.certifications && product.certifications.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                      <h4 className="font-semibold mb-2" style={{ color: getColorPalette().primaryColor }}>Certificaciones:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.certifications.map((cert, index) => {
                          // Translate certification names to Spanish
                          const certificationTranslations: { [key: string]: string } = {
                            'organic': 'Orgánico',
                            'natural': 'Natural',
                            'vegan': 'Vegano',
                            'cruelty-free': 'Libre de Crueldad',
                            'eco-friendly': 'Ecológico',
                            'biodegradable': 'Biodegradable',
                            'paraben-free': 'Sin Parabenos',
                            'sulfate-free': 'Sin Sulfatos',
                            'hypoallergenic': 'Hipoalergénico',
                            'dermatologically-tested': 'Testado Dermatológicamente',
                            'fda-approved': 'Aprobado por FDA',
                            'cosmetic-grade': 'Grado Cosmético'
                          };
                          
                          const translatedCert = certificationTranslations[cert.toLowerCase()] || cert.charAt(0).toUpperCase() + cert.slice(1);
                          
                          return (
                            <Badge key={index} variant="secondary" className="bg-verde-suave/20 text-verde-suave border-verde-suave/30">
                              {translatedCert}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            <TabsContent value="usage" className="mt-6">
              <Card className="bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                <CardHeader>
                  <CardTitle style={{ color: getColorPalette().primaryColor }}>Modo de uso</CardTitle>
                </CardHeader>
                <CardContent>
                  {product.usage_instructions ? (
                    <RichTextDisplay content={product.usage_instructions} />
                  ) : (
                    <p className="text-tierra-media">Información de uso no disponible.</p>
                  )}
                  
                  {product.precautions && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">Precauciones:</h4>
                      <div className="text-amber-700 text-sm">
                        <RichTextDisplay content={product.precautions} />
                      </div>
                    </div>
                  )}

                  {product.shelf_life_months && (
                    <div className="mt-4 text-sm text-tierra-media">
                      <strong>Vida útil:</strong> {product.shelf_life_months} meses
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          
            <TabsContent value="physical" className="mt-6">
              <Card className="bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                <CardHeader>
                  <CardTitle style={{ color: getColorPalette().primaryColor }}>Detalles Físicos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {product.weight && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getColorPalette().primaryColor}10` }}>
                          <span className="font-semibold" style={{ color: getColorPalette().primaryColor }}>⚖️</span>
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: getColorPalette().primaryColor }}>Peso</p>
                          <p className="text-tierra-media">{product.weight}g</p>
                        </div>
                      </div>
                    )}
                    
                    {product.dimensions && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getColorPalette().primaryColor}10` }}>
                          <span className="font-semibold" style={{ color: getColorPalette().primaryColor }}>📏</span>
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: getColorPalette().primaryColor }}>Dimensiones</p>
                          <p className="text-tierra-media">{product.dimensions}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {product.package_characteristics && (
                    <div className="mt-6">
                      <h4 className="font-semibold mb-3" style={{ color: getColorPalette().primaryColor }}>Características del Empaque</h4>
                      <div className="bg-white/30 p-4 rounded-lg border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                        <RichTextDisplay content={product.package_characteristics} />
                      </div>
                    </div>
                  )}
                  
                  {!product.weight && !product.dimensions && !product.package_characteristics && (
                    <p className="text-tierra-media">Información de detalles físicos no disponible.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {/* Review Form */}
                {currentUserId && (
                  <div>
                    {!showReviewForm ? (
                      <Card className="bg-white/50 backdrop-blur-sm border" style={{ borderColor: `${getColorPalette().primaryColor}10` }}>
                        <CardContent className="p-6 text-center">
                          <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                              <MessageSquare className="w-5 h-5" style={{ color: getColorPalette().primaryColor }} />
                              <h3 className="text-lg font-semibold" style={{ color: getColorPalette().primaryColor }}>
                                ¿Compraste este producto?
                              </h3>
                            </div>
                            <p className="text-tierra-media">
                              Comparte tu experiencia y ayuda a otros clientes a tomar una decisión informada.
                            </p>
                            <Button
                              onClick={() => setShowReviewForm(true)}
                              className={`${getColorPalette().buttonColor} transition-all duration-300 hover:scale-105`}
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Escribir Reseña
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div 
                        className="bg-white/50 backdrop-blur-sm border"
                        style={{ borderColor: `${getColorPalette().primaryColor}10` }}
                      >
                        <ReviewForm
                          productId={product.id}
                          userId={currentUserId || ''}
                          existingReview={editingReview}
                          onSuccess={handleReviewSuccess}
                          onCancel={() => {
                            setShowReviewForm(false);
                            setEditingReview(null);
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Reviews List */}
                <ReviewList
                  productId={product.id}
                  currentUserId={currentUserId ?? undefined}
                  onEditReview={handleEditReview}
                  onDeleteReview={handleDeleteReview}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-azul-profundo mb-2">
                Más productos de {determineProductLine(product)?.name || 'esta línea'}
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-azul-profundo to-transparent mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  description={relatedProduct.short_description || relatedProduct.description}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.compare_at_price}
                  category={relatedProduct.categories?.name || ''}
                  imageUrl={relatedProduct.featured_image}
                  rating={relatedProduct.averageRating || 0}
                  reviewCount={relatedProduct.reviewCount || 0}
                  isNatural={true}
                  isNew={false}
                  isOnSale={!!relatedProduct.compare_at_price}
                  stock={relatedProduct.inventory_quantity}
                  size={relatedProduct.product_variants?.find(v => v.is_default)?.option1}
                  onAddToCart={(productId: string, quantity: number) => {
                    const product = relatedProducts.find(p => p.id === productId);
                    if (!product) return;

                    const defaultVariant = product.product_variants?.find(v => v.is_default) || product.product_variants?.[0];
                    
                    addItem({
                      productId: product.id,
                      variantId: defaultVariant?.id,
                      name: product.name,
                      price: defaultVariant?.price || product.price,
                      originalPrice: product.compare_at_price,
                      image: product.featured_image,
                      stock: defaultVariant?.inventory_quantity || product.inventory_quantity,
                      size: defaultVariant?.option1,
                      sku: product.slug,
                      quantity,
                    });

                    toast.success(`${product.name} agregado al carrito`);
                  }}
                  variant="elegant"
                />
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Link href={`/categorias/linea-${determineProductLine(product)?.id}`}>
                <Button className={`px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 ${getColorPalette().buttonColor}`}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ver toda la línea {determineProductLine(product)?.name}
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal Dialog */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 w-auto h-auto">
          <div className="relative flex items-center justify-center min-h-[50vh] max-h-[90vh]">
            <div className="relative max-w-full max-h-full">
              <Image
                src={selectedImage || product.featured_image}
                alt={product.name}
                width={1200}
                height={1200}
                className="object-contain max-w-full max-h-full"
                priority
                style={{
                  maxWidth: '100%',
                  maxHeight: '90vh',
                  width: 'auto',
                  height: 'auto'
                }}
              />
              
              {/* Navigation Arrows in Modal */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <ArrowLeftSVG className="h-10 w-10 text-azul-profundo drop-shadow-lg" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  >
                    <ArrowRightSVG className="h-10 w-10 text-azul-profundo drop-shadow-lg" />
                  </button>
                </>
              )}
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 