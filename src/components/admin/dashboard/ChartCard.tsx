"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface ChartCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export default function ChartCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: ChartCardProps) {
  return (
    <Card
      className={`admin-card ${className || ""}`}
      style={{ border: "1px solid var(--admin-border-secondary)" }}
    >
      <CardHeader>
        <CardTitle
          className="flex items-center gap-2"
          style={{ color: "var(--admin-text-primary)" }}
        >
          {Icon && (
            <Icon
              className="h-5 w-5"
              style={{ color: "var(--admin-accent-secondary)" }}
            />
          )}
          {title}
        </CardTitle>
        {description && (
          <p
            className="text-sm"
            style={{ color: "var(--admin-text-secondary)" }}
          >
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
