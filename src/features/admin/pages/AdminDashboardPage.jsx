import { motion } from "framer-motion";
import {
  Users,
  List,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Check,
  X,
  Shield,
  Eye,
  Ban,
  UserCheck,
  Clock,
  BarChart3,
  Package,
  Eye as EyeIcon,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";
import api from "@/shared/services/api";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import toast from "react-hot-toast";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const activityConfig = {
  product: { icon: Package, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  user: { icon: Users, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  escrow: { icon: DollarSign, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
};

const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function AdminDashboardPage() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: () => api.get("/admin/stats").then((r) => r.data),
  });

  const { data: activityData } = useQuery({
    queryKey: ["adminActivity"],
    queryFn: () => api.get("/admin/activity").then((r) => r.data),
  });

  const { data: usersData } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: () => api.get("/admin/users").then((r) => r.data),
  });
  const users = usersData?.data ?? [];

  const { data: pendingVerificationsData } = useQuery({
    queryKey: ["adminPendingVerifications"],
    queryFn: () => api.get("/admin/kyc/pending").then((r) => r.data),
  });
  const pendingVerifications = pendingVerificationsData?.data ?? [];

  const { data: productsData } = useQuery({
    queryKey: ["adminProducts"],
    queryFn: () => api.get("/admin/products").then((r) => r.data),
  });
  const pendingListings = (productsData?.data ?? []).filter((p) => p.status === "pending");

  const { data: categoriesData } = useQuery({
    queryKey: ["adminCategories"],
    queryFn: () => api.get("/categories").then((r) => r.data),
  });
  const categories = categoriesData?.data ?? (Array.isArray(categoriesData) ? categoriesData : []);

  const displayedUsers = users.slice(0, 10);

  const toggleUserStatus = useMutation({
    mutationFn: ({ userId, isActive }) =>
      api.put(`/admin/users/${userId}/status`, { isActive }).then((r) => r.data),
    onSuccess: (_, { isActive }) => {
      toast.success(isActive ? "Utilisateur activé" : "Utilisateur désactivé");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const changeUserRole = useMutation({
    mutationFn: ({ userId, role }) =>
      api.put(`/admin/users/${userId}/role`, { role }).then((r) => r.data),
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: () => toast.error("Erreur lors du changement de rôle"),
  });

  const updateProductStatus = useMutation({
    mutationFn: ({ productId, status }) =>
      api.put(`/admin/products/${productId}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const approveKycMutation = useMutation({
    mutationFn: (kycId) => api.put(`/admin/kyc/${kycId}/approve`).then((r) => r.data),
    onSuccess: () => {
      toast.success("KYC approuvé");
      queryClient.invalidateQueries({ queryKey: ["adminPendingVerifications"] });
    },
    onError: () => toast.error("Erreur lors de l'approbation"),
  });

  const rejectKycMutation = useMutation({
    mutationFn: ({ kycId, reason }) =>
      api.put(`/admin/kyc/${kycId}/reject`, { reason }).then((r) => r.data),
    onSuccess: () => {
      toast.success("KYC rejeté");
      queryClient.invalidateQueries({ queryKey: ["adminPendingVerifications"] });
    },
    onError: () => toast.error("Erreur lors du rejet"),
  });

  const statCards = stats
    ? [
        { label: "Utilisateurs", value: stats.totalUsers, icon: Users, color: "blue", change: `+${stats.newUsersThisMonth} ce mois` },
        { label: "Annonces actives", value: stats.activeListings, icon: List, color: "green", change: `+${stats.newProductsThisMonth} ce mois` },
        { label: "Ventes", value: stats.totalSales, icon: TrendingUp, color: "blue", change: `+${stats.salesThisMonth} ce mois` },
        { label: "Vues totales", value: stats.totalViews, icon: EyeIcon, color: "purple", change: `${stats.totalProducts} annonces` },
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
      status: p.status,
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
      status: e.status,
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
          <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-brand-900 rounded-xl p-4 border border-brand-800">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold text-white">{stat.value?.toLocaleString() ?? "—"}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-500/10`}>
                    <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                  </div>
                </div>
                <p className="text-xs mt-2 font-medium text-brand-600">{stat.change}</p>
              </div>
            ))}
          </motion.div>
        )}

        {/* Users Management */}
        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-gray-800 bg-gray-900"
        >
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
            <h2 className="text-lg font-semibold text-white">Gestion des utilisateurs</h2>
            <Badge variant="primary">{displayedUsers.length}</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Rôle</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Inscrit</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {displayedUsers.map((user) => (
                  <tr key={user.id} className="transition-colors hover:bg-gray-800/50">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                        <span className="text-sm font-medium text-white">{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-3">
                      <select
                        value={user.role}
                        onChange={(e) => changeUserRole.mutate({ userId: user.id, role: e.target.value })}
                        className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer ${
                          user.role === "admin"
                            ? "bg-purple-500/10 text-purple-400"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        <option value="user">Utilisateur</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant={user.isActive ? "success" : "danger"}
                        dot
                      >
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-500">
                      {formatRelativeTime(user.createdAt)}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleUserStatus.mutate({ userId: user.id, isActive: !user.isActive })}
                          className={`rounded-lg p-1.5 transition-colors ${
                            user.isActive
                              ? "text-red-400 hover:bg-red-700/10"
                              : "text-brand-600 hover:bg-brand-700/10"
                          }`}
                          title={user.isActive ? "Désactiver" : "Activer"}
                        >
                          {user.isActive ? <Ban className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Listings */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Annonces en attente</h2>
              <Badge variant="warning" dot>{pendingListings.length}</Badge>
            </div>
            <div className="divide-y divide-gray-800">
              {pendingListings.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune annonce en attente</p>
              )}
              {pendingListings.map((listing) => (
                <div key={listing.id} className="px-6 py-4">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">{listing.title}</p>
                      <p className="mt-1 text-xs text-gray-500">
                        {formatCFA(listing.price)} · {listing.category?.name ?? "—"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        par {listing.user?.firstName} {listing.user?.lastName} · {formatRelativeTime(listing.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateProductStatus.mutate({ productId: listing.id, status: "active" })}
                        className="rounded-lg bg-brand-700/10 p-1.5 text-brand-600 transition-colors hover:bg-brand-700/20"
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => updateProductStatus.mutate({ productId: listing.id, status: "rejected" })}
                        className="rounded-lg bg-red-700/10 p-1.5 text-red-400 transition-colors hover:bg-red-700/20"
                        title="Rejeter"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Category Management */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Catégories</h2>
              <Badge variant="secondary">{categories.length}</Badge>
            </div>
            <div className="max-h-[360px] divide-y divide-gray-800 overflow-y-auto">
              {categories.slice(0, 12).map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-gray-800/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-sm"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <span style={{ color: cat.color }}>
                        {cat.icon === "Smartphone" ? "📱" : cat.icon === "Car" ? "🚗" : cat.icon === "Laptop" ? "💻" : "📦"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{cat.name}</p>
                      <p className="text-xs text-gray-500">{cat.productCount} annonces</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* KYC Moderation */}
        {pendingVerifications.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Vérifications KYC en attente</h2>
              <Badge variant="warning" dot>{pendingVerifications.length}</Badge>
            </div>
            <div className="divide-y divide-gray-800">
              {pendingVerifications.map((verification) => (
                <div key={verification.id} className="px-6 py-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white">{verification.user.firstName} {verification.user.lastName}</p>
                        <Badge variant="secondary" size="sm">{verification.documentType}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Soumis {formatRelativeTime(verification.submittedAt)}
                      </p>
                      <div className="mt-3 flex gap-2">
                        {verification.selfieUrl && (
                          <img src={verification.selfieUrl} alt="Selfie" className="h-16 w-16 rounded-lg object-cover" />
                        )}
                        {verification.documentFrontUrl && (
                          <img src={verification.documentFrontUrl} alt="Document" className="h-16 w-16 rounded-lg object-cover" />
                        )}
                        {verification.documentBackUrl && (
                          <img src={verification.documentBackUrl} alt="Document (verso)" className="h-16 w-16 rounded-lg object-cover" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => approveKycMutation.mutate(verification.id)}
                        disabled={approveKycMutation.isPending}
                        className="rounded-lg bg-brand-700/10 p-2 text-brand-600 transition-colors hover:bg-brand-700/20 disabled:opacity-50"
                        title="Approuver"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => rejectKycMutation.mutate({ kycId: verification.id, reason: "Documents non conformes" })}
                        disabled={rejectKycMutation.isPending}
                        className="rounded-lg bg-red-700/10 p-2 text-red-400 transition-colors hover:bg-red-700/20 disabled:opacity-50"
                        title="Rejeter"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Chart (real data from stats) */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
          >
            <h2 className="mb-4 text-lg font-semibold text-white">Annonces mensuelles</h2>
            {monthlyValues.length > 0 ? (
              <>
                <div className="flex items-end gap-2" style={{ height: 180 }}>
                  {monthlyValues.map((m, i) => {
                    const pct = Math.round((m.products / maxMonthly) * 100);
                    return (
                      <motion.div
                        key={m.month}
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                        className="flex-1 rounded-t-lg bg-brand-800"
                        title={`${m.products} annonces — ${m.month}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-gray-500 overflow-hidden">
                  {monthlyValues.map((m) => {
                    const monthNum = parseInt(m.month.split("-")[1], 10);
                    return <span key={m.month}>{months[monthNum - 1]}</span>;
                  })}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[180px] text-sm text-gray-500">
                {statsLoading ? "Chargement..." : "Aucune donnée"}
              </div>
            )}
          </motion.div>

          {/* Recent Activity (real data) */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-800 bg-gray-900"
          >
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <h2 className="text-lg font-semibold text-white">Activité récente</h2>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <div className="divide-y divide-gray-800">
              {allActivity.length === 0 && (
                <p className="px-6 py-8 text-center text-sm text-gray-500">Aucune activité récente</p>
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
                      <p className="text-sm text-gray-300 truncate">{activity.text}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(activity.time)}</p>
                    </div>
                    {activity.amount && (
                      <span className="text-xs font-medium text-brand-600 whitespace-nowrap">
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
