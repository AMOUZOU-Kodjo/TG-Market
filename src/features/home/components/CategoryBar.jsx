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
    slug: "multimedia",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
    subs: [
      { name: "Téléphones", slug: "telephones", icon: FaMobileScreen },
      { name: "Électronique", slug: "electronique", icon: FaLaptop },
      { name: "Multimédia & Jeux", slug: "multimedia-jeux", icon: FaGamepad },
      { name: "Appareils Photo & Vidéo", slug: "photo-video", icon: FaCamera },
    ],
  },
  {
    label: "Véhicules",
    icon: FaCar,
    slug: "vehicules",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop",
    subs: [
      { name: "Véhicules", slug: "vehicules", icon: FaCar },
      { name: "Motos & Scooters", slug: "motos", icon: FaBicycle },
    ],
  },
  {
    label: "Maison",
    icon: FaHouse,
    slug: "maison-meubles",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
    subs: [
      { name: "Maison & Meubles", slug: "maison-meubles", icon: FaCouch },
      { name: "Électroménager", slug: "electromenager", icon: FaBlender },
    ],
  },
  {
    label: "Mode & Beauté",
    icon: FaShirt,
    slug: "mode-vetements",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&h=300&fit=crop",
    subs: [
      { name: "Mode & Vêtements", slug: "mode-vetements", icon: FaShirt },
      { name: "Chaussures", slug: "chaussures", icon: FaPersonWalking },
      { name: "Sacs & Maroquinerie", slug: "sacs-maroquinerie", icon: FaBagShopping },
      { name: "Bijoux & Montres", slug: "bijoux-montres", icon: FaClock },
      { name: "Beauté & Santé", slug: "beaute-sante", icon: FaStar },
      { name: "Cosmétiques & Parfums", slug: "cosmetiques-parfums", icon: FaStar },
    ],
  },
  {
    label: "Loisirs",
    icon: FaDumbbell,
    slug: "sport-loisirs",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop",
    subs: [
      { name: "Sport & Loisirs", slug: "sport-loisirs", icon: FaDumbbell },
      { name: "Livres & Papeterie", slug: "livres-papeterie", icon: FaBookOpen },
      { name: "Musique & Instruments", slug: "musique-instruments", icon: FaGuitar },
      { name: "Art & Artisanat", slug: "art-artisanat", icon: FaPaintbrush },
    ],
  },
  {
    label: "Famille",
    icon: FaBaby,
    slug: "bebes-enfants",
    image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop",
    subs: [
      { name: "Bébés & Enfants", slug: "bebes-enfants", icon: FaBaby },
      { name: "Vêtements Enfants", slug: "vetements-enfants", icon: FaShirt },
      { name: "Animaux", slug: "animaux", icon: FaPaw },
    ],
  },
  {
    label: "Bricolage & Jardin",
    icon: FaHammer,
    slug: "jardin-exterieur",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    subs: [
      { name: "Outils & Bricolage", slug: "outils-bricolage", icon: FaHammer },
      { name: "Jardin & Extérieur", slug: "jardin-exterieur", icon: FaTree },
      { name: "Matériaux de Construction", slug: "materiaux-construction", icon: FaHammer },
      { name: "Énergie & Solaire", slug: "energie-solaire", icon: FaStar },
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
      { name: "Équipement Professionnel", slug: "equipement-pro", icon: FaBriefcase },
      { name: "Services", slug: "services", icon: FaWrench },
      { name: "Événementiel", slug: "evenementiel", icon: FaBoxOpen },
      { name: "Divers", slug: "divers", icon: FaBoxOpen },
    ],
  },
];

export default function CategoryBar() {
  const [openIndex, setOpenIndex] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0, width: 0 });
  const closeTimeout = useRef(null);
  const containerRef = useRef(null);

  const handleEnter = useCallback((i) => {
    clearTimeout(closeTimeout.current);
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
  }, []);

  const handleLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => setOpenIndex(null), 120);
  }, []);

  useEffect(() => {
    return () => clearTimeout(closeTimeout.current);
  }, []);

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar px-4 sm:px-6 lg:px-8 py-2">
          <Link
            to="/categories"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-brand-800 text-white text-xs font-semibold whitespace-nowrap shrink-0 hover:bg-brand-900 transition-colors"
          >
            <TbLayoutGrid className="w-3.5 h-3.5" />
            Tout
          </Link>

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
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setMobileOpen(mobileOpen === i ? null : i);
                    }
                  }}
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

      {/* Mega Menu — fixed to viewport, rendered at root level */}
      <AnimatePresence>
        {openIndex !== null && (
          <motion.div
            key={openIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="hidden  md:block fixed z-[100]"
            style={{ left: menuPos.left + 200, top: menuPos.top, width: menuPos.width - 400 }}
            onMouseEnter={() => {
              clearTimeout(closeTimeout.current);
              setOpenIndex(openIndex);
            }}
            onMouseLeave={handleLeave}
          >
              <div className="bg-white dark:bg-gray-800 rounded-b-lg  shadow-xl border border-gray-100 dark:border-gray-700 w-full overflow-hidden">
              <div className="flex">
                {/* Image gauche */}
                <div className="hidden lg:block w-[280px] shrink-0 relative">
                  <img
                    src={GROUPS[openIndex].image}
                    alt={GROUPS[openIndex].label}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/80 dark:to-gray-800/80" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white drop-shadow">
                      {GROUPS[openIndex].label}
                    </h3>
                  </div>
                </div>

                {/* Sous-catégories */}
                <div className="flex-1 p-5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 px-1 lg:hidden">
                    {GROUPS[openIndex].label}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                    {GROUPS[openIndex].subs.map((sub) => {
                      const SubIcon = sub.icon;
                      return (
                        <Link
                          key={sub.slug}
                          to={`/categories/${sub.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <SubIcon className="w-4 h-4 text-gray-400 dark:text-gray-500 shrink-0" />
                          {sub.name}
                        </Link>
                      );
                    })}
                  </div>
                  <Link
                    to="/categories"
                    className="mt-3 flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-brand-700 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
                  >
                    {/* <TbCategory className="w-3.5 h-3.5" />
                    Toutes les catégories */}
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
