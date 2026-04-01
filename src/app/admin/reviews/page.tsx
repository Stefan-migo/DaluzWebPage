"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StarDisplay } from "@/components/ui/reviews/StarRating";
import { Search, Filter, Eye, Trash2, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Review {
  id: string;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (ratingFilter !== "all") params.append("rating", ratingFilter);

      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al cargar reseñas");
      }

      setReviews(data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error al cargar las reseñas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [searchTerm, statusFilter, ratingFilter]);

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar reseña");
      }

      toast.success("Reseña eliminada exitosamente");
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error al eliminar la reseña");
    }
  };

  const getStatusBadge = (isApproved: boolean) => {
    if (isApproved) {
      return (
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium"
          style={{ color: "var(--admin-success)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "var(--admin-success)" }}
          />
          Publicada
        </span>
      );
    }
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-medium"
        style={{ color: "var(--admin-warning)" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "var(--admin-warning)" }}
        />
        Pendiente
      </span>
    );
  };

  const getUserName = (_review: Review) => {
    return "Usuario";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Reseñas
          </h1>
          <p style={{ color: "var(--admin-text-secondary)" }}>
            Administra y modera las reseñas de productos
          </p>
        </div>
        <Button
          onClick={fetchReviews}
          style={{
            borderColor: "var(--admin-border-secondary)",
            color: "var(--admin-text-primary)",
            backgroundColor: "var(--admin-bg-primary)",
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Filters */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Buscar
              </label>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <Input
                  placeholder="Buscar por producto o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Estado
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                  }}
                >
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent
                  style={{ backgroundColor: "var(--admin-bg-primary)" }}
                >
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="approved">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--admin-success)" }}
                      ></span>
                      Aprobadas
                    </span>
                  </SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--admin-warning)" }}
                      ></span>
                      Pendientes
                    </span>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <span className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: "var(--admin-error)" }}
                      ></span>
                      Rechazadas
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Calificación
              </label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                  }}
                >
                  <SelectValue placeholder="Seleccionar calificación" />
                </SelectTrigger>
                <SelectContent
                  style={{ backgroundColor: "var(--admin-bg-primary)" }}
                >
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="5">5 estrellas</SelectItem>
                  <SelectItem value="4">4 estrellas</SelectItem>
                  <SelectItem value="3">3 estrellas</SelectItem>
                  <SelectItem value="2">2 estrellas</SelectItem>
                  <SelectItem value="1">1 estrella</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-primary)" }}
              >
                Acciones
              </label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setRatingFilter("all");
                  }}
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    color: "var(--admin-text-primary)",
                  }}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Limpiar
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw
                className="w-6 h-6 animate-spin mr-2"
                style={{ color: "var(--admin-text-secondary)" }}
              />
              <span style={{ color: "var(--admin-text-secondary)" }}>
                Cargando reseñas...
              </span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p style={{ color: "var(--admin-text-tertiary)" }}>
                No se encontraron reseñas
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow
                    style={{
                      backgroundColor: "var(--admin-bg-tertiary)",
                    }}
                  >
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Producto
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Usuario
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Calificación
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Título
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Estado
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Fecha
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review, index) => (
                    <TableRow
                      key={review.id}
                      style={{
                        backgroundColor:
                          index % 2 === 0
                            ? "transparent"
                            : "var(--admin-bg-tertiary)",
                      }}
                      className="hover:bg-[#AE000025] transition-colors"
                    >
                      <TableCell>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {review.product.name}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--admin-text-tertiary)" }}
                          >
                            {review.product.slug}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {getUserName(review)}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: "var(--admin-text-tertiary)" }}
                          >
                            Usuario
                          </p>
                          {review.is_verified_purchase && (
                            <span
                              className="inline-flex items-center gap-1 text-xs mt-1"
                              style={{ color: "var(--admin-success)" }}
                            >
                              <span
                                className="w-1 h-1 rounded-full"
                                style={{
                                  backgroundColor: "var(--admin-success)",
                                }}
                              />
                              Compra verificada
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <StarDisplay rating={review.rating} size="sm" />
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          {review.title && (
                            <p
                              className="font-medium truncate"
                              style={{ color: "var(--admin-text-primary)" }}
                            >
                              {review.title}
                            </p>
                          )}
                          {review.comment && (
                            <p
                              className="text-sm line-clamp-2"
                              style={{ color: "var(--admin-text-secondary)" }}
                            >
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(review.is_approved)}
                      </TableCell>
                      <TableCell>
                        <p
                          className="text-sm"
                          style={{ color: "var(--admin-text-secondary)" }}
                        >
                          {formatDistanceToNow(new Date(review.created_at), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `/productos/${review.product.slug}`,
                                "_blank",
                              )
                            }
                            title="Ver en producto"
                            style={{
                              borderColor: "var(--admin-border-secondary)",
                              color: "var(--admin-text-primary)",
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteReview(review.id)}
                            title="Eliminar reseña"
                            style={{
                              borderColor: "var(--admin-border-secondary)",
                              color: "var(--admin-error)",
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
