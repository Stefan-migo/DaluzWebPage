"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/brand/ProductCard";
import TiendaHero from "@/components/commerce/TiendaHero";
import TiendaSidebar from "@/components/commerce/TiendaSidebar";
import FeaturedLineSection from "@/components/commerce/FeaturedLineSection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ChevronRight,
  ArrowUpDown,
  X,
  Heart,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLike } from "@/contexts/LikeContext";
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
  const { isLiked, likedProducts } = useLike();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "",
  );
  const [selectedSkinType, setSelectedSkinType] = useState(
    searchParams.get("skin_type") || "",
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sort_by") || "featured",
  );
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get("min_price") || "",
    max: searchParams.get("max_price") || "",
  });
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1"),
  );
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // Changed from 12 to 9
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
  const [gridCols, setGridCols] = useState(3);
  const [expandedSections, setExpandedSections] = useState({
    categories: false,
    filters: false,
    sort: false,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        if (response.ok) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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

        if (searchTerm) params.append("search", searchTerm);
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedSkinType && selectedSkinType !== "all")
          params.append("skin_type", selectedSkinType);
        if (priceRange.min) params.append("min_price", priceRange.min);
        if (priceRange.max) params.append("max_price", priceRange.max);
        if (sortBy) params.append("sort_by", getSortField(sortBy));
        if (getSortOrder(sortBy))
          params.append("sort_order", getSortOrder(sortBy));
        params.append("page", currentPage.toString());
        params.append("limit", "9"); // Desktop: 3x3 grid, Mobile: 2x5 grid
        params.append("in_stock", "true");

        const response = await fetch(`/api/products?${params.toString()}`);
        const data: ProductsResponse = await response.json();

        if (response.ok) {
          setProducts(data.products);
          setPagination(data.pagination);
        } else {
          console.error("API Error:", data);
          toast.error("Error al cargar productos");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [
    searchTerm,
    selectedCategory,
    selectedSkinType,
    priceRange,
    sortBy,
    currentPage,
  ]);

  const getSortField = (sort: string) => {
    switch (sort) {
      case "price_asc":
        return "price";
      case "price_desc":
        return "price";
      case "name":
        return "name";
      case "newest":
        return "created_at";
      case "featured":
        return "is_featured";
      default:
        return "created_at";
    }
  };

  const getSortOrder = (sort: string) => {
    switch (sort) {
      case "price_asc":
        return "asc";
      case "price_desc":
        return "desc";
      case "name":
        return "asc";
      case "newest":
        return "desc";
      case "featured":
        return "desc";
      default:
        return "desc";
    }
  };

  const handleAddToCart = (productId: string, quantity: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const defaultVariant =
      product.product_variants?.find((v) => v.is_default) ||
      product.product_variants?.[0];

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
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSkinType("");
    setPriceRange({ min: "", max: "" });
    setSortBy("featured");
    setCurrentPage(1);
    setShowOnlyFavorites(false);
  };

  const hasActiveFilters = Boolean(
    searchTerm ||
      selectedCategory ||
      (selectedSkinType && selectedSkinType !== "all") ||
      priceRange.min ||
      priceRange.max ||
      showOnlyFavorites,
  );

  const displayedProducts = showOnlyFavorites
    ? products.filter((p) => isLiked(p.id))
    : products;

  const skinTypes = ["seca", "grasa", "mixta", "sensible", "normal"];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* SVG Background */}
      <div
        className="fixed inset-0 w-full h-full opacity-100 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/svg/backgrounds/tienda-background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      {/* Hero Section */}
      <TiendaHero />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 bg-transparent">
        {/* Mobile Filters - 3x1 Horizontal Grid */}
        <div className="lg:hidden mb-4">
          <div className="grid grid-cols-3 gap-2">
            {/* Search Card - Always Open */}
            <div className="col-span-3">
              <Card variant="artisanal" className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-4 w-4 text-azul-profundo" />
                  <span className="text-sm font-medium">Buscar</span>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </Card>
            </div>

            {/* Categories Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      categories: !prev.categories,
                    }))
                  }
                >
                  <div className="flex items-center gap-1">
                    <Filter className="h-3 w-3 text-azul-profundo" />
                    <span className="text-xs font-medium">Categorías</span>
                  </div>
                  {expandedSections.categories ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.categories && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    <Button
                      variant={
                        selectedCategory === "" ? "line-primary" : "line-ghost"
                      }
                      className="w-full justify-start text-xs h-6"
                      onClick={() => setSelectedCategory("")}
                    >
                      Todas
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={
                          selectedCategory === category.id
                            ? "line-primary"
                            : "line-ghost"
                        }
                        className="w-full justify-start text-xs h-6"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Filters Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      filters: !prev.filters,
                    }))
                  }
                >
                  <div className="flex items-center gap-1">
                    <SlidersHorizontal className="h-3 w-3 text-azul-profundo" />
                    <span className="text-xs font-medium">Filtros</span>
                  </div>
                  {expandedSections.filters ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.filters && (
                  <div className="mt-2 space-y-2">
                    <Select
                      value={selectedSkinType}
                      onValueChange={setSelectedSkinType}
                    >
                      <SelectTrigger className="h-6 text-xs">
                        <SelectValue placeholder="Piel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="dry">Seca</SelectItem>
                        <SelectItem value="oily">Grasa</SelectItem>
                        <SelectItem value="combination">Mixta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="sensitive">Sensible</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Price Range */}
                    <div className="space-y-1">
                      <label className="text-xs text-gray-600">Precio</label>
                      <div className="grid grid-cols-2 gap-1">
                        <Input
                          type="number"
                          placeholder="Mín"
                          value={priceRange.min}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              min: e.target.value,
                            })
                          }
                          className="h-6 text-xs"
                        />
                        <Input
                          type="number"
                          placeholder="Máx"
                          value={priceRange.max}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              max: e.target.value,
                            })
                          }
                          className="h-6 text-xs"
                        />
                      </div>
                    </div>

                    <Button
                      variant={showOnlyFavorites ? "line-primary" : "outline"}
                      onClick={() => setShowOnlyFavorites((v) => !v)}
                      className="w-full text-xs h-6"
                    >
                      <Heart
                        className={cn(
                          "h-3 w-3 mr-1",
                          showOnlyFavorites && "fill-current",
                        )}
                      />
                      {showOnlyFavorites ? "Mostrando favoritos" : "Solo favoritos"}
                    </Button>

                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full text-xs h-6"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Limpiar
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Sort Card - Collapsible */}
            <div className="col-span-1">
              <Card variant="artisanal" className="p-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedSections((prev) => ({
                      ...prev,
                      sort: !prev.sort,
                    }))
                  }
                >
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="h-3 w-3 text-azul-profundo" />
                    <span className="text-xs font-medium">Ordenar</span>
                  </div>
                  {expandedSections.sort ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </div>
                {expandedSections.sort && (
                  <div className="mt-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-6 text-xs">
                        <SelectValue placeholder="Ordenar por" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Destacados</SelectItem>
                        <SelectItem value="price_asc">
                          Precio: Menor a Mayor
                        </SelectItem>
                        <SelectItem value="price_desc">
                          Precio: Mayor a Menor
                        </SelectItem>
                        <SelectItem value="name_asc">Nombre: A-Z</SelectItem>
                        <SelectItem value="name_desc">Nombre: Z-A</SelectItem>
                        <SelectItem value="newest">Más Recientes</SelectItem>
                        <SelectItem value="rating">Mejor Valorados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
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
              showOnlyFavorites={showOnlyFavorites}
              setShowOnlyFavorites={setShowOnlyFavorites}
              favoritesCount={likedProducts.size}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center"></div>

            {/* Products Grid */}
            {loading ? (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                  gridCols === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 sm:h-80 lg:h-96 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                {showOnlyFavorites && likedProducts.size === 0 ? (
                  <>
                    <Heart className="h-12 w-12 text-tierra-media mx-auto mb-4" />
                    <p className="text-tierra-media mb-2 text-lg font-medium">
                      Todavía no tenés favoritos
                    </p>
                    <p className="text-gray-500 mb-4 text-sm">
                      Marcá productos con el corazón para verlos acá.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setShowOnlyFavorites(false)}
                    >
                      Ver todos los productos
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-tierra-media mb-4">
                      {showOnlyFavorites
                        ? "Ninguno de tus favoritos coincide con los filtros actuales"
                        : "No se encontraron productos"}
                    </p>
                    {hasActiveFilters && (
                      <Button variant="outline" onClick={clearFilters}>
                        Limpiar filtros
                      </Button>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div
                className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                  gridCols === 2
                    ? "grid-cols-1 sm:grid-cols-2"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    description={
                      product.short_description || product.description
                    }
                    price={product.price}
                    originalPrice={product.compare_at_price}
                    category={product.categories?.name || ""}
                    imageUrl={product.featured_image}
                    rating={product.averageRating || 0}
                    reviewCount={product.reviewCount || 0}
                    isNatural={true}
                    isNew={false}
                    isOnSale={!!product.compare_at_price}
                    stock={product.inventory_quantity}
                    size={
                      product.product_variants?.find((v) => v.is_default)
                        ?.option1
                    }
                    onAddToCart={handleAddToCart}
                    variant="elegant"
                    className="p-[0]"
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && !showOnlyFavorites && (
              <div className="mt-12 flex justify-center gap-2 relative z-10 px-4 lg:px-0">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage(currentPage - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-white hover:bg-gray-100"
                  style={{ opacity: 1, backgroundColor: "#ffffff" }}
                >
                  Anterior
                </Button>

                {/* Desktop: Full pagination */}
                <div className="hidden lg:flex gap-2">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
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
                          variant="outline"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={
                            currentPage === page
                              ? "bg-[#791010] text-white border-[#791010] hover:bg-[#5a0c0c] hover:text-white"
                              : "bg-white hover:bg-gray-100 text-gray-700"
                          }
                          style={{
                            opacity: 1,
                          }}
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                </div>

                {/* Mobile: Simplified pagination */}
                <div className="lg:hidden flex gap-1">
                  {Array.from(
                    { length: Math.min(3, pagination.totalPages) },
                    (_, i) => {
                      let page;
                      if (pagination.totalPages <= 3) {
                        page = i + 1;
                      } else if (currentPage <= 2) {
                        page = i + 1;
                      } else if (currentPage >= pagination.totalPages - 1) {
                        page = pagination.totalPages - 2 + i;
                      } else {
                        page = currentPage - 1 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant="outline"
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={cn(
                            "text-xs px-2 py-1 h-8 min-w-[2rem]",
                            currentPage === page
                              ? "bg-[#791010] text-white border-[#791010] hover:bg-[#5a0c0c] hover:text-white"
                              : "bg-white hover:bg-gray-100 text-gray-700",
                          )}
                          style={{
                            opacity: 1,
                          }}
                        >
                          {page}
                        </Button>
                      );
                    },
                  )}
                  {pagination.totalPages > 3 &&
                    currentPage < pagination.totalPages - 1 && (
                      <span className="text-xs text-gray-500 px-1">...</span>
                    )}
                </div>

                <Button
                  variant="outline"
                  disabled={currentPage === pagination.totalPages}
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="bg-white hover:bg-gray-100"
                  style={{ opacity: 1, backgroundColor: "#ffffff" }}
                >
                  Siguiente
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Linea Separadora SVG */}
      <div className="my-8 flex justify-center">
        <img
          src="/svg/linea-separadora.svg"
          alt="Separador decorativo"
          className="w-full max-w-[70rem] h-auto z-20"
        />
      </div>

      {/* Featured Line Section */}
      <FeaturedLineSection />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
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
              <div
                key={i}
                className="h-96 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
