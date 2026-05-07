"use client";

import { useEffect, useState, useRef } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Package,
  ShoppingCart,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  Shield,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { NOTIFICATION_POLL_INTERVAL } from "@/constants/admin";

interface AdminNotification {
  id: string;
  type: string;
  priority: "low" | "medium" | "high" | "urgent";
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  action_url?: string;
  action_label?: string;
  metadata?: any;
  is_read: boolean;
  created_at: string;
}

const notificationIcons: Record<string, any> = {
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

export default function AdminNotificationDropdown() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=10");
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll for new notifications every 30 seconds
    intervalRef.current = setInterval(
      fetchNotifications,
      NOTIFICATION_POLL_INTERVAL,
    );

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const markAsRead = async (notificationId: string, actionUrl?: string) => {
    try {
      const response = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) throw new Error("Failed to mark notification as read");

      // Update local state
      setNotifications(
        notifications.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount(Math.max(0, unreadCount - 1));

      // Navigate if action URL provided
      if (actionUrl) {
        setIsOpen(false);
        router.push(actionUrl);
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Error al marcar la notificación");
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });

      if (!response.ok) throw new Error("Failed to mark all as read");

      // Update local state
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error("Error al marcar todas como leídas");
    } finally {
      setLoading(false);
    }
  };

  const getTimeSince = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000,
    );

    if (seconds < 60) return "Hace un momento";
    if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
    return `Hace ${Math.floor(seconds / 86400)} días`;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="admin-header-notification-btn"
          aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ""}`}
        >
          <Bell
            className="h-5 w-5"
            style={{ color: "var(--admin-text-inverse)" }}
            aria-hidden="true"
          />
          {unreadCount > 0 && (
            <span
              className="admin-header-notification-badge"
              aria-hidden="true"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-96 p-0"
        style={{
          backgroundColor: "var(--admin-bg-primary)",
          border: "1px solid var(--admin-border-secondary)",
        }}
        sideOffset={8}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ borderBottom: "1px solid var(--admin-border-secondary)" }}
        >
          <div>
            <h3
              className="font-semibold"
              style={{ color: "var(--admin-text-primary)" }}
            >
              Notificaciones
            </h3>
            <p
              className="text-xs"
              style={{ color: "var(--admin-text-secondary)" }}
            >
              {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              disabled={loading}
              className="text-xs"
              style={{ color: "var(--admin-accent-secondary)" }}
              aria-label="Marcar todas las notificaciones como leídas"
            >
              <CheckCheck className="h-4 w-4 mr-1" aria-hidden="true" />
              Marcar todas
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell
                className="h-12 w-12 mb-3"
                style={{ color: "var(--admin-text-tertiary)" }}
              />
              <p
                className="text-sm font-medium"
                style={{ color: "var(--admin-text-secondary)" }}
              >
                No hay notificaciones
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--admin-text-tertiary)" }}
              >
                Te avisaremos cuando haya novedades
              </p>
            </div>
          ) : (
            <div
              style={{
                borderBottom: "1px solid var(--admin-border-secondary)",
              }}
            >
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type] || Info;
                const isUnread = !notification.is_read;

                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 transition-colors cursor-pointer",
                      isUnread && "bg-[var(--admin-bg-tertiary)]",
                    )}
                    style={{
                      borderBottom: "1px solid var(--admin-border-secondary)",
                    }}
                    onClick={() =>
                      markAsRead(notification.id, notification.action_url)
                    }
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
              })}
            </div>
          )}
        </ScrollArea>


      </DropdownMenuContent>
    </DropdownMenu>
  );
}
