import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package,
  MessageCircle,
  Megaphone,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
  Search,
  LogOut,
  HelpCircle,
  TrendingUp,
  Wallet,
  ArrowLeft,
  Eye,
  Heart,
  X,
  User,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import Logo from "@/shared/ui/Logo";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useEscrowList, useWalletBalance } from "@/features/wallet/hooks/useWallet";
import { useFavorites } from "@/features/favorites/hooks/useFavorites";
import { formatCFA } from "@/shared/utils/format";

function SidebarContent({ sidebarOpen, setSidebarOpen, onMobileLinkClick, user, totalEarned, navigate, logout }) {
  return (
    <>
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
          {sidebarOpen && <span className="text-lg font-bold text-brand-900">Market</span>}
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
        >
          <ChevronLeft
            className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Mon espace */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          MON ESPACE
        </h3>
      </div>

      {/* Wallet */}
      <div className="mx-3 rounded-xl bg-brand-600 p-4 text-white shadow-lg">
        <div className="flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <Wallet size={18} className="text-amber-300" />
              </div>
              <span className="text-sm font-semibold text-white/80">Portefeuille TGM</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{formatCFA(totalEarned)}</h2>
          </div>
          <button
            onClick={() => { onMobileLinkClick(); navigate("/dashboard/analytics"); }}
            className="rounded-xl border border-white/25 bg-white/15 px-5 py-3 text-sm font-medium text-white backdrop-blur transition-all hover:bg-white/20"
          >
            Voir →
          </button>
        </div>
      </div>

      {/* Devenir membre certifié */}
      <Link
        to="/dashboard/settings"
        onClick={onMobileLinkClick}
        className="mx-3 mt-3 block rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Devenir un membre certifié
      </Link>

      {/* Profile */}
      <Link
        to="/dashboard/profile"
        onClick={onMobileLinkClick}
        className="mx-3 mt-4 flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        {user?.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-800/20 flex items-center justify-center text-brand-800 font-bold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <span className="text-sm font-medium text-gray-900 dark:text-white">Mon Profil</span>
      </Link>

      {/* Mes Ventes et Achats */}
      <Link
        to="/dashboard/history"
        onClick={onMobileLinkClick}
        className="mx-3 mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Package className="w-4 h-4 shrink-0" />
        Mes Ventes et Achats
      </Link>

      {/* Separator */}
      <div className="mx-3 mt-4 border-t border-gray-100 dark:border-gray-700" />

      {/* Messages */}
      <Link
        to="/dashboard/messages"
        onClick={onMobileLinkClick}
        className="mx-3 mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <MessageCircle className="w-4 h-4 shrink-0" />
        Messages
      </Link>

      {/* Notifications */}
      <Link
        to="/dashboard/notifications"
        onClick={onMobileLinkClick}
        className="mx-3 mt-1 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Bell className="w-4 h-4 shrink-0" />
        Notifications
      </Link>

      {/* Admin - visible only for admins */}
      {user?.role === "admin" && (
        <Link
          to="/admin"
          onClick={onMobileLinkClick}
          className="mx-3 mt-2 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LayoutDashboard className="w-4 h-4 shrink-0" />
          Administration
        </Link>
      )}

      {/* Footer */}
      <div className="mx-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-1 pb-4">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          Retour au site
        </Link>
        <Link
          to="/faq"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        >
          <HelpCircle className="w-4 h-4 shrink-0" />
          Aide
        </Link>
        <button
          onClick={async () => {
            await logout();
            navigate("/");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Déconnexion
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState("sidebar");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data: myProductsData } = useMyProducts();
  const { data: escrowData } = useEscrowList();
  const { data: walletData } = useWalletBalance();
  const { data: favoritesData } = useFavorites();

  const totalViews = myProductsData?.data?.reduce((s, p) => s + (p.views || 0), 0) ?? 0;
  const totalFavorites = favoritesData?.meta?.total ?? favoritesData?.total ?? 0;
  const completedSales = escrowData?.data?.filter((e) => e.status === "completed").length ?? 0;
  const totalEarned = walletData?.totalEarned ?? 0;

  useEffect(() => {
    setMobileView(location.pathname === "/dashboard" ? "sidebar" : "page");
  }, [location]);

  const handleMobileLinkClick = () => setMobileView("page");

  const pageTitles = {
    "/dashboard/profile": "Mon Profil",
    "/dashboard/history": "Ventes et Achats",
    "/dashboard/messages": "Messages",
    "/dashboard/notifications": "Notifications",
    "/dashboard/settings": "Paramètres",
    "/dashboard/analytics": "Statistiques",
    "/dashboard/promotions": "Promotions",
  };
  const pageTitle = pageTitles[location.pathname] ?? "Tableau de bord";

  const quickStats = [
    { label: "Vues totales", value: totalViews.toLocaleString("fr-FR"), icon: Eye, color: "blue" },
    { label: "Favoris", value: totalFavorites.toLocaleString("fr-FR"), icon: Heart, color: "pink" },
    { label: "Ventes", value: completedSales.toLocaleString("fr-FR"), icon: TrendingUp, color: "green" },
    { label: "Revenus", value: formatCFA(totalEarned), icon: Wallet, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex">
        {/* ===== DESKTOP SIDEBAR (lg+) ===== */}
        <aside
          className={`hidden lg:flex fixed lg:sticky top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            sidebarOpen ? "w-80" : "w-20"
          } flex-col`}
        >
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            onMobileLinkClick={() => {}}
            user={user}
            totalEarned={totalEarned}
            navigate={navigate}
            logout={logout}
          />
        </aside>

        {/* ===== MOBILE SIDEBAR FULL-SCREEN ===== */}
        {mobileView === "sidebar" && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
            {/* <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
              <Link to="/" className="flex items-center gap-2">
                <Logo size="sm" />
                <span className="text-lg font-bold text-brand-900">MARKET</span>
              </Link>
              <button
                onClick={() => setMobileView("page")}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div> */}
            <div className="flex-1 overflow-y-auto pb-20">
              <SidebarContent
                sidebarOpen={true}
                setSidebarOpen={() => {}}
                onMobileLinkClick={handleMobileLinkClick}
                user={user}
                totalEarned={totalEarned}
                navigate={navigate}
                logout={logout}
              />
            </div>
          </div>
        )}

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 min-w-0">
          {/* Dashboard Header */}
          <header className={`${mobileView === "sidebar" ? "hidden lg:flex" : "flex"} sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 items-center justify-between px-4 sm:px-6`}>
            <div className="flex items-center gap-3">
              {/* Mobile: back arrow */}
              <button
                onClick={() => setMobileView("sidebar")}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              {/* Desktop: hamburger */}
              <button
                onClick={() => setMobileView("sidebar")}
                className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <Menu className="w-5 h-5" />
              </button>
              {/* Mobile: page title */}
              <span className="lg:hidden text-sm font-semibold text-gray-900 dark:text-white">{pageTitle}</span>
              {/* Desktop: search */}
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-700/50 text-gray-900 dark:text-white w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {user?.unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {user.unreadMessages}
                  </span>
                )}
              </Link>
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {user?.unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {user?.unreadNotifications}
                  </span>
                )}
              </Link>
              <Link
                to="/vendre"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-brand-900 text-white rounded-xl text-sm font-medium hover:bg-brand-950 transition-colors shadow-md shadow-brand-700/25"
              >
                + Nouvelle annonce
              </Link>
            </div>
          </header>

          {/* Quick Stats Bar - desktop only */}
          {/*
          <div className={`${mobileView === "sidebar" ? "hidden lg:block" : ""} px-4 sm:px-6 py-4`}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-900/30`}
                    >
                      <stat.icon
                        className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          */}

          {/* Page Content */}
          <main className="px-4 sm:px-6 pb-8">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
