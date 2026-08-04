import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMobileScreen,
  FaLaptop,
  FaTabletScreenButton,
  FaGamepad,
  FaTv,
  FaHeadphones,
  FaCamera,
  FaCar,
  FaBicycle,
  FaHouse,
  FaCouch,
  FaPaintbrush,
  FaBlender,
  FaShirt,
  FaBagShopping,
  FaStar,
  FaClock,
  FaDumbbell,
  FaBookOpen,
  FaMusic,
  FaGuitar,
  FaBaby,
  FaPaw,
  FaHammer,
  FaTree,
  FaBuilding,
  FaBriefcase,
  FaWrench,
  FaBoxOpen,
  FaPersonWalking,
  FaShoePrints,
  FaBolt,
  FaSackDollar,
  FaGraduationCap,
  FaCalendarDays,
  FaBottleWater,
  FaKitchenSet,
  FaDog,
  FaCartShopping,
  FaScissors,
  FaTractor,
  FaIndustry,
  FaWeightScale,
  FaEye,
  FaGem,
  FaGlasses,
  FaTruckMoving,
  FaMotorcycle,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa6";
import { TbCategory } from "react-icons/tb";
import { useCategories } from "@/features/categories/hooks/useCategories";

const faIconMap = {
  Smartphone: FaMobileScreen,
  Laptop: FaLaptop,
  Tablet: FaTabletScreenButton,
  Gamepad2: FaGamepad,
  Tv: FaTv,
  Cable: FaHeadphones,
  Camera: FaCamera,
  Glasses: FaGlasses,
  Car: FaCar,
  Bike: FaBicycle,
  Home: FaHouse,
  Sofa: FaCouch,
  Refrigerator: FaBlender,
  Shirt: FaShirt,
  User: FaPersonWalking,
  Heart: FaStar,
  Footprints: FaShoePrints,
  BaggageClaim: FaBagShopping,
  Watch: FaClock,
  Sparkles: FaStar,
  Dumbbell: FaDumbbell,
  BookOpen: FaBookOpen,
  Music: FaMusic,
  Palette: FaPaintbrush,
  Baby: FaBaby,
  PawPrint: FaPaw,
  Wrench: FaWrench,
  TreePine: FaTree,
  Sun: FaBolt,
  Building: FaBuilding,
  Building2: FaIndustry,
  Briefcase: FaBriefcase,
  GraduationCap: FaGraduationCap,
  Calendar: FaCalendarDays,
  Coffee: FaBottleWater,
  Package: FaBoxOpen,
  Armchair: FaCouch,
  Blocks: FaGamepad,
  Dog: FaDog,
  Wallet: FaSackDollar,
};

const groupImages = {
  multimedia:
    "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=500&h=400&fit=crop",
  vehicules:
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&h=400&fit=crop",
  maison:
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
  mode: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=500&h=400&fit=crop",
  loisirs:
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=400&fit=crop",
  famille:
    "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=500&h=400&fit=crop",
  "bricolage-jardin":
    "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&h=400&fit=crop",
  immobilier:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=400&fit=crop",
  "pro-services":
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop",
};

