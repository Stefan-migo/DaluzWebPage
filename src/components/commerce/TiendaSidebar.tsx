"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Grid2X2,
  SlidersHorizontal,
  Heart,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiendaSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSkinType: string;
  setSelectedSkinType: (type: string) => void;
  selectedHairType: string;
  setSelectedHairType: (type: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  gridCols: number;
  setGridCols: (cols: number) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  showOnlyFavorites?: boolean;
  setShowOnlyFavorites?: (value: boolean) => void;
  showOnlySale?: boolean;
  setShowOnlySale?: (value: boolean) => void;
  className?: string;
}

const productLines = [
  { id: "alma-terra", name: "Alma Terra" },
  { id: "ecos", name: "Ecos" },
  { id: "jade-ritual", name: "Jade Ritual" },
  { id: "kits-experiencia", slug: "kits-y-experiencia", name: "Kits y Experiencia" },
  { id: "umbral", name: "Umbral" },
  { id: "utopica", slug: "prisma", name: "Prisma" },
];

const skinTypes = [
  { value: "dry", label: "Seca" },
  { value: "oily", label: "Grasa" },
  { value: "combination", label: "Mixta" },
  { value: "sensitive", label: "Sensible" },
  { value: "normal", label: "Normal" },
];

const hairTypes = [
  { value: "oily", label: "Graso" },
  { value: "dry", label: "Seco" },
  { value: "normal", label: "Normal" },
  { value: "combination", label: "Mixto" },
  { value: "curly", label: "Rizado" },
  { value: "straight", label: "Lacio" },
];

// Las etiquetas evitan "á" y ":": Synthese.otf no incluye esos glifos y el
// panel del Select se renderiza con esa tipografía.
const sortOptions = [
  { value: "featured", label: "Destacados" },
  { value: "newest", label: "Recientes" },
  { value: "price_asc", label: "Precio menor a mayor" },
  { value: "price_desc", label: "Precio mayor a menor" },
  { value: "name", label: "Nombre A-Z" },
];

