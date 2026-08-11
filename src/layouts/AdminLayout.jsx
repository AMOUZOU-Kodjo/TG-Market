import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";
import {
  LayoutDashboard,
  Users,
  List,
  FolderTree,
  CreditCard,
  AlertTriangle,
  Mail,
  Settings,
  ChevronLeft,
  Bell,
  Search,
  LogOut,
  Shield,
  HelpCircle,
  Activity,
  ChevronRight,
  Send,
} from "lucide-react";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const settings = useSiteSettings();

  const { data: unreadData } = useQuery({
    queryKey: ["adminUnreadMessages"],
    queryFn: () => api.get("/admin/contact-messages?read=false&page=1&perPage=1").then((r) => r.data.meta.total),
    refetchInterval: 30000,
  });

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Utilisateurs", icon: Users },
    { to: "/admin/listings", label: "Annonces", icon: List },
    { to: "/admin/categories", label: "Categories", icon: FolderTree },
    { to: "/admin/payments", label: "Paiements", icon: CreditCard },
    { to: "/admin/payouts", label: "Paiements vendeurs", icon: Send },
    { to: "/admin/reports", label: "Signalements", icon: AlertTriangle },
    { to: "/admin/contact-messages", label: "Messages", icon: Mail },
    { to: "/admin/settings", label: "Parametres", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <div className="flex">
        {/* Admin Sidebar */}
        <aside
          className={`fixed top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-x-hidden ${
            sidebarOpen ? "w-64" : "w-20"
          } -translate-x-full lg:translate-x-0`}
        >
          {/* Sidebar Header */}
          <div className="h-16 flex items-center px-4 border-b border-gray-100">
            {sidebarOpen && (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-gray-900">{settings.siteName?.split("-")[0] ?? "TG"}</span>
                  <span className="text-xs ml-1 px-1.5 py-0.5 bg-brand-50 text-brand-600 rounded font-medium">
                    ADMIN
                  </span>
                </div>
              </Link>
            )}
            <div className={sidebarOpen ? "ml-auto" : "mx-auto"}>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>

          {/* Admin User */}
          {sidebarOpen && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-100"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-brand-600 rounded-full border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                  <p className="text-xs text-brand-600 font-medium">Administrateur</p>
                </div>
              </div>
            </div>
          )}

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
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  } ${!sidebarOpen ? "justify-center" : ""}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-brand-600" : ""}`} />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-gray-100 space-y-1">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <Activity className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Retour au site</span>}
            </Link>
            <button
              onClick={logout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors ${!sidebarOpen ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {sidebarOpen && <span>Deconnexion</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 min-w-0 overflow-x-hidden transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"}`}>
          {/* Admin Header */}
          <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard/profile")}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
                title="Aller à mon profil"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans l'admin..."
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 placeholder-gray-400 w-72"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 text-brand-600 text-xs font-medium rounded-lg">
                <Shield className="w-3.5 h-3.5" />
                Mode Administrateur
              </span>
              <Link
                to="/admin/contact-messages"
                className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadData > 0 && (
                  <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadData > 99 ? "99+" : unreadData}
                  </span>
                )}
              </Link>
              <Link to="/faq" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="px-4 sm:px-6 py-6 pb-24 lg:pb-8">
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

      {/* Mobile Bottom Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-white border-t border-gray-200 safe-area-pb">
        <div className="flex items-center overflow-x-auto h-16 hide-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === "/admin" && location.pathname === "/admin");
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex flex-col items-center justify-center gap-0.5 shrink-0 min-w-[60px] h-full transition-colors ${
                  isActive
                    ? "text-brand-600"
                    : "text-gray-400"
                }`}
              >
                <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
                <span className={`text-[10px] leading-tight whitespace-nowrap ${isActive ? "font-semibold" : "font-medium"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
