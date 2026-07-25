import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
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
  Grid3X3,
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
import Logo from "@/shared/ui/Logo";
import CategoryBar from "@/features/home/components/CategoryBar";
import { mockCurrentUser } from "../data/users";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
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
    { to: "/categories", label: "Catégories", icon: Grid3X3 },
    { to: "/vendre", label: "Vendre", icon: PlusCircle },
  ];

  const userMenuItems = [
    { to: "/profil", label: "Mon profil", icon: User },
    { to: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
    {
      to: "/messages",
      label: "Messages",
      icon: MessageCircle,
      badge: mockCurrentUser.unreadMessages,
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
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 shrink-0">
                <Logo size="md" />
                {/* <span className="text-xl font-bold text-white hidden sm:block">Market</span> */}
              </Link>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
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
                    className="w-full pl-10 pr-4 py-2.5 bg-white/20 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50  text-white placeholder-white/70 transition-all"
                  />
                </div>
              </form>

              {/* Desktop Nav */}
              <nav className="hidden md:flex items-center gap-1">
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
                  className="relative p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors hidden sm:flex"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-4 h-4 bg-brand-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {mockCurrentUser.notifications}
                  </span>
                </Link>

                {/* User Menu */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <img
                      src={mockCurrentUser.avatar}
                      alt={mockCurrentUser.name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-white/30"
                    />
                    <ChevronDown
                      className={`w-4 h-4 text-white/80 transition-transform hidden sm:block ${
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
                            {mockCurrentUser.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {mockCurrentUser.email}
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
                              {item.badge && (
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
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Deconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden overflow-hidden border-t border-white/20"
              >
                <div className="p-4 space-y-3 bg-brand-900">
                  {/* Mobile Search */}
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-white/50 text-white placeholder-white/60"
                      />
                    </div>
                  </form>
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                        location.pathname === link.to
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <link.icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to="/notifications"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                    <span className="ml-auto px-2 py-0.5 bg-brand-700 text-white text-[10px] font-bold rounded-full">
                      {mockCurrentUser.notifications}
                    </span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Category Bar */}
        <CategoryBar />
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="bg-brand-900 dark:bg-brand-950 text-gray-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Logo size="md" />
                  {/* <span className="text-xl font-bold text-white">Market</span> */}
                </div>
                <p className="text-sm text-gray-100 mb-4 leading-relaxed">
                  La première plateforme de marketplace au Togo. Achetez et vendez facilement, en
                  toute confiance.
                </p>
                <div className="flex gap-3">
                  {[Globe, MessageCircle, Share2, ExternalLink].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-brand-900 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { to: "/categories", label: "Toutes les catégories" },
                    { to: "/vendre", label: "Vendre un produit" },
                    { to: "/comment-ca-marche", label: "Comment ça marche" },
                    { to: "/a-propos", label: "Sécurité" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="text-white font-semibold mb-4">Support</h3>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { to: "/faq", label: "Centre d'aide" },
                    { to: "/faq", label: "Questions fréquentes" },
                    { to: "/contact", label: "Nous contacter" },
                    { to: "/conditions", label: "Conditions générales" },
                    { to: "/confidentialite", label: "Politique de confidentialité" },
                  ].map((link) => (
                    <li key={link.label}>
                      <Link to={link.to} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & App */}
              <div>
                <h3 className="text-white font-semibold mb-4">Contact</h3>
                <ul className="space-y-3 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                    <span>Lomé, Togo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-red-400 shrink-0" />
                    <span>+228 90 00 00 00</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-red-400 shrink-0" />
                    <span>contact@akmarket.tg</span>
                  </li>
                </ul>
                <h4 className="text-white font-semibold text-sm mb-3">Télécharger l'app</h4>
                <div className="flex gap-2">
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
            </div>

            <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-100">
              <p>&copy; 2025 TG-Market. Tous droits réservés.</p>
              <div className="flex gap-4">
                <Link to="/conditions" className="hover:text-white transition-colors">
                  CGU
                </Link>
                <Link to="/confidentialite" className="hover:text-white transition-colors">
                  Confidentialité
                </Link>
                <Link to="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
