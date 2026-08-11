import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  List,
  TrendingUp,
  Clock,
  Package,
  DollarSign,
  Eye as EyeIcon,
  X,
  MapPin,
  Mail,
  Calendar,
  Tag,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/shared/services/api";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const activityConfig = {
  product: { icon: Package, color: "text-brand-600", bg: "bg-brand-50" },
  user: { icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
  escrow: { icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
};

const statusLabels = {
  active: "Actif",
  reserved: "Réservé",
  pending: "En attente",
  completed: "Complété",
  paid: "Payé",
  pending_delivery: "En livraison",
  delivered: "Livré",
  disputed: "Litige",
  refunded: "Remboursé",
  cancelled: "Annulé",
  sold: "Vendu",
  rejected: "Rejeté",
};

const statusColors = {
  active: "success",
  reserved: "warning",
  pending: "warning",
  completed: "success",
  paid: "primary",
  pending_delivery: "warning",
  delivered: "success",
  disputed: "danger",
  refunded: "danger",
  cancelled: "secondary",
  sold: "primary",
  rejected: "danger",
};

function ActivityModal({ activity, onClose }) {
  const navigate = useNavigate();
  if (!activity) return null;

  const config = activityConfig[activity.type] ?? activityConfig.product;
  const IconComp = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg}`}>
              <IconComp className={`w-5 h-5 ${config.color}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {activity.type === "product" && "Annonce"}
                {activity.type === "user" && "Utilisateur"}
                {activity.type === "escrow" && "Transaction"}
              </p>
              <p className="text-xs text-gray-400">{formatRelativeTime(activity.time)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {activity.type === "product" && activity.raw && (
            <>
              <div className="flex items-center gap-3">
                <Avatar src={activity.raw.user?.avatar} name={`${activity.raw.user?.firstName} ${activity.raw.user?.lastName}`} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.raw.user?.firstName} {activity.raw.user?.lastName}</p>
                  <p className="text-xs text-gray-400">Vendeur</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <p className="text-sm font-semibold text-gray-900">{activity.raw.title}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{formatCFA(activity.raw.price)}</span>
                  <Badge variant={statusColors[activity.raw.status] ?? "secondary"}>
                    {statusLabels[activity.raw.status] ?? activity.raw.status}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate(`/admin/listings`); }}
                className="w-full text-center text-xs text-brand-600 hover:underline py-1"
              >
                Voir dans les annonces →
              </button>
            </>
          )}

          {activity.type === "user" && activity.raw && (
            <>
              <div className="flex items-center gap-3">
                <Avatar src={activity.raw.avatar} name={`${activity.raw.firstName} ${activity.raw.lastName}`} size="md" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{activity.raw.firstName} {activity.raw.lastName}</p>
                  <p className="text-xs text-gray-400">Nouvel utilisateur</p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{activity.raw.email}</span>
                </div>
                {activity.raw.city && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{activity.raw.city}, Togo</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(activity.raw.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate(`/admin/users`); }}
                className="w-full text-center text-xs text-brand-600 hover:underline py-1"
              >
                Voir dans les utilisateurs →
              </button>
            </>
          )}

          {activity.type === "escrow" && activity.raw && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 mb-1">Vendeur</p>
                  <div className="flex items-center gap-2">
                    <Avatar src={activity.raw.seller?.avatar} name={`${activity.raw.seller?.firstName} ${activity.raw.seller?.lastName}`} size="xs" />
                    <p className="text-xs font-medium text-gray-900 truncate">{activity.raw.seller?.firstName} {activity.raw.seller?.lastName}</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 mb-1">Acheteur</p>
                  <div className="flex items-center gap-2">
                    <Avatar src={activity.raw.buyer?.avatar} name={`${activity.raw.buyer?.firstName} ${activity.raw.buyer?.lastName}`} size="xs" />
                    <p className="text-xs font-medium text-gray-900 truncate">{activity.raw.buyer?.firstName} {activity.raw.buyer?.lastName}</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <p className="text-sm font-semibold text-gray-900">{activity.raw.product?.title}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{formatCFA(activity.raw.amount)}</span>
                  {activity.raw.fee && <span>Frais : {formatCFA(activity.raw.fee)}</span>}
                  <Badge variant={statusColors[activity.raw.status] ?? "secondary"}>
                    {statusLabels[activity.raw.status] ?? activity.raw.status}
                  </Badge>
                </div>
              </div>
              <button
                onClick={() => { onClose(); navigate(`/admin/payments`); }}
                className="w-full text-center text-xs text-brand-600 hover:underline py-1"
              >
                Voir dans les paiements →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function AdminDashboardPage() {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const { data: activityData } = useQuery({
    queryKey: ["adminActivity"],
    queryFn: () => api.get("/admin/activity").then((r) => r.data),
  });

  const statCards = stats
    ? [
        { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "blue", change: `+${stats.newUsersThisMonth} ce mois` },
        { label: "Annonces", value: stats.activeListings, icon: List, color: "green", change: `+${stats.newProductsThisMonth} ce mois` },
        { label: "Ventes", value: stats.totalSales, icon: TrendingUp, color: "purple", change: `+${stats.salesThisMonth} ce mois` },
        { label: "Vues", value: stats.totalViews, icon: EyeIcon, color: "orange", change: `${stats.totalProducts} annonces` },
      ]
    : [];

  const monthlyValues = stats?.monthlyData ?? [];
  const maxMonthly = Math.max(...monthlyValues.map((m) => m.products), 1);

  const recentProducts = activityData?.recentProducts ?? [];
  const recentUsers = activityData?.recentUsers ?? [];
  const recentEscrows = activityData?.recentEscrows ?? [];

  const allActivity = [
    ...recentProducts.map((p) => ({
      type: "product",
      text: `${p.title} — ${p.user.firstName} ${p.user.lastName}`,
      time: p.createdAt,
      amount: p.price,
      raw: p,
    })),
    ...recentUsers.map((u) => ({
      type: "user",
      text: `${u.firstName} ${u.lastName} inscrit`,
      time: u.createdAt,
      raw: u,
    })),
    ...recentEscrows.map((e) => ({
      type: "escrow",
      text: `${e.product.title} — ${e.buyer.firstName} → ${e.seller.firstName}`,
      time: e.createdAt,
      amount: e.amount,
      raw: e,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6"
      >
        {/* Stat Cards */}
        {statCards.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between gap-1.5">
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 truncate">{stat.label}</p>
                    <p className="text-base sm:text-2xl font-bold text-gray-900 leading-tight">{stat.value?.toLocaleString() ?? "—"}</p>
                  </div>
                  <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center bg-${stat.color}-50 shrink-0`}>
                    <stat.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 text-${stat.color}-600`} />
                  </div>
                </div>
                <p className="text-[10px] sm:text-xs mt-1.5 sm:mt-3 font-medium text-green-600 truncate">{stat.change}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Annonces mensuelles */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
        >
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">Annonces mensuelles</h2>
          {monthlyValues.length > 0 ? (
            <>
              <div className="flex items-end gap-1 sm:gap-2" style={{ height: 160 }}>
                {monthlyValues.map((m, i) => {
                  const pct = Math.round((m.products / maxMonthly) * 100);
                  return (
                    <motion.div
                      key={m.month}
                      initial={{ height: 0 }}
                      animate={{ height: `${pct}%` }}
                      transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                      className="flex-1 rounded-t-md sm:rounded-t-lg bg-brand-500 min-w-0"
                      title={`${m.products} annonces — ${m.month}`}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between text-[10px] sm:text-[11px] text-gray-400 overflow-hidden">
                {monthlyValues.map((m) => {
                  const monthNum = parseInt(m.month.split("-")[1], 10);
                  return <span key={m.month} className="truncate">{months[monthNum - 1]}</span>;
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              {statsLoading ? "Chargement..." : "Aucune donnée"}
            </div>
          )}
        </motion.div>

        {/* Activité récente */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Activité récente</h2>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="divide-y divide-gray-100">
            {allActivity.length === 0 && (
              <p className="px-4 sm:px-6 py-8 text-center text-sm text-gray-400">Aucune activité récente</p>
            )}
            {allActivity.map((activity, i) => {
              const config = activityConfig[activity.type] ?? activityConfig.product;
              const IconComp = config.icon;
              return (
                <div
                  key={i}
                  onClick={() => setSelectedActivity(activity)}
                  className="flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                    <IconComp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${config.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm text-gray-700 truncate">{activity.text}</p>
                    <p className="text-[10px] sm:text-xs text-gray-400">{formatRelativeTime(activity.time)}</p>
                  </div>
                  {activity.amount && (
                    <span className="text-[10px] sm:text-xs font-medium text-green-600 whitespace-nowrap shrink-0">
                      +{formatCFA(activity.amount)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </motion.div>

      {selectedActivity && (
        <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}
