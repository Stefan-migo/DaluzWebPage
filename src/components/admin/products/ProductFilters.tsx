"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Grid3X3, List, AlertTriangle } from "lucide-react";
import type { ProductStatus } from "@/types/admin";

interface Category {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  statusFilter: ProductStatus | "all";
  onStatusChange: (value: ProductStatus | "all") => void;
  showLowStockOnly: boolean;
  onLowStockToggle: () => void;
  viewMode: "grid" | "table";
  onViewModeChange: (mode: "grid" | "table") => void;
  categories: Category[];
  selectedCount?: number;
  onClearSelection?: () => void;
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  showLowStockOnly,
  onLowStockToggle,
  viewMode,
  onViewModeChange,
  categories,
  selectedCount = 0,
  onClearSelection,
}: ProductFiltersProps) {
  const handleLowStockToggle = () => {
    // When enabling low stock filter, clear other filters
    if (!showLowStockOnly) {
      onSearchChange("");
      onCategoryChange("all");
      onStatusChange("all");
    }
    onLowStockToggle();
  };

  return (
    <>
      {/* Search and Filters */}
      <Card className="bg-admin-bg-secondary admin-card">
        <CardHeader>
          <CardTitle className="flex items-center text-azul-profundo">
            <Filter className="h-5 w-5 mr-2" aria-hidden="true" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Buscar productos por nombre..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                  aria-label="Buscar productos por nombre"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full sm:w-48">
              <Select value={categoryFilter} onValueChange={onCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-full sm:w-48">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  onStatusChange(value as ProductStatus | "all")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Low Stock Toggle */}
            <div className="w-full sm:w-auto">
              <Button
                variant={showLowStockOnly ? "default" : "outline"}
                size="sm"
                onClick={handleLowStockToggle}
              >
                {showLowStockOnly ? "Ver Todos" : "Ver"}
                <AlertTriangle className="h-4 w-4 ml-2" />
                Stock Bajo
              </Button>
            </div>

            {/* View Toggle Button */}
            <div className="w-full sm:w-auto">
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange("grid")}
                  className="border-0"
                  title="Vista de tarjetas"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onViewModeChange("table")}
                  className="border-0"
                  title="Vista de lista"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Actions - Only show when items are selected */}
      {selectedCount > 0 && (
        <Card className="bg-admin-bg-secondary admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">
                  {selectedCount} productos seleccionados
                </Badge>
                {onClearSelection && (
                  <Button
                    className="btn-daluz-outline"
                    size="sm"
                    onClick={onClearSelection}
                  >
                    Limpiar selección
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
