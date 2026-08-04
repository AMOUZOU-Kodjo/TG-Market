import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronLeft,
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
  Globe,
  Share2,
  ExternalLink,
  Download,
} from "lucide-react";
import { FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import Logo from "@/shared/ui/Logo";
import BottomNav from "@/shared/ui/BottomNav";
import { AppleStoreBadge, GooglePlayBadge } from "@/shared/ui/StoreBadges";
import CategoryBar from "@/features/home/components/CategoryBar";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useTheme } from "@/shared/contexts/ThemeContext";
import { useNotificationContext } from "@/shared/hooks/useNotificationContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

export default function MainLayout() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isDark: darkMode, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { unreadCount } = useNotificationContext();
  const settings = useSiteSettings();

  useEffect(() => {
    document.title = `${settings.siteName} - Achat & Vente au Togo`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && settings.siteDescription) meta.setAttribute("content", settings.siteDescription);
  }, [settings.siteName, settings.siteDescription]);

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
    { to: "/dashboard", label: "Mon profil", icon: User },
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
    <div className="min-h-screen flex flex-col">
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
        {/* Sticky Header + Category Bar */}
        <div className={`sticky top-0 z-50 relative ${location.pathname.startsWith("/vendeur/") || location.pathname.startsWith("/recherche") || location.pathname.startsWith("/a-propos") ? "hidden" : ""}`}>
          {/* Logo centered in combined header+category height */}
          <Link to="/" className="absolute left-4 sm:left-6 lg:left-8 top-1/3 -translate-y-1/2 z-50 hidden md:block">
            <Logo size="md" className="w-24 h-24" />
          </Link>

          {/* Header */}
          <header
            className={`transition-all duration-300 bg-white border-b border-gray-100 ${
              scrolled ? "shadow-md" : "shadow-sm"
            }`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Desktop: single row */}
              <div className="hidden md:flex items-center justify-between h-15">
                {/* Logo spacer to keep layout */}
                <div className="w-24 shrink-0" />

                {/* Search */}
                <form onSubmit={handleSearch} className="flex flex-1 max-w-xl mx-8">
                  <div
                    className={`relative w-full transition-all duration-200 ${
                      searchFocused ? "scale-[1.02]" : ""
                    }`}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800" />
                    <input
                      type="text"
                      placeholder="Rechercher des produits, catégories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setSearchFocused(false)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-200 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-gray-900 placeholder-gray-400 transition-all"
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
                          ? "bg-brand-800 text-white hover:bg-brand-700 shadow-md"
                          : location.pathname === link.to
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
                  {/* <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button> */}

                  {/* Notifications */}
                  <Link
                    to={user ? "/dashboard/profile?tab=notifications" : "/connexion"}
                    className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-brand-700 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Link>

                  {user ? (
                    /* User Menu (connected) */
                    <div className="relative" ref={desktopMenuRef}>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                        />
                        <ChevronDown
                          className={`w-4 h-4 text-gray-500 transition-transform ${
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
                            className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
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
                                    <span className="px-2 py-0.5 bg-brand-700 text-white text-[10px] font-extrabold rounded-full">
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
                                onClick={async () => {
                                  await logout();
                                  navigate("/");
                                  setUserMenuOpen(false);
                                }}
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
                        className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                      >
                        Connexion
                      </Link>
                      <Link
                        to="/inscription"
                        className="px-3 py-2 rounded-lg text-sm font-medium bg-brand-800 text-white hover:bg-brand-700 transition-colors"
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
                {!location.pathname.startsWith("/categories/") && (
                  <div className="flex items-center justify-center pt-2 pb-1">
                    <Link to="/">
                      <Logo size="sm" />
                    </Link>
                  </div>
                )}

                {/* Row 2: Back button (category pages) + Search + Actions */}
                <div
                  className={`flex items-center gap-2 ${location.pathname.startsWith("/categories/") ? "pt-2 pb-1" : "pb-1"}`}
                >
                  {location.pathname.startsWith("/categories/") && (
                    <Link
                      to="/"
                      className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  )}
                  <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 rounded-xl text-sm focus:outline-none focus:ring-2 bg-gray-100 text-gray-900 placeholder-gray-400 focus:ring-gray-300"
                      />
                    </div>
                  </form>
                  {/* <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button> */}
                  {/* {user ? (
                    <div className="relative" ref={mobileMenuRef}>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200"
                        />
                      </button>

                      <AnimatePresence>
                        {userMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50"
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
                                    <span className="px-2 py-0.5 bg-brand-700 text-white text-[10px] font-extrabold rounded-full">
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
                                onClick={async () => {
                                  await logout();
                                  navigate("/");
                                  setUserMenuOpen(false);
                                }}
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
                      className="p-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                    >
                      <User className="w-5 h-5" />
                    </Link>
                  )} */}
                </div>
              </div>
            </div>

            {/* Category Bar */}
            <CategoryBar />
          </header>
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

        <footer
          className={`bg-footer dark:bg-footer-dark text-footer-text pb-20 md:pb-0 
${location.pathname.startsWith("/categories/") || location.pathname.startsWith("/vendre") || 
location.pathname.startsWith("/annonce/") || location.pathname.startsWith("/vendeur/") || 
location.pathname.startsWith("/recherche") ||
location.pathname.startsWith("/comment-ca-marche") ||location.pathname.startsWith("/portefeuille") ||location.pathname.startsWith("/contact")|| location.pathname.startsWith("/a-propos") ? "hidden " : ""}`}
        >
          {/* <hr className="max-w-full font-extrabold text-gray-400"/> */}
          <hr className="border-t border-footer-border w-full" />
          <div className="max-w-8xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
            {/* Mobile: centered layout | Desktop: 3-column grid */}
            <div className="flex flex-col items-center lg:grid lg:grid-cols-3 lg:items-start lg:gap-8">
              {/* Col 1 — Logo + Nous écrire + Télécharger */}
              <div className="text-center mb-8 lg:mb-0 w-full">
                <div className="flex justify-center mb-2">
                  <Logo size="md" />
                </div>
                <div className="mb-2">
                  <Link to="/contact" className="text-md text-gray-600 text-footer-heading font-extrabold">
                    Nous écrire
                  </Link>
                </div>
                <h4 className="text-footer-heading font-extrabold text-md mb-3">
                  Télécharger l'application : 
                </h4>
                <div className="flex gap-2 justify-center">
                  <AppleStoreBadge />
                  <GooglePlayBadge />
                </div>
              </div>

              {/* Col 2 — À propos */}
              <div className="text-center mb-8 lg:mb-0 w-full">
                <h3 className="text-footer-heading font-extrabold text-xl mb-4">À propos</h3>
                <ul className="space-y-3 text-sm font-bold">
                  {[
                    { to: "/confidentialite", label: "Politique de confidentialité" },
                    { to: "/mentions-legales", label: "Mentions légales" },
                    { to: "/a-propos", label: "Sécurité" },
                    { to: "/conditions", label: "CGU" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-footer-heading transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      to="/faq"
                      className="px-3 py-3 bg-brand-500 text-black hover:bg-brand-300 rounded-full text-md font-extrabold transition-colors"
                    >
                      Questions fréquentes
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3 — Contact + Réseaux sociaux */}
              <div className="text-center w-full">
                <h3 className="text-footer-heading font-extrabold text-xl mb-4">Contact</h3>
                <ul className="space-y-3  font-semibold mb-4">
                  <li className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4 text-black shrink-0" />
                    <span>Lomé, Togo</span>
                  </li>
                  {/* <li className="flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                    <span>+228 90 00 00 00</span>
                  </li> */}
                  <li className="flex items-center justify-center gap-2">
                    <SiGmail className="w-4 h-4 text-black shrink-0" />
                    <span>contact@akmarket.tg</span>
                  </li>
                </ul>

                <h3 className="text-footer-heading font-extrabold mb-4">Suivez-nous</h3>
                <div className="flex justify-center gap-4">
                  <a
                    href={settings.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#1877F2] text-white hover:opacity-80 flex items-center justify-center transition-opacity"
                    aria-label="Facebook"
                  >
                    <FaFacebookF className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.socialTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#000000] text-white hover:opacity-80 flex items-center justify-center transition-opacity"
                    aria-label="Twitter / X"
                  >
                    <FaXTwitter className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#E4405F] text-white hover:opacity-80 flex items-center justify-center transition-opacity"
                    aria-label="Instagram"
                  >
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.socialLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#0A66C2] text-white hover:opacity-80 flex items-center justify-center transition-opacity"
                    aria-label="LinkedIn"
                  >
                    <FaLinkedinIn className="w-4 h-4" />
                  </a>
                  <a
                    href={settings.socialGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-[#333] text-white hover:opacity-80 flex items-center justify-center transition-opacity"
                    aria-label="GitHub"
                  >
                    <FaGithub className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-8 pt-4 border-t text-center border-footer-border  items-center justify-between gap-4 text-md font-extrabold text-footer-text">
              <p>
                Copyright &copy; 2026 - {settings.siteName} {"   "} v{settings.siteVersion} - Tous droits réservés
              </p>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Nav */}
        <BottomNav />
      </div>
    </div>
  );
}
