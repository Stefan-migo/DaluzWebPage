"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import TiendaHero from "@/components/commerce/TiendaHero";
import TiendaSidebar from "@/components/commerce/TiendaSidebar";
import FeaturedLineSection from "@/components/commerce/FeaturedLineSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  compare_at_price?: number;
  featured_image: string;
  gallery?: string[];
  category_id: string;
  skin_type: string[];
  benefits: string[];
  inventory_quantity: number;
  is_featured: boolean;
  averageRating?: number;
  reviewCount?: number;
  categories?: {
    id: string;
    name: string;
    slug: string;
  };
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
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedSkinType, setSelectedSkinType] = useState(searchParams.get('skin_type') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'featured');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min_price') || '',
    max: searchParams.get('max_price') || '',
  });
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // Changed from 12 to 9
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [gridCols, setGridCols] = useState(3);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        
        if (searchTerm) params.append('search', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedSkinType && selectedSkinType !== 'all') params.append('skin_type', selectedSkinType);
        if (priceRange.min) params.append('min_price', priceRange.min);
        if (priceRange.max) params.append('max_price', priceRange.max);
        if (sortBy) params.append('sort_by', getSortField(sortBy));
        if (getSortOrder(sortBy)) params.append('sort_order', getSortOrder(sortBy));
        params.append('page', currentPage.toString());
        params.append('limit', '9'); // Changed from 12 to 9
        params.append('in_stock', 'true');

        const response = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await response.json();
        
        if (response.ok) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          console.error('API Error:', data);
          toast.error('Error al cargar productos');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error al cargar productos');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [searchTerm, selectedCategory, selectedSkinType, priceRange, sortBy, currentPage]);

  const getSortField = (sort: string) => {
    switch (sort) {
      case 'price_asc': return 'price';
      case 'price_desc': return 'price';
      case 'name': return 'name';
      case 'newest': return 'created_at';
      case 'featured': return 'is_featured';
      default: return 'created_at';
    }
  };

  const getSortOrder = (sort: string) => {
    switch (sort) {
      case 'price_asc': return 'asc';
      case 'price_desc': return 'desc';
      case 'name': return 'asc';
      case 'newest': return 'desc';
      case 'featured': return 'desc';
      default: return 'desc';
    }
  };

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
      sku: product.slug,
      quantity,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSkinType('');
    setPriceRange({ min: '', max: '' });
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(searchTerm || selectedCategory || (selectedSkinType && selectedSkinType !== 'all') || priceRange.min || priceRange.max);

  const skinTypes = ['seca', 'grasa', 'mixta', 'sensible', 'normal'];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* SVG Background */}
      <div 
        className="fixed inset-0 w-full h-full opacity-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/svg/backgrounds/tienda-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      {/* Hero Section */}
      <TiendaHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-transparent">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-80 flex-shrink-0 order-2 lg:order-1">
            <TiendaSidebar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedSkinType={selectedSkinType}
              setSelectedSkinType={setSelectedSkinType}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              gridCols={gridCols}
              setGridCols={setGridCols}
              categories={categories}
              onClearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 order-1 lg:order-2">
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-tierra-media">
                {loading ? 'Cargando...' : pagination.total > 0 ? `${pagination.total} productos encontrados` : ''}
              </p>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className={`grid gap-6 ${
                gridCols === 2 
                  ? 'grid-cols-1 md:grid-cols-2' 
                  : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-tierra-media mb-4">No se encontraron productos</p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                )}
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
                    category={product.categories?.name || ''}
                    imageUrl={product.featured_image}
                    rating={product.averageRating || 0}
                    reviewCount={product.reviewCount || 0}
                    isNatural={true}
                    isNew={false}
                    isOnSale={!!product.compare_at_price}
                    stock={product.inventory_quantity}
                    size={product.product_variants?.find(v => v.is_default)?.option1}
                    onAddToCart={handleAddToCart}
                    variant="elegant"
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2 relative z-10">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="bg-white hover:bg-gray-100"
                  style={{ opacity: 1, backgroundColor: '#ffffff' }}
                >
                  Anterior
                </Button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let page;
                  if (pagination.totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= pagination.totalPages - 2) {
                    page = pagination.totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage === page ? "bg-azul-profundo text-white" : "bg-white hover:bg-gray-100"}
                      style={{ opacity: 1, backgroundColor: currentPage === page ? '#2C3E50' : '#ffffff' }}
                    >
                      {page}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="bg-white hover:bg-gray-100"
                  style={{ opacity: 1, backgroundColor: '#ffffff' }}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider */}
      <Separator className="my-8" />

      {/* Featured Line Section */}
      <FeaturedLineSection />
    </div>

  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-azul-profundo mb-2">
            Nuestros Productos
          </h1>
          <p className="text-gray-600">
            Descubre nuestra línea completa de biocosmética artesanal
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
} 