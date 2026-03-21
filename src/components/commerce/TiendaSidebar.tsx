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
  X,
  ChevronDown,
  ChevronRight,
  Grid3X3,
  Grid2X2,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TiendaSidebarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedSkinType: string;
  setSelectedSkinType: (type: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  gridCols: number;
  setGridCols: (cols: number) => void;
  categories: Array<{ id: string; name: string; slug: string }>;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  className?: string;
}

const productLines = [
  { id: 'alma-terra', name: 'Alma Terra', color: 'text-alma-primary' },
  { id: 'ecos', name: 'Ecos', color: 'text-ecos-primary' },
  { id: 'jade-ritual', name: 'Jade Ritual', color: 'text-jade-primary' },
  { id: 'umbral', name: 'Umbral', color: 'text-umbral-primary' },
  { id: 'utopica', name: 'Utópica', color: 'text-utopica-primary' }
];

const skinTypes = [
  { value: 'dry', label: 'Seca' },
  { value: 'oily', label: 'Grasa' },
  { value: 'combination', label: 'Mixta' },
  { value: 'sensitive', label: 'Sensible' },
  { value: 'normal', label: 'Normal' }
];

const sortOptions = [
  { value: 'featured', label: 'Destacados' },
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'name', label: 'Nombre A-Z' }
];

export default function TiendaSidebar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedSkinType,
  setSelectedSkinType,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  gridCols,
  setGridCols,
  categories,
  onClearFilters,
  hasActiveFilters,
  className
}: TiendaSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    filters: true,
    sort: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    console.log('Toggling section:', section, 'current state:', expandedSections[section]);
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className={cn("w-full lg:w-80 space-y-4 lg:space-y-6", className)}>
      {/* Mobile Filter Toggle - Hidden on desktop */}
      <div className="lg:hidden mb-2">
        <Button
          variant="outline"
          className="w-full flex items-center gap-2 text-sm h-9"
          onClick={() => setExpandedSections(prev => ({ ...prev, categories: !prev.categories }))}
        >
          <SlidersHorizontal className="h-4 w-4" />
          {expandedSections.categories ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Button>
      </div>
      {/* Search */}
      <Card variant="artisanal" className="lg:block">
        <CardHeader className="pb-2 lg:pb-3">
          <CardTitle
            className="text-base lg:text-lg flex items-center gap-2"
            style={{
              fontFamily: 'VELISTA, var(--font-velista), serif',
              fontWeight: 'normal',
              fontStyle: 'normal'
            }}
          >
            <Search className="h-4 w-4 lg:h-5 lg:w-5 text-azul-profundo" />
            Buscar Productos
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9 lg:h-10 text-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card variant="artisanal">
        <CardHeader
          className="pb-2 lg:pb-3 cursor-pointer"
          onClick={() => {
            console.log('Categories header clicked');
            toggleSection('categories');
          }}
        >
          <CardTitle
            className="text-base lg:text-lg flex items-center justify-between"
            style={{
              fontFamily: 'VELISTA, var(--font-velista), serif',
              fontWeight: 'normal',
              fontStyle: 'normal'
            }}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4 lg:h-5 lg:w-5 text-azul-profundo" />
              Categorías
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
                  variant={selectedCategory === line.id ? 'line-primary' : 'line-ghost'}
                  className={cn(
                    "w-full justify-start text-sm h-8 lg:h-9",
                    line.color
                  )}
                  onClick={() => {
                    // Redirect to specific category page instead of filtering
                    window.location.href = `/categorias/linea-${line.id}`;
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
      <Card variant="artisanal">
        <CardHeader
          className="pb-2 lg:pb-3 cursor-pointer"
          onClick={() => {
            console.log('Filters header clicked');
            toggleSection('filters');
          }}
        >
          <CardTitle
            className="text-base lg:text-lg flex items-center justify-between"
            style={{
              fontFamily: 'VELISTA, var(--font-velista), serif',
              fontWeight: 'normal',
              fontStyle: 'normal'
            }}
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 lg:h-5 lg:w-5 text-azul-profundo" />
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
              <label className="text-xs lg:text-sm font-medium mb-2 block">Tipo de Piel</label>
              <Select value={selectedSkinType} onValueChange={setSelectedSkinType}>
                <SelectTrigger className="h-8 lg:h-10 text-sm">
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {skinTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="text-xs lg:text-sm font-medium mb-2 block">Rango de Precio</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Mín"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="h-8 lg:h-10 text-sm"
                />
                <Input
                  type="number"
                  placeholder="Máx"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="h-8 lg:h-10 text-sm"
                />
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={() => {
                  console.log('Clear filters clicked');
                  onClearFilters();
                }}
                className="w-full flex items-center gap-2 text-sm h-8 lg:h-9"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        )}
      </Card>

      {/* Sort & Grid - Hidden on mobile */}
      <Card variant="artisanal" className="hidden lg:block">
        <CardHeader
          className="pb-3 cursor-pointer"
          onClick={() => {
            console.log('Sort header clicked');
            toggleSection('sort');
          }}
        >
          <CardTitle
            className="text-lg flex items-center justify-between"
            style={{
              fontFamily: 'VELISTA, var(--font-velista), serif',
              fontWeight: 'normal',
              fontStyle: 'normal'
            }}
          >
            <span className="flex items-center gap-2">
              <Grid3X3 className="h-5 w-5 text-azul-profundo" />
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
              <label className="text-sm font-medium mb-2 block">Ordenar por</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar orden" />
                </SelectTrigger>
                <SelectContent>
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
              <label className="text-sm font-medium mb-2 block">Vista</label>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={gridCols === 2 ? "line-primary" : "line-ghost"}
                  size="sm"
                  onClick={() => {
                    console.log('Grid 2x2 clicked');
                    setGridCols(2);
                  }}
                  className="flex-1 rounded-none"
                >
                  <Grid2X2 className="h-4 w-4 mr-2" />
                  2x2
                </Button>
                <Button
                  variant={gridCols === 3 ? "line-primary" : "line-ghost"}
                  size="sm"
                  onClick={() => {
                    console.log('Grid 3x3 clicked');
                    setGridCols(3);
                  }}
                  className="flex-1 rounded-none"
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
              <h4
                className="font-normal text-sm"
                style={{
                  fontFamily: 'VELISTA, var(--font-velista), serif',
                  fontWeight: 'normal',
                  fontStyle: 'normal'
                }}
              >
                Filtros Activos:
              </h4>
              <div className="flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge variant="secondary" className="text-xs">
                    Búsqueda: {searchTerm}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="text-xs">
                    Categoría: {categories.find(c => c.id === selectedCategory)?.name || productLines.find(p => p.id === selectedCategory)?.name}
                  </Badge>
                )}
                {selectedSkinType && selectedSkinType !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    Piel: {skinTypes.find(s => s.value === selectedSkinType)?.label}
                  </Badge>
                )}
                {(priceRange.min || priceRange.max) && (
                  <Badge variant="secondary" className="text-xs">
                    Precio: {priceRange.min || '0'} - {priceRange.max || '∞'}
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
