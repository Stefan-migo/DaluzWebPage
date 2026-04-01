"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "default" | "destructive";
  loading?: boolean;
  showIcon?: boolean;
  className?: string;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  variant = "default",
  loading = false,
  showIcon = true,
  className = "",
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    if (!loading) {
      onConfirm();
    }
  };

  const dialogId = `confirm-dialog-${title.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={className}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogId}
      >
        <DialogHeader>
          <DialogTitle id={dialogId} className="flex items-center gap-2">
            {showIcon && variant === "destructive" && (
              <AlertTriangle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            )}
            {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={variant === "destructive" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
