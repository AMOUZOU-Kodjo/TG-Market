import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  BarChart3,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import ProductTable from "@/features/dashboard/components/ProductTable";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useEscrowList, useWalletBalance } from "@/features/wallet/hooks/useWallet";
import UserProfilePage from "@/features/profile/pages/UserProfilePage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";

const escrowStatusConfig = {
  completed: { label: "Livrée", variant: "success" },
  pending: { label: "En attente", variant: "warning" },
  confirmed: { label: "Confirmée", variant: "primary" },
  disputed: { label: "Litige", variant: "danger" },
  cancelled: { label: "Annulée", variant: "danger" },
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
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
  const { data: escrowData, isLoading } = useEscrowList();
  const escrows = escrowData?.data ?? escrowData?.escrows ?? [];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Mes commandes
      </h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : escrows.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
          <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        #{order.id.slice(0, 8)}
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
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Vues totales</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {(myProductsData?.data?.reduce((s, p) => s + (p.views || 0), 0) ?? 0).toLocaleString("fr-FR")}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Revenus totaux</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {formatCFA(walletData?.totalEarned ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">Annonces actives</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            {products.filter((p) => p.status === "active").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
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
