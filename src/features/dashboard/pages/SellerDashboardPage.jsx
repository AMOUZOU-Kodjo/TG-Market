import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  BarChart3,
  Megaphone,
  Star,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import DashboardStats from "@/features/dashboard/components/DashboardStats";
import ProductTable from "@/features/dashboard/components/ProductTable";

const recentActivity = [
  { id: 1, type: "sale", text: "Nouvelle vente : Samsung Galaxy S24 Ultra", time: "2025-07-20T10:30:00Z", icon: ShoppingCart, color: "text-green-700", bg: "bg-green-50 dark:bg-green-700/10" },
  { id: 2, type: "message", text: "3 nouveaux messages de Kofi Améyo", time: "2025-07-20T09:15:00Z", icon: Star, color: "text-red-800", bg: "bg-red-50 dark:bg-red-800/10" },
  { id: 3, type: "favorite", text: "PS5 ajouté en favoris par Kévin", time: "2025-07-19T16:45:00Z", icon: Star, color: "text-red-700", bg: "bg-red-50 dark:bg-red-700/10" },
  { id: 4, type: "view", text: "Canon EOS R6 Mark II : 23 nouvelles vues", time: "2025-07-19T14:20:00Z", icon: TrendingUp, color: "text-red-700", bg: "bg-red-50 dark:bg-red-700/10" },
  { id: 5, type: "review", text: "Nouvel avis 5 étoiles de Yao Agbeko", time: "2025-07-19T11:00:00Z", icon: Star, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10" },
];

const orders = [
  { id: 101, buyer: "Mathieu Tossou", product: "Samsung Galaxy S24 Ultra", amount: 850000, status: "completed", date: "2025-07-20T10:30:00Z" },
  { id: 102, buyer: "Abra Povi", product: "Pagne Wax Hollandais", amount: 25000, status: "pending", date: "2025-07-19T14:00:00Z" },
  { id: 103, buyer: "Prosper Degan", product: "Canon EOS R6 Mark II", amount: 1200000, status: "shipping", date: "2025-07-18T09:00:00Z" },
  { id: 104, buyer: "Kévin Agbéké", product: "PS5 + 2 Manettes", amount: 380000, status: "completed", date: "2025-07-15T16:00:00Z" },
  { id: 105, buyer: "Nana Akua", product: "DJI Mini 4 Pro", amount: 650000, status: "cancelled", date: "2025-07-12T11:30:00Z" },
];

const promotions = [
  { id: 1, title: "Soldes d'été -20%", type: "percentage", discount: 20, startDate: "2025-07-01", endDate: "2025-07-31", active: true },
  { id: 2, title: "Livraison gratuite > 100k", type: "shipping", discount: null, startDate: "2025-07-15", endDate: "2025-08-15", active: true },
  { id: 3, title: "Bundle électronique", type: "bundle", discount: 15, startDate: "2025-06-01", endDate: "2025-06-30", active: false },
];

const orderStatusConfig = {
  completed: { label: "Livrée", variant: "success", icon: CheckCircle },
  pending: { label: "En attente", variant: "warning", icon: Clock },
  shipping: { label: "En cours", variant: "primary", icon: ShoppingCart },
  cancelled: { label: "Annulée", variant: "danger", icon: XCircle },
};

function OverviewTab() {
  return (
    <div className="space-y-6">
      <DashboardStats />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
              Vues des annonces (7 derniers jours)
            </h3>
            <div className="flex h-48 items-end gap-2">
              {[65, 45, 78, 52, 90, 67, 85].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
                  className="flex-1 rounded-t-lg bg-red-800"
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            Activité récente
          </h3>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", activity.bg)}>
                  <activity.icon className={cn("h-4 w-4", activity.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-700 dark:text-gray-300">{activity.text}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
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
        <button className="flex items-center gap-2 rounded-xl bg-red-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-red-800/25 hover:bg-red-900 transition-colors">
          <Package className="h-4 w-4" />
          Nouvelle annonce
        </button>
      </div>
      <ProductTable />
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Mes commandes
      </h3>
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
              {orders.map((order) => {
                const status = orderStatusConfig[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      #{order.id}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {order.product}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 sm:table-cell">
                      {order.buyer}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white md:table-cell">
                      {formatCFA(order.amount)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400 lg:table-cell">
                      {formatRelativeTime(order.date)}
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
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Statistiques
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: "Vues totales", value: "3 456", change: "+12%" },
          { label: "Taux de conversion", value: "3.2%", change: "+0.5%" },
          { label: "Temps moyen de vente", value: "4.5 jours", change: "-1.2j" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-green-800 dark:text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
            <BarChart3 className="h-4 w-4 text-red-800" />
            Vues au fil du temps
          </h4>
          <div className="flex h-40 items-end gap-1.5">
            {[30, 45, 35, 60, 50, 75, 40, 55, 70, 85, 60, 90].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.1 + i * 0.03, duration: 0.4 }}
                className="flex-1 rounded-t-md bg-red-700"
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-gray-400">
            {["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
          <h4 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Produits les plus vus
          </h4>
          <div className="space-y-3">
            {[
              { title: "Samsung Galaxy S24 Ultra", views: 234, pct: 85 },
              { title: "Canon EOS R6 Mark II", views: 423, pct: 100 },
              { title: "PS5 + 2 Manettes", views: 445, pct: 92 },
              { title: "DJI Mini 4 Pro", views: 345, pct: 72 },
              { title: "MacBook Air M2", views: 312, pct: 65 },
            ].map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700 dark:text-gray-300">{p.title}</p>
                  <div className="mt-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-red-700"
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">{p.views}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PromotionsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Promotions
        </h3>
        <button className="flex items-center gap-2 rounded-xl bg-red-800 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-red-800/25 hover:bg-red-900 transition-colors">
          <Megaphone className="h-4 w-4" />
          Nouvelle promo
        </button>
      </div>
      <div className="space-y-3">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                promo.active ? "bg-green-50 dark:bg-green-700/10" : "bg-gray-100 dark:bg-gray-800"
              )}>
                <Megaphone className={cn(
                  "h-5 w-5",
                  promo.active ? "text-green-700" : "text-gray-400"
                )} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {promo.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {promo.startDate} → {promo.endDate}
                </p>
              </div>
            </div>
            <Badge variant={promo.active ? "success" : "secondary"} dot>
              {promo.active ? "Active" : "Terminée"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabs = [
  { id: "overview", label: "Vue d'ensemble", icon: BarChart3 },
  { id: "products", label: "Mes annonces", icon: Package },
  { id: "orders", label: "Commandes", icon: ShoppingCart },
  { id: "analytics", label: "Statistiques", icon: TrendingUp },
  { id: "promotions", label: "Promotions", icon: Megaphone },
];

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabContent = {
    overview: <OverviewTab />,
    products: <ProductsTab />,
    orders: <OrdersTab />,
    analytics: <AnalyticsTab />,
    promotions: <PromotionsTab />,
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
                ? "text-red-800"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="dashboard-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-red-800"
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
