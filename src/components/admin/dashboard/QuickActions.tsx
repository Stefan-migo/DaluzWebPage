"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Plus,
  ShoppingCart,
  Users,
  Package,
  BarChart3,
  MessageSquare,
  Settings,
  FileText,
} from "lucide-react";
import type { Product } from "@/types/admin";

interface QuickActionsProps {
  lowStockProducts?: Product[];
}

export default function QuickActions({
  lowStockProducts = [],
}: QuickActionsProps) {
  const quickLinks = [
    {
      href: "/admin/products/add",
      icon: Plus,
      label: "Nuevo Producto",
      description: "Agregar al catálogo",
    },
    {
      href: "/admin/orders",
      icon: ShoppingCart,
      label: "Pedidos",
      description: "Gestionar pedidos",
    },
    {
      href: "/admin/products?filter=low_stock",
      icon: AlertTriangle,
      label: "Stock Bajo",
      description: "Revisar inventario",
    },
    {
      href: "/admin/analytics",
      icon: BarChart3,
      label: "Analíticas",
      description: "Ver reportes",
    },
  ];

  return (
    <Card
      className="admin-card"
      style={{ border: "1px solid var(--admin-border-secondary)" }}
    >
      <CardHeader className="pb-3">
        <CardTitle
          className="font-subtitle text-xl"
          style={{ color: "var(--admin-text-primary)" }}
        >
          Acciones Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Stock Alerts Section */}
          {lowStockProducts.length > 0 && (
            <div
              className="mb-4 p-3 rounded-lg"
              style={{
                backgroundColor: "rgba(139, 0, 0, 0.08)",
                border: "1px solid var(--admin-error)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "var(--admin-error)" }}
                />
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--admin-error)" }}
                >
                  Alertas de Stock
                </p>
              </div>
              <p
                className="text-xs mb-2"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                {lowStockProducts.length} producto
                {lowStockProducts.length !== 1 ? "s" : ""} requiere
                {lowStockProducts.length === 1 ? "" : "n"} atención
              </p>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/edit/${product.id}`}
                    className="block"
                  >
                    <div
                      className="flex items-center justify-between text-xs p-2 rounded transition-colors hover:bg-opacity-50"
                      style={{ backgroundColor: "var(--admin-bg-primary)" }}
                    >
                      <span
                        className="truncate flex-1 mr-2"
                        style={{ color: "var(--admin-text-primary)" }}
                      >
                        {product.name}
                      </span>
                      <Badge
                        className="text-xs flex-shrink-0"
                        style={{
                          backgroundColor: "var(--admin-error)",
                          color: "white",
                        }}
                      >
                        {product.inventory_quantity} un.
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
              {lowStockProducts.length > 5 && (
                <p
                  className="text-xs mt-2 text-center"
                  style={{ color: "var(--admin-error)" }}
                >
                  +{lowStockProducts.length - 5} más
                </p>
              )}
              <Link href="/admin/products?filter=low_stock">
                <Button
                  className="w-full mt-3"
                  size="sm"
                  style={{
                    borderColor: "var(--admin-error)",
                    color: "var(--admin-error)",
                    backgroundColor: "transparent",
                  }}
                >
                  Ver Todos
                  <ArrowRight className="h-3 w-3 ml-2" />
                </Button>
              </Link>
            </div>
          )}

          {/* Action Buttons */}
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                className="w-full justify-start h-auto py-3 transition-all duration-300"
                style={{
                  border: "1px solid var(--admin-border-secondary)",
                  color: "var(--admin-text-primary)",
                  backgroundColor: "var(--admin-bg-primary)",
                }}
              >
                <link.icon
                  className="h-4 w-4 mr-3 flex-shrink-0"
                  style={{ color: "var(--admin-accent-secondary)" }}
                />
                <div className="text-left">
                  <span className="block font-medium">{link.label}</span>
                  <span
                    className="block text-xs"
                    style={{ color: "var(--admin-text-tertiary)" }}
                  >
                    {link.description}
                  </span>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
