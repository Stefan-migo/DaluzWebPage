"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Settings,
  Download,
  Upload,
  Copy,
  FileText,
  CheckCircle,
  RefreshCw,
  Grid3X3,
  List,
  X,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { PRODUCTS_STATS_LIMIT } from "@/constants/admin";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventory_quantity: number;
  category?: { name: string };
  categories?: { name: string };
  is_featured: boolean;
  featured?: boolean;
  title?: string;
  created_at: string;
}

interface BulkOperationResult {
  success: boolean;
  operation: string;
  affected_count: number;
  results: any[];
}

export default function ProductsPage() {
  // View state
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Load view preference from localStorage
  useEffect(() => {
    const savedViewMode = localStorage.getItem("admin-products-view-mode");
    if (savedViewMode === "grid" || savedViewMode === "table") {
      setViewMode(savedViewMode);
    }
  }, []);

  // Save view preference to localStorage
  const handleViewModeChange = (mode: "grid" | "table") => {
    setViewMode(mode);
    localStorage.setItem("admin-products-view-mode", mode);
  };

  // Product data
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Global stats (unaffected by filters)
  const [globalStats, setGlobalStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStockCount: 0,
    totalValue: 0,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active"); // Show active products by default in admin
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);

  // Selection for bulk operations
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Bulk operation states
  const [bulkOperation, setBulkOperation] = useState("");
  const [bulkUpdates, setBulkUpdates] = useState<any>({});
  const [showBulkDialog, setShowBulkDialog] = useState(false);

  const [isDeleteDialog, setIsDeleteDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);

  // Import/Export states
  const [showJsonImportDialog, setShowJsonImportDialog] = useState(false);
  const [jsonImportResults, setJsonImportResults] = useState<any>(null);
  const [jsonImportMode, setJsonImportMode] = useState("create"); // 'create', 'update', 'upsert', 'skip_duplicates'

  // Single product delete
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchGlobalStats(); // Fetch global stats once on mount
    fetchCategories();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, categoryFilter, statusFilter, showLowStockOnly]);

  useEffect(() => {
    fetchProducts();
  }, [
    currentPage,
    itemsPerPage,
    categoryFilter,
    statusFilter,
    showLowStockOnly,
  ]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Calculate offset for pagination
      const offset = (currentPage - 1) * itemsPerPage;

      const params = new URLSearchParams({
        limit: itemsPerPage.toString(),
        offset: offset.toString(),
      });

      // Fix: Only send status param when filtering, otherwise use include_archived
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      } else {
        params.append("include_archived", "true");
      }

      // Fix: Send category ID, not name
      if (categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      // Low stock filter
      if (showLowStockOnly) {
        params.append("low_stock", "true");
      }

      const response = await fetch(`/api/admin/products?${params}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      // Calculate pagination
      const total = data.pagination?.total || data.total || 0;
      const calculatedTotalPages = Math.ceil(total / itemsPerPage);

      setProducts(data.products || []);
      setTotalProducts(total);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      toast.error("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchGlobalStats = async () => {
    try {
      // Fetch ALL products without any filters to calculate global stats
      const params = new URLSearchParams({
        limit: PRODUCTS_STATS_LIMIT.toString(),
        include_archived: "true", // Include all statuses
      });

      const response = await fetch(`/api/admin/products?${params}`);
      if (!response.ok) {
        console.error("Failed to fetch global stats");
        return;
      }

      const data = await response.json();
      const allProducts = data.products || [];

      // Calculate global stats
      const stats = {
        totalProducts: allProducts.length,
        activeProducts: allProducts.filter(
          (p: Product) => p.status === "active" || !p.status,
        ).length,
        lowStockCount: allProducts.filter(
          (p: Product) => (p.inventory_quantity || 0) <= 5,
        ).length,
        totalValue: allProducts.reduce(
          (sum: number, p: Product) =>
            sum + (p.price || 0) * (p.inventory_quantity || 0),
          0,
        ),
      };

      setGlobalStats(stats);
    } catch (error) {
      console.error("Error fetching global stats:", error);
    }
  };

  // Selection handlers
  const handleSelectProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === filteredProducts.length
        ? []
        : filteredProducts.map((p) => p.id),
    );
  };

  // Bulk operations
  const handleBulkOperation = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Selecciona al menos un producto");
      return;
    }

    if (!bulkOperation) {
      toast.error("Selecciona una operación");
      return;
    }

    try {
      setProcessing(true);

      const response = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation: bulkOperation,
          product_ids: selectedProducts,
          updates: {
            ...bulkUpdates,
            force_delete: forceDelete,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Failed to perform bulk operation";
        toast.error(errorMessage);
        return; // Don't throw error, just show toast and return
      }

      const result: BulkOperationResult = await response.json();

      toast.success(
        `Operación completada: ${result.affected_count} productos afectados`,
      );
      setShowBulkDialog(false);
      setIsDeleteDialog(false);
      setSelectedProducts([]);
      setBulkOperation("");
      setBulkUpdates({});
      fetchProducts();
    } catch (error) {
      console.error("Error performing bulk operation:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al realizar la operación masiva";
      toast.error(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  // Import/Export functions
  const handleJsonExport = async () => {
    try {
      const params = new URLSearchParams({
        format: "json",
        ...(categoryFilter !== "all" && { category_id: categoryFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/products/bulk?${params}`);
      if (!response.ok) {
        throw new Error("Failed to export products");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `productos-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Productos exportados exitosamente");
    } catch (error) {
      console.error("Error exporting products:", error);
      toast.error("Error al exportar productos");
    }
  };

  const handleJsonImport = async (file: File) => {
    if (!file) return;

    try {
      setProcessing(true);

      const text = await file.text();
      const products = JSON.parse(text);

      const response = await fetch("/api/admin/products/import-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products,
          mode: jsonImportMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to import JSON products");
      }

      const result = await response.json();
      setJsonImportResults(result);

      if (result.success) {
        const summary = result.summary || {};
        let message = `Importación JSON completada: `;
        if (summary.created > 0) message += `${summary.created} creados `;
        if (summary.updated > 0) message += `${summary.updated} actualizados `;
        if (summary.skipped > 0) message += `${summary.skipped} omitidos `;
        toast.success(message);
        fetchProducts();
      } else {
        toast.error("Error en la importación JSON");
      }
    } catch (error) {
      console.error("Error importing JSON products:", error);
      toast.error("Error al importar productos JSON");
    } finally {
      setProcessing(false);
    }
  };

  // Single product delete
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      setDeleteLoading(true);

      const response = await fetch(`/api/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete product");
      }

      const result = await response.json();

      setProducts((prevProducts) =>
        prevProducts.filter((p) => p.id !== productToDelete.id),
      );

      setDeleteDialogOpen(false);
      setProductToDelete(null);

      toast.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error al eliminar el producto");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openDeleteDialog = (product: any) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  // Utility functions
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(amount);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      active: { variant: "default", label: "Activo" },
      draft: { variant: "secondary", label: "Borrador" },
      archived: { variant: "outline", label: "Archivado" },
    };

    const statusConfig = config[status] || config["draft"];
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  // Filter products (client-side filtering for search only)
  // Low stock filtering is now done server-side via API
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Bulk operation form renderer
  const renderBulkOperationForm = () => {
    switch (bulkOperation) {
      case "update_status":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Nuevo Estado</Label>
              <Select
                onValueChange={(value) =>
                  setBulkUpdates({ ...bulkUpdates, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "update_category":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Nueva Categoría</Label>
              <Select
                onValueChange={(value) =>
                  setBulkUpdates({ ...bulkUpdates, category_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case "update_pricing":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="adjustment_type">Tipo de Ajuste</Label>
              <Select
                onValueChange={(value) =>
                  setBulkUpdates({ ...bulkUpdates, adjustment_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de ajuste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Porcentaje</SelectItem>
                  <SelectItem value="fixed">Monto Fijo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="price_adjustment">
                Ajuste{" "}
                {bulkUpdates.adjustment_type === "percentage" ? "(%)" : "($)"}
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder={
                  bulkUpdates.adjustment_type === "percentage"
                    ? "ej: 10 para +10%"
                    : "ej: 500 para +$500"
                }
                onChange={(e) =>
                  setBulkUpdates({
                    ...bulkUpdates,
                    price_adjustment: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );

      case "update_inventory":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="inventory_adjustment_type">Tipo de Ajuste</Label>
              <Select
                onValueChange={(value) =>
                  setBulkUpdates({ ...bulkUpdates, adjustment_type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de ajuste" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Establecer cantidad</SelectItem>
                  <SelectItem value="add">Agregar/Quitar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="inventory_adjustment">
                {bulkUpdates.adjustment_type === "set"
                  ? "Nueva Cantidad"
                  : "Ajuste (+/-)"}
              </Label>
              <Input
                type="number"
                placeholder={
                  bulkUpdates.adjustment_type === "set"
                    ? "ej: 50"
                    : "ej: -10 o +20"
                }
                onChange={(e) =>
                  setBulkUpdates({
                    ...bulkUpdates,
                    inventory_adjustment: parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>
        );

      case "delete":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4  rounded-lg">
              <AlertTriangle className="h-5 w-5 text-[#AE0000]" />
              <div>
                <p className="font-medium text-red-800">
                  Confirmar eliminación suave
                </p>
                <p className="text-sm text-[#AE0000]">
                  Los {selectedProducts.length} productos seleccionados serán
                  archivados (eliminación suave). Esta acción se puede deshacer
                  cambiando el estado a "Activo".
                </p>
              </div>
            </div>
          </div>
        );

      case "hard_delete":
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 p-4 bg-red-100 border border-red-300 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-admin-error-text" />
              <div>
                <p className="font-medium text-red-900">
                  ⚠️ ELIMINACIÓN PERMANENTE
                </p>
                <p className="text-sm text-admin-error-text font-medium">
                  Los {selectedProducts.length} productos seleccionados serán
                  ELIMINADOS PERMANENTEMENTE de la base de datos.
                </p>
                <p className="text-sm text-[#AE0000] mt-2">
                  ⚠️ Esta acción NO se puede deshacer. Todos los datos del
                  producto se perderán para siempre.
                </p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Recomendación:</strong> Considera usar "Eliminación
                suave" (archivar) en su lugar, que permite recuperar los
                productos si es necesario.
              </p>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="force_delete"
                  checked={forceDelete}
                  onChange={(e) => setForceDelete(e.target.checked)}
                  className="mt-1 h-4 w-4 text-dorado focus:ring-orange-500 border-orange-300 rounded"
                />
                <div>
                  <label
                    htmlFor="force_delete"
                    className="text-sm font-medium text-orange-900"
                  >
                    Forzar eliminación (incluye productos con órdenes)
                  </label>
                  <p className="text-xs text-orange-700 mt-1">
                    ⚠️ Marca esta opción si quieres eliminar productos que
                    tienen órdenes asociadas. Esto eliminará también los
                    elementos de las órdenes relacionadas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-[#E5DFD3] rounded w-64 mb-2"></div>
          <div className="h-4 bg-[#E5DFD3] rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-[#E5DFD3] h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-[#E5DFD3] rounded-lg"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-title text-3xl text-azul-profundo">
              Gestión de Productos
            </h1>
            <p className="text-tierra-media">
              Administra tu catálogo de productos biocosmética
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#AE0000] mb-2">
                Error al cargar productos
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Productos
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--admin-text-tertiary)" }}
          >
            Administra tu catálogo de productos
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 w-full sm:w-auto"
                style={{ borderColor: "var(--admin-border-secondary)" }}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">JSON</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleJsonExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar Productos
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  window.open("/api/admin/products/json-template", "_blank")
                }
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar Plantilla
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowJsonImportDialog(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Importar Productos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/admin/products/add" className="flex-1 sm:flex-none">
            <Button
              className="w-full flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              <Plus className="h-4 w-4" />
              <span>Agregar</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards - Always show global stats regardless of filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Productos */}
        <Card className="admin-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  Total Productos
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {globalStats.totalProducts}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  Todos los estados
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(139, 0, 0, 0.1)" }}
              >
                <Package
                  className="h-7 w-7"
                  style={{ color: "var(--admin-bg-secondary)" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Productos Activos */}
        <Card className="admin-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  Productos Activos
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "var(--admin-success)" }}
                >
                  {globalStats.activeProducts}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  En venta
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(40, 93, 48, 0.1)" }}
              >
                <TrendingUp
                  className="h-7 w-7"
                  style={{ color: "var(--admin-success)" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Bajo */}
        <Card className="admin-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  Stock Bajo
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "var(--admin-warning)" }}
                >
                  {globalStats.lowStockCount}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  ≤ 5 unidades
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "rgba(255, 78, 33, 0.1)" }}
              >
                <AlertTriangle
                  className="h-7 w-7"
                  style={{ color: "var(--admin-warning)" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valor Total */}
        <Card className="admin-card">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  Valor Total
                </p>
                <p
                  className="text-3xl font-bold mt-1"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {formatPrice(globalStats.totalValue)}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: "var(--admin-text-tertiary)" }}
                >
                  En inventario
                </p>
              </div>
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--admin-bg-tertiary)" }}
              >
                <BarChart3
                  className="h-7 w-7"
                  style={{ color: "var(--admin-bg-secondary)" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="admin-card">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 admin-input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full lg:w-40">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="admin-select">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-36">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="admin-select">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Low Stock Toggle */}
            <div className="w-full lg:w-auto">
              <Button
                variant={showLowStockOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setShowLowStockOnly(!showLowStockOnly);
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
                className="w-full lg:w-auto gap-2"
                style={
                  showLowStockOnly
                    ? {
                        backgroundColor: "var(--admin-warning)",
                        color: "white",
                      }
                    : { borderColor: "var(--admin-border-secondary)" }
                }
              >
                <AlertTriangle className="h-4 w-4" />
                <span>Stock Bajo</span>
                {globalStats.lowStockCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                    {globalStats.lowStockCount}
                  </span>
                )}
              </Button>
            </div>

            {/* View Toggle Button */}
            <div className="w-full lg:w-auto">
              <div
                className="flex items-center overflow-hidden rounded-md border"
                style={{ borderColor: "var(--admin-border-secondary)" }}
              >
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("grid")}
                  className="rounded-none border-0"
                  style={
                    viewMode === "grid"
                      ? {
                          backgroundColor: "var(--admin-bg-secondary)",
                          color: "white",
                        }
                      : {}
                  }
                  title="Vista de tarjetas"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewModeChange("table")}
                  className="rounded-none border-0"
                  style={
                    viewMode === "table"
                      ? {
                          backgroundColor: "var(--admin-bg-secondary)",
                          color: "white",
                        }
                      : {}
                  }
                  title="Vista de lista"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Actions */}
      {selectedProducts.length > 0 && (
        <Card className="admin-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Badge
                  style={{
                    backgroundColor: "var(--admin-bg-secondary)",
                    color: "white",
                  }}
                >
                  {selectedProducts.length} seleccionados
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Limpiar
                </Button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none"
                  onClick={() => {
                    setBulkOperation("delete");
                    setIsDeleteDialog(true);
                    setShowBulkDialog(true);
                  }}
                  style={{
                    borderColor: "var(--admin-error)",
                    color: "var(--admin-error)",
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Eliminar
                </Button>

                <Dialog
                  open={showBulkDialog}
                  onOpenChange={(open) => {
                    setShowBulkDialog(open);
                    if (!open) {
                      setIsDeleteDialog(false);
                      setBulkOperation("");
                      setBulkUpdates({});
                      setForceDelete(false);
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setIsDeleteDialog(false);
                        setBulkOperation("");
                        setBulkUpdates({});
                        setForceDelete(false);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Operaciones Masivas
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {bulkOperation === "delete"
                          ? "Archivar Productos"
                          : bulkOperation === "hard_delete"
                            ? "⚠️ Eliminar Permanentemente"
                            : "Operación Masiva"}
                      </DialogTitle>
                      <DialogDescription>
                        {bulkOperation === "delete"
                          ? `Archivar ${selectedProducts.length} productos seleccionados`
                          : bulkOperation === "hard_delete"
                            ? `ELIMINAR PERMANENTEMENTE ${selectedProducts.length} productos seleccionados`
                            : `Aplicar cambios a ${selectedProducts.length} productos seleccionados`}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      {!isDeleteDialog && (
                        <div>
                          <Label htmlFor="operation">Operación</Label>
                          <Select
                            value={bulkOperation}
                            onValueChange={setBulkOperation}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar operación" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="update_status">
                                Cambiar Estado
                              </SelectItem>
                              <SelectItem value="update_category">
                                Cambiar Categoría
                              </SelectItem>
                              <SelectItem value="update_pricing">
                                Ajustar Precios
                              </SelectItem>
                              <SelectItem value="update_inventory">
                                Ajustar Inventario
                              </SelectItem>
                              <SelectItem value="duplicate">
                                Duplicar Productos
                              </SelectItem>
                              <SelectItem value="delete">
                                Archivar Productos (Eliminación Suave)
                              </SelectItem>
                              <SelectItem
                                value="hard_delete"
                                className="text-[#AE0000] font-medium"
                              >
                                ⚠️ Eliminar Permanentemente
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {bulkOperation && renderBulkOperationForm()}
                    </div>

                    <DialogFooter>
                      <Button
                        className="btn-daluz-outline"
                        onClick={() => {
                          setShowBulkDialog(false);
                          setIsDeleteDialog(false);
                          setBulkOperation("");
                          setBulkUpdates({});
                          setForceDelete(false);
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleBulkOperation}
                        disabled={processing || !bulkOperation}
                        variant={
                          bulkOperation === "delete" ||
                          bulkOperation === "hard_delete"
                            ? "destructive"
                            : "default"
                        }
                      >
                        {processing && (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        )}
                        {bulkOperation === "delete"
                          ? "Archivar Productos"
                          : bulkOperation === "hard_delete"
                            ? "⚠️ ELIMINAR PERMANENTEMENTE"
                            : "Aplicar Cambios"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Display */}
      {viewMode === "grid" ? (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="admin-card group relative overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Selection Checkbox - Top Right */}
              <div className="absolute top-3 right-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-4 h-4 rounded cursor-pointer"
                  style={{ accentColor: "var(--admin-bg-secondary)" }}
                />
              </div>

              {/* Featured Badge - Top Left */}
              {(product.featured || product.is_featured) && (
                <div className="absolute top-3 left-3 z-10">
                  <Badge
                    className="text-xs font-medium"
                    style={{
                      backgroundColor: "var(--admin-accent-tertiary)",
                      color: "white",
                    }}
                  >
                    Destacado
                  </Badge>
                </div>
              )}

              <CardHeader className="pb-2 pt-5 pr-8">
                {/* Product Name */}
                <CardTitle
                  className="text-base font-semibold line-clamp-2"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {product.name || product.title}
                </CardTitle>

                {/* Category Badge */}
                <div className="mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.categories?.name ||
                      product.category?.name ||
                      (typeof product.category === "string"
                        ? product.category
                        : "") ||
                      "Sin categoría"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                {/* Price and Status Section */}
                <div
                  className="flex items-center justify-between py-2 border-t"
                  style={{ borderColor: "var(--admin-border-primary)" }}
                >
                  <div>
                    <p
                      className="text-xl font-bold"
                      style={{ color: "var(--admin-success)" }}
                    >
                      {formatPrice(product.price || 0)}
                    </p>
                  </div>
                  <div>{getStatusBadge(product.status || "active")}</div>
                </div>

                {/* Stock Information */}
                <div
                  className="flex items-center justify-between p-2 rounded-lg"
                  style={{ backgroundColor: "var(--admin-bg-tertiary)" }}
                >
                  <div className="flex items-center gap-2">
                    <Package
                      className="h-4 w-4"
                      style={{
                        color:
                          (product.inventory_quantity || 0) <= 5
                            ? "var(--admin-warning)"
                            : "var(--admin-success)",
                      }}
                    />
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--admin-text-secondary)" }}
                    >
                      Stock
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className="text-sm font-semibold"
                      style={{
                        color:
                          (product.inventory_quantity || 0) <= 5
                            ? "var(--admin-warning)"
                            : "var(--admin-text-primary)",
                      }}
                    >
                      {product.inventory_quantity || 0}
                    </span>
                    {(product.inventory_quantity || 0) <= 5 && (
                      <AlertTriangle
                        className="h-3 w-3"
                        style={{ color: "var(--admin-warning)" }}
                      />
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-1.5 pt-1">
                  <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    size="sm"
                    asChild
                    style={{ borderColor: "var(--admin-border-secondary)" }}
                  >
                    <Link href={`/productos/${product.slug}`} target="_blank">
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 h-8 text-xs"
                    size="sm"
                    asChild
                    style={{ borderColor: "var(--admin-border-secondary)" }}
                  >
                    <Link href={`/admin/products/edit/${product.id}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 px-2"
                    size="sm"
                    onClick={() => openDeleteDialog(product)}
                    style={{ borderColor: "var(--admin-border-secondary)" }}
                  >
                    <Trash2
                      className="h-3 w-3"
                      style={{ color: "var(--admin-error)" }}
                    />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="admin-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow
                  style={{ backgroundColor: "var(--admin-bg-tertiary)" }}
                >
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      checked={
                        selectedProducts.length === filteredProducts.length &&
                        filteredProducts.length > 0
                      }
                      onChange={handleSelectAll}
                      className="rounded"
                      style={{ accentColor: "var(--admin-bg-secondary)" }}
                    />
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Producto
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Categoría
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Precio
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Stock
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Estado
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Fecha
                  </TableHead>
                  <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow
                    key={product.id}
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "white" : "var(--admin-bg-tertiary)",
                    }}
                  >
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded"
                        style={{ accentColor: "var(--admin-bg-secondary)" }}
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        <div
                          className="font-medium"
                          style={{ color: "var(--admin-text-primary)" }}
                        >
                          {product.name}
                        </div>
                        <div
                          className="text-xs"
                          style={{ color: "var(--admin-text-tertiary)" }}
                        >
                          {product.slug}
                        </div>
                        {product.is_featured && (
                          <Badge variant="outline" className="text-xs mt-1">
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
                        <span style={{ color: "var(--admin-text-tertiary)" }}>
                          Sin categoría
                        </span>
                      )}
                    </TableCell>

                    <TableCell
                      className="font-medium"
                      style={{ color: "var(--admin-success)" }}
                    >
                      {formatPrice(product.price)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            color:
                              (product.inventory_quantity || 0) <= 5
                                ? "var(--admin-warning)"
                                : "var(--admin-text-primary)",
                          }}
                        >
                          {product.inventory_quantity}
                        </span>
                        {(product.inventory_quantity || 0) <= 5 && (
                          <AlertTriangle
                            className="h-3 w-3"
                            style={{ color: "var(--admin-warning)" }}
                          />
                        )}
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(product.status)}</TableCell>

                    <TableCell
                      className="text-sm"
                      style={{ color: "var(--admin-text-tertiary)" }}
                    >
                      {new Date(product.created_at).toLocaleDateString("es-AR")}
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-1">
                        <Link
                          href={`/productos/${product.slug}`}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Eye
                              className="h-3 w-3"
                              style={{ color: "var(--admin-info)" }}
                            />
                          </Button>
                        </Link>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit
                              className="h-3 w-3"
                              style={{ color: "var(--admin-bg-secondary)" }}
                            />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openDeleteDialog(product)}
                        >
                          <Trash2
                            className="h-3 w-3"
                            style={{ color: "var(--admin-error)" }}
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package
                  className="h-12 w-12 mx-auto mb-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  No se encontraron productos
                </h3>
                <p style={{ color: "var(--admin-text-tertiary)" }}>
                  Ajusta los filtros o agrega nuevos productos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card className="bg-admin-bg-secondary admin-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-tierra-media">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
                {Math.min(currentPage * itemsPerPage, totalProducts)} de{" "}
                {totalProducts} productos
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  className="btn-daluz-outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>

                <div className="flex items-center space-x-1">
                  {/* First page */}
                  {currentPage > 3 && (
                    <>
                      <Button
                        variant={currentPage === 1 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(1)}
                      >
                        1
                      </Button>
                      {currentPage > 4 && <span className="px-2">...</span>}
                    </>
                  )}

                  {/* Pages around current */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return (
                        page === currentPage ||
                        page === currentPage - 1 ||
                        page === currentPage + 1 ||
                        (page === currentPage - 2 && currentPage <= 3) ||
                        (page === currentPage + 2 &&
                          currentPage >= totalPages - 2)
                      );
                    })
                    .map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}

                  {/* Last page */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <span className="px-2">...</span>
                      )}
                      <Button
                        variant={
                          currentPage === totalPages ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(totalPages)}
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                </div>

                <Button
                  className="btn-daluz-outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>

                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 / pág</SelectItem>
                    <SelectItem value="24">24 / pág</SelectItem>
                    <SelectItem value="48">48 / pág</SelectItem>
                    <SelectItem value="100">100 / pág</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-admin-bg-secondary admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dorado/20 rounded-lg">
                <Plus className="h-6 w-6 text-dorado" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">
                  Agregar Producto
                </h3>
                <p className="text-sm text-tierra-media">
                  Crear nuevo producto
                </p>
              </div>
              <Button className="btn-daluz-outline" size="sm" asChild>
                <Link href="/admin/products/add">Crear</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-bg-secondary admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Stock Bajo</h3>
                <p className="text-sm text-tierra-media">
                  {globalStats.lowStockCount} productos necesitan restock
                </p>
              </div>
              <Button
                className="btn-daluz-outline"
                size="sm"
                onClick={() => {
                  setShowLowStockOnly(!showLowStockOnly);
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                {showLowStockOnly ? "Ver Todos" : "Ver"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-admin-bg-secondary admin-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-azul-profundo/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-azul-profundo" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Analíticas</h3>
                <p className="text-sm text-tierra-media">
                  Ver rendimiento de productos
                </p>
              </div>
              <Button
                className="btn-daluz-outline"
                size="sm"
                onClick={() => (window.location.href = "/admin/analytics")}
              >
                Ver
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el producto "
              {productToDelete?.name}"?
              <br />
              <strong>Esta es una eliminación suave:</strong> El producto será
              archivado (cambio de estado a "Archivado") y se puede restaurar
              cambiando su estado a "Activo".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="btn-daluz-outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
              disabled={deleteLoading}
            >
              Cancelar
            </Button>
            <Button
              className="btn-daluz-danger"
              onClick={handleDeleteProduct}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Eliminando..." : "Eliminar Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* JSON Import Dialog */}
      <Dialog
        open={showJsonImportDialog}
        onOpenChange={setShowJsonImportDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar Productos desde JSON</DialogTitle>
            <DialogDescription>
              Sube un archivo JSON para importar productos masivamente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Modo de Importación
              </label>
              <select
                value={jsonImportMode}
                onChange={(e) => setJsonImportMode(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="create">
                  Solo productos nuevos - Crear únicamente productos que no
                  existen
                </option>
                <option value="update">
                  Solo productos existentes - Actualizar únicamente productos
                  que ya existen
                </option>
                <option value="upsert">
                  Crear/Actualizar - Crear nuevos y actualizar existentes
                </option>
                <option value="skip_duplicates">
                  Omitir duplicados - Crear solo si no existe, omitir duplicados
                </option>
              </select>
              <p className="text-sm text-tierra-media mt-1">
                Elige cómo manejar productos duplicados o existentes
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Archivo JSON
              </label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleJsonImport(file);
                  }
                }}
              />
              <p className="text-sm text-tierra-media mt-1">
                Formato JSON con array de productos. Descarga la plantilla para
                ver el formato correcto.
              </p>
            </div>

            {jsonImportResults && (
              <div className="mt-4 p-4 border rounded-lg">
                <h4 className="font-medium mb-2">
                  Resultados de Importación JSON
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>Total: {jsonImportResults.total}</div>
                  <div>Exitosos: {jsonImportResults.successful}</div>
                  <div>Fallidos: {jsonImportResults.failed}</div>
                </div>

                {jsonImportResults.errors &&
                  jsonImportResults.errors.length > 0 && (
                    <div className="mt-2">
                      <h5 className="font-medium text-[#AE0000]">Errores:</h5>
                      <ul className="text-sm text-[#AE0000] max-h-32 overflow-y-auto">
                        {jsonImportResults.errors.map(
                          (error: any, index: number) => (
                            <li key={index}>
                              Producto {error.index + 1} ({error.product}):{" "}
                              {error.error}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              className="btn-daluz-outline"
              onClick={() => setShowJsonImportDialog(false)}
            >
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
