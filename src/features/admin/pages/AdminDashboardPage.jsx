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
  ShieldCheck,
  AlertTriangle,
  Star,
  Wallet,
  Banknote,
  ArrowUpRight,
  ChevronRight,
  Activity,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "@/shared/services/api";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import { useAuth } from "@/shared/contexts/AuthContext";

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

const colorConfig = {
  blue: { bg: "bg-blue-50", text: "text-blue-600" },
  green: { bg: "bg-green-50", text: "text-green-600" },
  purple: { bg: "bg-purple-50", text: "text-purple-600" },
  orange: { bg: "bg-orange-50", text: "text-orange-600" },
  teal: { bg: "bg-teal-50", text: "text-teal-600" },
  amber: { bg: "bg-amber-50", text: "text-amber-600" },
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

function ChartTooltip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  const prev = payload[0].payload.prev;
  const delta = prev !== null && prev !== undefined ? (value - prev) / (prev || 1) : null;
  const deltaText =
    delta === null
      ? null
      : delta > 0
        ? `+${Math.round(delta * 100)}% vs mois préc.`
        : `${Math.round(delta * 100)}% vs mois préc.`;
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-lg px-3 py-2">
      <p className="text-xs font-semibold text-gray-900 capitalize">{label}</p>
      <p className="text-xs text-gray-700">
        <span className="font-bold" style={{ color: payload[0].stroke }}>
          {money ? formatCFA(value) : value.toLocaleString("fr-FR")}
        </span>
        {deltaText && (
          <span className={delta > 0 ? "text-green-600" : delta < 0 ? "text-red-500" : "text-gray-400"}>
            {" "}· {deltaText}
          </span>
        )}
      </p>
    </div>
  );
}

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const metricOptions = [
  { id: "products", label: "Annonces", icon: List, color: "#01796F" },
  { id: "users", label: "Inscriptions", icon: Users, color: "#2563eb" },
  { id: "sales", label: "Ventes", icon: TrendingUp, color: "#7c3aed" },
  { id: "views", label: "Vues", icon: EyeIcon, color: "#f59e0b" },
  { id: "volume", label: "Volume", icon: Wallet, color: "#0d9488", money: true },
  { id: "fees", label: "Frais", icon: Banknote, color: "#d97706", money: true },
];

