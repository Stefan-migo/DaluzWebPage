"use client";

import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Icon className="h-12 w-12 text-tierra-media" />
      </div>

      <h3 className="text-lg font-semibold text-azul-profundo mb-2">{title}</h3>

      {description && (
        <p className="text-tierra-media text-center max-w-md mb-6">
          {description}
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {actionLabel && onAction && (
          <Button onClick={onAction}>{actionLabel}</Button>
        )}

        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="outline" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
