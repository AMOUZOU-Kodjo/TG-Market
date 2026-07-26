import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
  Settings,
  MessageCircle,
  Sun,
  Moon,
  Home,
  PlusCircle,
  HelpCircle,
  Shield,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  ExternalLink,
  Download,
  Apple,
  Play,
} from "lucide-react";
import { FaLinkedinIn, FaFacebookF, FaTiktok } from "react-icons/fa6";
import Logo from "@/shared/ui/Logo";
import BottomNav from "@/shared/ui/BottomNav";
import CategoryBar from "@/features/home/components/CategoryBar";
import { useAuth } from "@/shared/contexts/AuthContext";

export default function MainLayout() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setUserMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedDesktop = desktopMenuRef.current?.contains(e.target);
      const clickedMobile = mobileMenuRef.current?.contains(e.target);
      if (!clickedDesktop && !clickedMobile) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { to: "/", label: "Accueil", icon: Home },
    { to: "/vendre", label: "Vendre", icon: PlusCircle },
  ];

  const userMenuItems = [
    { to: "/profil", label: "Mon profil", icon: User },
    { to: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
    {
      to: "/messages",
      label: "Messages",
      icon: MessageCircle,
      badge: user?.unreadMessages,
    },
    { to: "/favoris", label: "Mes favoris", icon: Heart },
    { to: "/parametres", label: "Paramètres", icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Sticky Header + Category Bar */}
        <div className="sticky top-0 z-50">
          {/* Header */}
          <header
            className={`transition-all shadow-2xl duration-300 ${
              scrolled ? "bg-brand-900/90 backdrop-blur-xl shadow-xl" : "bg-brand-900"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Desktop: single row */}
              <div className="hidden md:flex items-center justify-between h-16">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 shrink-0">
                  <Logo size="md" />
                </Link>

                {/* Search */}
                <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-8">
                  <div
                    className={`relative w-full transition-all duration-200 ${
                      searchFocused ? "scale-[1.02]" : ""
                    }`}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher des produits, catégories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white/20 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/70 transition-all"
                    />
                  </div>
                </form>

                {/* Desktop Nav */}
                <nav className="flex items-center gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        link.to === "/vendre"
                          ? "bg-white text-red-800 hover:bg-red-50 shadow-md"
                          : location.pathname === link.to
                            ? "bg-white/20 text-white"
                            : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {user?.unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {user?.unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {user ? (
                  /* User Menu (connected) */
                  <div className="relative" ref={desktopMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                      />
                      <ChevronDown
                        className={`w-4 h-4 text-white/80 transition-transform ${
                          userMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {user?.email}
                            </p>
                          </div>
                          <div className="p-2">
                            {userMenuItems.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge > 0 && (
                                  <span className="px-2 py-0.5 bg-brand-700 text-white text-[10px] font-bold rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                            <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                            <Link
                              to="/faq"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                              Aide et support
                            </Link>
                            <button
                              onClick={async () => { await logout(); navigate("/"); setUserMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Deconnexion
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  ) : (
                  /* Login/Register buttons (guest) */
                  <div className="flex items-center gap-2">
                    <Link
                      to="/connexion"
                      className="px-3 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      className="px-3 py-2 rounded-lg text-sm font-medium bg-white text-brand-900 hover:bg-white/90 transition-colors"
                    >
                      Inscription
                    </Link>
                  </div>
                  )}
                </div>
              </div>

              {/* Mobile: two rows */}
              <div className="md:hidden">
                {/* Row 1: Logo */}
                <div className="flex items-center justify-center py-2">
                  <Link to="/">
                    <Logo size="md" />
                  </Link>
                </div>

                {/* Row 2: Search + Actions */}
                <div className="flex items-center gap-2 pb-2">
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
                      />
                    </div>
                  </form>
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                  {user ? (
                  <div className="relative" ref={mobileMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="p-1 rounded-full hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={user?.avatar}
                        alt={user?.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                      />
                    </button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
                        >
                          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">
                              {user?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user?.email}
                            </p>
                          </div>
                          <div className="p-2">
                            {userMenuItems.map((item) => (
                              <Link
                                key={item.to}
                                to={item.to}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span className="flex-1">{item.label}</span>
                                {item.badge > 0 && (
                                  <span className="px-2 py-0.5 bg-brand-700 text-white text-[10px] font-bold rounded-full">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ))}
                            <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                            <Link
                              to="/faq"
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <HelpCircle className="w-4 h-4 text-gray-400" />
                              Aide et support
                            </Link>
                            <button
                              onClick={async () => { await logout(); navigate("/"); setUserMenuOpen(false); }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                            >
                              <LogOut className="w-4 h-4" />
                              Deconnexion
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  ) : (
                  <Link
                    to="/connexion"
                    className="p-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Category Bar */}
          <CategoryBar />
        </div>

        {/* Main Content */}
        <main className="flex-1 pb-20 md:pb-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>

        <footer className="bg-brand-900 dark:bg-brand-950 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Mobile: centered layout | Desktop: 3-column grid */}
            <div className="flex flex-col items-center lg:grid lg:grid-cols-3 lg:items-start lg:gap-8">

              {/* Col 1 — Logo + Télécharger */}
              <div className="text-center mb-8 lg:mb-0 w-full">
                <div className="flex justify-center mb-4">
                  <Logo size="md" />
                </div>
                <h4 className="text-white font-semibold text-sm mb-3">Télécharger l'app</h4>
                <div className="flex gap-2 justify-center">
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Apple className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Disponible sur</p>
                      <p className="text-xs font-medium text-white">App Store</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    <Play className="w-5 h-5" />
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400">Disponible sur</p>
                      <p className="text-xs font-medium text-white">Google Play</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Col 2 — À propos */}
              <div className="text-center mb-8 lg:mb-0 w-full">
                <h3 className="text-white font-semibold mb-4">À propos</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { to: "/confidentialite", label: "Politique de confidentialité" },
                    { to: "/mentions-legales", label: "Mentions légales" },
                    { to: "/a-propos", label: "Sécurité" },
                    { to: "/conditions", label: "CGU" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/faq"
                      className="px-3 py-1 bg-gray-800 hover:bg-brand-900 rounded-full text-xs font-medium transition-colors"
                    >
                      Questions fréquentes
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 — Contact + Réseaux sociaux */}
              <div className="text-center w-full">
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-3 text-sm mb-8">
                  <li className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Lomé, Togo</span>
                  </li>
                  {/* <li className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-red-400 shrink-0" />
                    <span>+228 90 00 00 00</span>
                  </li> */}
                  <li className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4 text-red-400 shrink-0" />
                    <span>contact@akmarket.tg</span>
                  </li>
                </ul>

                <h3 className="text-white font-semibold mb-4">Suivez-nous</h3>
                <div className="flex justify-center gap-4">
                  <a
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-800 text-gray-300 hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-800 text-gray-300 hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 rounded-lg bg-gray-800 text-gray-300 hover:bg-brand-800 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="TikTok"
                  >
                    <FaTiktok className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-10 pt-4 pb-2 border-t text-center border-gray-800  items-center justify-between gap-4 text-sm text-gray-100">
              <p>&copy; 2025 TG-Market. Tous droits réservés.</p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
