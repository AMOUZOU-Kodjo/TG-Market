import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  List,
  FolderTree,
  CreditCard,
  AlertTriangle,
  Settings,
  ChevronLeft,
  Menu,
  Bell,
  Search,
  LogOut,
  Shield,
  HelpCircle,
  X,
  TrendingUp,
  Activity,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { mockCurrentUser } from "../data/users";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location]);

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Utilisateurs", icon: Users },
    { to: "/admin/listings", label: "Annonces", icon: List },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/payments", label: "Paiements", icon: CreditCard },
    { to: "/admin/reports", label: "Signalements", icon: AlertTriangle },
    { to: "/admin/settings", label: "Parametres", icon: Settings },
  ];

  const adminStats = [
    { label: "Utilisateurs", value: "24 567", icon: Users, color: "blue", change: "+12%" },
    { label: "Annonces actives", value: "12 456", icon: List, color: "green", change: "+8%" },
    { label: "Signalements", value: "23", icon: AlertCircle, color: "blue", change: "-5%" },
    { label: "Ventes", value: "5 678", icon: TrendingUp, color: "blue", change: "+15%" },
  ];

  return (
    <div className="min-h-screen bg-green-950">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 z-40 h-screen bg-green-900 border-r border-green-800 transition-all duration-300 flex flex-col ${
            sidebarOpen ? "w-64" : "w-20"
          } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-green-900 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              {sidebarOpen && (
                <div>
                  <span className="text-lg font-bold text-white">AK</span>
                  <span className="text-xs ml-1 px-1.5 py-0.5 bg-red-700/20 text-red-400 rounded font-medium">
                    ADMIN
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Admin User */}
          <div className={`p-4 border-b border-gray-800 ${!sidebarOpen ? "px-2" : ""}`}>
            <div className={`flex items-center gap-3 ${!sidebarOpen ? "justify-center" : ""}`}>
              <div className="relative shrink-0">
                <img
                  src={mockCurrentUser.avatar}
                  alt={mockCurrentUser.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-red-700/30"
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-700 rounded-full border-2 border-gray-900" />
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{mockCurrentUser.name}</p>
                  <p className="text-xs text-red-400 font-medium">Administrateur</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to === "/admin" && location.pathname === "/admin");
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-red-700/10 text-red-400"
                      : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-red-400" : ""}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-800 space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <Activity className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Retour au site</span>}
            </Link>
            <button
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-700/10 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Deconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Admin Header */}
          <header className="sticky top-0 z-30 h-16 bg-green-900/80 backdrop-blur-xl border-b border-green-800 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 text-gray-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Rechercher dans l'admin..."
                   className="pl-10 pr-4 py-2 bg-green-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-700/50 text-white placeholder-gray-500 w-72"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-red-700/10 text-red-400 text-xs font-medium rounded-lg">
                <Shield className="w-3.5 h-3.5" />
                Mode Admin
              </span>
              <button className="relative p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  7
                </span>
              </button>
              <Link to="/faq" className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </Link>
            </div>
          </header>

          {/* Admin Stats */}
          <div className="px-4 sm:px-6 py-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {adminStats.map((stat, i) => (
                <div
                  key={i}
                   className="bg-green-900 rounded-xl p-4 border border-green-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                      <p className="text-xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${stat.color}-500/10`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                    </div>
                  </div>
                  <p className={`text-xs mt-2 font-medium ${
                    stat.change.startsWith("+") ? "text-green-600" : "text-red-400"
                  }`}>
                    {stat.change} ce mois
                  </p>
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
