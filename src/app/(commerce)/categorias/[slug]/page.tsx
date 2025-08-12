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

interface Product {
  id: string;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  inventory_quantity: number;
  is_featured: boolean;
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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li><Link href="/" className="hover:text-azul-profundo">Inicio</Link></li>
          <li>/</li>
          <li><Link href="/productos" className="hover:text-azul-profundo">Productos</Link></li>
          <li>/</li>
          <li className="text-azul-profundo font-medium">{category.name}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo mb-2">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-gray-600 max-w-2xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Grid Controls */}
          <div className="flex border rounded-md">
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
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {products.length} productos
          </Badge>
          {products.some(p => p.is_featured) && (
            <Badge variant="secondary" className="bg-dorado/20 text-dorado">
              Incluye productos destacados
            </Badge>
          )}
        </div>
      </div>

      {/* Category Image */}
      {category.image_url && (
        <div className="mb-8 aspect-[3/1] relative overflow-hidden rounded-lg">
          <img
            src={category.image_url}
            alt={category.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-azul-profundo/20" />
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            No hay productos disponibles en esta categoría
          </p>
          <Link href="/productos">
            <Button variant="outline">
              Ver todos los productos
            </Button>
          </Link>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          gridCols === 2 
            ? 'grid-cols-1 md:grid-cols-2' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.short_description || product.description}
              price={product.price}
              originalPrice={product.compare_at_price}
              category={category.name}
              imageUrl={product.featured_image}
              rating={4.5} // TODO: Implement actual ratings
              reviewCount={23} // TODO: Implement actual review counts
              isNatural={true}
              isNew={false}
              isOnSale={!!product.compare_at_price}
              stock={product.inventory_quantity}
              size={product.product_variants?.find(v => v.is_default)?.option1}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Back to Products */}
      <div className="mt-12 text-center">
        <Link href="/productos">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Ver todos los productos
          </Button>
        </Link>
      </div>
    </div>
  );
} 