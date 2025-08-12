"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { Search, SlidersHorizontal, Grid3X3, Grid2X2, Filter, X } from "lucide-react";
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
    limit: 12,
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
        if (selectedSkinType) params.append('skin_type', selectedSkinType);
        if (priceRange.min) params.append('min_price', priceRange.min);
        if (priceRange.max) params.append('max_price', priceRange.max);
        if (sortBy) params.append('sort_by', getSortField(sortBy));
        if (getSortOrder(sortBy)) params.append('sort_order', getSortOrder(sortBy));
        params.append('page', currentPage.toString());
        params.append('limit', '12');
        params.append('in_stock', 'true');

        const response = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await response.json();
        
        if (response.ok) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
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

  const hasActiveFilters = searchTerm || selectedCategory || selectedSkinType || priceRange.min || priceRange.max;

  const skinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal'];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-azul-profundo mb-2">
          Nuestros Productos
        </h1>
        <p className="text-gray-600">
          Descubre nuestra línea completa de biocosmética artesanal
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
            </Button>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
                <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
                <SelectItem value="name">Nombre A-Z</SelectItem>
              </SelectContent>
            </Select>

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
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas las categorías" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todas las categorías</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Skin Type Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Tipo de Piel</label>
                  <Select value={selectedSkinType} onValueChange={setSelectedSkinType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Todos los tipos</SelectItem>
                      {skinTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Precio mínimo</label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Precio máximo</label>
                  <Input
                    type="number"
                    placeholder="Sin límite"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
                    <X className="h-4 w-4" />
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary">
                Búsqueda: {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1">×</button>
              </Badge>
            )}
            {selectedCategory && (
              <Badge variant="secondary">
                Categoría: {categories.find(c => c.id === selectedCategory)?.name}
                <button onClick={() => setSelectedCategory('')} className="ml-1">×</button>
              </Badge>
            )}
            {selectedSkinType && (
              <Badge variant="secondary">
                Tipo de piel: {selectedSkinType}
                <button onClick={() => setSelectedSkinType('')} className="ml-1">×</button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          {loading ? 'Cargando...' : `${pagination.total} productos encontrados`}
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No se encontraron productos</p>
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
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
              >
                {page}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={currentPage === pagination.totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
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