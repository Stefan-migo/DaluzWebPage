"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProtectedForm } from "@/hooks/useFormProtection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // 🚀 Protected form state with auto data-loss prevention
  const {
    formData,
    updateFormData,
    hasChanges,
    markAsSaving,
    markAsSaved,
    resetForm
  } = useProtectedForm({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    compare_at_price: '',
    category_id: '',
    featured_image: '',
    inventory_quantity: '0',
    is_featured: false,
    status: 'active',
    skin_type: [] as string[],
    benefits: [] as string[],
    certifications: [] as string[],
    usage_instructions: '',
    precautions: '',
  });

  // Available options
  const skinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal', 'mature'];
  const benefitOptions = ['Hidratante', 'Anti-edad', 'Regenerador', 'Nutritivo', 'Tonificante', 'Equilibrante', 'Refrescante', 'Exfoliante', 'Antibacteriano', 'Relajante', 'Aromático'];
  const certificationOptions = ['organic', 'cruelty-free', 'vegan', 'natural', 'eco-friendly'];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    const updates: any = { [field]: value };

    // Auto-generate slug from name
    if (field === 'name' && value) {
      updates.slug = generateSlug(value);
    }

    updateFormData(updates);
  };

  const addToArray = (field: 'skin_type' | 'benefits' | 'certifications', value: string) => {
    if (!formData[field].includes(value)) {
      updateFormData({
        [field]: [...formData[field], value]
      });
    }
  };

  const removeFromArray = (field: 'skin_type' | 'benefits' | 'certifications', value: string) => {
    updateFormData({
      [field]: formData[field].filter(item => item !== value)
    });
  };

  const addSampleProducts = async () => {
    setLoading(true);
    try {
      // First ensure we have categories
      let categoryMap: Record<string, string> = {};
      
      // Try to get existing categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      
      if (categoriesData.categories?.length === 0) {
        // Create categories first
        const categoryCreationPromises = [
          { name: 'Cremas Faciales', slug: 'cremas-faciales', description: 'Cremas hidratantes y nutritivas para el rostro' },
          { name: 'Aceites Corporales', slug: 'aceites-corporales', description: 'Aceites esenciales y nutritivos para el cuerpo' },
          { name: 'Hidrolatos', slug: 'hidrolatos', description: 'Aguas florales purificadoras y tonificantes' },
          { name: 'Jabones Artesanales', slug: 'jabones-artesanales', description: 'Jabones naturales hechos a mano' },
          { name: 'Sets y Kits', slug: 'sets-kits', description: 'Combinaciones especiales de productos' }
        ].map(cat => 
          fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cat)
          })
        );

        await Promise.all(categoryCreationPromises);
        
        // Fetch categories again
        const newCategoriesResponse = await fetch('/api/categories');
        const newCategoriesData = await newCategoriesResponse.json();
        categoriesData.categories = newCategoriesData.categories;
      }

      // Build category map
      categoriesData.categories.forEach((cat: Category) => {
        categoryMap[cat.slug] = cat.id;
      });

      // Sample products
      const sampleProducts = [
        {
          name: 'Crema Hidratante de Rosa Mosqueta',
          slug: 'crema-hidratante-rosa-mosqueta',
          description: 'Crema facial hidratante enriquecida con aceite de rosa mosqueta, perfecta para regenerar y nutrir la piel del rostro. Rica en vitaminas A y E, ayuda a reducir las líneas de expresión y mantener la piel suave y radiante.',
          short_description: 'Hidratación profunda con aceite de rosa mosqueta',
          price: 12500.00,
          compare_at_price: 15000.00,
          category_id: categoryMap['cremas-faciales'],
          featured_image: 'https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop',
          skin_type: ['dry', 'mature', 'sensitive'],
          benefits: ['Hidratante', 'Anti-edad', 'Regenerador', 'Nutritivo'],
          usage_instructions: 'Aplicar sobre rostro limpio, mañana y noche. Masajear suavemente hasta absorción completa.',
          precautions: 'Solo para uso externo. Evitar contacto con los ojos.',
          certifications: ['organic', 'cruelty-free'],
          inventory_quantity: 45,
          is_featured: true
        },
        {
          name: 'Aceite Corporal de Lavanda',
          slug: 'aceite-corporal-lavanda',
          description: 'Aceite corporal relajante con esencia pura de lavanda. Ideal para masajes e hidratación profunda de la piel. Sus propiedades aromáticas ayudan a reducir el estrés y promover la relajación.',
          short_description: 'Relajación y suavidad con lavanda pura',
          price: 8900.00,
          category_id: categoryMap['aceites-corporales'],
          featured_image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=400&fit=crop',
          skin_type: ['dry', 'normal', 'sensitive'],
          benefits: ['Hidratante', 'Relajante', 'Aromático', 'Nutritivo'],
          usage_instructions: 'Aplicar sobre piel húmeda después del baño. Masajear suavemente por todo el cuerpo.',
          precautions: 'Solo para uso externo. Evitar contacto con los ojos.',
          certifications: ['organic', 'cruelty-free'],
          inventory_quantity: 52,
          is_featured: false
        },
        {
          name: 'Hidrolato de Rosas',
          slug: 'hidrolato-rosas',
          description: 'Agua floral de rosas destilada, perfecta como tónico facial y spray refrescante. Equilibra el pH de la piel, cierra los poros y proporciona hidratación instantánea.',
          short_description: 'Tónico natural equilibrante y refrescante',
          price: 6700.00,
          category_id: categoryMap['hidrolatos'],
          featured_image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
          skin_type: ['oily', 'combination', 'normal', 'sensitive'],
          benefits: ['Tonificante', 'Equilibrante', 'Refrescante', 'Hidratante'],
          usage_instructions: 'Aplicar con algodón sobre rostro limpio o usar como spray. Usar mañana y noche.',
          precautions: 'Solo para uso externo. Evitar contacto con los ojos.',
          certifications: ['organic', 'cruelty-free'],
          inventory_quantity: 28,
          is_featured: false
        }
      ];

      // Create products
      const productPromises = sampleProducts.map(product => 
        fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product)
        })
      );

      await Promise.all(productPromises);
      toast.success('✅ Productos de muestra agregados exitosamente!');
      
    } catch (error) {
      console.error('Error adding sample products:', error);
      toast.error('Error al agregar productos de muestra');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    markAsSaving(); // 🚀 Allow navigation during save process

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        inventory_quantity: parseInt(formData.inventory_quantity),
        published_at: new Date().toISOString()
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success('Producto creado exitosamente');
        markAsSaved(); // 🚀 Mark as saved to allow navigation
        router.push('/admin/products');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Error al crear el producto');
        markAsSaved(); // Reset saving state on error
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al crear el producto');
      markAsSaved(); // Reset saving state on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Agregar Producto</h1>
          {hasChanges && (
            <span className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full border border-amber-200">
              Cambios sin guardar
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={addSampleProducts}
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Agregando...' : '🌿 Agregar Productos de Muestra'}
          </Button>
          <p className="text-sm text-gray-600">
            Esto agregará 3 productos de ejemplo para que puedas probar la tienda inmediatamente.
          </p>
        </CardContent>
      </Card>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
                <Label htmlFor="slug">URL (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="Se genera automáticamente"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="short_description">Descripción Corta</Label>
              <Textarea
                id="short_description"
                value={formData.short_description}
                onChange={(e) => handleInputChange('short_description', e.target.value)}
                placeholder="Descripción breve para listados"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="description">Descripción Detallada</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción completa del producto"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Precios e Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Precio *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="compare_at_price">Precio Comparado</Label>
                <Input
                  id="compare_at_price"
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price}
                  onChange={(e) => handleInputChange('compare_at_price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="inventory_quantity">Cantidad en Stock</Label>
                <Input
                  id="inventory_quantity"
                  type="number"
                  value={formData.inventory_quantity}
                  onChange={(e) => handleInputChange('inventory_quantity', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categoría e Imagen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
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
              <div>
                <Label htmlFor="featured_image">URL de Imagen Principal</Label>
                <Input
                  id="featured_image"
                  value={formData.featured_image}
                  onChange={(e) => handleInputChange('featured_image', e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atributos del Producto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Skin Types */}
            <div>
              <Label>Tipos de Piel</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skin_type.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('skin_type', type)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addToArray('skin_type', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Agregar tipo de piel" />
                </SelectTrigger>
                <SelectContent>
                  {skinTypes.filter(type => !formData.skin_type.includes(type)).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Benefits */}
            <div>
              <Label>Beneficios</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="flex items-center gap-1">
                    {benefit}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('benefits', benefit)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addToArray('benefits', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Agregar beneficio" />
                </SelectTrigger>
                <SelectContent>
                  {benefitOptions.filter(benefit => !formData.benefits.includes(benefit)).map((benefit) => (
                    <SelectItem key={benefit} value={benefit}>
                      {benefit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Certifications */}
            <div>
              <Label>Certificaciones</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.certifications.map((cert) => (
                  <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                    {cert}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFromArray('certifications', cert)} />
                  </Badge>
                ))}
              </div>
              <Select onValueChange={(value) => addToArray('certifications', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Agregar certificación" />
                </SelectTrigger>
                <SelectContent>
                  {certificationOptions.filter(cert => !formData.certifications.includes(cert)).map((cert) => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Uso</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="usage_instructions">Instrucciones de Uso</Label>
              <Textarea
                id="usage_instructions"
                value={formData.usage_instructions}
                onChange={(e) => handleInputChange('usage_instructions', e.target.value)}
                placeholder="Cómo usar el producto"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="precautions">Precauciones</Label>
              <Textarea
                id="precautions"
                value={formData.precautions}
                onChange={(e) => handleInputChange('precautions', e.target.value)}
                placeholder="Advertencias y precauciones"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {loading ? 'Guardando...' : 'Guardar Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
} 