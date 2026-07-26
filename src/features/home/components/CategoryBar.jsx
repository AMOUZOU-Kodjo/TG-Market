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
} from "react-icons/fa6";
import { TbLayoutGrid, TbCategory } from "react-icons/tb";

const GROUPS = [
  {
    label: "Multimédia",
    icon: FaLaptop,
    slug: "telephones",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
    subs: [
      { name: "Téléphones", slug: "telephones", icon: FaMobileScreen },
      { name: "Électronique", slug: "electronique", icon: FaLaptop },
      { name: "Multimédia", slug: "multimedia", icon: FaGamepad },
      { name: "Tablettes", slug: "tablettes", icon: FaTabletScreenButton },
      { name: "Accessoires tech", slug: "accessoires-tech", icon: FaHeadphones },
    ],
  },
  {
    label: "Véhicules",
    icon: FaCar,
    slug: "vehicules",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    subs: [
      { name: "Véhicules", slug: "vehicules", icon: FaCar },
    ],
  },
  {
    label: "Maison",
    icon: FaHouse,
    slug: "maison",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    subs: [
      { name: "Maison & Décoration", slug: "maison", icon: FaCouch },
      { name: "Meubles", slug: "meubles", icon: FaCouch },
      { name: "Électroménager", slug: "electromenager", icon: FaBlender },
    ],
  },
  {
    label: "Mode & Beauté",
    icon: FaShirt,
    slug: "vetements",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
    subs: [
      { name: "Vêtements", slug: "vetements", icon: FaShirt },
      { name: "Vêtements Homme", slug: "vetements-homme", icon: FaShirt },
      { name: "Vêtements Femme", slug: "vetements-femme", icon: FaShirt },
      { name: "Chaussures", slug: "chaussures", icon: FaPersonWalking },
      { name: "Maroquinerie", slug: "maroquinerie", icon: FaBagShopping },
      { name: "Montres & Bijoux", slug: "montres", icon: FaClock },
      { name: "Beauté & Santé", slug: "beaute", icon: FaStar },
    ],
  },
  {
    label: "Loisirs",
    icon: FaDumbbell,
    slug: "sports",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    subs: [
      { name: "Sports & Loisirs", slug: "sports", icon: FaDumbbell },
      { name: "Livres & Médias", slug: "livres", icon: FaBookOpen },
      { name: "Musique & Instruments", slug: "musique", icon: FaGuitar },
      { name: "Art & Artisanat", slug: "art", icon: FaPaintbrush },
    ],
  },
  {
    label: "Famille",
    icon: FaBaby,
    slug: "enfants",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop",
    subs: [
      { name: "Enfants & Bébé", slug: "enfants", icon: FaBaby },
      { name: "Animaux", slug: "animaux", icon: FaPaw },
      { name: "Jeux & Jouets", slug: "jouets", icon: FaGamepad },
    ],
  },
  {
    label: "Bricolage & Jardin",
    icon: FaHammer,
    slug: "jardin",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    subs: [
      { name: "Outils & Bricolage", slug: "outils", icon: FaHammer },
      { name: "Jardin & Extérieur", slug: "jardin", icon: FaTree },
    ],
  },
  {
    label: "Immobilier",
    icon: FaBuilding,
    slug: "immobilier",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
    subs: [
      { name: "Immobilier", slug: "immobilier", icon: FaBuilding },
    ],
  },
  {
    label: "Pro & Services",
    icon: FaBriefcase,
    slug: "services",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    subs: [
      { name: "Services", slug: "services", icon: FaWrench },
      { name: "Emploi & Formation", slug: "emploi", icon: FaBriefcase },
      { name: "Événementiel", slug: "evenements", icon: FaBoxOpen },
      { name: "Alimentation", slug: "alimentation", icon: FaBoxOpen },
    ],
  },
];

export default function CategoryBar() {
  const [openIndex, setOpenIndex] = useState(null);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0, width: 0 });
  const closeTimeout = useRef(null);
  const containerRef = useRef(null);

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

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-2">
          {/* <Link
            to="/categories"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-800 text-white text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-brand-900 transition-colors"
          >
             <TbLayoutGrid className="w-3.5 h-3.5" />
            Tout 
          </Link> */}

          {GROUPS.map((group, i) => {
            const Icon = group.icon;
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
                  {group.label}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mega Menu */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            key={openIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[100] left-0 right-0 md:left-auto md:right-auto md:w-auto"
            style={window.innerWidth >= 768 ? { left: menuPos.left + 200, top: menuPos.top, width: menuPos.width - 400 } : { left: 0, top: menuPos.top, width: '100vw', height: 'calc(100vh - ' + menuPos.top + 'px)' }}
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
                {/* Image: top on mobile, side on desktop */}
                <div className="relative w-full h-40 lg:w-[280px] lg:h-full shrink-0">
                  <img
                    src={GROUPS[openIndex].image}
                    alt={GROUPS[openIndex].label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-white/80 lg:dark:to-gray-800/80" />
                  <button
                    onClick={() => setOpenIndex(null)}
                    className="lg:hidden absolute top-3 left-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors z-10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="absolute bottom-3 left-4 lg:bottom-4">
                    <h3 className="text-lg font-bold text-white lg:text-gray-900 lg:dark:text-white drop-shadow">
                      {GROUPS[openIndex].label}
                    </h3>
                  </div>
                </div>

                {/* Sous-catégories */}
                <div className="flex-1 p-5 overflow-y-auto">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 px-1 hidden">
                    {GROUPS[openIndex].label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                    {GROUPS[openIndex].subs.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.slug}
                          to={`/categories/${sub.slug}`}
                          onClick={() => setOpenIndex(null)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <SubIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                   <Link
                    to={`/categories/${GROUPS[openIndex].slug}`}
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
