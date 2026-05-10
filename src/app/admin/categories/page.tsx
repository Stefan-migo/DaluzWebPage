"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Tag, AlertTriangle, Save, X } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null,
  );

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data.categories || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Auto-generate slug when name changes
    if (field === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    }
  };

  const openCreateDialog = () => {
    setIsEditing(false);
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setIsEditing(true);
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("El nombre de la categoría es requerido");
      return;
    }

    try {
      setFormLoading(true);

      const url = isEditing
        ? `/api/categories/${editingCategory?.id}`
        : "/api/categories";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save category");
      }

      const result = await response.json();

      if (isEditing) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === editingCategory?.id ? result.category : cat,
          ),
        );
        toast.success("Categoría actualizada exitosamente");
      } else {
        setCategories((prev) => [...prev, result.category]);
        toast.success("Categoría creada exitosamente");
      }

      setIsDialogOpen(false);
      setFormData({ name: "", slug: "", description: "" });
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al guardar la categoría",
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openDeleteDialog = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const response = await fetch(`/api/categories/${categoryToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete category");
      }

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id),
      );

      toast.success("Categoría eliminada exitosamente");
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al eliminar la categoría",
      );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-admin-bg-tertiary rounded w-64 mb-2"></div>
          <div className="h-4 bg-admin-bg-tertiary rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-admin-bg-tertiary h-32 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Categorías
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Administra las categorías de productos
          </p>
        </div>

        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="text-center">
              <AlertTriangle
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: "var(--admin-error)" }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--admin-error)" }}
              >
                Error al cargar categorías
              </h3>
              <p
                className="mb-4"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                {error}
              </p>
              <Button onClick={fetchCategories}>Reintentar</Button>
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
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Categorías
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            Administra las categorías de productos
          </p>
        </div>

      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="transition-all duration-200 admin-card"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle
                    className="font-subtitle text-xl"
                    style={{ color: "var(--admin-text-primary)" }}
                  >
                    {category.name}
                  </CardTitle>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    {category.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="admin-btn-outline"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              {category.description && (
                <p
                  className="text-sm line-clamp-3"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  {category.description}
                </p>
              )}
              <div
                className="mt-4 text-xs"
                style={{ color: "var(--admin-text-tertiary)" }}
              >
                Creada:{" "}
                {new Date(category.created_at).toLocaleDateString("es-ES")}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {categories.length === 0 && (
        <Card className="text-center py-12 admin-card">
          <CardContent>
            <Tag
              className="h-16 w-16 mx-auto mb-4"
              style={{ color: "var(--admin-text-secondary)" }}
            />
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--admin-text-primary)" }}
            >
              No hay categorías
            </h3>
            <p
              className="mb-6"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              Aún no hay categorías para mostrar
            </p>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] admin-dialog">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--admin-text-primary)" }}>
              {isEditing ? "Editar Categoría" : "Nueva Categoría"}
            </DialogTitle>
            <DialogDescription style={{ color: "var(--admin-text-secondary)" }}>
              {isEditing
                ? "Modifica los datos de la categoría"
                : "Crea una nueva categoría para organizar tus productos"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Nombre *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ej: Cuidado Facial"
                required
                className="admin-input"
              />
            </div>

            <div>
              <Label
                htmlFor="slug"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Slug
              </Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="cuidado-facial"
                className="admin-input"
              />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--admin-text-tertiary)" }}
              >
                URL amigable (se genera automáticamente)
              </p>
            </div>

            <div>
              <Label
                htmlFor="description"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Descripción
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Descripción opcional de la categoría"
                rows={3}
                className="admin-input"
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="admin-btn-outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={formLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={formLoading}
                className="admin-btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {formLoading
                  ? "Guardando..."
                  : isEditing
                    ? "Actualizar"
                    : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="admin-dialog">
          <DialogHeader>
            <DialogTitle style={{ color: "var(--admin-text-primary)" }}>
              Confirmar Eliminación
            </DialogTitle>
            <DialogDescription style={{ color: "var(--admin-text-secondary)" }}>
              ¿Estás seguro de que deseas eliminar la categoría "
              {categoryToDelete?.name}"?
              <br />
              Esta acción no se puede deshacer y puede afectar los productos
              asociados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="admin-btn-outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="admin-btn-danger"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar Categoría
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