function MetricLegend({ options, onToggle, hidden }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onToggle(opt.id)}
          className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-medium transition-opacity ${hidden.has(opt.id) ? "opacity-40 line-through" : "opacity-100"} hover:opacity-100`}
        >
          <span className="w-2.5 h-0.5 rounded-full inline-block" style={{ backgroundColor: opt.color }} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}

const activityFilters = [
  { id: "all", label: "Tous" },
  { id: "product", label: "Annonces" },
  { id: "user", label: "Utilisateurs" },
  { id: "escrow", label: "Transactions" },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityFilter, setActivityFilter] = useState("all");
  const [metric, setMetric] = useState("products");
  const [hiddenSeries, setHiddenSeries] = useState(() => new Set());

  const toggleSeries = (key) =>
    setHiddenSeries((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const { data: activityData } = useQuery({
    queryKey: ["adminActivity"],
    queryFn: () => api.get("/admin/activity").then((r) => r.data),
  });

  const { data: kycPendingCount } = useQuery({
    queryKey: ["adminKycPendingCount"],
    queryFn: () => api.get("/admin/kyc/pending?page=1&perPage=1").then((r) => r.data.meta.total),
    refetchInterval: 60000,
  });

  const { data: reportsCount } = useQuery({
    queryKey: ["adminReportsCount"],
    queryFn: () => api.get("/admin/reports?page=1&perPage=1").then((r) => r.data.meta.total),
    refetchInterval: 60000,
  });

  const statCards = stats
    ? [
        { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "blue", change: `+${stats.newUsersThisMonth} ce mois`, to: "/admin/users" },
        { label: "Annonces actives", value: stats.activeListings, icon: List, color: "green", change: `+${stats.newProductsThisMonth} ce mois`, to: "/admin/listings" },
        { label: "Ventes", value: stats.totalSales, icon: TrendingUp, color: "purple", change: `+${stats.salesThisMonth} ce mois`, to: "/admin/payments" },
        { label: "Vues", value: stats.totalViews, icon: EyeIcon, color: "orange", change: `${stats.totalProducts} annonces`, to: "/admin/listings" },
      ]
    : [];

  const financeCards = stats?.platformFees
    ? [
        { label: "Volume total", value: formatCFA(stats.platformFees.totalVolume), icon: Wallet, color: "teal" },
        { label: "Frais plateforme", value: formatCFA(stats.platformFees.totalFees), icon: Banknote, color: "amber" },
        { label: "Transactions", value: stats.platformFees.totalTransactions, icon: DollarSign, color: "purple" },
      ]
    : [];

  const toDoItems = [
    { label: "Vérifications KYC", count: kycPendingCount ?? 0, icon: ShieldCheck, color: "blue", to: "/admin/kyc" },
    { label: "Signalements", count: reportsCount ?? 0, icon: AlertTriangle, color: "amber", to: "/admin/reports" },
  ];

  const monthlyValues = stats?.monthlyData ?? [];
  const activeSeries = metricOptions.filter((o) => monthlyValues.some((m) => (m[o.id] ?? 0) > 0));
  const seriesMax = {};
  for (const opt of activeSeries) {
    seriesMax[opt.id] = Math.max(...monthlyValues.map((m) => m[opt.id] ?? 0), 1);
  }
  const chartData = monthlyValues.map((m, i) => {
    const monthNum = parseInt(m.month.split("-")[1], 10);
    const point = {
      ...m,
      label: months[monthNum - 1] ?? m.month,
      prev: i > 0 ? (monthlyValues[i - 1][metric] ?? 0) : null,
    };
    for (const opt of activeSeries) {
      point[`${opt.id}Pct`] = Math.round(((m[opt.id] ?? 0) / seriesMax[opt.id]) * 100);
    }
    return point;
  });
  const activeMetric = metricOptions.find((o) => o.id === metric) ?? metricOptions[0];
  const metricTotal = chartData.reduce((sum, m) => sum + (m[metric] ?? 0), 0);

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

  const filteredActivity = activityFilter === "all" ? allActivity : allActivity.filter((a) => a.type === activityFilter);

  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const firstName = user?.firstName || user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="space-y-4 sm:space-y-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4 sm:space-y-6"
      >
        {/* En-tête de bienvenue */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Bonjour, {firstName}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 capitalize">{today}</p>
          </div>
          <Link className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors" to="/">
            Voir le site public <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Stat Cards */}
        {statCards.length > 0 && (
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
            {statCards.map((stat, i) => {
              const colors = colorConfig[stat.color] ?? colorConfig.blue;
              return (
                <button
                  key={i}
                  onClick={() => navigate(stat.to)}
                  className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-5 border border-gray-200 shadow-sm text-left hover:border-brand-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 truncate">{stat.label}</p>
                      <p className="text-base sm:text-2xl font-bold text-gray-900 leading-tight">{stat.value?.toLocaleString() ?? "—"}</p>
                    </div>
                    <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${colors.bg} shrink-0`}>
                      <stat.icon className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${colors.text}`} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 sm:mt-3">
                    <p className="text-[10px] sm:text-xs font-medium text-green-600 truncate">{stat.change}</p>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Finance + À traiter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
          {/* Finances plateforme */}
          {financeCards.length > 0 && (
            <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Finances de la plateforme</h2>
                <Badge variant="primary">Escrow sécurisé</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {financeCards.map((card, i) => {
                  const colors = colorConfig[card.color] ?? colorConfig.teal;
                  return (
                    <div key={i} className="rounded-xl border border-gray-100 bg-gray-50/50 p-3 sm:p-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg} mb-2`}>
                        <card.icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <p className="text-base sm:text-xl font-bold text-gray-900 leading-tight truncate">{card.value?.toLocaleString() ?? "—"}</p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{card.label}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* À traiter */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">À traiter</h2>
            <div className="space-y-2">
              {toDoItems.map((item) => {
                const colors = colorConfig[item.color] ?? colorConfig.blue;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.to)}
                    className="w-full flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3 text-left hover:border-brand-300 hover:bg-brand-50/50 transition-all group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg} shrink-0`}>
                      <item.icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 flex-1">{item.label}</span>
                    <span className={`text-sm font-bold ${item.count > 0 ? "text-brand-600" : "text-gray-300"}`}>{item.count}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
              <p className="text-[10px] sm:text-xs text-gray-400 pt-1">Actualisation automatique toutes les 60 s</p>
            </div>
          </motion.div>
        </div>

        {/* Évolution mensuelle */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Évolution mensuelle</h2>
              <p className="text-[10px] sm:text-xs text-gray-400">
                {metric === "all"
                  ? "Toutes les métriques · 12 derniers mois · échelle normalisée (max = 100%)"
                  : (
                      <>
                        Total :{" "}
                        <span className="font-semibold text-gray-600">
                          {activeMetric.money ? formatCFA(metricTotal) : metricTotal.toLocaleString("fr-FR")}
                        </span>{" "}
                        · 12 derniers mois
                      </>
                    )}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5 overflow-x-auto hide-scrollbar">
              <button
                onClick={() => setMetric("all")}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  metric === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Activity className="w-3.5 h-3.5" style={{ color: metric === "all" ? "#111827" : undefined }} />
                Toutes
              </button>
              {metricOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMetric(opt.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] sm:text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    metric === opt.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <opt.icon className="w-3.5 h-3.5" style={{ color: metric === opt.id ? opt.color : undefined }} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {chartData.length > 0 && (metric === "all" ? activeSeries.length > 0 : activeSeries.some((o) => o.id === metric)) ? (
            <>
              {metric === "all" && (
                <div className="mb-2">
                  <MetricLegend options={activeSeries} onToggle={toggleSeries} hidden={hiddenSeries} />
                </div>
              )}
              <div className="h-48 sm:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 8, left: metric === "all" ? -8 : -14, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradAdmin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={activeMetric.color} stopOpacity={0.35} />
                        <stop offset="100%" stopColor={activeMetric.color} stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      width={45}
                      domain={metric === "all" ? [0, 100] : undefined}
                      tickFormatter={(v) => (metric === "all" ? `${v}%` : v >= 1000 ? `${Math.round(v / 1000)}k` : v)}
                    />
                    {metric === "all" ? (
                      <>
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (!active || !payload?.length) return null;
                            return (
                              <div className="bg-white rounded-lg border border-gray-200 shadow-lg px-3 py-2 min-w-[170px]">
                                <p className="text-xs font-semibold text-gray-900 capitalize mb-1">{label}</p>
                                <div className="space-y-0.5">
                                  {activeSeries
                                    .filter((o) => !hiddenSeries.has(o.id))
                                    .map((o) => (
                                      <div key={o.id} className="flex items-center justify-between gap-3">
                                        <span className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-500">
                                          <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: o.color }} />
                                          {o.label}
                                        </span>
                                        <span className="text-[10px] sm:text-xs font-semibold text-gray-800">
                                          {o.money ? formatCFA(payload[0].payload[o.id] ?? 0) : (payload[0].payload[o.id] ?? 0).toLocaleString("fr-FR")}
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            );
                          }}
                          cursor={{ stroke: "#9ca3af", strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        {activeSeries.map((opt) => (
                          <Area
                            key={opt.id}
                            type="monotone"
                            dataKey={`${opt.id}Pct`}
                            name={opt.label}
                            stroke={opt.color}
                            strokeWidth={2}
                            fill="transparent"
                            hide={hiddenSeries.has(opt.id)}
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 1.5, stroke: "#fff" }}
                            animationDuration={600}
                          />
                        ))}
                      </>
                    ) : (
                      <>
                        <Tooltip
                          content={<ChartTooltip money={activeMetric.money} />}
                          cursor={{ stroke: activeMetric.color, strokeWidth: 1, strokeDasharray: "4 4" }}
                        />
                        <Area
                          type="monotone"
                          dataKey={metric}
                          name={activeMetric.label}
                          stroke={activeMetric.color}
                          strokeWidth={2.5}
                          fill="url(#gradAdmin)"
                          dot={{ r: 3, fill: activeMetric.color, strokeWidth: 0 }}
                          activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }}
                          animationDuration={600}
                        />
                      </>
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-40 text-sm text-gray-400">
              {statsLoading ? "Chargement..." : "Pas encore de données pour cette métrique"}
            </div>
          )}
        </motion.div>

        {/* Activité récente */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Activité récente</h2>
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
              {activityFilters.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActivityFilter(f.id)}
                  className={`px-2.5 py-1 text-[10px] sm:text-xs font-medium rounded-md transition-colors ${
                    activityFilter === f.id ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {filteredActivity.length === 0 && (
              <p className="px-4 sm:px-6 py-8 text-center text-sm text-gray-400">Aucune activité récente</p>
            )}
            {filteredActivity.map((activity, i) => {
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

        {/* Meilleurs vendeurs */}
        {stats?.topSellers?.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Meilleurs vendeurs</h2>
              <Star className="h-4 w-4 text-amber-400" />
            </div>
            <div className="divide-y divide-gray-100">
              {stats.topSellers.slice(0, 5).map((seller, i) => (
                <button
                  key={seller.id}
                  onClick={() => navigate("/admin/users")}
                  className="w-full flex items-center gap-2.5 sm:gap-3 px-4 sm:px-6 py-2.5 sm:py-3 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="w-4 text-xs font-bold text-gray-300">{i + 1}</span>
                  <Avatar src={seller.avatar} name={`${seller.firstName} ${seller.lastName}`} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate">
                      {seller.firstName} {seller.lastName}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                      {seller.city ?? "—"} · {seller.productCount} annonces
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">
                      {Number(seller.ratingAvg).toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-400">({seller.reviewCount})</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {selectedActivity && (
        <ActivityModal activity={selectedActivity} onClose={() => setSelectedActivity(null)} />
      )}
    </div>
  );
}