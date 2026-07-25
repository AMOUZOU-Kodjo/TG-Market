import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  MessageCircle,
  BarChart3,
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
  Eye,
  Heart,
  X,
} from "lucide-react";
import { mockCurrentUser } from "../data/users";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  const navItems = [
    { to: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
    { to: "/dashboard/products", label: "Mes annonces", icon: Package },
    { to: "/dashboard/orders", label: "Mes commandes", icon: ShoppingBag },
    { to: "/dashboard/messages", label: "Messages", icon: MessageCircle, badge: mockCurrentUser.unreadMessages },
    { to: "/dashboard/analytics", label: "Statistiques", icon: BarChart3 },
    { to: "/dashboard/promotions", label: "Promotions", icon: Megaphone },
    { to: "/dashboard/settings", label: "Parametres", icon: Settings },
  ];

  const quickStats = [
    { label: "Vues totales", value: "3 456", icon: Eye, color: "blue" },
    { label: "Favoris", value: "89", icon: Heart, color: "pink" },
    { label: "Ventes", value: "12", icon: TrendingUp, color: "green" },
    { label: "Revenus", value: "1.2M", icon: Wallet, color: "purple" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            sidebarOpen ? "w-64" : "w-20"
          } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} flex flex-col`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-gray-700">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-900 flex items-center justify-center shrink-0">
                <span className="text-white font-bold text-sm">AK</span>
              </div>
              {sidebarOpen && (
                <span className="text-lg font-bold text-green-900">
                  Market
                </span>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className={`p-4 border-b border-gray-100 dark:border-gray-700 ${!sidebarOpen ? "px-2" : ""}`}>
            <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
              <img
                src={mockCurrentUser.avatar}
                alt={mockCurrentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-red-700/20 shrink-0"
              />
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                    {mockCurrentUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {mockCurrentUser.productCount} annonces
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-red-800 dark:text-red-400" : ""}`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 bg-red-700 text-white text-[10px] font-bold rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
            <Link
              to="/help"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <HelpCircle className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Aide</span>}
            </Link>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Deconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Dashboard Header */}
          <header className="sticky top-0 z-30 h-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50 text-gray-900 dark:text-white w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                {mockCurrentUser.unreadMessages > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {mockCurrentUser.unreadMessages}
                  </span>
                )}
              </Link>
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {mockCurrentUser.notifications > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {mockCurrentUser.notifications}
                  </span>
                )}
              </Link>
              <Link to="/vendre" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-900 text-white rounded-xl text-sm font-medium hover:bg-green-950 transition-colors shadow-md shadow-green-700/25">
                + Nouvelle annonce
              </Link>
            </div>
          </header>

          {/* Quick Stats Bar */}
          <div className="px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickStats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-50 dark:bg-${stat.color}-900/30`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
