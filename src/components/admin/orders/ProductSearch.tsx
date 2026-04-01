"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, Package } from "lucide-react";
import type { ProductSearchResult } from "@/types/admin";

interface ProductSearchProps {
  onSelect: (product: ProductSearchResult) => void;
}

export default function ProductSearch({ onSelect }: ProductSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<ProductSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const searchProducts = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/admin/products/search?q=${encodeURIComponent(searchTerm)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.products || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error searching products:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (product: ProductSearchResult) => {
    onSelect(product);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative product-search-container">
      <Label htmlFor="product-search-input">Buscar Producto</Label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
          aria-hidden="true"
        />
        <Input
          id="product-search-input"
          placeholder="Buscar productos por nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          className="pl-10"
          aria-label="Buscar productos por nombre"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => handleSelect(product)}
              className="w-full p-3 text-left hover:bg-gray-100 border-b last:border-b-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-600">
                      Stock: {product.inventory_quantity} unidades
                    </div>
                  </div>
                </div>
                <div className="text-verde-suave font-semibold">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
