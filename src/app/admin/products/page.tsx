"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch real products data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch categories  
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData.products || []);
        setCategories(categoriesData.categories || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Mock data - keep as fallback for reference
  const mockProducts = [
    {
      id: '1',
      name: 'Crema Hidratante de Rosa Mosqueta',
      slug: 'crema-hidratante-rosa-mosqueta',
      price: 12500,
      stock: 3,
      category: 'Cremas Faciales',
      status: 'active',
      featured: true,
      lowStock: true
    },
    {
      id: '2',
      name: 'Aceite Corporal de Lavanda',
      slug: 'aceite-corporal-lavanda',
      price: 8900,
      stock: 52,
      category: 'Aceites Corporales',
      status: 'active',
      featured: false,
      lowStock: false
    },
    {
      id: '3',
      name: 'Hidrolato de Rosas',
      slug: 'hidrolato-rosas',
      price: 6700,
      stock: 1,
      category: 'Hidrolatos',
      status: 'active',
      featured: false,
      lowStock: true
    }
  ];

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-verde-suave text-white">Activo</Badge>;
      case 'draft':
        return <Badge variant="secondary">Borrador</Badge>;
      case 'archived':
        return <Badge variant="outline">Archivado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredProducts = products.filter(product => {
    const productName = product.name || product.title || '';
    const productCategory = product.category?.name || product.category || '';
    const productStatus = product.status || 'active';
    
    const matchesSearch = 
      productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || productCategory === categoryFilter;
    const matchesStatus = statusFilter === 'all' || productStatus === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const lowStockCount = products.filter(p => (p.inventory_quantity || 0) <= 5).length;
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === 'active' || !p.status).length;

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Productos</h1>
            <p className="text-tierra-media">
              Administra tu catálogo de productos biocosmética
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar productos</h3>
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
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-azul-profundo">Gestión de Productos</h1>
          <p className="text-tierra-media">
            Administra tu catálogo de productos biocosmética
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/products/bulk">
              <Settings className="h-4 w-4 mr-2" />
              Operaciones Masivas
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/products/add">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-azul-profundo" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Total Productos</p>
                <p className="text-2xl font-bold text-azul-profundo">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-verde-suave" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Productos Activos</p>
                <p className="text-2xl font-bold text-verde-suave">{activeProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Stock Bajo</p>
                <p className="text-2xl font-bold text-red-500">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-dorado" />
              <div className="ml-4">
                <p className="text-sm font-medium text-tierra-media">Valor Total</p>
                <p className="text-2xl font-bold text-dorado">
                  {formatPrice(mockProducts.reduce((sum, p) => sum + p.price * p.stock, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-azul-profundo">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-azul-profundo line-clamp-2">
                    {product.name || product.title}
                  </CardTitle>
                  <p className="text-sm text-tierra-media mt-1">
                    {product.category?.name || product.category || 'Sin categoría'}
                  </p>
                </div>
                {(product.featured || product.is_featured) && (
                  <Badge className="bg-dorado text-azul-profundo ml-2">
                    Destacado
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-verde-suave">
                  {formatPrice(product.price || 0)}
                </p>
                {getStatusBadge(product.status || 'active')}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-tierra-media">Stock:</span>
                <span className={`font-medium ${(product.inventory_quantity || 0) <= 5 ? 'text-red-500' : 'text-verde-suave'}`}>
                  {product.inventory_quantity || 0} unidades
                  {(product.inventory_quantity || 0) <= 5 && (
                    <AlertTriangle className="h-4 w-4 inline ml-1" />
                  )}
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/productos/${product.slug}`} target="_blank">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={`/admin/products/edit/${product.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
                      // TODO: Implement delete functionality
                      console.log('Delete product:', product.id);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 text-tierra-media mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-azul-profundo mb-2">
              No hay productos
            </h3>
            <p className="text-tierra-media mb-6">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                ? 'No se encontraron productos con los filtros aplicados'
                : 'Aún no hay productos para mostrar'
              }
            </p>
            <Button asChild>
              <Link href="/admin/products/add">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-dorado/20 rounded-lg">
                <Plus className="h-6 w-6 text-dorado" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Agregar Producto</h3>
                <p className="text-sm text-tierra-media">Crear nuevo producto</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products/add">Crear</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Stock Bajo</h3>
                <p className="text-sm text-tierra-media">{lowStockCount} productos necesitan restock</p>
              </div>
              <Button variant="outline" size="sm">Ver</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-azul-profundo/20 rounded-lg">
                <BarChart3 className="h-6 w-6 text-azul-profundo" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-azul-profundo">Analíticas</h3>
                <p className="text-sm text-tierra-media">Ver rendimiento de productos</p>
              </div>
              <Button variant="outline" size="sm">Ver</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
