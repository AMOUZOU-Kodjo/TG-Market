import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  TrendingDown,
  Star,
  Package,
  Megaphone,
  UserPlus,
  Check,
  CheckCheck,
  Trash2,
  Filter,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import EmptyState from "@/shared/ui/EmptyState";
import Avatar from "@/shared/ui/Avatar";
import { formatRelativeTime } from "@/shared/utils/format";

const notificationTypes = {
  message: { icon: MessageCircle, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  price_drop: { icon: TrendingDown, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  review: { icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
  sold: { icon: Package, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  system: { icon: Megaphone, color: "text-brand-800", bg: "bg-brand-50 dark:bg-brand-800/10" },
  follower: { icon: UserPlus, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
};

const initialNotifications = [
  {
    id: 1,
    type: "message",
    title: "Nouveau message de Kofi AmÃ©yo",
    description: "Oui, je peux vous l'envoyer demain matin. Quel est votre adresse ?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=2",
    productName: "Samsung Galaxy S24 Ultra 256GB",
  },
  {
    id: 2,
    type: "price_drop",
    title: "Baisse de prix !",
    description: "Le prix de Â« PS5 + 2 Manettes + 3 Jeux Â» a baissÃ© de 450 000 Ã  380 000 FCFA.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: false,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    type: "review",
    title: "Nouvel avis reÃ§u",
    description: "KÃ©vin AgbÃ©kÃ© a laissÃ© un avis 5 Ã©toiles sur votre annonce Â« PS5 + 2 Manettes + 3 Jeux Â».",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    read: false,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&facepad=3",
  },
  {
    id: 4,
    type: "sold",
    title: "Annonce vendue !",
    description: "FÃ©licitations ! Votre Â« iPhone 15 Pro Max Â» a Ã©tÃ© marquÃ© comme vendu.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    type: "system",
    title: "Mise Ã  jour d'TG-Market",
    description: "Nouvelle fonctionnalitÃ© : paiement sÃ©curisÃ© via T-Money et Moov Money. DÃ©couvrez-le !",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 6,
    type: "follower",
    title: "Nouvel abonnÃ©",
    description: "Efua Semonu suit maintenant votre profil.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&facepad=2",
  },
  {
    id: 7,
    type: "message",
    title: "Nouveau message de Yao Agbeko",
    description: "Merci pour l'info. Je vais visiter le weekend prochain.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&facepad=2",
    productName: "Appartement 3 chambres",
  },
  {
    id: 8,
    type: "price_drop",
    title: "Baisse de prix !",
    description: "Le prix de Â« Kit Panneaux Solaires 300W Â» a baissÃ© de 750 000 Ã  650 000 FCFA.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=100&h=100&fit=crop",
  },
  {
    id: 9,
    type: "review",
    title: "Nouvel avis reÃ§u",
    description: "Abra Povi a laissÃ© un avis 4 Ã©toiles sur Â« Pagne Wax Hollandais 6 yards Â».",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&facepad=2",
  },
  {
    id: 10,
    type: "follower",
    title: "Nouvel abonnÃ©",
    description: "Massa Houndjro suit maintenant votre profil.",
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&facepad=3",
  },
];

const listVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) {
    return (
      <div className="min-h-[60vh]">
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Vous Ãªtes Ã  jour ! Les nouvelles activitÃ©s apparaÃ®tront ici."
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
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
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
        className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900"
      >
        <AnimatePresence mode="popLayout">
          {filteredNotifications.map((notification) => {
            const typeConfig = notificationTypes[notification.type];
            const IconComponent = typeConfig.icon;

            return (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                exit={{ opacity: 0, x: -20, height: 0 }}
                layout
                onClick={() => markAsRead(notification.id)}
                className={`relative flex cursor-pointer gap-4 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                  !notification.read
                    ? "bg-brand-50/50 dark:bg-brand-800/5"
                    : ""
                }`}
              >
                {!notification.read && (
                  <div className="absolute left-1.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-800" />
                )}

                <div className="shrink-0">
                  {notification.avatar ? (
                    <Avatar src={notification.avatar} size="md" />
                  ) : notification.image ? (
                    <img
                      src={notification.image}
                      alt=""
                      className="h-10 w-10 rounded-xl object-cover"
                    />
                  ) : (
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${typeConfig.bg}`}>
                      <IconComponent className={`h-5 w-5 ${typeConfig.color}`} />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    {notification.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                    {notification.description}
                  </p>
                  {notification.productName && (
                    <p className="mt-1 text-xs text-brand-800">
                      {notification.productName}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-gray-400 dark:text-gray-500">
                    {formatRelativeTime(notification.timestamp)}
                  </p>
                </div>

                <div className="flex shrink-0 items-start gap-1">
                  <div className={`rounded-lg p-1.5 ${typeConfig.bg}`}>
                    <IconComponent className={`h-4 w-4 ${typeConfig.color}`} />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-brand-50 hover:text-brand-700 group-hover:opacity-100 dark:hover:bg-brand-700/10 dark:hover:text-brand-400"
                    style={{ opacity: 1 }}
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
