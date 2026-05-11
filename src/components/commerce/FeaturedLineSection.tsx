"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/ui/brand/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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
  installments_3_enabled?: boolean;
  installments_6_enabled?: boolean;
}

interface FeaturedLineSectionProps {
  className?: string;
}

const productLines = [
  {
    id: "alma-terra",
    name: "Alma Terra",
    description: "Conexión con la tierra",
    color: "text-alma-primary",
    bgColor: "bg-alma-primary/10",
    borderColor: "border-alma-primary/20",
    buttonColor: "bg-alma-primary hover:bg-alma-primary/90",
  },
  {
    id: "ecos",
    name: "Ecos",
    description: "Ritmos naturales",
    color: "text-ecos-primary",
    bgColor: "bg-ecos-primary/10",
    borderColor: "border-ecos-primary/20",
    buttonColor: "bg-ecos-primary hover:bg-ecos-primary/90",
  },
  {
    id: "jade-ritual",
    name: "Jade Ritual",
    description: "Ceremonias sagradas",
    color: "text-jade-primary",
    bgColor: "bg-jade-primary/10",
    borderColor: "border-jade-primary/20",
    buttonColor: "bg-jade-primary hover:bg-jade-primary/90",
  },
  {
    id: "umbral",
    name: "Umbral",
    description: "Transformación interior",
    color: "text-umbral-primary",
    bgColor: "bg-umbral-primary/10",
    borderColor: "border-umbral-primary/20",
    buttonColor: "bg-umbral-primary hover:bg-umbral-primary/90",
  },
  {
    id: "utopica",
    slug: "prisma",
    name: "Prisma",
    description: "Visión elevada",
    color: "text-utopica-primary",
    bgColor: "bg-utopica-primary/10",
    borderColor: "border-utopica-primary/20",
    buttonColor: "bg-utopica-primary hover:bg-utopica-primary/90",
  },
];

