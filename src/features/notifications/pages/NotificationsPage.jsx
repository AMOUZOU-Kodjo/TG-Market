import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  TrendingDown,
  Star,
  Package,
  Megaphone,
  UserPlus,
  CheckCheck,
  Trash2,
  Heart,
  ShoppingCart,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import EmptyState from "@/shared/ui/EmptyState";
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/features/notifications/hooks/useNotifications";
import { useNotificationContext } from "@/shared/hooks/useNotificationContext";
import { formatRelativeTime } from "@/shared/utils/format";
import { notificationsApi } from "@/features/notifications/services/notifications.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const notificationTypes = {
  message: { icon: MessageCircle, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10", link: true },
  price_drop: { icon: TrendingDown, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  review: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  sold: { icon: Package, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  system: { icon: Megaphone, color: "text-brand-800", bg: "bg-brand-50 dark:bg-brand-800/10" },
  follower: { icon: UserPlus, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  sale: { icon: ShoppingCart, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  favorite: { icon: Heart, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  order: { icon: ShoppingCart, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  view: { icon: TrendingDown, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
};

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: notificationsData, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const { markAsRead: socketMarkAsRead, markAllAsRead: socketMarkAllAsRead } = useNotificationContext();

  const notifications = notificationsData?.data ?? [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const handleMarkAsRead = (id) => {
    socketMarkAsRead(id);
    markRead.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    socketMarkAllAsRead();
    markAllRead.mutate();
  };

  const handleDelete = async (id) => {
    try {
      await notificationsApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unreadNotificationCount"] });
      toast.success("Notification supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh]">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
                <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  <div className="h-3 w-72 animate-pulse rounded bg-gray-100 dark:bg-gray-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Vous êtes à jour ! Les nouvelles activités apparaîtront ici."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={handleMarkAllAsRead}>
            Tout marquer comme lu
          </Button>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
        {[
          { id: "all", label: "Toutes" },
          { id: "unread", label: "Non lues", count: unreadCount },
          { id: "read", label: "Lues" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === f.id
                ? "bg-brand-800 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            }`}
          >
            {f.label}
            {f.count > 0 && (
              <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-[10px]">
                {f.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-800"
      >
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => {
            const typeConfig = notificationTypes[notification.type] || notificationTypes.system;
            const IconComponent = typeConfig.icon;

            const convId = notification.metadata?.conversationId;
            const isMessage = notification.type === "message" && convId;

            const mainContent = (
              <>
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-800" />
                )}

                <div className="shrink-0">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeConfig.bg}`}>
                    <IconComponent className={`h-5 w-5 ${typeConfig.color}`} />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {notification.title}
                  </p>
                  {notification.description && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                      {notification.description}
                    </p>
                  )}
                  {notification.productName && (
                    <p className="mt-1 text-xs text-brand-800">
                      {notification.productName}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </>
            );

            return (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                exit={{ opacity: 0, x: -20, height: 0 }}
                layout
                className={`relative flex cursor-pointer gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  !notification.read
                    ? "bg-brand-50/50 dark:bg-brand-800/5"
                    : ""
                }`}
              >
                {isMessage ? (
                  <Link
                    to={`/messages/${convId}`}
                    className="flex flex-1 items-center gap-4 min-w-0"
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    {mainContent}
                  </Link>
                ) : (
                  <div
                    className="flex flex-1 items-center gap-4 min-w-0"
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  >
                    {mainContent}
                  </div>
                )}

                <div className="flex shrink-0 items-start gap-1">
                  <div className={`rounded-lg p-1.5 ${typeConfig.bg}`}>
                    <IconComponent className={`h-4 w-4 ${typeConfig.color}`} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification.id);
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredNotifications.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {filter === "unread"
              ? "Toutes les notifications sont lues."
              : "Aucune notification lue pour le moment."}
          </p>
        </div>
      )}
    </div>
  );
}
