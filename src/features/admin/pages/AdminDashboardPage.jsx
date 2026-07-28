import { motion } from "framer-motion";
import {
  Users,
  List,
  TrendingUp,
  Clock,
  Package,
  DollarSign,
  Eye as EyeIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";

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

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function AdminDashboardPage() {
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
        { label: "Annonces actives", value: stats.activeListings, icon: List, color: "green", change: `+${stats.newProductsThisMonth} ce mois` },
        { label: "Ventes", value: stats.totalSales, icon: TrendingUp, color: "purple", change: `+${stats.salesThisMonth} ce mois` },
        { label: "Vues totales", value: stats.totalViews, icon: EyeIcon, color: "orange", change: `${stats.totalProducts} annonces` },
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
      text: `${p.title} ajouté par ${p.user.firstName} ${p.user.lastName}`,
      time: p.createdAt,
      amount: p.price,
    })),
    ...recentUsers.map((u) => ({
      type: "user",
      text: `${u.firstName} ${u.lastName} s'est inscrit`,
      time: u.createdAt,
    })),
    ...recentEscrows.map((e) => ({
      type: "escrow",
      text: `Vente de ${e.product.title} — ${e.buyer.firstName} → ${e.seller.firstName}`,
      time: e.createdAt,
      amount: e.amount,
    })),
  ]
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Stat Cards */}
        {statCards.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value?.toLocaleString() ?? "—"}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${stat.color}-50`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                  </div>
                </div>
                <p className="text-xs mt-3 font-medium text-green-600">{stat.change}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Annonces mensuelles + Activité récente */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Annonces mensuelles */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Annonces mensuelles</h2>
            {monthlyValues.length > 0 ? (
              <>
                <div className="flex items-end gap-2" style={{ height: 200 }}>
                  {monthlyValues.map((m, i) => {
                    const pct = Math.round((m.products / maxMonthly) * 100);
                    return (
                      <motion.div
                        key={m.month}
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                        className="flex-1 rounded-t-lg bg-brand-500"
                        title={`${m.products} annonces — ${m.month}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-3 flex justify-between text-[11px] text-gray-400 overflow-hidden">
                  {monthlyValues.map((m) => {
                    const monthNum = parseInt(m.month.split("-")[1], 10);
                    return <span key={m.month}>{months[monthNum - 1]}</span>;
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-sm text-gray-400">
                {statsLoading ? "Chargement..." : "Aucune donnée"}
              </div>
            )}
          </motion.div>

          {/* Activité récente */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="divide-y divide-gray-100">
              {allActivity.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-gray-400">Aucune activité récente</p>
              )}
              {allActivity.map((activity, i) => {
                const config = activityConfig[activity.type] ?? activityConfig.product;
                const IconComp = config.icon;
                return (
                  <div key={i} className="flex items-center gap-3 px-6 py-3">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                      <IconComp className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-700 truncate">{activity.text}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(activity.time)}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-xs font-medium text-green-600 whitespace-nowrap">
                        +{formatCFA(activity.amount)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
