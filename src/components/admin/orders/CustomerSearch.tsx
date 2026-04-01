"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, User } from "lucide-react";
import type { CustomerSearchResult } from "@/types/admin";

interface CustomerSearchProps {
  onSelect: (customer: CustomerSearchResult) => void;
  onEmailChange: (email: string) => void;
  selectedEmail: string;
}

export default function CustomerSearch({
  onSelect,
  onEmailChange,
  selectedEmail,
}: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<CustomerSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    const searchCustomers = async () => {
      if (searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/admin/customers/search?q=${encodeURIComponent(searchTerm)}`,
        );
        if (response.ok) {
          const data = await response.json();
          setResults(data.customers || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Error searching customers:", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchCustomers, 300);
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

  const handleSelect = (customer: CustomerSearchResult) => {
    onSelect(customer);
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative customer-search-container">
      <Label htmlFor="customer-search-input">Buscar Cliente Existente</Label>
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"
          aria-hidden="true"
        />
        <Input
          id="customer-search-input"
          placeholder="Buscar por email o nombre..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => searchTerm.length >= 2 && setIsOpen(true)}
          className="pl-10"
          aria-label="Buscar cliente por email o nombre"
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((customer) => (
            <button
              key={customer.id}
              type="button"
              onClick={() => handleSelect(customer)}
              className="w-full p-3 text-left hover:bg-gray-100 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <div className="font-medium">{customer.name}</div>
              </div>
              <div className="text-sm text-gray-600 ml-6">{customer.email}</div>
              {customer.shipping_info?.city && (
                <div className="text-xs text-gray-500 mt-1 ml-6">
                  {customer.shipping_info.city}, {customer.shipping_info.state}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
