"use client";

import { Badge, type BadgeProps } from "@/components/ui/badge";

type StatusType =
  | "active"
  | "draft"
  | "archived"
  | "pending"
  | "processing"
  | "completed"
  | "cancelled"
  | "refunded"
  | "paid"
  | "failed"
  | "healthy"
  | "warning"
  | "critical";

interface StatusBadgeProps {
  status: StatusType;
  variant?: BadgeProps["variant"];
  className?: string;
  showIcon?: boolean;
}

const statusConfig: Record<
  StatusType,
  { variant: BadgeProps["variant"]; label: string; icon?: string }
> = {
  // Product/General statuses
  active: { variant: "default", label: "Activo" },
  draft: { variant: "secondary", label: "Borrador" },
  archived: { variant: "outline", label: "Archivado" },

  // Order statuses
  pending: { variant: "outline", label: "Pendiente" },
  processing: { variant: "default", label: "Procesando" },
  completed: { variant: "default", label: "Completado" },
  cancelled: { variant: "destructive", label: "Cancelado" },
  refunded: { variant: "secondary", label: "Reembolsado" },

  // Payment statuses
  paid: { variant: "default", label: "Pagado" },
  failed: { variant: "destructive", label: "Fallido" },

  // Health statuses
  healthy: { variant: "default", label: "Saludable" },
  warning: { variant: "secondary", label: "Advertencia" },
  critical: { variant: "destructive", label: "Crítico" },
};

export default function StatusBadge({
  status,
  variant,
  className = "",
  showIcon = false,
}: StatusBadgeProps) {
  const config = statusConfig[status] || {
    variant: "secondary",
    label: status,
  };

  const displayVariant = variant || config.variant;
  const displayLabel = config.label || status;

  return (
    <Badge variant={displayVariant} className={className}>
      {showIcon && config.icon && <span className="mr-1">{config.icon}</span>}
      {displayLabel}
    </Badge>
  );
}
