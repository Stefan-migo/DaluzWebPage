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
import { useCart } from "@/contexts/CartContext";
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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

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
  tags: string[];
  is_featured: boolean;
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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

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

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setSelectedImage(variant.image_url || product?.featured_image || '');
    setQuantity(1);
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
    return images.filter(Boolean);
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
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
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
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-50">
            <Image
              src={selectedImage || product.featured_image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.compare_at_price && product.compare_at_price > currentPrice && (
              <Badge className="absolute top-4 left-4 bg-red-500">
                -{Math.round(((product.compare_at_price - currentPrice) / product.compare_at_price) * 100)}%
              </Badge>
            )}
            {product.is_featured && (
              <Badge className="absolute top-4 right-4 bg-dorado text-azul-profundo">
                Destacado
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square relative overflow-hidden rounded border-2 transition-colors ${
                    selectedImage === image ? 'border-dorado' : 'border-gray-200 hover:border-gray-300'
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
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.categories && (
                <Badge variant="outline">{product.categories.name}</Badge>
              )}
              {product.certifications.includes('organic') && (
                <Badge variant="secondary" className="bg-verde-suave/20 text-verde-suave">
                  <Leaf className="h-3 w-3 mr-1" />
                  Orgánico
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-azul-profundo mb-2">{product.name}</h1>
            
            {product.short_description && (
              <p className="text-gray-600 text-lg">{product.short_description}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="h-4 w-4 fill-dorado text-dorado" />
                ))}
              </div>
              <span className="text-sm text-gray-500">(23 reseñas)</span>
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-azul-profundo">
                ${currentPrice.toLocaleString('es-AR')}
              </span>
              {product.compare_at_price && product.compare_at_price > currentPrice && (
                <span className="text-lg text-gray-500 line-through">
                  ${product.compare_at_price.toLocaleString('es-AR')}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">Precio en pesos argentinos</p>
          </div>

          {/* Variants */}
          {product.product_variants && product.product_variants.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-azul-profundo">Presentación:</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.product_variants.map((variant) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                    onClick={() => handleVariantSelect(variant)}
                    className="h-auto p-3 text-left"
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
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 p-0"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-center min-w-[3rem]">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="h-10 w-10 p-0"
                    disabled={quantity >= currentStock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-dorado hover:bg-dorado/90 text-azul-profundo font-semibold h-10"
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
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                  {isFavorite ? 'En favoritos' : 'Agregar a favoritos'}
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartir
                </Button>
              </div>
            </div>
          )}

          {/* Benefits */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-verde-suave" />
              <span className="text-sm">Envío gratis en compras superiores a $50.000</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-azul-profundo" />
              <span className="text-sm">Garantía de calidad y satisfacción</span>
            </div>
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-verde-suave" />
              <span className="text-sm">Productos naturales y artesanales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Descripción</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
            <TabsTrigger value="usage">Modo de uso</TabsTrigger>
            <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Descripción del producto</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p className="whitespace-pre-line">{product.description}</p>
                
                {product.benefits && product.benefits.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Beneficios:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {product.benefits.map((benefit, index) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.skin_type && product.skin_type.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Ideal para:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.skin_type.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Ingredientes</CardTitle>
              </CardHeader>
              <CardContent>
                {product.ingredients && product.ingredients.length > 0 ? (
                  <div className="space-y-2">
                    {product.ingredients.map((ingredient: any, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span>{ingredient.name}</span>
                        {ingredient.percentage && (
                          <Badge variant="outline">{ingredient.percentage}%</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Información de ingredientes no disponible.</p>
                )}
                
                {product.certifications && product.certifications.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Certificaciones:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="bg-verde-suave/20 text-verde-suave">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="usage" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Modo de uso</CardTitle>
              </CardHeader>
              <CardContent>
                {product.usage_instructions ? (
                  <p className="whitespace-pre-line">{product.usage_instructions}</p>
                ) : (
                  <p className="text-gray-500">Información de uso no disponible.</p>
                )}
                
                {product.precautions && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-semibold text-amber-800 mb-2">Precauciones:</h4>
                    <p className="text-amber-700 text-sm">{product.precautions}</p>
                  </div>
                )}

                {product.shelf_life_months && (
                  <div className="mt-4 text-sm text-gray-600">
                    <strong>Vida útil:</strong> {product.shelf_life_months} meses
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Reseñas de clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Las reseñas de clientes aparecerán aquí próximamente.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 