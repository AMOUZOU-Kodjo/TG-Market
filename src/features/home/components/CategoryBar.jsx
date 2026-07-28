import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
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
  FaGears,
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
  Watch: FaClock,
};

const groupImages = {
  multimedia: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
  vehicules: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
  maison: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
  mode: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
  loisirs: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
  famille: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop",
  "bricolage-jardin": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
  immobilier: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
  "pro-services": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
};

export default function CategoryBar() {
  const { data: categories = [] } = useCategories();
  const [openIndex, setOpenIndex] = useState(null);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0, width: 0 });
  const closeTimeout = useRef(null);
  const containerRef = useRef(null);

  const parents = categories.filter((c) => c.parentId === null);

  const handleEnter = useCallback((i) => {
    clearTimeout(closeTimeout.current);
    if (window.innerWidth >= 768) {
      const bar = containerRef.current;
      if (bar) {
        const rect = bar.getBoundingClientRect();
        setMenuPos({
          left: rect.left,
          top: rect.bottom,
          width: rect.width,
        });
      }
      setOpenIndex(i);
    }
  }, []);

  const handleLeave = useCallback(() => {
    if (window.innerWidth >= 768) {
      closeTimeout.current = setTimeout(() => setOpenIndex(null), 120);
    }
  }, []);

  const handleMobileClick = useCallback((i) => {
    if (window.innerWidth < 768) {
      setOpenIndex(openIndex === i ? null : i);
    }
  }, [openIndex]);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (openIndex !== null && containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openIndex]);

  if (parents.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="bg-[#01353095] dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-start md:justify-center gap-1 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-2">
          {parents.map((group, i) => {
            const Icon = faIconMap[group.icon] || FaLaptop;
            return (
              <div
                key={group.slug}
                className="relative shrink-0"
                onMouseEnter={() => handleEnter(i)}
                onMouseLeave={handleLeave}
              >
                <button
                  onClick={() => handleMobileClick(i)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    openIndex === i
                      ? "bg-brand-50 text-brand-800 dark:bg-brand-900/30 dark:text-brand-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-brand-50 hover:text-brand-800 dark:hover:bg-brand-900/30 dark:hover:text-brand-400"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {group.name}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {openIndex !== null && parents[openIndex] && (
          <motion.div
            key={parents[openIndex].slug}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[100] left-0 right-0 md:left-auto md:right-auto md:w-auto"
            style={
              window.innerWidth >= 768
                ? { left: menuPos.left + 200, top: menuPos.top, width: menuPos.width - 400 }
                : {
                    left: 0,
                    top: menuPos.top,
                    width: "100vw",
                    height: "calc(100vh - " + menuPos.top + "px)",
                  }
            }
            onMouseEnter={() => {
              if (window.innerWidth >= 768) {
                clearTimeout(closeTimeout.current);
                setOpenIndex(openIndex);
              }
            }}
            onMouseLeave={handleLeave}
          >
            <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-xl border border-gray-100 dark:border-gray-700 w-full h-full overflow-hidden flex flex-col">
              <div className="flex flex-col lg:flex-row flex-1 min-h-0">
                <div className="relative w-full h-40 lg:w-[280px] lg:h-full shrink-0">
                  <img
                    src={groupImages[parents[openIndex].slug] || groupImages.multimedia}
                    alt={parents[openIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/80 lg:dark:to-gray-800/80" />
                  <button
                    onClick={() => setOpenIndex(null)}
                    className="lg:hidden absolute top-3 left-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-4 lg:bottom-4">
                    <h3 className="text-lg font-bold text-white lg:text-gray-900 lg:dark:text-white drop-shadow">
                      {parents[openIndex].name}
                    </h3>
                  </div>
                </div>

                  <div className="flex-1 p-5 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4">
                    {parents[openIndex].children?.map((sub) => {
                      const SubIcon = faIconMap[sub.icon] || FaBoxOpen;
                      const hasSubChildren = sub.children?.length > 0;
                      return (
                        <div key={sub.slug}>
                          <Link
                            to={`/categories/${sub.slug}`}
                            onClick={() => setOpenIndex(null)}
                            className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <SubIcon className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0" />
                            {sub.name}
                          </Link>
                          {hasSubChildren && (
                            <div className="ml-8 mt-1 flex flex-wrap gap-1">
                              {sub.children.map((subSub) => {
                                const SubSubIcon = faIconMap[subSub.icon] || FaBoxOpen;
                                return (
                                  <Link
                                    key={subSub.slug}
                                    to={`/categories/${subSub.slug}`}
                                    onClick={() => setOpenIndex(null)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
                                  >
                                    <SubSubIcon className="w-3.5 h-3.5 shrink-0" />
                                    {subSub.name}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <Link
                    to={`/categories/${parents[openIndex].slug}`}
                    onClick={() => setOpenIndex(null)}
                    className="mt-3 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                  >
                    <TbCategory className="w-3.5 h-3.5" />
                    Voir tous les produits
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}