export default function CategoryBar() {
  const { data: categories = [] } = useCategories();
  const location = useLocation();
  const isCategoryPage = location.pathname.startsWith("/categories/");
  const [openIndex, setOpenIndex] = useState(null);
  const [mobilePath, setMobilePath] = useState([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimeout = useRef(null);
  const containerRef = useRef(null);

  const handleMobileDrill = useCallback((cat) => {
    setMobilePath((prev) => [...prev, cat]);
  }, []);

  const handleMobileBack = useCallback(() => {
    setMobilePath((prev) => prev.slice(0, -1));
  }, []);

  const handleMobileOpenCategory = useCallback((parent) => {
    setMobilePath([parent]);
    setMobileOpen(true);
  }, []);

  const closeMobile = useCallback(() => {
    setMobilePath([]);
    setMobileOpen(false);
  }, []);

  const parents = categories.filter((c) => c.parentId === null);

  const handleEnter = useCallback(
    (i) => {
      clearTimeout(closeTimeout.current);
      if (window.innerWidth >= 768) {
        setOpenIndex(i);
      }
    },
    []
  );

  const handleLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      closeTimeout.current = setTimeout(() => setOpenIndex(null), 100);
    }
  }, []);

  const handleCancelLeave = useCallback(() => {
    clearTimeout(closeTimeout.current);
  }, []);

  const closeMenu = useCallback(() => setOpenIndex(null), []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openIndex !== null &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openIndex]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setOpenIndex(null);
        closeMobile();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (parents.length === 0) return null;

  const activeParent = openIndex !== null ? parents[openIndex] : null;

  return (
    <div ref={containerRef} className={`relative ${isCategoryPage ? "border-b border-gray-200 md:border-gray-200" : "border-b border-gray-200"}`}>
      {/* ═══ Desktop: Category pills ═══ */}
      <div className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="overflow-x-auto hide-scrollbar text-center py-2">
            <div className="inline-flex  items-center gap-1 text-left">
             {parents.map((group, i) => {
               const Icon = faIconMap[group.icon] || FaLaptop;
               const isActive = openIndex === i;
               return (
                 <button
                   key={group.slug}
                   onMouseEnter={() => handleEnter(i)}
                   onMouseLeave={handleLeave}
                   onClick={() => (isActive ? closeMenu() : setOpenIndex(i))}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 ${
                      isCategoryPage
                        ? isActive
                          ? "text-brand-800"
                          : "text-gray-600 hover:text-gray-900"
                        : isActive
                          ? "text-brand-800"
                          : "text-gray-600 hover:text-gray-900"
                    }`}
                 >
                   <Icon className="w-4 h-4" />
                   {group.name}
                 </button>
               );
             })}
           </div>
          </div>
        </div>
      </div>

      {/* ═══ Mobile: Category pills + Full-screen overlay ═══ */}
      <div className="md:hidden">
        {/* Scrollable pills */}
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-4 py-2">
          {parents.map((group) => {
            const Icon = faIconMap[group.icon] || FaLaptop;
            const isActive = mobileOpen && mobilePath[0]?.id === group.id;
            return (
              <button
                key={group.slug}
                onClick={() => isActive ? closeMobile() : handleMobileOpenCategory(group)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                  isCategoryPage
                    ? isActive
                      ? "text-brand-800"
                      : "text-gray-600"
                    : isActive
                      ? "text-brand-800"
                      : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {group.name}
              </button>
            );
          })}
        </div>

        {/* Full-screen overlay */}
        {createPortal(
          <AnimatePresence>
            {mobileOpen && mobilePath.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed inset-0 z-[200] bg-white dark:bg-gray-900 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
                <button
                  type="button"
                  onClick={closeMobile}
                  className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {mobilePath[mobilePath.length - 1].name}
                </h2>
              </div>

              {/* Breadcrumbs */}
              {mobilePath.length > 1 && (
                <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-50 dark:border-gray-800 shrink-0">
                  {mobilePath.map((cat, i) => (
                    <span key={cat.id} className="flex items-center gap-1.5">
                      {i > 0 && <span className="text-gray-300">/</span>}
                      <button
                        type="button"
                        onClick={() => setMobilePath((prev) => prev.slice(0, i + 1))}
                        className={`text-xs font-medium transition-colors ${
                          i === mobilePath.length - 1
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* Voir tout */}
                <Link
                  to={`/categories/${mobilePath[mobilePath.length - 1].slug}`}
                  onClick={closeMobile}
                  className="flex items-center gap-3 px-4 py-3 mb-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 font-semibold text-sm transition-colors"
                >
                  <TbCategory className="w-5 h-5" />
                  Voir tout
                </Link>

                {/* Children */}
                <div className="space-y-1">
                  {(mobilePath[mobilePath.length - 1].children || []).map((cat) => {
                    const hasChildren = cat.children && cat.children.length > 0;
                    const Icon = faIconMap[cat.icon] || FaBoxOpen;
                    if (hasChildren) {
                      return (
                        <button
                          key={cat.slug}
                          onClick={() => handleMobileDrill(cat)}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <span className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-gray-400" />
                            {cat.name}
                          </span>
                          <FaChevronRight className="w-4 h-4 text-gray-300" />
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={cat.slug}
                        to={`/categories/${cat.slug}`}
                        onClick={closeMobile}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <Icon className="w-5 h-5 text-gray-400" />
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
          document.body
        )}
      </div>

      {/* ═══ Desktop: Mega Menu Dropdown ═══ */}
      <AnimatePresence>
        {activeParent && (
          <motion.div
            key={activeParent.slug}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onMouseEnter={handleCancelLeave}
            onMouseLeave={handleLeave}
            className="hidden md:block absolute top-full left-0 right-0 z-[100]"
          >
            <div className="bg-white dark:bg-gray-900 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.12)] border-t border-gray-100 dark:border-gray-800">
              <div className="max-w-350 mx-auto flex">
                {/* ── Left Panel: Image ── */}
                <div className="relative w-87.5 shrink-0 flex flex-col">
                  <div className="border-r border-gray-200 dark:border-gray-700 mb-6">
                    <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-800">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">{activeParent.name}</h3>
                      <Link
                        to={`/categories/${activeParent.slug}`}
                        onClick={closeMenu}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/30 rounded-lg text-xs font-semibold transition-colors shrink-0"
                      >
                        Voir tout
                        <FaArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <div className="mx-6 mt-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <img
                        src={groupImages[activeParent.slug] || groupImages.multimedia}
                        alt={activeParent.name}
                        className="w-full object-cover transition-transform duration-500 hover:scale-[1.03] aspect-5/5"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Right Panel: Subcategories Grid ── */}
                <div className="flex-1 p-8 overflow-y-auto" style={{ maxHeight: "420px" }}>
                  {activeParent.children?.length > 0 ? (
                    <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                      {activeParent.children.map((sub) => {
                        const hasSubChildren = sub.children && sub.children.length > 0;
                        return (
                          <div key={sub.slug}>
                            <Link
                              to={`/categories/${sub.slug}`}
                              onClick={closeMenu}
                              className="group inline-flex items-center gap-1.5 mb-3"
                            >
                              <h6 className="text-sm font-semibold text-black dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                                {sub.name}
                              </h6>
                              <FaChevronRight className="w-3 h-3 text-gray-300 dark:text-gray-600 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors opacity-0 group-hover:opacity-100" />
                            </Link>
                            {hasSubChildren && (
                              <ul className="space-y-1">
                                {sub.children.map((subSub) => (
                                  <li key={subSub.slug}>
                                    <Link
                                      to={`/categories/${subSub.slug}`}
                                      onClick={closeMenu}
                                      className="block py-1 text-xs font-medium text-gray-800 dark:text-gray-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                                    >
                                      {subSub.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-400 dark:text-gray-500 text-sm">Aucune sous-catégorie</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
