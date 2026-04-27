"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle2,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type BlogStatus = "pendiente" | "publicado";

interface Blog {
  _id: string;
  title: string;
  slug: string | null;
  status: BlogStatus | null;
  publishedAt: string | null;
  _createdAt: string;
  _updatedAt: string;
  authorName: string | null;
}

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_STUDIO_HOSTNAME =
  process.env.NEXT_PUBLIC_SANITY_STUDIO_HOSTNAME || "daluzconsciente";

function getStudioEditUrl(id: string) {
  const host = SANITY_STUDIO_HOSTNAME || SANITY_PROJECT_ID;
  if (!host) return null;
  return `https://${host}.sanity.studio/structure/post;${id}`;
}

function formatDate(value: string | null) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function StatusBadge({ status }: { status: BlogStatus | null }) {
  const isPublished = status === "publicado";
  const label = isPublished ? "Publicado" : "Pendiente";
  const color = isPublished ? "var(--admin-success)" : "var(--admin-warning)";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{
        color,
        backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 35%, transparent)`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al cargar blogs");
      setBlogs(data.posts || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nuevo artículo" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al crear blog");
      toast.success("Blog creado en estado Pendiente");

      const editUrl = getStudioEditUrl(data?.post?._id);
      if (editUrl) window.open(editUrl, "_blank", "noopener,noreferrer");

      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo crear el blog");
    } finally {
      setCreating(false);
    }
  };

  const handlePublish = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "publicado" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al publicar");
      toast.success("Blog publicado");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo publicar el blog");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Eliminar el blog "${title}"? Esta acción no se puede deshacer.`)) {
      return;
    }
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al eliminar");
      toast.success("Blog eliminado");
      fetchBlogs();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el blog");
    } finally {
      setBusyId(null);
    }
  };

  const handleEdit = (id: string) => {
    const url = getStudioEditUrl(id);
    if (!url) {
      toast.error("Sanity Studio no está configurado (falta projectId)");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Blogs
          </h1>
          <p style={{ color: "var(--admin-text-secondary)" }}>
            Administra los artículos del blog y su flujo de publicación
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchBlogs}
            disabled={loading}
            style={{
              borderColor: "var(--admin-border-secondary)",
              color: "var(--admin-text-primary)",
              backgroundColor: "var(--admin-bg-primary)",
            }}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Actualizar
          </Button>
          <Button
            onClick={handleCreate}
            disabled={creating}
            style={{
              backgroundColor: "var(--admin-accent-primary)",
              color: "var(--admin-text-inverse)",
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {creating ? "Creando..." : "Nuevo Blog"}
          </Button>
        </div>
      </div>

      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw
                className="w-6 h-6 animate-spin mr-2"
                style={{ color: "var(--admin-text-secondary)" }}
              />
              <span style={{ color: "var(--admin-text-secondary)" }}>
                Cargando blogs...
              </span>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <p
                className="mb-4"
                style={{ color: "var(--admin-text-tertiary)" }}
              >
                Aún no hay blogs creados
              </p>
              <Button
                onClick={handleCreate}
                disabled={creating}
                style={{
                  backgroundColor: "var(--admin-accent-primary)",
                  color: "var(--admin-text-inverse)",
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear primer blog
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow
                    style={{ backgroundColor: "var(--admin-bg-tertiary)" }}
                  >
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Título
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Autor
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Fecha
                    </TableHead>
                    <TableHead style={{ color: "var(--admin-text-primary)" }}>
                      Estado
                    </TableHead>
                    <TableHead
                      style={{ color: "var(--admin-text-primary)" }}
                      className="text-right"
                    >
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogs.map((blog, index) => {
                    const isPending = blog.status !== "publicado";
                    const isBusy = busyId === blog._id;
                    return (
                      <TableRow
                        key={blog._id}
                        style={{
                          backgroundColor:
                            index % 2 === 0
                              ? "transparent"
                              : "var(--admin-bg-tertiary)",
                        }}
                        className="hover:bg-[#AE000025] transition-colors"
                      >
                        <TableCell>
                          <p
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {blog.title || "(Sin título)"}
                          </p>
                          {blog.slug && (
                            <p
                              className="text-xs"
                              style={{ color: "var(--admin-text-tertiary)" }}
                            >
                              /{blog.slug}
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            {blog.authorName || "—"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className="text-sm"
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            {formatDate(blog.publishedAt || blog._createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={blog.status} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => handlePublish(blog._id)}
                              disabled={isBusy || !isPending}
                              title={
                                isPending
                                  ? "Publicar blog"
                                  : "El blog ya está publicado"
                              }
                              style={{
                                backgroundColor: isPending
                                  ? "var(--admin-success)"
                                  : "var(--admin-bg-tertiary)",
                                color: isPending
                                  ? "var(--admin-text-inverse)"
                                  : "var(--admin-text-tertiary)",
                                cursor: isPending ? "pointer" : "not-allowed",
                                opacity: isPending ? 1 : 0.6,
                              }}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              {isPending ? "Publicar" : "Publicado"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(blog._id)}
                              disabled={isBusy}
                              title="Editar en Sanity Studio"
                              style={{
                                borderColor: "var(--admin-border-secondary)",
                                color: "var(--admin-text-primary)",
                              }}
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(blog._id, blog.title)}
                              disabled={isBusy}
                              title="Eliminar blog"
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
