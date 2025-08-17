"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Package,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Eye,
  Filter
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: string;
  inventory_quantity: number;
  category?: { name: string };
  is_featured: boolean;
  created_at: string;
}

interface BulkOperationResult {
  success: boolean;
  operation: string;
  affected_count: number;
  results: any[];
}

interface ImportResult {
  success: boolean;
  summary: {
    total_processed: number;
    created: number;
    updated: number;
    skipped: number;
    errors_count: number;
    warnings_count: number;
  };
  results: {
    errors: string[];
    warnings: string[];
    details: any[];
  };
}

export default function BulkOperationsPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Bulk operation states
  const [bulkOperation, setBulkOperation] = useState('');
  const [bulkUpdates, setBulkUpdates] = useState<any>({});
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importMode, setImportMode] = useState('create');
  const [importResults, setImportResults] = useState<ImportResult | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    setSelectedProducts(
      selectedProducts.length === products.length ? [] : products.map(p => p.id)
    );
  };

  const handleBulkOperation = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Selecciona al menos un producto');
      return;
    }

    if (!bulkOperation) {
      toast.error('Selecciona una operación');
      return;
    }

    try {
      setProcessing(true);
      
      const response = await fetch('/api/admin/products/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation: bulkOperation,
          product_ids: selectedProducts,
          updates: bulkUpdates
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to perform bulk operation');
      }

      const result: BulkOperationResult = await response.json();
      
      toast.success(`Operación completada: ${result.affected_count} productos afectados`);
      setShowBulkDialog(false);
      setSelectedProducts([]);
      setBulkOperation('');
      setBulkUpdates({});
      fetchProducts();

    } catch (error) {
      console.error('Error performing bulk operation:', error);
      toast.error('Error al realizar la operación masiva');
    } finally {
      setProcessing(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        format: 'csv',
        ...(categoryFilter !== 'all' && { category_id: categoryFilter }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      });

      const response = await fetch(`/api/admin/products/bulk?${params}`);
      if (!response.ok) {
        throw new Error('Failed to export products');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Productos exportados exitosamente');
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Error al exportar productos');
    }
  };

  const handleImport = async (file: File) => {
    if (!file) return;

    try {
      setProcessing(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('mode', importMode);

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to import products');
      }

      const result: ImportResult = await response.json();
      setImportResults(result);
      
      if (result.success) {
        toast.success(`Importación completada: ${result.summary.created} creados, ${result.summary.updated} actualizados`);
        fetchProducts();
      } else {
        toast.error('Error en la importación');
      }

    } catch (error) {
      console.error('Error importing products:', error);
      toast.error('Error al importar productos');
    } finally {
      setProcessing(false);
    }
  };

  const formatPrice = (amount: number) => 
    new Intl.NumberFormat('es-AR', { 
      style: 'currency', 
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      active: { variant: 'default', label: 'Activo' },
      draft: { variant: 'secondary', label: 'Borrador' },
      archived: { variant: 'outline', label: 'Archivado' }
    };

    const statusConfig = config[status] || config['draft'];
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  const renderBulkOperationForm = () => {
    switch (bulkOperation) {
      case 'update_status':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Nuevo Estado</Label>
              <Select onValueChange={(value) => setBulkUpdates({...bulkUpdates, status: value})}>
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

      case 'update_category':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Nueva Categoría</Label>
              <Select onValueChange={(value) => setBulkUpdates({...bulkUpdates, category_id: value})}>
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

      case 'update_pricing':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="adjustment_type">Tipo de Ajuste</Label>
              <Select onValueChange={(value) => setBulkUpdates({...bulkUpdates, adjustment_type: value})}>
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
                Ajuste {bulkUpdates.adjustment_type === 'percentage' ? '(%)' : '($)'}
              </Label>
              <Input
                type="number"
                step="0.01"
                placeholder={bulkUpdates.adjustment_type === 'percentage' ? 'ej: 10 para +10%' : 'ej: 500 para +$500'}
                onChange={(e) => setBulkUpdates({...bulkUpdates, price_adjustment: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        );

      case 'update_inventory':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="inventory_adjustment_type">Tipo de Ajuste</Label>
              <Select onValueChange={(value) => setBulkUpdates({...bulkUpdates, adjustment_type: value})}>
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
                {bulkUpdates.adjustment_type === 'set' ? 'Nueva Cantidad' : 'Ajuste (+/-)'}
              </Label>
              <Input
                type="number"
                placeholder={bulkUpdates.adjustment_type === 'set' ? 'ej: 50' : 'ej: -10 o +20'}
                onChange={(e) => setBulkUpdates({...bulkUpdates, inventory_adjustment: parseInt(e.target.value)})}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Operaciones Masivas</h1>
            <p className="text-tierra-media">Cargando productos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/products">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-azul-profundo">Operaciones Masivas</h1>
            <p className="text-tierra-media">
              Gestiona múltiples productos de forma eficiente
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Importar Productos desde CSV</DialogTitle>
                <DialogDescription>
                  Sube un archivo CSV para importar productos masivamente
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="import_mode">Modo de Importación</Label>
                  <Select value={importMode} onValueChange={setImportMode}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create">Crear - Solo productos nuevos</SelectItem>
                      <SelectItem value="update">Actualizar - Solo productos existentes</SelectItem>
                      <SelectItem value="upsert">Crear/Actualizar - Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="csv_file">Archivo CSV</Label>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImport(file);
                      }
                    }}
                  />
                  <p className="text-sm text-tierra-media mt-1">
                    Formatos soportados: nombre, descripción, precio, stock, estado, categoría, etc.
                  </p>
                </div>

                {importResults && (
                  <div className="mt-4 p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Resultados de Importación</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>Procesados: {importResults.summary.total_processed}</div>
                      <div>Creados: {importResults.summary.created}</div>
                      <div>Actualizados: {importResults.summary.updated}</div>
                      <div>Omitidos: {importResults.summary.skipped}</div>
                    </div>
                    
                    {importResults.results.errors.length > 0 && (
                      <div className="mt-2">
                        <h5 className="font-medium text-red-600">Errores:</h5>
                        <ul className="text-sm text-red-600 list-disc list-inside">
                          {importResults.results.errors.slice(0, 5).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                          {importResults.results.errors.length > 5 && (
                            <li>... y {importResults.results.errors.length - 5} más</li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Selection Actions */}
      {selectedProducts.length > 0 && (
        <Card className="border-dorado">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="secondary">
                  {selectedProducts.length} productos seleccionados
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Limpiar selección
                </Button>
              </div>
              
              <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Edit className="h-4 w-4 mr-2" />
                    Operaciones Masivas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Operación Masiva</DialogTitle>
                    <DialogDescription>
                      Aplicar cambios a {selectedProducts.length} productos seleccionados
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="operation">Operación</Label>
                      <Select value={bulkOperation} onValueChange={setBulkOperation}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar operación" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="update_status">Cambiar Estado</SelectItem>
                          <SelectItem value="update_category">Cambiar Categoría</SelectItem>
                          <SelectItem value="update_pricing">Ajustar Precios</SelectItem>
                          <SelectItem value="update_inventory">Ajustar Inventario</SelectItem>
                          <SelectItem value="duplicate">Duplicar Productos</SelectItem>
                          <SelectItem value="delete">Archivar Productos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {bulkOperation && renderBulkOperationForm()}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleBulkOperation} 
                      disabled={processing || !bulkOperation}
                    >
                      {processing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                      Aplicar Cambios
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
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

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Productos ({products.length})
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={handleSelectAll}
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
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
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
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-tierra-media">{product.slug}</div>
                      {product.is_featured && (
                        <Badge variant="outline" className="text-xs">Destacado</Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline">{product.category.name}</Badge>
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
                  
                  <TableCell>
                    {getStatusBadge(product.status)}
                  </TableCell>
                  
                  <TableCell className="text-sm text-tierra-media">
                    {new Date(product.created_at).toLocaleDateString('es-AR')}
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-tierra-media mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-azul-profundo mb-2">No se encontraron productos</h3>
              <p className="text-tierra-media">Ajusta los filtros o agrega nuevos productos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