export default function FeaturedLineSection({
  className,
}: FeaturedLineSectionProps) {
  const [selectedLine, setSelectedLine] = useState(productLines[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableLines, setAvailableLines] = useState(productLines);
  const { addItem } = useCart();

  // Find lines that have products available
  useEffect(() => {
    const findAvailableLines = async () => {
      try {
        const response = await fetch(`/api/products?limit=100&in_stock=true`);
        const data = await response.json();

        if (response.ok) {
          const allProducts = data.products || [];
          const linesWithProducts = productLines.filter((line) => {
            const lineName = line.name.toLowerCase();
            const lineId = line.id.toLowerCase();

            return allProducts.some((product: any) => {
              const name = product.name?.toLowerCase() || "";
              const description = product.description?.toLowerCase() || "";
              const shortDescription =
                product.short_description?.toLowerCase() || "";
              const categoryName =
                product.categories?.name?.toLowerCase() || "";
              const categorySlug =
                product.categories?.slug?.toLowerCase() || "";

              return (
                categoryName.includes(lineName) ||
                categoryName.includes(lineId) ||
                categorySlug.includes(lineId) ||
                name.includes(lineName) ||
                name.includes(lineId) ||
                description.includes(lineName) ||
                description.includes(lineId) ||
                shortDescription.includes(lineName) ||
                shortDescription.includes(lineId) ||
                (product.tags &&
                  product.tags.some(
                    (tag: string) =>
                      tag.toLowerCase().includes(lineName) ||
                      tag.toLowerCase().includes(lineId),
                  )) ||
                (product.collections &&
                  product.collections.some(
                    (collection: string) =>
                      collection.toLowerCase().includes(lineName) ||
                      collection.toLowerCase().includes(lineId),
                  ))
              );
            });
          });

          setAvailableLines(linesWithProducts);

          // Select a random line from available lines
          if (linesWithProducts.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * linesWithProducts.length,
            );
            setSelectedLine(linesWithProducts[randomIndex]);
          }
        }
      } catch (error) {
        console.error("Error finding available lines:", error);
        // Fallback to original behavior
        const randomIndex = Math.floor(Math.random() * productLines.length);
        setSelectedLine(productLines[randomIndex]);
      }
    };

    findAvailableLines();
  }, []);

  // Fetch products for the selected line
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First, try to fetch products by category if it exists
        let response = await fetch(`/api/products?limit=50&in_stock=true`);
        let data = await response.json();

        if (response.ok) {
          let filteredProducts: any[] = [];

          // Try to find products by category first
          const allProducts = data.products || [];

          // Look for products that belong to this specific line
          filteredProducts = allProducts.filter((product: any) => {
            const name = product.name?.toLowerCase() || "";
            const description = product.description?.toLowerCase() || "";
            const shortDescription =
              product.short_description?.toLowerCase() || "";
            const categoryName = product.categories?.name?.toLowerCase() || "";
            const categorySlug = product.categories?.slug?.toLowerCase() || "";
            const lineName = selectedLine.name.toLowerCase();
            const lineId = selectedLine.id.toLowerCase();

            // Check if product belongs to this line by:
            // 1. Category name/slug matches line
            // 2. Product name contains line name/id
            // 3. Product description contains line name/id
            // 4. Product tags/collections contain line info
            return (
              categoryName.includes(lineName) ||
              categoryName.includes(lineId) ||
              categorySlug.includes(lineId) ||
              name.includes(lineName) ||
              name.includes(lineId) ||
              description.includes(lineName) ||
              description.includes(lineId) ||
              shortDescription.includes(lineName) ||
              shortDescription.includes(lineId) ||
              (product.tags &&
                product.tags.some(
                  (tag: string) =>
                    tag.toLowerCase().includes(lineName) ||
                    tag.toLowerCase().includes(lineId),
                )) ||
              (product.collections &&
                product.collections.some(
                  (collection: string) =>
                    collection.toLowerCase().includes(lineName) ||
                    collection.toLowerCase().includes(lineId),
                ))
            );
          });

          // If we found products, limit to 6
          if (filteredProducts.length > 0) {
            setProducts(filteredProducts.slice(0, 4));
          } else {
            // If no products found for this line, don't show the section
            setProducts([]);
          }
        } else {
          console.error("Error fetching featured products:", data);
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedLine.id) {
      fetchProducts();
    }
  }, [selectedLine.id]);

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
      installments3Enabled: product.installments_3_enabled,
      installments6Enabled: product.installments_6_enabled,
    });

    toast.success(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <div
        className={cn("py-12 relative overflow-hidden", className)}
        style={{
          background: `linear-gradient(135deg, ${selectedLine.bgColor.replace("bg-", "")} 0%, ${selectedLine.bgColor.replace("bg-", "")}CC 100%)`,
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <div className="h-8 bg-white/20 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-white/20 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-96 bg-white/20 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0 || availableLines.length === 0) {
    return null; // Don't show section if no products or no available lines
  }

  return (
    <div
      className={cn("py-12 relative overflow-hidden", className)}
      style={{
        background: `linear-gradient(135deg, ${selectedLine.bgColor.replace("bg-", "")} 0%, ${selectedLine.bgColor.replace("bg-", "")}CC 100%)`,
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <Badge
            className={cn(
              "mb-4 px-4 py-2 text-sm font-semibold hover:bg-inherit hover:text-inherit",
              selectedLine.bgColor,
              selectedLine.borderColor,
              selectedLine.color,
            )}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Línea Destacada
          </Badge>

          <h2
            className={cn(
              "text-3xl md:text-4xl font-semibold mb-4 leading-tight tracking-wider text-center",
              selectedLine.color,
            )}
            style={{
              fontFamily: "Playfair Display, var(--font-playfair), serif",
              fontWeight: 600,
              fontStyle: "normal",
            }}
          >
            Descubre la línea {selectedLine.name}
          </h2>

          <p
            className="text-lg text-tierra-media max-w-2xl mx-auto mb-6 text-center"
            style={{ fontFamily: "EB Garamond, var(--font-text), serif" }}
          >
            {selectedLine.description}. Una selección especial de productos
            cuidadosamente elegidos para tu bienestar.
          </p>

          <Link href={`/categorias/linea-${"slug" in selectedLine ? selectedLine.slug : selectedLine.id}`}>
            <Button
              className={cn(
                "group relative px-10 py-4 text-lg font-semibold text-white transition-all duration-500 transform hover:scale-105 overflow-hidden",
                selectedLine.buttonColor,
              )}
              style={{
                borderRadius: "50px",
              }}
            >
              <span className="relative z-10">Ver toda la línea</span>
              <div className="absolute inset-0 -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              description={product.short_description || product.description}
              price={product.price}
              originalPrice={product.compare_at_price}
              category={product.categories?.name || selectedLine.name}
              imageUrl={product.featured_image}
              rating={product.averageRating || 0}
              reviewCount={product.reviewCount || 0}
              isNatural={true}
              isNew={false}
              isOnSale={!!product.compare_at_price}
              stock={product.inventory_quantity}
              size={
                product.product_variants?.find((v) => v.is_default)?.option1
              }
              lineTheme={selectedLine.id as any}
              onAddToCart={handleAddToCart}
              variant="elegant"
              className="p-[0]"
            />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-8">
          <Link href={`/categorias/linea-${"slug" in selectedLine ? selectedLine.slug : selectedLine.id}`}>
            <Button
              className={cn(
                "group relative px-10 py-4 text-lg font-semibold text-white transition-all duration-500 transform hover:scale-105 overflow-hidden",
                selectedLine.buttonColor,
              )}
              style={{
                borderRadius: "50px",
              }}
            >
              <span className="relative z-10">
                Ver más productos de {selectedLine.name}
              </span>
              <div className="absolute inset-0 -top-1 -left-1 w-[calc(100%+8px)] h-[calc(100%+8px)] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
