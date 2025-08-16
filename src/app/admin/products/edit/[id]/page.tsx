"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { ArrowLeft, Package, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    sku: '',
    inventory_quantity: '',
    weight: '',
    dimensions: '',
    image_url: '',
    skin_types: [] as string[],
    benefits: [] as string[],
    certifications: [] as string[],
    ingredients: '',
    usage_instructions: '',
    featured: false,
    status: 'active'
  });

  // Fetch product data and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch product data
        const productResponse = await fetch(`/api/products/${productId}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await productResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        // Set form data with product values
        setFormData({
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price?.toString() || '',
          compare_at_price: productData.compare_at_price?.toString() || '',
          category_id: productData.category_id || '',
          sku: productData.sku || '',
          inventory_quantity: productData.inventory_quantity?.toString() || '',
          weight: productData.weight?.toString() || '',
          dimensions: productData.dimensions || '',
          image_url: productData.image_url || '',
          skin_types: productData.skin_types || [],
          benefits: productData.benefits || [],
          certifications: productData.certifications || [],
          ingredients: productData.ingredients || '',
          usage_instructions: productData.usage_instructions || '',
          featured: productData.featured || false,
          status: productData.status || 'active'
        });
        
        setCategories(categoriesData.categories || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        inventory_quantity: parseInt(formData.inventory_quantity),
        weight: formData.weight ? parseFloat(formData.weight) : null,
      };

      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Producto actualizado exitosamente');
        router.push('/admin/products');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al actualizar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Productos
            </Link>
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">Error al cargar producto</h3>
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Productos
          </Link>
        </Button>
        
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-azul-profundo" />
          <h1 className="text-2xl font-bold text-azul-profundo">Editar Producto</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Ej: Crema Hidratante de Rosa Mosqueta"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Ej: CRM-001"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del producto..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Inventory */}
        <Card>
          <CardHeader>
            <CardTitle>Precios e Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Precio (ARS) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="15000"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="compare_at_price">Precio Anterior (ARS)</Label>
                <Input
                  id="compare_at_price"
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={(e) => handleInputChange('compare_at_price', e.target.value)}
                  placeholder="18000"
                />
              </div>
              
              <div>
                <Label htmlFor="inventory_quantity">Stock *</Label>
                <Input
                  id="inventory_quantity"
                  type="number"
                  value={formData.inventory_quantity}
                  onChange={(e) => handleInputChange('inventory_quantity', e.target.value)}
                  placeholder="50"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Product Details */}
        <Card>
          <CardHeader>
            <CardTitle>Categoría y Detalles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category_id">Categoría *</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
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
              
              <div>
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado del producto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="draft">Borrador</SelectItem>
                    <SelectItem value="archived">Archivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="image_url">URL de Imagen</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => handleInputChange('featured', checked)}
              />
              <Label htmlFor="featured">Producto Destacado</Label>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ingredients">Ingredientes</Label>
              <Textarea
                id="ingredients"
                value={formData.ingredients}
                onChange={(e) => handleInputChange('ingredients', e.target.value)}
                placeholder="Lista de ingredientes..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="usage_instructions">Instrucciones de Uso</Label>
              <Textarea
                id="usage_instructions"
                value={formData.usage_instructions}
                onChange={(e) => handleInputChange('usage_instructions', e.target.value)}
                placeholder="Cómo usar el producto..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Peso (gramos)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="250"
                />
              </div>
              
              <div>
                <Label htmlFor="dimensions">Dimensiones</Label>
                <Input
                  id="dimensions"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange('dimensions', e.target.value)}
                  placeholder="10cm x 5cm x 5cm"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button type="submit" disabled={saving} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/products">
              Cancelar
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
