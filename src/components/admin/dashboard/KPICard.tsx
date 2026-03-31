"use client";

import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  LucideIcon,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  variant?: "default" | "success" | "warning" | "danger";
  href?: string;
  description?: string;
}

const KPICard = memo(function KPICard({
  title,
  value,
  icon: Icon,
  subtitle,
  change,
  changeLabel,
  variant = "default",
  href,
  description,
}: KPICardProps) {
  const variantClasses = {
    default: "text-[var(--admin-text-primary)]",
    success: "text-[var(--admin-success)]",
    warning: "text-[var(--admin-warning)]",
    danger: "text-[var(--admin-error)]",
  };

  const cardContent = (
    <Card
      className={cn(
        "admin-card transition-all duration-200",
        href &&
          "cursor-pointer hover:shadow-lg hover:border-[var(--admin-accent-secondary)]",
      )}
      style={{ border: "1px solid var(--admin-border-secondary)" }}
    >
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-3">
          <Icon
            className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0"
            style={{ color: "var(--admin-accent-secondary)" }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p
                className="text-xs md:text-sm font-medium truncate"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                {title}
              </p>
              {href && (
                <ArrowUpRight
                  className="h-4 w-4 flex-shrink-0"
                  style={{ color: "var(--admin-text-tertiary)" }}
                />
              )}
            </div>
            <p
              className="text-lg md:text-2xl font-bold break-words"
              style={{ color: "var(--admin-text-primary)" }}
            >
              {value}
            </p>
            {change !== undefined && (
              <div
                className={cn("flex items-center text-xs mt-1 gap-1")}
                style={{
                  color:
                    change >= 0 ? "var(--admin-success)" : "var(--admin-error)",
                }}
                aria-label={
                  change >= 0
                    ? `Tendencia positiva: +${change.toFixed(1)}%`
                    : `Tendencia negativa: ${change.toFixed(1)}%`
                }
              >
                {change >= 0 ? (
                  <>
                    <TrendingUp
                      className="h-3 w-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      +{change.toFixed(1)}% {changeLabel}
                    </span>
                  </>
                ) : (
                  <>
                    <TrendingDown
                      className="h-3 w-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {change.toFixed(1)}% {changeLabel}
                    </span>
                  </>
                )}
              </div>
            )}
            {subtitle && (
              <p
                className="text-xs mt-1 truncate"
                style={{ color: "var(--admin-text-tertiary)" }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
});

export default KPICard;
