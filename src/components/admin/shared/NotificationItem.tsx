"use client";

import {
  ShoppingCart,
  Package,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Shield,
  Info,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminNotification {
  id: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

interface NotificationItemProps {
  notification: AdminNotification;
  onClick?: (notification: AdminNotification) => void;
}

const notificationIcons: Record<string, LucideIcon> = {
  order_new: ShoppingCart,
  order_status_change: Package,
  low_stock: AlertTriangle,
  out_of_stock: AlertTriangle,
  new_review: MessageSquare,
  review_pending: MessageSquare,
  support_ticket_new: MessageSquare,
  support_ticket_update: MessageSquare,
  payment_received: TrendingUp,
  system_alert: Shield,
  custom: Info,
};

const priorityColors: Record<string, string> = {
  low: "text-gray-500 bg-gray-100",
  medium: "text-blue-600 bg-blue-100",
  high: "text-orange-600 bg-orange-100",
  urgent: "text-red-600 bg-red-100",
};

function getTimeSince(date: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );

  if (seconds < 60) return "Hace un momento";
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
  return `Hace ${Math.floor(seconds / 86400)} días`;
}

export default function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const Icon = notificationIcons[notification.type] || Info;
  const isUnread = !notification.is_read;

  return (
    <div
      className={cn(
        "p-4 hover:bg-[#AE000010] transition-colors cursor-pointer",
        isUnread && "bg-[#AE000005]",
      )}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            priorityColors[notification.priority],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium text-[#1C1B1A]",
                  isUnread && "font-semibold",
                )}
              >
                {notification.title}
              </p>
              <p className="text-xs text-[#1C1B1A]/70 mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>
            {isUnread && (
              <div className="w-2 h-2 bg-[#AE0000] rounded-full flex-shrink-0 mt-1" />
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#1C1B1A]/50">
              {getTimeSince(notification.created_at)}
            </span>
            {notification.action_label && (
              <span className="text-xs font-medium text-[#AE0000]">
                {notification.action_label} →
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