export default function TiendaSidebar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSkinType,
  setSelectedSkinType,
  selectedHairType,
  setSelectedHairType,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  gridCols,
  setGridCols,
  categories,
  onClearFilters,
  hasActiveFilters,
  showOnlyFavorites = false,
  setShowOnlyFavorites,
  showOnlySale = false,
  setShowOnlySale,
  className,
}: TiendaSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    filters: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    console.log(
      "Toggling section:",
      section,
      "current state:",
      expandedSections[section],
    );
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={cn("w-full lg:w-80 space-y-4 lg:space-y-6", className)}>
      {/* Mobile Filter Toggle - Hidden on desktop */}
      <div className="lg:hidden mb-2">
        <Button
          variant="outline"
          className="tienda-button w-full flex items-center gap-2 text-sm h-9"
          onClick={() =>
            setExpandedSections((prev) => ({
              ...prev,
              categories: !prev.categories,
            }))
          }
        >
          <SlidersHorizontal className="h-4 w-4" />
          {expandedSections.categories ? "Ocultar Filtros" : "Mostrar Filtros"}
        </Button>
      </div>
      {/* Search */}
      <Card variant="artisanal" className="lg:block" style={{ backgroundColor: "#fff2db" }}>
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle className="tienda-section-title text-base lg:text-lg flex items-center gap-2">
            <Search className="h-4 w-4 lg:h-5 lg:w-5" />
            Buscar
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-azul-institucional h-4 w-4" />
            <Input
              variant="tienda"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 lg:h-10 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card variant="artisanal" style={{ backgroundColor: "#fff2db" }}>
        <CardHeader
          className="pb-2 lg:pb-3 cursor-pointer"
          onClick={() => {
            console.log("Categories header clicked");
            toggleSection("categories");
          }}
        >
          <CardTitle className="tienda-section-title text-base lg:text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4 lg:h-5 lg:w-5" />
              {/* Sin tilde: Synthese.otf no incluye el glifo "Í" y caería a otra fuente */}
              Categorias
            </span>
            {expandedSections.categories ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.categories && (
          <CardContent className="pt-0">
            <div className="space-y-2 lg:space-y-3">
              {/* Product Lines */}
              {productLines.map((line) => (
                <Button
                  key={line.id}
                  variant={
                    selectedCategory === line.id ? "line-primary" : "line-ghost"
                  }
                  className="tienda-line-button w-full justify-start text-sm h-8 lg:h-9"
                  onClick={() => {
                    const lineSlug = "slug" in line ? line.slug : line.id;
                    window.location.href = `/categorias/linea-${lineSlug}`;
                  }}
                >
                  {line.name}
                </Button>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      <Card variant="artisanal" style={{ backgroundColor: "#fff2db" }}>
        <CardHeader
          className="pb-2 lg:pb-3 cursor-pointer"
          onClick={() => {
            console.log("Filters header clicked");
            toggleSection("filters");
          }}
        >
          <CardTitle className="tienda-section-title text-base lg:text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 lg:h-5 lg:w-5" />
              Filtros
            </span>
            {expandedSections.filters ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.filters && (
          <CardContent className="pt-0 space-y-3 lg:space-y-4">
            {/* Skin Type */}
            <div>
              <label className="tienda-field-label mb-2 block">
                Tipo de Piel
              </label>
              <Select
                value={selectedSkinType}
                onValueChange={setSelectedSkinType}
              >
                <SelectTrigger className="tienda-select-trigger h-8 lg:h-10 text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent className="tienda-select-panel">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {skinTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hair Type */}
            <div>
              <label className="tienda-field-label mb-2 block">
                Tipo de Cabello
              </label>
              <Select
                value={selectedHairType}
                onValueChange={setSelectedHairType}
              >
                <SelectTrigger className="tienda-select-trigger h-8 lg:h-10 text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent className="tienda-select-panel">
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {hairTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="tienda-field-label mb-2 block">
                Rango de Precio
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Sin tilde: Synthese.otf no trae los glifos "í"/"á" */}
                <Input
                  variant="tienda"
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="h-8 lg:h-10 text-sm"
                />
                <Input
                  variant="tienda"
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="h-8 lg:h-10 text-sm"
                />
              </div>
            </div>

            {/* Favorites Toggle - el icono aparece solo en estado activo */}
            {setShowOnlyFavorites && (
              <Button
                variant="outline"
                data-active={showOnlyFavorites || undefined}
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className="tienda-action-button w-full flex items-center justify-center gap-2 text-sm h-8 lg:h-9"
              >
                {showOnlyFavorites && (
                  <Heart className="h-4 w-4 fill-current" />
                )}
                Mis favoritos
              </Button>
            )}

            {/* Sale Toggle - el icono aparece solo en estado activo */}
            {setShowOnlySale && (
              <Button
                variant="outline"
                data-active={showOnlySale || undefined}
                onClick={() => setShowOnlySale(!showOnlySale)}
                className="tienda-action-button w-full flex items-center justify-center gap-2 text-sm h-8 lg:h-9"
              >
                {showOnlySale && <Tag className="h-4 w-4" />}
                Solo ofertas
              </Button>
            )}

            {/* Clear Filters - sin icono: no tiene estado activo */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  console.log("Clear filters clicked");
                  onClearFilters();
                }}
                className="tienda-action-button w-full flex items-center justify-center gap-2 text-sm h-8 lg:h-9"
              >
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Sort & Grid - Hidden on mobile */}
      <Card variant="artisanal" className="hidden lg:block" style={{ backgroundColor: "#fff2db" }}>
        <CardHeader
          className="pb-3 cursor-pointer"
          onClick={() => {
            console.log("Sort header clicked");
            toggleSection("sort");
          }}
        >
          <CardTitle className="tienda-section-title text-lg flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5" />
              Ordenar y Vista
            </span>
            {expandedSections.sort ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </CardTitle>
        </CardHeader>
        {expandedSections.sort && (
          <CardContent className="pt-0 space-y-4">
            {/* Sort Options */}
            <div>
              <label className="tienda-field-label mb-2 block">
                Ordenar por
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="tienda-select-trigger">
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent className="tienda-select-panel">
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Grid Options */}
            <div>
              <label className="tienda-field-label mb-2 block">Vista</label>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={gridCols === 2 ? "line-primary" : "line-ghost"}
                  size="sm"
                  onClick={() => {
                    console.log("Grid 2x2 clicked");
                    setGridCols(2);
                  }}
                  className="tienda-button tienda-flat flex-1 rounded-none"
                >
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  2x2
                </Button>
                <Button
                  variant={gridCols === 3 ? "line-primary" : "line-ghost"}
                  size="sm"
                  onClick={() => {
                    console.log("Grid 3x3 clicked");
                    setGridCols(3);
                  }}
                  className="tienda-button tienda-flat flex-1 rounded-none"
                >
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  3x3
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <Card variant="artisanal">
          <CardContent className="pt-4">
            <div className="space-y-2">
              {/* Sin ":" — Synthese.otf no incluye ese glifo y caería a otra fuente */}
              <h4 className="tienda-section-title text-sm">Filtros Activos</h4>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Búsqueda: {searchTerm}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="text-xs">
                    Categoría:{" "}
                    {categories.find((c) => c.id === selectedCategory)?.name ||
                      productLines.find((p) => p.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedSkinType && selectedSkinType !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Piel:{" "}
                    {skinTypes.find((s) => s.value === selectedSkinType)?.label}
                  </Badge>
                )}
                {selectedHairType && selectedHairType !== "all" && (
                  <Badge variant="secondary" className="text-xs">
                    Cabello:{" "}
                    {hairTypes.find((h) => h.value === selectedHairType)?.label}
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="text-xs">
                    Precio: {priceRange.min || "0"} - {priceRange.max || "∞"}
                  </Badge>
                )}
                {showOnlyFavorites && (
                  <Badge variant="secondary" className="text-xs">
                    Solo favoritos
                  </Badge>
                )}
                {showOnlySale && (
                  <Badge variant="secondary" className="text-xs">
                    Solo ofertas
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
