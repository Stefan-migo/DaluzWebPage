"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, Grid3X3, Grid2X2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// Map category slugs to product line themes
const getLineThemeFromSlug = (slug: string): 'alma-terra' | 'ecos' | 'jade-ritual' | 'umbral' | 'utopica' | 'kits-experiencia' | 'default' => {
  const slugLower = slug.toLowerCase();
  if (slugLower.includes('alma-terra')) return 'alma-terra';
  if (slugLower.includes('ecos')) return 'ecos';
  if (slugLower.includes('jade-ritual')) return 'jade-ritual';
  if (slugLower.includes('kits')) return 'kits-experiencia';
  if (slugLower.includes('umbral')) return 'umbral';
  if (slugLower.includes('utopica') || slugLower.includes('prisma')) return 'utopica';
  return 'default';
};

interface Product {
  id: string;
  slug?: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  inventory_quantity: number;
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  product_variants?: Array<{
    id: string;
    title: string;
    price: number;
    inventory_quantity: number;
    option1?: string;
    is_default: boolean;
  }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  products?: Product[];
}

export default function CategoryPage() {
  const params = useParams();
  const { addItem } = useCart();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [gridCols, setGridCols] = useState(3);

  // Detect product line theme from slug
  const lineTheme = params.slug ? getLineThemeFromSlug(params.slug as string) : 'default';

  useEffect(() => {
    async function fetchCategoryAndProducts() {
      if (!params.slug) return;

      setLoading(true);
      try {
        // Fetch category by slug
        const categoryResponse = await fetch(`/api/categories/by-slug/${params.slug}`);
        if (!categoryResponse.ok) {
          toast.error('Categoría no encontrada');
          return;
        }

        const categoryData = await categoryResponse.json();
        setCategory(categoryData.category);

        // Fetch products for this category
        const productsResponse = await fetch(`/api/products?category=${categoryData.category.id}&limit=50`);
        if (productsResponse.ok) {
          const productsData = await productsResponse.json();
          setProducts(productsData.products);
        }
      } catch (error) {
        console.error('Error fetching category:', error);
        toast.error('Error al cargar la categoría');
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryAndProducts();
  }, [params.slug]);

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find(p => p.id === productId);
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
      sku: product.id,
      quantity,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-azul-profundo mb-4">Categoría no encontrada</h1>
        <Link href="/productos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Button>
        </Link>
      </div>
    );
  }

  // Get line-specific colors
  const getLineColors = () => {
    switch (lineTheme) {
      case 'alma-terra':
        return { primary: '#9B201A', secondary: '#BD311C', light: '#FFE58D', lightest: '#FFEFC6', dark: '#4E100D' };
      case 'ecos':
        return { primary: '#12406F', secondary: '#005180', light: '#81CCD7', lightest: '#B7DFE5', dark: '#092038' };
      case 'jade-ritual':
        return { primary: '#04412D', secondary: '#286939', light: '#7BC38E', lightest: '#D3E1BE', dark: '#022116' };
      case 'kits-experiencia':
        return { primary: '#AE0000', secondary: '#C70000', light: '#F0EACE', lightest: '#F6FBD6', dark: '#570000' };
      case 'umbral':
        return { primary: '#EA4F12', secondary: '#F17E06', light: '#FFD18A', lightest: '#FFF2DB', dark: '#752809' };
      case 'utopica':
        return { primary: '#392E13', secondary: '#72571C', light: '#F8EE76', lightest: '#F9F5C5', dark: '#1D170A' };
      default:
        return { primary: '#AE0000', secondary: '#C70000', light: '#F0EACE', lightest: '#F6FBD6', dark: '#570000' };
    }
  };

  const lineColors = getLineColors();
  const isCenteredDarkTheme = lineTheme !== 'default';

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: lineColors.lightest }}>
      {/* Background Image with 60% opacity */}
      <div
        className="fixed inset-0 w-full h-full opacity-60 pointer-events-none z-0"
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
          <ol className="flex items-center space-x-2 text-sm" style={{ color: lineColors.primary }}>
            <li><Link href="/" className="hover:opacity-80 transition-opacity">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/productos" className="hover:opacity-80 transition-opacity">Productos</Link></li>
            <li>/</li>
            <li className="font-medium">{category.name}</li>
          </ol>
        </nav>

        {/* Category Header */}
        <div className="mb-8">
          <div className={`flex ${isCenteredDarkTheme ? 'flex-col justify-center items-center text-center gap-6' : 'items-center justify-between'} mb-4`}>
            <div className={isCenteredDarkTheme ? 'flex flex-col items-center w-full' : ''}>
              <h1
                className={`text-3xl mb-2 ${isCenteredDarkTheme ? 'font-normal' : 'font-title font-bold'}`}
                style={isCenteredDarkTheme ? { color: lineColors.primary, fontFamily: 'Velista, serif' } : { color: lineColors.primary }}
              >
                {category.name}
              </h1>
              {category.description && (
                <p
                  className={`max-w-2xl ${isCenteredDarkTheme ? 'mx-auto' : ''}`}
                  style={isCenteredDarkTheme ? { color: lineColors.dark, fontFamily: '"EB Garamond", serif', fontSize: '18px', lineHeight: '1.6', fontWeight: 500 } : { color: lineColors.primary, opacity: 0.8 }}
                >
                  {category.description}
                </p>
              )}
            </div>

            {/* Grid Controls */}
            <div className={`flex border rounded-md ${isCenteredDarkTheme ? 'self-end' : ''}`}>
              <Button
                variant={gridCols === 2 ? "default" : "ghost"}
                size="sm"
                onClick={() => setGridCols(2)}
                className="rounded-r-none"
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridCols === 3 ? "default" : "ghost"}
                size="sm"
                onClick={() => setGridCols(3)}
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Category Stats */}
          <div className={`flex items-center gap-4 ${isCenteredDarkTheme ? 'justify-center w-full' : ''}`}>
            <Badge variant="outline" style={{ borderColor: lineColors.primary, color: lineColors.primary }}>
              {products.length} productos
            </Badge>
            {products.some(p => p.is_featured) && (
              <Badge variant="secondary" style={{ backgroundColor: `${lineColors.primary}20`, color: lineColors.primary, borderColor: `${lineColors.primary}40` }}>
                Incluye productos destacados
              </Badge>
            )}
          </div>
        </div>

        {/* Category Image */}
        {(category.image_url || params.slug === 'linea-prisma' || (params.slug as string).includes('kits')) && (
          <div className="mb-8 aspect-[3/1] relative overflow-hidden rounded-lg" style={{ borderRadius: '0px 15px' }}>
            <img
              src={
                params.slug === 'linea-prisma' ? '/images/lineas/utopica/prisma-banner.png' : 
                (params.slug as string).includes('kits') ? '/images/lineas/kits-experiencia-banner.png' : 
                category.image_url
              }
              alt={category.name}
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0" style={{ backgroundColor: `${lineColors.primary}20` }} />
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="mb-4" style={{ color: lineColors.primary, opacity: 0.8 }}>
              No hay productos disponibles en esta categoría
            </p>
            <Link href="/productos">
              <Button variant="outline" style={{ borderColor: lineColors.primary, color: lineColors.primary }} className="hover:opacity-80">
                Ver todos los productos
              </Button>
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 ${gridCols === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                name={product.name}
                description={product.short_description || product.description}
                price={product.price}
                originalPrice={product.compare_at_price}
                category={category.name}
                imageUrl={product.featured_image}
                rating={product.averageRating || 0}
                reviewCount={product.reviewCount || 0}
                isNatural={true}
                isNew={false}
                isOnSale={!!product.compare_at_price}
                stock={product.inventory_quantity}
                size={product.product_variants?.find(v => v.is_default)?.option1}
                onAddToCart={handleAddToCart}
                lineTheme={lineTheme}
              />
            ))}
          </div>
        )}

        {/* Back to Products */}
        <div className="mt-12 text-center">
          <Link href="/productos">
            <Button variant="outline" style={{ borderColor: lineColors.primary, color: lineColors.primary }} className="hover:opacity-80">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver todos los productos
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 