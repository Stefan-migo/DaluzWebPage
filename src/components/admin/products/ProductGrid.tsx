"use client";

import React, { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Package, Eye, Edit, Trash2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import type { Product, ProductStatus } from "@/types/admin";

interface ProductGridProps {
  products: Product[];
  viewMode: "grid" | "table";
  selectedProducts: string[];
  onSelectProduct: (productId: string) => void;
  onSelectAll: () => void;
  onDeleteProduct: (product: Product) => void;
}

const formatPrice = (amount: number): string =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);

const getStatusBadge = (status: string): React.ReactNode => {
  const config: Record<
    string,
    { variant: "default" | "secondary" | "outline"; label: string }
  > = {
    active: { variant: "default", label: "Activo" },
    draft: { variant: "secondary", label: "Borrador" },
    archived: { variant: "outline", label: "Archivado" },
  };

  const statusConfig = config[status] || config.draft;
  return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
};

// ============================================
// GRID VIEW COMPONENT
// ============================================

function ProductGridView({
  products,
  selectedProducts,
  onSelectProduct,
  onDeleteProduct,
}: Omit<ProductGridProps, "viewMode" | "onSelectAll">) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden"
        >
          {/* Selection Checkbox - Top Right */}
          <div className="absolute top-3 right-3 z-10">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={() => onSelectProduct(product.id)}
              className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer bg-white/90 backdrop-blur-sm transition-all hover:scale-110"
            />
          </div>

          {/* Featured Badge - Top Left */}
          {(product.featured || product.is_featured) && (
            <div className="absolute top-3 left-3 z-10">
              <Badge className="bg-dorado text-azul-profundo shadow-md">
                ⭐ Destacado
              </Badge>
            </div>
          )}

          <CardHeader className="pb-3 pt-6">
            {/* Product Name */}
            <CardTitle className="font-subtitle text-xl text-azul-profundo line-clamp-2 pr-8 min-h-[3rem]">
              {product.name || product.title}
            </CardTitle>

            {/* Category Badge */}
            <div className="mt-2">
              <Badge variant="outline" className="text-xs font-normal">
                {product.categories?.name ||
                  product.category?.name ||
                  "Sin categoría"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            {/* Price and Status Section */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div>
                <p className="text-2xl font-bold text-verde-suave">
                  {formatPrice(product.price || 0)}
                </p>
              </div>
              <div>{getStatusBadge(product.status || "active")}</div>
            </div>

            {/* Stock Information */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 border border-gray-100">
              <div className="flex items-center gap-2">
                <Package
                  className={`h-4 w-4 ${(product.inventory_quantity || 0) <= 5 ? "text-red-500" : "text-verde-suave"}`}
                />
                <span className="text-sm font-medium text-gray-700">Stock</span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-sm font-semibold ${(product.inventory_quantity || 0) <= 5 ? "text-red-500" : "text-gray-700"}`}
                >
                  {product.inventory_quantity || 0}
                </span>
                <span className="text-xs text-tierra-media">unidades</span>
                {(product.inventory_quantity || 0) <= 5 && (
                  <AlertTriangle className="h-4 w-4 text-red-500 ml-1" />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                className="btn-daluz-outline flex-1 group/btn hover:bg-verde-suave/10 hover:border-verde-suave transition-colors"
                size="sm"
                asChild
                aria-label={`Ver producto ${product.name}`}
              >
                <Link href={`/productos/${product.slug}`} target="_blank">
                  <Eye
                    className="h-4 w-4 mr-1.5 group-hover/btn:text-verde-suave"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Ver</span>
                </Link>
              </Button>
              <Button
                className="btn-daluz-outline flex-1 group/btn hover:bg-azul-profundo/10 hover:border-azul-profundo transition-colors"
                size="sm"
                asChild
                aria-label={`Editar producto ${product.name}`}
              >
                <Link href={`/admin/products/edit/${product.id}`}>
                  <Edit
                    className="h-4 w-4 mr-1.5 group-hover/btn:text-azul-profundo"
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">Editar</span>
                </Link>
              </Button>
              <Button
                className="btn-daluz-outline group/btn hover:bg-red-50 hover:border-red-300 transition-colors"
                size="sm"
                onClick={() => onDeleteProduct(product)}
                aria-label={`Eliminar producto ${product.name}`}
              >
                <Trash2
                  className="h-4 w-4 group-hover/btn:text-red-500"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ============================================
// TABLE VIEW COMPONENT
// ============================================

function ProductTableView({
  products,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onDeleteProduct,
}: ProductGridProps) {
  const allSelected =
    selectedProducts.length === products.length && products.length > 0;

  return (
    <Card className="bg-admin-bg-secondary admin-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 mr-2" aria-hidden="true" />
            Productos ({products.length})
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={onSelectAll}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-tierra-media">Seleccionar todos</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => onSelectProduct(product.id)}
                    className="rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-tierra-media">
                      {product.slug}
                    </div>
                    {product.is_featured && (
                      <Badge variant="outline" className="text-xs">
                        Destacado
                      </Badge>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  {product.categories?.name || product.category?.name ? (
                    <Badge variant="outline">
                      {product.categories?.name || product.category?.name}
                    </Badge>
                  ) : (
                    <span className="text-tierra-media">Sin categoría</span>
                  )}
                </TableCell>

                <TableCell className="font-medium">
                  {formatPrice(product.price)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center space-x-2">
                    <span>{product.inventory_quantity}</span>
                    {product.inventory_quantity <= 5 && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </TableCell>

                <TableCell>{getStatusBadge(product.status)}</TableCell>

                <TableCell className="text-sm text-tierra-media">
                  {new Date(product.created_at).toLocaleDateString("es-AR")}
                </TableCell>

                <TableCell>
                  <div className="flex space-x-2">
                    <Link
                      href={`/productos/${product.slug}`}
                      target="_blank"
                      aria-label={`Ver producto ${product.name}`}
                    >
                      <Button className="btn-daluz-outline" size="sm">
                        <Eye className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Link
                      href={`/admin/products/edit/${product.id}`}
                      aria-label={`Editar producto ${product.name}`}
                    >
                      <Button className="btn-daluz-outline" size="sm">
                        <Edit className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </Link>
                    <Button
                      className="btn-daluz-outline"
                      size="sm"
                      onClick={() => onDeleteProduct(product)}
                      aria-label={`Eliminar producto ${product.name}`}
                    >
                      <Trash2 className="h-3 w-3" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-tierra-media mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-azul-profundo mb-2">
              No se encontraron productos
            </h3>
            <p className="text-tierra-media">
              Ajusta los filtros o agrega nuevos productos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

const ProductGrid = memo(function ProductGrid({
  products,
  viewMode,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onDeleteProduct,
}: ProductGridProps) {
  if (viewMode === "grid") {
    return (
      <ProductGridView
        products={products}
        selectedProducts={selectedProducts}
        onSelectProduct={onSelectProduct}
        onDeleteProduct={onDeleteProduct}
      />
    );
  }

  return (
    <ProductTableView
      products={products}
      viewMode={viewMode}
      selectedProducts={selectedProducts}
      onSelectProduct={onSelectProduct}
      onSelectAll={onSelectAll}
      onDeleteProduct={onDeleteProduct}
    />
  );
});

export default ProductGrid;
