"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  MessageSquare,
  Plus,
  Search,
  Eye,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
  FileText,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  ticket_number: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  customer_email: string;
  customer_name?: string;
  created_at: string;
  updated_at: string;
  first_response_at?: string;
  last_response_at?: string;
  assigned_to?: string;
  category?: {
    id: string;
    name: string;
  };
  assigned_admin?: {
    id: string;
    email: string;
  };
  customer?: {
    id: string;
    first_name?: string;
    last_name?: string;
    email: string;
  };
  order?: {
    id: string;
    order_number: string;
  };
  stats?: {
    messageCount: number;
    customerMessageCount: number;
    adminMessageCount: number;
    ageHours: number;
    needsResponse: boolean;
  };
}

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  urgentTickets: number;
  avgResponseTimeHours: number;
  ticketsThisWeek: number;
}

export default function SupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [assignedFilter, setAssignedFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Status update loading state
  const [updatingTickets, setUpdatingTickets] = useState<Set<string>>(
    new Set(),
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(priorityFilter !== "all" && { priority: priorityFilter }),
        ...(categoryFilter !== "all" && { category_id: categoryFilter }),
        ...(assignedFilter !== "all" && { assigned_to: assignedFilter }),
      });

      const response = await fetch(`/api/admin/support/tickets?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch support tickets");
      }

      const data = await response.json();
      setTickets(data.tickets || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching support tickets:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/support/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error("Error fetching support categories:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const totalTickets = tickets.length;
      const openTickets = tickets.filter((t) => t.status === "open").length;
      const inProgressTickets = tickets.filter(
        (t) => t.status === "in_progress",
      ).length;
      const urgentTickets = tickets.filter(
        (t) => t.priority === "urgent",
      ).length;

      const ticketsWithResponse = tickets.filter((t) => t.first_response_at);
      const avgResponseTimeHours =
        ticketsWithResponse.length > 0
          ? ticketsWithResponse.reduce((acc, ticket) => {
              const created = new Date(ticket.created_at).getTime();
              const firstResponse = new Date(
                ticket.first_response_at!,
              ).getTime();
              return acc + (firstResponse - created) / (1000 * 60 * 60);
            }, 0) / ticketsWithResponse.length
          : 0;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const ticketsThisWeek = tickets.filter((t) => {
        return new Date(t.created_at) > weekAgo;
      }).length;

      setStats({
        totalTickets,
        openTickets,
        inProgressTickets,
        urgentTickets,
        avgResponseTimeHours: Math.round(avgResponseTimeHours * 10) / 10,
        ticketsThisWeek,
      });
    } catch (err) {
      console.error("Error calculating support stats:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchCategories();
  }, [
    currentPage,
    statusFilter,
    priorityFilter,
    categoryFilter,
    assignedFilter,
  ]);

  useEffect(() => {
    if (tickets.length > 0) {
      fetchStats();
    }
  }, [tickets]);

  const getStatusBadge = (status: string) => {
    const config: Record<
      string,
      { variant: any; label: string; icon: any; color: string }
    > = {
      open: {
        variant: "destructive",
        label: "Abierto",
        icon: AlertTriangle,
        color: "var(--admin-error)",
      },
      in_progress: {
        variant: "default",
        label: "En Progreso",
        icon: Activity,
        color: "var(--admin-warning)",
      },
      pending_customer: {
        variant: "secondary",
        label: "Esperando Cliente",
        icon: Clock,
        color: "var(--admin-text-tertiary)",
      },
      resolved: {
        variant: "outline",
        label: "Resuelto",
        icon: CheckCircle,
        color: "var(--admin-success)",
      },
      closed: {
        variant: "outline",
        label: "Cerrado",
        icon: CheckCircle,
        color: "var(--admin-text-tertiary)",
      },
    };

    const statusConfig = config[status] || config["open"];
    const Icon = statusConfig.icon;

    return (
      <Badge
        variant={statusConfig.variant}
        className="flex items-center gap-1"
        style={{
          backgroundColor:
            statusConfig.variant === "destructive"
              ? "var(--admin-error)"
              : statusConfig.variant === "default"
                ? "var(--admin-warning)"
                : "transparent",
          color:
            statusConfig.variant === "outline" ? statusConfig.color : "white",
        }}
      >
        <Icon className="h-3 w-3" />
        {statusConfig.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<
      string,
      { variant: any; label: string; bgColor: string; textColor: string }
    > = {
      low: {
        variant: "outline",
        label: "Baja",
        bgColor: "transparent",
        textColor: "var(--admin-text-tertiary)",
      },
      medium: {
        variant: "secondary",
        label: "Media",
        bgColor: "var(--admin-warning)",
        textColor: "white",
      },
      high: {
        variant: "default",
        label: "Alta",
        bgColor: "var(--admin-accent-tertiary)",
        textColor: "white",
      },
      urgent: {
        variant: "destructive",
        label: "Urgente",
        bgColor: "var(--admin-error)",
        textColor: "white",
      },
    };

    const priorityConfig = config[priority] || config["medium"];
    return (
      <Badge
        variant={priorityConfig.variant}
        style={{
          backgroundColor: priorityConfig.bgColor,
          color: priorityConfig.textColor,
          borderColor:
            priorityConfig.variant === "outline"
              ? priorityConfig.textColor
              : "transparent",
        }}
      >
        {priorityConfig.label}
      </Badge>
    );
  };

  const formatTimeAgo = (dateString: string) => {
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

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      setUpdatingTickets((prev) => new Set(prev).add(ticketId));

      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          previous_status: tickets.find((t) => t.id === ticketId)?.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket status");
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: newStatus,
                updated_at: new Date().toISOString(),
              }
            : ticket,
        ),
      );

      setUpdatingTickets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });

      toast.success("Estado actualizado exitosamente");
      fetchStats();
    } catch (err) {
      console.error("Error updating ticket status:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar el estado";
      toast.error("Error al actualizar el estado", {
        description: errorMessage,
      });

      setUpdatingTickets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  const handlePriorityChange = async (
    ticketId: string,
    newPriority: string,
  ) => {
    try {
      setUpdatingTickets((prev) => new Set(prev).add(ticketId));

      const response = await fetch(`/api/admin/support/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: newPriority,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update ticket priority");
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                priority: newPriority,
                updated_at: new Date().toISOString(),
              }
            : ticket,
        ),
      );

      setUpdatingTickets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });

      toast.success("Prioridad actualizada exitosamente");
      fetchStats();
    } catch (err) {
      console.error("Error updating ticket priority:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar la prioridad";
      toast.error("Error al actualizar la prioridad", {
        description: errorMessage,
      });

      setUpdatingTickets((prev) => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  // Client-side filtering
  const filteredTickets = useMemo(() => {
    if (!searchTerm) return tickets;

    const searchLower = searchTerm.toLowerCase();
    return tickets.filter((ticket) => {
      const ticketNumber = (ticket.ticket_number || "").toLowerCase();
      const subject = (ticket.subject || "").toLowerCase();
      const customerName = (ticket.customer_name || "").toLowerCase();
      const customerEmail = (ticket.customer_email || "").toLowerCase();
      const customerFirstName = (
        ticket.customer?.first_name || ""
      ).toLowerCase();
      const customerLastName = (ticket.customer?.last_name || "").toLowerCase();
      const fullCustomerName =
        `${customerFirstName} ${customerLastName}`.trim();

      return (
        ticketNumber.includes(searchLower) ||
        subject.includes(searchLower) ||
        customerName.includes(searchLower) ||
        customerEmail.includes(searchLower) ||
        customerFirstName.includes(searchLower) ||
        customerLastName.includes(searchLower) ||
        fullCustomerName.includes(searchLower)
      );
    });
  }, [tickets, searchTerm]);

  if (loading && tickets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div
            className="h-8 rounded w-64 mb-2"
            style={{ backgroundColor: "var(--admin-border-secondary)" }}
          ></div>
          <div
            className="h-4 rounded w-96"
            style={{ backgroundColor: "var(--admin-border-secondary)" }}
          ></div>
        </div>
        <Card className="admin-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div
                    className="h-12 rounded"
                    style={{ backgroundColor: "var(--admin-border-secondary)" }}
                  ></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
              Soporte al Cliente
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
              Error al cargar soporte
            </h3>
            <p
              style={{ color: "var(--admin-text-secondary)" }}
              className="mb-4"
            >
              {error}
            </p>
            <Button onClick={fetchTickets}>Reintentar</Button>
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
            Soporte al Cliente
          </h1>
          <p style={{ color: "var(--admin-text-secondary)" }}>
            Gestiona tickets de soporte y comunicación con clientes
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            onClick={fetchTickets}
            className="flex-1 md:flex-none"
            style={{
              borderColor: "var(--admin-border-secondary)",
              color: "var(--admin-text-primary)",
              backgroundColor: "var(--admin-bg-primary)",
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Link
            href="/admin/support/tickets/new"
            className="flex-1 md:flex-none"
          >
            <Button
              style={{
                backgroundColor: "var(--admin-bg-secondary)",
                color: "white",
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Ticket
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <MessageSquare
                  className="h-6 w-6"
                  style={{ color: "var(--admin-text-primary)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Total
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-text-primary)" }}
                  >
                    {stats.totalTickets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle
                  className="h-6 w-6"
                  style={{ color: "var(--admin-warning)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Abiertos
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-warning)" }}
                  >
                    {stats.openTickets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <Activity
                  className="h-6 w-6"
                  style={{ color: "var(--admin-accent-tertiary)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    En Progreso
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-accent-tertiary)" }}
                  >
                    {stats.inProgressTickets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle
                  className="h-6 w-6"
                  style={{ color: "var(--admin-error)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Urgentes
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-error)" }}
                  >
                    {stats.urgentTickets}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <Clock
                  className="h-6 w-6"
                  style={{ color: "var(--admin-success)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Tiempo Resp.
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-success)" }}
                  >
                    {stats.avgResponseTimeHours > 0
                      ? `${stats.avgResponseTimeHours}h`
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="admin-card"
            style={{ border: "1px solid var(--admin-border-secondary)" }}
          >
            <CardContent className="p-4">
              <div className="flex items-center">
                <TrendingUp
                  className="h-6 w-6"
                  style={{ color: "var(--admin-info)" }}
                />
                <div className="ml-3">
                  <p
                    className="text-xs"
                    style={{ color: "var(--admin-text-secondary)" }}
                  >
                    Esta Semana
                  </p>
                  <p
                    className="text-lg font-bold"
                    style={{ color: "var(--admin-info)" }}
                  >
                    {stats.ticketsThisWeek}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
                <Input
                  placeholder="Buscar por número, asunto o email..."
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

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className="w-full md:w-[180px]"
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
                <SelectItem value="open">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-error)" }}
                    ></span>
                    Abiertos
                  </span>
                </SelectItem>
                <SelectItem value="in_progress">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-warning)" }}
                    ></span>
                    En progreso
                  </span>
                </SelectItem>
                <SelectItem value="pending_customer">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-text-tertiary)" }}
                    ></span>
                    Esperando cliente
                  </span>
                </SelectItem>
                <SelectItem value="resolved">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-success)" }}
                    ></span>
                    Resueltos
                  </span>
                </SelectItem>
                <SelectItem value="closed">
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--admin-text-tertiary)" }}
                    ></span>
                    Cerrados
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className="w-full md:w-[150px]"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: "var(--admin-bg-primary)" }}
              >
                <SelectItem value="all">Todas las prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger
                className="w-full md:w-[160px]"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: "var(--admin-bg-primary)" }}
              >
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Assigned Filter */}
            <Select value={assignedFilter} onValueChange={setAssignedFilter}>
              <SelectTrigger
                className="w-full md:w-[150px]"
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <SelectValue placeholder="Asignación" />
              </SelectTrigger>
              <SelectContent
                style={{ backgroundColor: "var(--admin-bg-primary)" }}
              >
                <SelectItem value="all">Todas las asignaciones</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                <SelectItem value="assigned">Asignados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results count */}
          <div
            className="mt-3 text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            {searchTerm ? (
              <>
                Resultados para "<strong>{searchTerm}</strong>" (
                {filteredTickets.length} tickets)
              </>
            ) : (
              <>
                Mostrando <strong>{filteredTickets.length}</strong> tickets
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tickets Table */}
      <Card
        className="admin-card"
        style={{ border: "1px solid var(--admin-border-secondary)" }}
      >
        <CardHeader>
          <CardTitle
            className="flex items-center"
            style={{ color: "var(--admin-text-primary)" }}
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Tickets de Soporte ({filteredTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: "var(--admin-bg-tertiary)" }}>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Ticket
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Cliente
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Categoría
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Estado
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Prioridad
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Asignado
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Última Actividad
                </TableHead>
                <TableHead style={{ color: "var(--admin-text-secondary)" }}>
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  style={{
                    backgroundColor: ticket.stats?.needsResponse
                      ? "rgba(255, 78, 33, 0.05)"
                      : "transparent",
                  }}
                  className="hover:bg-[var(--admin-bg-tertiary)] transition-colors"
                >
                  <TableCell>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: "var(--admin-text-primary)" }}
                      >
                        #{ticket.ticket_number}
                      </div>
                      <div
                        className="text-sm truncate max-w-[200px]"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        {ticket.subject}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--admin-text-tertiary)" }}
                      >
                        {formatTimeAgo(ticket.created_at)}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: "var(--admin-text-primary)" }}
                      >
                        {ticket.customer?.first_name &&
                        ticket.customer?.last_name
                          ? `${ticket.customer.first_name} ${ticket.customer.last_name}`
                          : ticket.customer_name || "Sin nombre"}
                      </div>
                      <div
                        className="text-sm"
                        style={{ color: "var(--admin-text-secondary)" }}
                      >
                        {ticket.customer_email}
                      </div>
                      {ticket.order && (
                        <div
                          className="text-xs"
                          style={{ color: "var(--admin-text-tertiary)" }}
                        >
                          Pedido: #{ticket.order.order_number}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {ticket.category ? (
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: "var(--admin-border-secondary)",
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        {ticket.category.name}
                      </Badge>
                    ) : (
                      <span style={{ color: "var(--admin-text-tertiary)" }}>
                        Sin categoría
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Select
                      value={ticket.status}
                      onValueChange={(value) =>
                        handleStatusChange(ticket.id, value)
                      }
                      disabled={updatingTickets.has(ticket.id)}
                    >
                      <SelectTrigger
                        className="w-[160px] h-auto py-1 px-2"
                        style={{
                          borderColor: "transparent",
                          backgroundColor: "transparent",
                        }}
                      >
                        <SelectValue>
                          {updatingTickets.has(ticket.id) ? (
                            <span className="text-xs">Actualizando...</span>
                          ) : (
                            getStatusBadge(ticket.status)
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        style={{ backgroundColor: "var(--admin-bg-primary)" }}
                      >
                        <SelectItem value="open">
                          <div className="flex items-center gap-2">
                            <AlertTriangle
                              className="h-3 w-3"
                              style={{ color: "var(--admin-error)" }}
                            />
                            Abierto
                          </div>
                        </SelectItem>
                        <SelectItem value="in_progress">
                          <div className="flex items-center gap-2">
                            <Activity
                              className="h-3 w-3"
                              style={{ color: "var(--admin-warning)" }}
                            />
                            En Progreso
                          </div>
                        </SelectItem>
                        <SelectItem value="pending_customer">
                          <div className="flex items-center gap-2">
                            <Clock
                              className="h-3 w-3"
                              style={{ color: "var(--admin-text-tertiary)" }}
                            />
                            Esperando Cliente
                          </div>
                        </SelectItem>
                        <SelectItem value="resolved">
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className="h-3 w-3"
                              style={{ color: "var(--admin-success)" }}
                            />
                            Resuelto
                          </div>
                        </SelectItem>
                        <SelectItem value="closed">
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className="h-3 w-3"
                              style={{ color: "var(--admin-text-tertiary)" }}
                            />
                            Cerrado
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Select
                      value={ticket.priority}
                      onValueChange={(value) =>
                        handlePriorityChange(ticket.id, value)
                      }
                      disabled={updatingTickets.has(ticket.id)}
                    >
                      <SelectTrigger
                        className="w-[140px] h-auto py-1 px-2"
                        style={{
                          borderColor: "transparent",
                          backgroundColor: "transparent",
                        }}
                      >
                        <SelectValue>
                          {updatingTickets.has(ticket.id) ? (
                            <span className="text-xs">Actualizando...</span>
                          ) : (
                            getPriorityBadge(ticket.priority)
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent
                        style={{ backgroundColor: "var(--admin-bg-primary)" }}
                      >
                        <SelectItem value="low">
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: "var(--admin-text-tertiary)",
                              color: "var(--admin-text-tertiary)",
                            }}
                          >
                            Baja
                          </Badge>
                        </SelectItem>
                        <SelectItem value="medium">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: "var(--admin-warning)",
                              color: "white",
                            }}
                          >
                            Media
                          </Badge>
                        </SelectItem>
                        <SelectItem value="high">
                          <Badge
                            style={{
                              backgroundColor: "var(--admin-accent-tertiary)",
                              color: "white",
                            }}
                          >
                            Alta
                          </Badge>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <Badge
                            variant="destructive"
                            style={{
                              backgroundColor: "var(--admin-error)",
                              color: "white",
                            }}
                          >
                            Urgente
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    {ticket.assigned_admin ? (
                      <div className="text-sm">
                        <div
                          className="font-medium"
                          style={{ color: "var(--admin-text-primary)" }}
                        >
                          {ticket.assigned_admin.email}
                        </div>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        style={{
                          borderColor: "var(--admin-border-secondary)",
                          color: "var(--admin-text-tertiary)",
                        }}
                      >
                        Sin asignar
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {ticket.last_response_at ? (
                        <div>
                          <div
                            className="font-medium"
                            style={{ color: "var(--admin-text-primary)" }}
                          >
                            {formatTimeAgo(ticket.last_response_at)}
                          </div>
                          {ticket.stats?.needsResponse && (
                            <Badge
                              variant="destructive"
                              className="text-xs"
                              style={{
                                backgroundColor: "var(--admin-warning)",
                                color: "white",
                              }}
                            >
                              Requiere respuesta
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "var(--admin-text-tertiary)" }}>
                          Sin respuesta
                        </span>
                      )}

                      {ticket.stats && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: "var(--admin-text-tertiary)" }}
                        >
                          {ticket.stats.messageCount} mensajes
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Link href={`/admin/support/tickets/${ticket.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        style={{
                          borderColor: "var(--admin-border-secondary)",
                          color: "var(--admin-text-secondary)",
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && !loading && (
            <div className="text-center py-12">
              <MessageSquare
                className="h-12 w-12 mx-auto mb-4"
                style={{ color: "var(--admin-text-tertiary)" }}
              />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--admin-text-primary)" }}
              >
                No se encontraron tickets
              </h3>
              <p style={{ color: "var(--admin-text-secondary)" }}>
                Ajusta los filtros o crea un nuevo ticket de soporte.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 space-x-2 pb-6">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  color: "var(--admin-text-primary)",
                }}
              >
                Anterior
              </Button>

              <span
                className="text-sm"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                Página {currentPage} de {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  borderColor: "var(--admin-border-secondary)",
                  color: "var(--admin-text-primary)",
                }}
              >
                Siguiente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
