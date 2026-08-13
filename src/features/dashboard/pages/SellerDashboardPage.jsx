import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  BarChart3,
  User,
  Handshake,
  Megaphone,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatCFA } from "@/shared/utils/format";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import ProductTable from "@/features/dashboard/components/ProductTable";
import BundleProposalsTab from "@/features/dashboard/components/BundleProposalsTab";
import PromotionsTab from "@/features/dashboard/components/PromotionsTab";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useWalletBalance } from "@/features/wallet/hooks/useWallet";
import UserProfilePage from "@/features/profile/pages/UserProfilePage";

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

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "products", label: "Mes annonces", icon: Package },
  { id: "bundleProposals", label: "Propositions", icon: Handshake },
  { id: "promotions", label: "Promotions", icon: Megaphone },
  { id: "analytics", label: "Statistiques", icon: TrendingUp },
  { id: "profile", label: "Profil", icon: User },
];

export default function SellerDashboardPage({ defaultTab = "overview" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabContent = {
    overview: <OverviewTab />,
    products: <ProductsTab />,
    bundleProposals: <BundleProposalsTab />,
    promotions: <PromotionsTab />,
    analytics: <AnalyticsTab />,
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
