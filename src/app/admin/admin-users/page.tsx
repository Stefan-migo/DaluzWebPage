"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  UserPlus,
  Crown,
  Shield,
  User,
  Settings,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Activity,
  Clock,
  Mail,
  Phone,
  Check,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PermissionsEditor from "@/components/admin/PermissionsEditor";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: Record<string, string[]>;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  analytics?: {
    activityCount30Days: number;
    lastActivity?: string;
    fullName?: string;
  };
}

interface SuggestedUser {
  id: string;
  email: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
}

export default function AdminUsersPage() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Search autocomplete state
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<AdminUser[]>([]);

  // Create admin dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newAdminData, setNewAdminData] = useState({
    email: "",
    role: "admin",
    is_active: true,
  });

  // Autocomplete state
  const [openUserSelect, setOpenUserSelect] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Permissions editor state
  const [showPermissionsEditor, setShowPermissionsEditor] = useState(false);
  const [selectedUserForPermissions, setSelectedUserForPermissions] =
    useState<AdminUser | null>(null);

  useEffect(() => {
    fetchAdminUsers();
  }, [roleFilter, statusFilter]);

  // Fetch suggested users when search query changes
  useEffect(() => {
    if (openUserSelect) {
      fetchSuggestedUsers(userSearchQuery);
    }
  }, [userSearchQuery, openUserSelect]);

  // Fetch users when dialog opens and reset state when closed
  useEffect(() => {
    if (showCreateDialog) {
      fetchSuggestedUsers("");
      setUserSearchQuery("");
      setOpenUserSelect(false);
    } else {
      // Clean up when dialog closes
      setUserSearchQuery("");
      setSuggestedUsers([]);
      setOpenUserSelect(false);
    }
  }, [showCreateDialog]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openUserSelect && !target.closest(".autocomplete-container")) {
        setOpenUserSelect(false);
      }
      if (
        showSearchSuggestions &&
        !target.closest(".search-autocomplete-container")
      ) {
        setShowSearchSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openUserSelect, showSearchSuggestions]);

  // Generate search suggestions from existing admin users
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const filtered = adminUsers.filter((admin) => {
        const searchLower = searchTerm.toLowerCase();
        const email = admin.email.toLowerCase();
        const fullName = (admin.analytics?.fullName || "").toLowerCase();
        return email.includes(searchLower) || fullName.includes(searchLower);
      });
      setSearchSuggestions(filtered.slice(0, 5)); // Limit to 5 suggestions
      setShowSearchSuggestions(filtered.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSearchSuggestions(false);
    }
  }, [searchTerm, adminUsers]);

  const fetchSuggestedUsers = async (query: string) => {
    try {
      setLoadingUsers(true);
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query);
      }

      const response = await fetch(`/api/admin/users/search?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setSuggestedUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setSuggestedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(roleFilter !== "all" && { role: roleFilter }),
        ...(statusFilter !== "all" && { status: statusFilter }),
      });

      const response = await fetch(`/api/admin/admin-users?${params}`);
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error(
            "Acceso restringido: Solo administradores pueden ver esta sección",
          );
        }
        throw new Error("Failed to fetch admin users");
      }

      const data = await response.json();
      setAdminUsers(data.adminUsers || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching admin users:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async () => {
    if (!newAdminData.email || !newAdminData.role) {
      toast.error("Email y rol son requeridos");
      return;
    }

    try {
      setCreating(true);

      const response = await fetch("/api/admin/admin-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdminData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create admin user");
      }

      toast.success("Usuario administrador creado exitosamente");
      setShowCreateDialog(false);
      setNewAdminData({ email: "", role: "admin", is_active: true });
      fetchAdminUsers();
    } catch (error) {
      console.error("Error creating admin user:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al crear usuario administrador",
      );
    } finally {
      setCreating(false);
    }
  };

  const handleToggleStatus = async (
    adminId: string,
    currentStatus: boolean,
  ) => {
    try {
      const response = await fetch(`/api/admin/admin-users/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update admin user");
      }

      toast.success(
        `Usuario ${!currentStatus ? "activado" : "desactivado"} exitosamente`,
      );
      fetchAdminUsers();
    } catch (error) {
      console.error("Error updating admin user:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al actualizar usuario",
      );
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres eliminar al administrador ${adminEmail}? Esta acción no se puede deshacer.`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/admin-users/${adminId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete admin user");
      }

      toast.success("Usuario administrador eliminado exitosamente");
      fetchAdminUsers();
    } catch (error) {
      console.error("Error deleting admin user:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al eliminar usuario",
      );
    }
  };

  const getRoleBadge = (role: string) => {
    // Simplified: only 'admin' role
    return (
      <Badge
        className="flex items-center gap-1"
        style={{
          backgroundColor: "var(--admin-accent-tertiary)",
          color: "white",
        }}
      >
        <Crown className="h-3 w-3" />
        Administrador
      </Badge>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge
        style={{
          backgroundColor: "var(--admin-success)",
          color: "white",
        }}
      >
        Activo
      </Badge>
    ) : (
      <Badge
        variant="outline"
        style={{
          borderColor: "var(--admin-text-tertiary)",
          color: "var(--admin-text-tertiary)",
        }}
      >
        Inactivo
      </Badge>
    );
  };

  const formatLastActivity = (dateString?: string) => {
    if (!dateString) return "Nunca";

    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffHours < 1) return "Hace menos de 1 hora";
    if (diffHours < 24) return `Hace ${diffHours} horas`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString("es-AR");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="font-title text-3xl"
              style={{ color: "var(--admin-text-primary)" }}
            >
              Gestión de Administradores
            </h1>
            <p style={{ color: "var(--admin-text-secondary)" }}>
              Cargando usuarios administradores...
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse admin-card">
              <CardContent className="p-6">
                <div
                  className="h-4 rounded w-3/4 mb-2"
                  style={{ backgroundColor: "var(--admin-border-secondary)" }}
                ></div>
                <div
                  className="h-8 rounded w-1/2"
                  style={{ backgroundColor: "var(--admin-border-secondary)" }}
                ></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1
              className="font-title text-3xl"
              style={{ color: "var(--admin-text-primary)" }}
            >
              Gestión de Administradores
            </h1>
            <p style={{ color: "var(--admin-text-secondary)" }}>
              Error al cargar los datos
            </p>
          </div>
        </div>
        <Card className="admin-card">
          <CardContent className="text-center py-16">
            <AlertTriangle
              className="h-12 w-12 mx-auto mb-4"
              style={{ color: "var(--admin-error)" }}
            />
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: "var(--admin-text-primary)" }}
            >
              Error al cargar administradores
            </h3>
            <p
              style={{ color: "var(--admin-text-secondary)" }}
              className="mb-4"
            >
              {error}
            </p>
            <Button
              onClick={fetchAdminUsers}
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className="font-title text-3xl"
            style={{ color: "var(--admin-text-primary)" }}
          >
            Gestión de Administradores
          </h1>
          <p style={{ color: "var(--admin-text-secondary)" }}>
            Administra usuarios con acceso al panel de administración
          </p>
        </div>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Administrador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle style={{ color: "var(--admin-text-primary)" }}>
                Crear Nuevo Administrador
              </DialogTitle>
              <DialogDescription
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Otorga acceso administrativo a un usuario registrado
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="relative autocomplete-container">
                <Label
                  htmlFor="email"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  Email del Usuario
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="text"
                    placeholder="Buscar por email o nombre..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setOpenUserSelect(true);
                    }}
                    onFocus={() => setOpenUserSelect(true)}
                    className="w-full"
                    style={{
                      borderColor: "var(--admin-border-secondary)",
                      backgroundColor: "var(--admin-bg-primary)",
                    }}
                  />
                  {loadingUsers && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-admin-accent-tertiary border-t-transparent rounded-full" />
                    </div>
                  )}
                </div>

                {/* Autocomplete Suggestions */}
                {openUserSelect &&
                  (userSearchQuery.length > 0 || suggestedUsers.length > 0) && (
                    <div
                      className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto"
                      style={{
                        backgroundColor: "var(--admin-bg-primary)",
                        borderColor: "var(--admin-border-secondary)",
                      }}
                    >
                      {suggestedUsers.length === 0 && !loadingUsers && (
                        <div
                          className="px-4 py-3 text-sm text-center"
                          style={{ color: "var(--admin-text-secondary)" }}
                        >
                          No se encontraron usuarios
                        </div>
                      )}
                      {suggestedUsers.map((user) => (
                        <div
                          key={user.id}
                          className="px-4 py-3 hover:bg-[var(--admin-bg-tertiary)] cursor-pointer transition-colors border-b last:border-b-0"
                          style={{ borderColor: "var(--admin-border-primary)" }}
                          onClick={() => {
                            setNewAdminData({
                              ...newAdminData,
                              email: user.email,
                            });
                            setUserSearchQuery(user.email);
                            setOpenUserSelect(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            {newAdminData.email === user.email && (
                              <Check
                                className="h-4 w-4 flex-shrink-0"
                                style={{
                                  color: "var(--admin-accent-tertiary)",
                                }}
                              />
                            )}
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className="font-medium text-sm truncate"
                                style={{ color: "var(--admin-text-primary)" }}
                              >
                                {user.fullName}
                              </span>
                              <span
                                className="text-xs truncate"
                                style={{ color: "var(--admin-text-secondary)" }}
                              >
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Escribe para buscar un usuario registrado del sistema
                </p>
              </div>

              <div>
                <Label
                  htmlFor="role"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  Rol Administrativo
                </Label>
                <div
                  className="mt-2 p-3 rounded-md"
                  style={{ backgroundColor: "var(--admin-bg-tertiary)" }}
                >
                  <div className="flex items-center gap-2">
                    <Crown
                      className="h-4 w-4"
                      style={{ color: "var(--admin-accent-tertiary)" }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: "var(--admin-text-primary)" }}
                    >
                      Administrador
                    </span>
                  </div>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Acceso completo a todas las funciones del sistema
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  color: "var(--admin-text-primary)",
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateAdmin}
                disabled={creating}
                style={{
                  backgroundColor: "var(--admin-bg-secondary)",
                  color: "white",
                }}
              >
                {creating ? "Creando..." : "Crear Administrador"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users
                className="h-8 w-8"
                style={{ color: "var(--admin-text-primary)" }}
              />
              <div className="ml-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Total Administradores
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {adminUsers.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown
                className="h-8 w-8"
                style={{ color: "var(--admin-accent-tertiary)" }}
              />
              <div className="ml-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Administradores
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--admin-accent-tertiary)" }}
                >
                  {adminUsers.filter((admin) => admin.role === "admin").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle
                className="h-8 w-8"
                style={{ color: "var(--admin-success)" }}
              />
              <div className="ml-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Activos
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--admin-success)" }}
                >
                  {adminUsers.filter((admin) => admin.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className="admin-card"
          style={{ border: "1px solid var(--admin-border-secondary)" }}
        >
          <CardContent className="p-6">
            <div className="flex items-center">
              <Activity
                className="h-8 w-8"
                style={{ color: "var(--admin-text-primary)" }}
              />
              <div className="ml-4">
                <p
                  className="text-sm"
                  style={{ color: "var(--admin-text-secondary)" }}
                >
                  Activos Recientes
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--admin-text-primary)" }}
                >
                  {
                    adminUsers.filter(
                      (admin) =>
                        admin.analytics?.activityCount30Days &&
                        admin.analytics.activityCount30Days > 0,
                    ).length
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative search-autocomplete-container">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 z-10"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <Input
                  placeholder="Buscar por email o nombre..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSearchSuggestions(true);
                  }}
                  onFocus={() => {
                    if (
                      searchTerm.trim().length > 0 &&
                      searchSuggestions.length > 0
                    ) {
                      setShowSearchSuggestions(true);
                    }
                  }}
                  className="pl-10"
                  style={{
                    borderColor: "var(--admin-border-secondary)",
                    backgroundColor: "var(--admin-bg-primary)",
                  }}
                />

                {/* Search Autocomplete Suggestions */}
                {showSearchSuggestions && searchSuggestions.length > 0 && (
                  <div
                    className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto"
                    style={{
                      backgroundColor: "var(--admin-bg-primary)",
                      borderColor: "var(--admin-border-secondary)",
                    }}
                  >
                    {searchSuggestions.map((admin) => {
                      const fullName = admin.analytics?.fullName || admin.email;
                      return (
                        <div
                          key={admin.id}
                          className="px-4 py-3 hover:bg-[var(--admin-bg-tertiary)] cursor-pointer transition-colors border-b last:border-b-0"
                          style={{ borderColor: "var(--admin-border-primary)" }}
                          onClick={() => {
                            setSearchTerm(admin.email);
                            setShowSearchSuggestions(false);
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col min-w-0 flex-1">
                              <span
                                className="font-medium text-sm truncate"
                                style={{ color: "var(--admin-text-primary)" }}
                              >
                                {fullName}
                              </span>
                              <span
                                className="text-xs truncate"
                                style={{ color: "var(--admin-text-secondary)" }}
                              >
                                {admin.email}
                              </span>
                            </div>
                            {admin.is_active ? (
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: "var(--admin-success)",
                                  color: "white",
                                }}
                              >
                                Activo
                              </Badge>
                            ) : (
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: "var(--admin-error)",
                                  color: "white",
                                }}
                              >
                                Inactivo
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-[180px]"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: "var(--admin-bg-primary)" }}
              >
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Table */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardHeader>
          <CardTitle
            className="flex items-center"
            style={{ color: "var(--admin-text-primary)" }}
          >
            <Users
              className="h-5 w-5 mr-2"
              style={{ color: "var(--admin-text-primary)" }}
            />
            Usuarios Administradores (
            {(() => {
              // Client-side filtering for search
              const filtered = adminUsers.filter((admin) => {
                if (!searchTerm) return true;
                const searchLower = searchTerm.toLowerCase();
                const fullName = (
                  admin.analytics?.fullName || ""
                ).toLowerCase();
                const email = admin.email.toLowerCase();
                return (
                  fullName.includes(searchLower) || email.includes(searchLower)
                );
              });
              return filtered.length;
            })()}
            )
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Última Actividad</TableHead>
                  <TableHead>Actividad (30d)</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(() => {
                  // Client-side filtering for search
                  const filteredAdminUsers = adminUsers.filter((admin) => {
                    if (!searchTerm) return true;
                    const searchLower = searchTerm.toLowerCase();
                    const fullName = (
                      admin.analytics?.fullName || ""
                    ).toLowerCase();
                    const email = admin.email.toLowerCase();
                    return (
                      fullName.includes(searchLower) ||
                      email.includes(searchLower)
                    );
                  });
                  return filteredAdminUsers.map((admin) => (
                    <TableRow
                      key={admin.id}
                      style={{ borderColor: "var(--admin-border-primary)" }}
                      className="hover:bg-[var(--admin-bg-tertiary)] transition-colors"
                    >
                      <TableCell>
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {admin.analytics?.fullName || "Sin nombre"}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "var(--admin-text-secondary)" }}
                          >
                            {admin.email}
                          </div>
                          {admin.profiles?.phone && (
                            <div
                              className="flex items-center text-xs mt-1"
                              style={{ color: "var(--admin-text-secondary)" }}
                            >
                              <Phone
                                className="h-3 w-3 mr-1"
                                style={{ color: "var(--admin-text-tertiary)" }}
                              />
                              {admin.profiles.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>{getRoleBadge(admin.role)}</TableCell>

                      <TableCell>{getStatusBadge(admin.is_active)}</TableCell>

                      <TableCell>
                        <div
                          className="flex items-center text-sm"
                          style={{ color: "var(--admin-text-secondary)" }}
                        >
                          <Clock
                            className="h-3 w-3 mr-1"
                            style={{ color: "var(--admin-text-tertiary)" }}
                          />
                          {formatLastActivity(admin.last_login)}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="text-center">
                          <div
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {admin.analytics?.activityCount30Days || 0}
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "var(--admin-text-tertiary)" }}
                          >
                            acciones
                          </div>
                        </div>
                      </TableCell>

                      <TableCell
                        className="text-sm"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        {new Date(admin.created_at).toLocaleDateString("es-AR")}
                      </TableCell>

                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Abrir menú</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/admin-users/${admin.id}`}
                                className="flex items-center cursor-pointer"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/admin-users/${admin.id}/edit`}
                                className="flex items-center cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUserForPermissions(admin);
                                setShowPermissionsEditor(true);
                              }}
                              className="flex items-center cursor-pointer"
                            >
                              <Shield className="mr-2 h-4 w-4" />
                              Editar Permisos
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleToggleStatus(admin.id, admin.is_active)
                              }
                              className="flex items-center cursor-pointer"
                            >
                              {admin.is_active ? (
                                <>
                                  <AlertTriangle
                                    className="mr-2 h-4 w-4"
                                    style={{ color: "var(--admin-error)" }}
                                  />
                                  Desactivar
                                </>
                              ) : (
                                <>
                                  <CheckCircle
                                    className="mr-2 h-4 w-4"
                                    style={{ color: "var(--admin-success)" }}
                                  />
                                  Activar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleDeleteAdmin(admin.id, admin.email)
                              }
                              className="flex items-center cursor-pointer"
                              style={{ color: "var(--admin-error)" }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ));
                })()}
              </TableBody>
            </Table>
          </div>

          {adminUsers.length === 0 && (
            <div className="text-center py-12">
              <Users
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: "var(--admin-text-tertiary)" }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--admin-text-primary)" }}
              >
                No se encontraron administradores
              </h3>
              <p style={{ color: "var(--admin-text-secondary)" }}>
                Ajusta los filtros o crea un nuevo administrador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Permissions Editor Dialog */}
      {showPermissionsEditor && selectedUserForPermissions && (
        <PermissionsEditor
          userId={selectedUserForPermissions.id}
          currentPermissions={selectedUserForPermissions.permissions || {}}
          open={showPermissionsEditor}
          onOpenChange={setShowPermissionsEditor}
          onSave={() => {
            fetchAdminUsers();
            setSelectedUserForPermissions(null);
          }}
        />
      )}
    </div>
  );
}
