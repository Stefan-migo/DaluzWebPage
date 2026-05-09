"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProtectedForm } from "@/hooks/useFormProtection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import RichTextEditor from "@/components/ui/RichTextEditor";
import ProductImageUpload from "./ProductImageUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Plus,
  Save,
  ArrowLeft,
  AlertTriangle,
  Package,
  DollarSign,
  ImageIcon,
  Star,
  FlaskConical,
  FileText,
  Box,
  Link2,
  CheckCircle2,
  Circle,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  mode: "add" | "edit";
  initialData?: any;
  productId?: string;
}

export default function ProductForm({
  mode,
  initialData,
  productId,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showPublishAlert, setShowPublishAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // Available options
  const skinTypes = [
    { value: "dry", label: "Seco" },
    { value: "oily", label: "Graso" },
    { value: "combination", label: "Mixto" },
    { value: "sensitive", label: "Sensible" },
    { value: "normal", label: "Normal" },
    { value: "mature", label: "Maduro" },
  ];
  const hairTypes = [
    { value: "oily", label: "Graso" },
    { value: "dry", label: "Seco" },
    { value: "normal", label: "Normal" },
    { value: "combination", label: "Mixto" },
    { value: "curly", label: "Rizado" },
    { value: "straight", label: "Lacio" },
  ];
  const benefitOptions = [
    "Hidratante",
    "Anti-edad",
    "Regenerador",
    "Nutritivo",
    "Tonificante",
    "Equilibrante",
    "Refrescante",
    "Exfoliante",
    "Antibacteriano",
    "Relajante",
    "Aromático",
  ];
  const certificationOptions = [
    { value: "organic", label: "Orgánico" },
    { value: "cruelty-free", label: "Libre de Crueldad" },
    { value: "vegan", label: "Vegano" },
    { value: "natural", label: "Natural" },
    { value: "eco-friendly", label: "Ecológico" },
  ];

  const defaultFormData = {
    name: "",
    slug: "",
    description: "",
    short_description: "",
    price: "",
    compare_at_price: "",
    category_id: "",
    featured_image: "",
    gallery: [] as string[],
    inventory_quantity: "0",
    is_featured: false,
    status: "active",
    skin_type: [] as string[],
    hair_type: [] as string[],
    benefits: [] as string[],
    certifications: [] as string[],
    usage_instructions: "",
    precautions: "",
    ingredients: [] as Array<{ name: string; percentage?: number }>,
    weight: "",
    dimensions: "",
    package_characteristics: "",
    promotional_tag: "none",
    discount_transfer_percent: "",
    discount_cash_percent: "",
    access_id: "",
  };

  // 🚀 Protected form state with auto data-loss prevention
  const {
    formData,
    updateFormData,
    hasChanges,
    markAsSaving,
    markAsSaved,
    resetForm,
  } = useProtectedForm(initialData || defaultFormData);

  // Form protection state for edit mode
  const [initialDataState, setInitialDataState] = useState<any>(null);
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  useEffect(() => {
    fetchCategories();

    // If in edit mode, fetch initial data
    if (mode === "edit" && productId) {
      fetchProductData();
    }
  }, []);

  // Track changes in edit mode
  useEffect(() => {
    if (mode === "edit" && initialDataState) {
      const hasChanges =
        JSON.stringify(formData) !== JSON.stringify(initialDataState);
      setHasLocalChanges(hasChanges);
    }
  }, [formData, initialDataState, mode]);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productResponse = await fetch(
        `/api/admin/products/${productId}`,
      );
      if (!productResponse.ok) throw new Error("Failed to fetch product");
      const productData = await productResponse.json();

      const product = productData.product;
      const loadedData = {
        name: product.name || "",
        slug: product.slug || "",
        short_description: product.short_description || "",
        description: product.description || "",
        price: product.price?.toString() || "",
        compare_at_price: product.compare_at_price?.toString() || "",
        category_id: product.category_id || "",
        featured_image: product.featured_image || "",
        gallery: product.gallery || [],
        inventory_quantity: product.inventory_quantity?.toString() || "",
        weight: product.weight?.toString() || "",
        dimensions: product.dimensions || "",
        package_characteristics: product.package_characteristics || "",
        skin_type: product.skin_type || [],
        hair_type: product.hair_type || [],
        benefits: product.benefits || [],
        certifications: product.certifications || [],
        ingredients: product.ingredients || [],
        usage_instructions: product.usage_instructions || "",
        precautions: product.precautions || "",
        is_featured: product.is_featured || false,
        status: product.status || "active",
        promotional_tag: product.promotional_tag || "none",
        discount_transfer_percent:
          product.discount_transfer_percent?.toString() || "",
        discount_cash_percent: product.discount_cash_percent?.toString() || "",
        access_id: product.access_id || "",
      };

      updateFormData(loadedData);
      setInitialDataState(loadedData);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Error al cargar el producto");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (field: string, value: any) => {
    const updates: any = { [field]: value };

    // Auto-generate slug from name
    if (field === "name" && value) {
      updates.slug = generateSlug(value);
    }

    updateFormData(updates);
  };

  const addToArray = (
    field: "skin_type" | "hair_type" | "benefits" | "certifications",
    value: string,
  ) => {
    if (!formData[field].includes(value)) {
      updateFormData({
        [field]: [...formData[field], value],
      });
    }
  };

  const removeFromArray = (
    field: "skin_type" | "hair_type" | "benefits" | "certifications",
    value: string,
  ) => {
    updateFormData({
      [field]: formData[field].filter((item: string) => item !== value),
    });
  };

  const addIngredient = () => {
    updateFormData({
      ingredients: [
        ...formData.ingredients,
        { name: "", percentage: undefined },
      ],
    });
  };

  const removeIngredient = (index: number) => {
    updateFormData({
      ingredients: formData.ingredients.filter(
        (_: any, i: number) => i !== index,
      ),
    });
  };

  const updateIngredient = (
    index: number,
    field: "name" | "percentage",
    value: string | number,
  ) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = {
      ...updatedIngredients[index],
      [field]: value,
    };
    updateFormData({ ingredients: updatedIngredients });
  };

  const handleSubmit = async (
    e?: React.FormEvent,
    status: string = "active",
  ) => {
    if (e && e.preventDefault) e.preventDefault();
    setLoading(true);
    markAsSaving();

    try {
      const productData = {
        ...formData,
        status: status,
        price: parseFloat(formData.price) || 0,
        compare_at_price: formData.compare_at_price
          ? parseFloat(formData.compare_at_price)
          : null,
        inventory_quantity: parseInt(formData.inventory_quantity) || 0,
        published_at: status === "active" ? new Date().toISOString() : null,
      };

      const url =
        mode === "edit" ? `/api/admin/products/${productId}` : "/api/admin/products";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast.success(
          mode === "edit"
            ? "Producto actualizado exitosamente"
            : "Producto creado exitosamente",
        );
        markAsSaved();
        router.push("/admin/products");
      } else {
        const error = await response.json();
        toast.error(
          error.message ||
          `Error al ${mode === "edit" ? "actualizar" : "crear"} el producto`,
        );
        markAsSaved();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        `Error al ${mode === "edit" ? "actualizar" : "crear"} el producto`,
      );
      markAsSaved();
    } finally {
      setLoading(false);
    }
  };

  // Check if a tab section has data
  const checkSectionComplete = (tabId: string): boolean => {
    switch (tabId) {
      case "basic":
        return !!formData.name && !!formData.price;
      case "prices":
        return !!formData.price;
      case "images":
        return !!formData.featured_image;
      case "features":
        return (
          formData.skin_type.length > 0 ||
          formData.benefits.length > 0 ||
          formData.certifications.length > 0
        );
      case "ingredients":
        return (
          formData.ingredients.length > 0 &&
          formData.ingredients.some((i: any) => i.name)
        );
      case "details":
        return !!formData.usage_instructions || !!formData.precautions;
      default:
        return false;
    }
  };

  const tabs = [
    { id: "basic", label: "Básico", icon: Package },
    { id: "prices", label: "Precios", icon: DollarSign },
    { id: "images", label: "Imágenes", icon: ImageIcon },
    { id: "features", label: "Características", icon: Star },
    { id: "ingredients", label: "Ingredientes", icon: FlaskConical },
    { id: "details", label: "Detalles", icon: FileText },
  ];

  if (loading && mode === "edit") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#E5DFD3] rounded w-64"></div>
          <div className="h-96 bg-[#E5DFD3] rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-admin-bg-tertiary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--admin-text-primary)" }}
            >
              {mode === "edit" ? "Editar Producto" : "Agregar Producto"}
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--admin-text-tertiary)" }}
            >
              {mode === "edit"
                ? "Actualiza la información del producto"
                : "Completa los datos del nuevo producto"}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {(hasChanges || hasLocalChanges) && (
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200"
            >
              <Circle className="h-3 w-3 fill-amber-400 mr-1" />
              Cambios sin guardar
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSubmit(undefined, "draft")}
            disabled={loading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Guardar Borrador
          </Button>
          <Button
            size="sm"
            onClick={() => setShowPublishAlert(true)}
            disabled={loading}
            className="gap-2"
            style={{
              backgroundColor: "var(--admin-bg-secondary)",
              color: "white",
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            {mode === "edit" ? "Actualizar" : "Publicar"}
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 overflow-x-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="flex w-full justify-start gap-1 h-auto p-1 bg-transparent border-b rounded-none"
            style={{
              backgroundColor: "transparent",
              borderColor: "var(--admin-border-secondary)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isComplete = checkSectionComplete(tab.id);
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium
                    data-[state=active]:shadow-none border-b-2 -mb-px
                    transition-all duration-200
                    ${activeTab === tab.id
                      ? "border-b-2 border-current"
                      : "border-transparent hover:bg-admin-bg-tertiary"
                    }
                  `}
                  style={{
                    color:
                      activeTab === tab.id
                        ? "var(--admin-bg-secondary)"
                        : "var(--admin-text-tertiary)",
                    borderColor:
                      activeTab === tab.id
                        ? "var(--admin-bg-secondary)"
                        : "transparent",
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {isComplete && (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* TAB 1: Información Básica */}
          <TabsContent value="basic" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Información Básica
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Producto *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Ej: Crema Hidratante de Rosa Mosqueta"
                      required
                      className="admin-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL (slug)</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) =>
                        handleInputChange("slug", e.target.value)
                      }
                      placeholder="Se genera automáticamente"
                      className="admin-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="short_description">Descripción Corta</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) =>
                      handleInputChange("short_description", e.target.value)
                    }
                    placeholder="Descripción breve para listados (máx. 150 caracteres)"
                    rows={2}
                    className="admin-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción Detallada</Label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) =>
                      handleInputChange("description", value)
                    }
                    placeholder="Descripción completa del producto"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) =>
                        handleInputChange("category_id", value)
                      }
                    >
                      <SelectTrigger className="admin-select">
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
                  {mode === "edit" && (
                    <div className="space-y-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger className="admin-select">
                          <SelectValue placeholder="Estado del producto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="archived">Archivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setActiveTab("prices")}
                className="gap-2"
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                Siguiente: Precios
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 2: Precios */}
          <TabsContent value="prices" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Precios e Inventario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Prices */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Precio *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="0.00"
                        required
                        className="pl-7 admin-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compare_at_price">Precio Anterior</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="compare_at_price"
                        type="number"
                        step="0.01"
                        value={formData.compare_at_price}
                        onChange={(e) =>
                          handleInputChange("compare_at_price", e.target.value)
                        }
                        placeholder="0.00"
                        className="pl-7 admin-input"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory_quantity">Stock</Label>
                    <Input
                      id="inventory_quantity"
                      type="number"
                      value={formData.inventory_quantity}
                      onChange={(e) =>
                        handleInputChange("inventory_quantity", e.target.value)
                      }
                      placeholder="0"
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Discounts by Payment Method */}
                <div className="border-t pt-6">
                  <h3
                    className="text-sm font-medium mb-4"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Descuentos por Método de Pago
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="discount_transfer_percent">
                        % Descuento Transferencia
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="discount_transfer_percent"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount_transfer_percent}
                          onChange={(e) =>
                            handleInputChange(
                              "discount_transfer_percent",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="admin-input"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Descuento para pago por transferencia
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_cash_percent">
                        % Descuento Efectivo
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="discount_cash_percent"
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount_cash_percent}
                          onChange={(e) =>
                            handleInputChange(
                              "discount_cash_percent",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="admin-input"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Descuento para pago en efectivo
                      </p>
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center space-x-3 pt-4 border-t">
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) =>
                      handleInputChange("is_featured", checked)
                    }
                  />
                  <Label htmlFor="is_featured" className="cursor-pointer">
                    Producto Destacado
                  </Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("basic")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
              <Button
                onClick={() => setActiveTab("images")}
                className="gap-2"
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                Siguiente: Imágenes
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 3: Imágenes */}
          <TabsContent value="images" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Imágenes del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Imagen Principal *</Label>
                  <ProductImageUpload
                    value={formData.featured_image}
                    onChange={(url) => handleInputChange("featured_image", url)}
                    label=""
                  />
                </div>

                <div className="space-y-3">
                  <Label>Galería de Imágenes</Label>
                  <p className="text-sm text-gray-500">
                    Agrega hasta 4 imágenes adicionales para mostrar en la
                    galería del producto
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }, (_, index) => (
                      <ProductImageUpload
                        key={index}
                        value={formData.gallery[index] || ""}
                        onChange={(url) => {
                          const newGallery = [...formData.gallery];
                          newGallery[index] = url;
                          handleInputChange("gallery", newGallery);
                        }}
                        label={`Imagen ${index + 2}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("prices")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
              <Button
                onClick={() => setActiveTab("features")}
                className="gap-2"
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                Siguiente: Características
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 4: Características */}
          <TabsContent value="features" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Características del Producto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Promotional Tag */}
                <div className="space-y-2">
                  <Label>Etiqueta de Promoción</Label>
                  <Select
                    value={formData.promotional_tag}
                    onValueChange={(value) =>
                      handleInputChange("promotional_tag", value)
                    }
                  >
                    <SelectTrigger className="admin-select">
                      <SelectValue placeholder="Seleccionar etiqueta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguna</SelectItem>
                      <SelectItem value="lanzamiento">Lanzamiento</SelectItem>
                      <SelectItem value="descuento">Descuento</SelectItem>
                      <SelectItem value="ultimas_unidades">
                        Últimas Unidades
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Skin Types */}
                <div className="space-y-3">
                  <Label>Tipos de Piel</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.skin_type.map((type: string) => {
                      const skinTypeLabel =
                        skinTypes.find((st) => st.value === type)?.label ||
                        type;
                      return (
                        <Badge
                          key={type}
                          className="flex items-center gap-1 px-3 py-1"
                          style={{
                            backgroundColor: "var(--admin-bg-secondary)",
                            color: "white",
                          }}
                        >
                          {skinTypeLabel}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-200"
                            onClick={() => removeFromArray("skin_type", type)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                  <Select
                    onValueChange={(value) => addToArray("skin_type", value)}
                  >
                    <SelectTrigger className="w-full admin-select">
                      <SelectValue placeholder="Agregar tipo de piel" />
                    </SelectTrigger>
                    <SelectContent>
                      {skinTypes
                        .filter(
                          (type) => !formData.skin_type.includes(type.value),
                        )
                        .map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Hair Types */}
                <div className="space-y-3">
                  <Label>Tipos de Cabello</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.hair_type.map((type: string) => {
                      const hairTypeLabel =
                        hairTypes.find((ht) => ht.value === type)?.label ||
                        type;
                      return (
                        <Badge
                          key={type}
                          className="flex items-center gap-1 px-3 py-1"
                          style={{
                            backgroundColor: "var(--admin-bg-secondary)",
                            color: "white",
                          }}
                        >
                          {hairTypeLabel}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-200"
                            onClick={() => removeFromArray("hair_type", type)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                  <Select
                    onValueChange={(value) => addToArray("hair_type", value)}
                  >
                    <SelectTrigger className="w-full admin-select">
                      <SelectValue placeholder="Agregar tipo de cabello" />
                    </SelectTrigger>
                    <SelectContent>
                      {hairTypes
                        .filter(
                          (type) => !formData.hair_type.includes(type.value),
                        )
                        .map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <Label>Beneficios</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.benefits.map((benefit: string) => (
                      <Badge
                        key={benefit}
                        className="flex items-center gap-1 px-3 py-1"
                        style={{
                          backgroundColor: "var(--admin-success)",
                          color: "white",
                        }}
                      >
                        {benefit}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-200"
                          onClick={() => removeFromArray("benefits", benefit)}
                        />
                      </Badge>
                    ))}
                  </div>
                  <Select
                    onValueChange={(value) => addToArray("benefits", value)}
                  >
                    <SelectTrigger className="w-full admin-select">
                      <SelectValue placeholder="Agregar beneficio" />
                    </SelectTrigger>
                    <SelectContent>
                      {benefitOptions
                        .filter(
                          (benefit) => !formData.benefits.includes(benefit),
                        )
                        .map((benefit) => (
                          <SelectItem key={benefit} value={benefit}>
                            {benefit}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Certifications */}
                <div className="space-y-3">
                  <Label>Certificaciones</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert: string) => {
                      const certLabel =
                        certificationOptions.find((co) => co.value === cert)
                          ?.label || cert;
                      return (
                        <Badge
                          key={cert}
                          variant="outline"
                          className="flex items-center gap-1 px-3 py-1"
                          style={{
                            borderColor: "var(--admin-success)",
                            color: "var(--admin-success)",
                          }}
                        >
                          {certLabel}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() =>
                              removeFromArray("certifications", cert)
                            }
                          />
                        </Badge>
                      );
                    })}
                  </div>
                  <Select
                    onValueChange={(value) =>
                      addToArray("certifications", value)
                    }
                  >
                    <SelectTrigger className="w-full admin-select">
                      <SelectValue placeholder="Agregar certificación" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificationOptions
                        .filter(
                          (cert) =>
                            !formData.certifications.includes(cert.value),
                        )
                        .map((cert) => (
                          <SelectItem key={cert.value} value={cert.value}>
                            {cert.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("images")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
              <Button
                onClick={() => setActiveTab("ingredients")}
                className="gap-2"
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                Siguiente: Ingredientes
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 5: Ingredientes */}
          <TabsContent value="ingredients" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Ingredientes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.ingredients.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay ingredientes agregados</p>
                    <p className="text-sm">
                      Agrega los ingredientes principales del producto
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.ingredients.map(
                      (ingredient: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                        >
                          <Input
                            placeholder="Nombre del ingrediente"
                            value={ingredient.name}
                            onChange={(e) =>
                              updateIngredient(index, "name", e.target.value)
                            }
                            className="flex-1 admin-input"
                          />
                          <div className="flex items-center gap-1 w-24">
                            <Input
                              type="number"
                              placeholder="%"
                              value={ingredient.percentage || ""}
                              onChange={(e) =>
                                updateIngredient(
                                  index,
                                  "percentage",
                                  parseFloat(e.target.value) || 0,
                                )
                              }
                              className="admin-input"
                            />
                            <span className="text-sm text-gray-500">%</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeIngredient(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ),
                    )}
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addIngredient}
                  className="w-full gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Agregar Ingrediente
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("features")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
              <Button
                onClick={() => setActiveTab("details")}
                className="gap-2"
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                Siguiente: Detalles
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* TAB 6: Detalles */}
          <TabsContent value="details" className="mt-6">
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText
                    className="h-5 w-5"
                    style={{ color: "var(--admin-bg-secondary)" }}
                  />
                  Detalles Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Instructions */}
                <div className="space-y-2">
                  <Label>Instrucciones de Uso</Label>
                  <RichTextEditor
                    value={formData.usage_instructions}
                    onChange={(value) =>
                      handleInputChange("usage_instructions", value)
                    }
                    placeholder="Cómo usar el producto"
                    rows={3}
                  />
                </div>

                {/* Precautions */}
                <div className="space-y-2">
                  <Label>Precauciones</Label>
                  <RichTextEditor
                    value={formData.precautions}
                    onChange={(value) =>
                      handleInputChange("precautions", value)
                    }
                    placeholder="Advertencias y precauciones"
                    rows={2}
                  />
                </div>

                {/* Physical Details */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Box className="h-4 w-4" />
                    Detalles Físicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Peso (gramos)</Label>
                      <Input
                        type="number"
                        value={formData.weight}
                        onChange={(e) =>
                          handleInputChange("weight", e.target.value)
                        }
                        placeholder="Ej: 500"
                        className="admin-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Dimensiones</Label>
                      <Input
                        value={formData.dimensions}
                        onChange={(e) =>
                          handleInputChange("dimensions", e.target.value)
                        }
                        placeholder="Ej: 15x10x5 cm"
                        className="admin-input"
                      />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Label>Características del Empaque</Label>
                    <Textarea
                      value={formData.package_characteristics}
                      onChange={(e) =>
                        handleInputChange(
                          "package_characteristics",
                          e.target.value,
                        )
                      }
                      placeholder="Describe las características del empaque..."
                      rows={2}
                      className="admin-input"
                    />
                  </div>
                </div>

                {/* Integrations */}
                <div className="border-t pt-6">
                  <h3 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Integraciones
                  </h3>
                  <div className="space-y-2">
                    <Label>ID de Acceso (Tesoros DaLuz)</Label>
                    <Input
                      value={formData.access_id}
                      onChange={(e) =>
                        handleInputChange("access_id", e.target.value)
                      }
                      placeholder="Ej: linea-umbral, kit-alkimya"
                      className="admin-input"
                    />
                    <p className="text-xs text-gray-500">
                      Vincula este producto con contenido en Sanity para acceso
                      del comprador
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-start mt-4">
              <Button
                variant="outline"
                onClick={() => setActiveTab("ingredients")}
                className="gap-2"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Anterior
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Publish Alert Dialog */}
      <Dialog open={showPublishAlert} onOpenChange={setShowPublishAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Confirmar {mode === "edit" ? "Actualización" : "Publicación"}
            </DialogTitle>
            <DialogDescription>
              <div className="space-y-3 mt-2">
                <p>
                  ¿Estás seguro de que deseas{" "}
                  {mode === "edit" ? "actualizar" : "publicar"} este producto?
                </p>
                {mode === "add" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800 font-medium text-sm">
                      Recomendación:
                    </p>
                    <p className="text-amber-700 text-sm mt-1">
                      Te recomendamos guardar primero como "Borrador" para
                      revisar todos los detalles antes de publicar.
                    </p>
                  </div>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPublishAlert(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowPublishAlert(false);
                handleSubmit(undefined, "draft");
              }}
              disabled={loading}
              className="text-white"
            >
              Guardar como Borrador
            </Button>
            <Button
              onClick={() => {
                setShowPublishAlert(false);
                handleSubmit(undefined, "active");
              }}
              disabled={loading}
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              {loading
                ? "Guardando..."
                : mode === "edit"
                  ? "Actualizar Producto"
                  : "Publicar Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
