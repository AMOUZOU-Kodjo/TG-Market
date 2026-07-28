import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  Bell,
  User,
  Handshake,
  CheckCircle,
  XCircle,
  MessageCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import ProductTable from "@/features/dashboard/components/ProductTable";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useEscrowList, useWalletBalance } from "@/features/wallet/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import UserProfilePage from "@/features/profile/pages/UserProfilePage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";
import { useReceivedBundleProposals, useAcceptBundleProposal, useRejectBundleProposal } from "@/features/bundles/hooks/useBundleProposals";

const escrowStatusConfig = {
  completed: { label: "Terminée", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  paid: { label: "Payée", variant: "primary" },
  pending_delivery: { label: "Expédiée", variant: "info" },
  delivered: { label: "Livrée", variant: "info" },
  disputed: { label: "Litige", variant: "danger" },
  cancelled: { label: "Annulée", variant: "danger" },
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
          Annonces récentes
        </h3>
        <ProductTable />
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Mes annonces
        </h3>
        <button
          onClick={() => (window.location.href = "/publier")}
          className="flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors"
        >
          <Package className="h-4 w-4" />
          Nouvelle annonce
        </button>
      </div>
      <ProductTable />
    </div>
  );
}

function OrdersTab() {
  const navigate = useNavigate();
  const { data: escrowData, isLoading } = useEscrowList();
  const escrows = escrowData?.data ?? escrowData?.escrows ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Mes commandes
      </h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : escrows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Commande
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Produit
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                    Acheteur
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                    Montant
                  </th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {escrows.map((order) => {
                  const status = escrowStatusConfig[order.status] || {
                    label: order.status,
                    variant: "neutral",
                  };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 cursor-pointer" onClick={() => navigate(`/commandes/${order.id}`)}>
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.toString().slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {order.productTitle}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 sm:table-cell">
                        {order.buyerName}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white md:table-cell">
                        {formatCFA(order.amount)}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                        {formatRelativeTime(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={status.variant} dot>
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function BundleProposalsTab() {
  const navigate = useNavigate();
  const { data, isLoading } = useReceivedBundleProposals();
  const acceptProposal = useAcceptBundleProposal();
  const rejectProposal = useRejectBundleProposal();
  const proposals = data?.data ?? [];

  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal.mutateAsync(proposalId);
    } catch {
      // toast already handled
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await rejectProposal.mutateAsync(proposalId);
    } catch {
      // toast already handled
    }
  };

  const proposalStatusBadge = (status) => {
    const map = {
      pending: { label: "En attente", icon: Clock, class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      accepted: { label: "Acceptée", icon: CheckCircle, class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      rejected: { label: "Refusée", icon: XCircle, class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
      cancelled: { label: "Annulée", icon: XCircle, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.class}`}>
        <s.icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Propositions de lots
      </h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <Handshake className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune proposition reçue</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Acheteur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lot</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">Montant proposé</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {proposals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      <button onClick={() => navigate(`/vendeur/${p.buyerId}`)} className="hover:underline">
                        {[p.buyer?.firstName, p.buyer?.lastName].filter(Boolean).join(" ") || "Acheteur"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <button onClick={() => navigate(`/lot/${p.bundleId}`)} className="hover:text-brand-800 dark:hover:text-brand-600">
                        {p.bundle?.title ?? `Lot #${p.bundleId}`}
                      </button>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                      {formatCFA(p.proposedPrice)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                      {formatRelativeTime(p.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {proposalStatusBadge(p.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleAccept(p.id)}
                            disabled={acceptProposal.isPending}
                            className="rounded-lg bg-green-50 p-1.5 text-green-700 hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            title="Accepter"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            disabled={rejectProposal.isPending}
                            className="rounded-lg bg-red-50 p-1.5 text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                            title="Refuser"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          {p.message && (
                            <div className="group relative">
                              <button className="rounded-lg bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700" title="Message">
                                <MessageCircle className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 top-full z-10 mt-1 hidden w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {p.message}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsTab() {
  const { data: myProductsData } = useMyProducts();
  const { data: walletData } = useWalletBalance();
  const products = myProductsData?.data ?? [];

  const topProducts = [...products]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5);
  const maxViews = Math.max(...topProducts.map((p) => p.views || 0), 1);

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Statistiques
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {(myProductsData?.data?.reduce((s, p) => s + (p.views || 0), 0) ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenus totaux</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatCFA(walletData?.totalEarned ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">Annonces actives</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
        <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
          Produits les plus vus
        </h4>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune donnée disponible</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700 dark:text-gray-300">{p.title}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-brand-700"
                      style={{ width: `${((p.views || 0) / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{p.views || 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilTab() {
  return <UserProfilePage />;
}

function NotificationsTab() {
  return <NotificationsPage />;
}

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "products", label: "Mes annonces", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "bundleProposals", label: "Propositions", icon: Handshake },
  { id: "analytics", label: "Statistiques", icon: TrendingUp },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "profile", label: "Profil", icon: User },
];

export default function SellerDashboardPage({ defaultTab = "overview" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabContent = {
    overview: <OverviewTab />,
    products: <ProductsTab />,
    orders: <OrdersTab />,
    bundleProposals: <BundleProposalsTab />,
    analytics: <AnalyticsTab />,
    notifications: <NotificationsTab />,
    profile: <ProfilTab />,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de bord
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez vos annonces, commandes et statistiques.
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 dark:border-gray-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "text-brand-800"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="dashboard-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-brand-800"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tabContent[activeTab]}
      </motion.div>
    </div>
  );
}
