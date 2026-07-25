import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  GraduationCap,
  Crown,
  Scissors,
  Hammer,
  Wrench,
  PartyPopper,
  Camera,
  Bike,
  Footprints,
  ShoppingBag,
  Gem,
  Flower2,
  Sun,
  Package,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { mockCategories } from "@/data/categories";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

const iconMap = {
  Smartphone,
  Car,
  Laptop,
  Sofa,
  Shirt,
  Home,
  Refrigerator,
  Gamepad2,
  Dumbbell,
  Sparkles,
  Baby,
  Apple,
  Briefcase,
  PawPrint,
  BookOpen,
  Music,
  Palette,
  TreePine,
  GraduationCap,
  Crown,
  Scissors,
  Hammer,
  Wrench,
  PartyPopper,
  Camera,
  Bike,
  Footprints,
  ShoppingBag,
  Gem,
  Flower2,
  Sun,
  Package,
};

const hexToBg = (hex) => {
  const map = {
    "#3B82F6": "bg-red-700",
    "#EF4444": "bg-red-700",
    "#8B5CF6": "bg-red-700",
    "#F59E0B": "bg-yellow-500",
    "#EC4899": "bg-red-700",
    "#10B981": "bg-green-700",
    "#06B6D4": "bg-red-700",
    "#7C3AED": "bg-red-700",
    "#F97316": "bg-red-800",
    "#F472B6": "bg-red-700",
    "#FB923C": "bg-red-700",
    "#22C55E": "bg-green-700",
    "#6366F1": "bg-red-700",
    "#A855F7": "bg-red-700",
    "#0EA5E9": "bg-red-700",
    "#D946EF": "bg-red-700",
    "#E11D48": "bg-red-700",
    "#16A34A": "bg-green-800",
    "#C8102E": "bg-red-800",
    "#D97706": "bg-yellow-500",
    "#BE185D": "bg-red-700",
    "#78716C": "bg-green-700",
    "#0D9488": "bg-green-800",
    "#C084FC": "bg-red-700",
    "#475569": "bg-green-700",
    "#DC2626": "bg-red-700",
    "#92400E": "bg-yellow-600",
    "#7C2D12": "bg-red-700",
    "#CA8A04": "bg-yellow-500",
    "#DB2777": "bg-red-700",
    "#B45309": "bg-yellow-500",
    "#FACC15": "bg-yellow-500",
    "#6B7280": "bg-green-700",
  };
  return map[hex] || "bg-red-800";
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const alphabet = useMemo(() => {
    const letters = new Set(
      mockCategories.map((c) => c.name.charAt(0).toUpperCase())
    );
    return [...letters].sort();
  }, []);

  const filteredCategories = useMemo(() => {
    let result = mockCategories;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    if (selectedLetter) {
      result = result.filter(
        (c) => c.name.charAt(0).toUpperCase() === selectedLetter
      );
    }

    return result;
  }, [searchQuery, selectedLetter]);

  const totalProducts = mockCategories.reduce(
    (sum, c) => sum + c.productCount,
    0
  );

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Catégories" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Toutes les catégories
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {mockCategories.length} catégories ·{" "}
                {new Intl.NumberFormat("fr-FR").format(totalProducts)} annonces au total
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value) setSelectedLetter(null);
              }}
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-1.5"
        >
          <button
            onClick={() => {
              setSelectedLetter(null);
              setSearchQuery("");
            }}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
              !selectedLetter && !searchQuery
                ? "bg-red-800 text-white shadow-sm shadow-red-800/25"
                : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            )}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          {alphabet.map((letter) => (
            <button
              key={letter}
              onClick={() => {
                setSelectedLetter(selectedLetter === letter ? null : letter);
                setSearchQuery("");
              }}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all",
                selectedLetter === letter
                  ? "bg-red-800 text-white shadow-sm shadow-red-800/25"
                  : "bg-white text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              {letter}
            </button>
          ))}
        </motion.div>

        {filteredCategories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 text-center"
          >
            <Search className="mx-auto mb-4 h-12 w-12 text-gray-300 dark:text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Aucune catégorie trouvée
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Essayez un autre terme de recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLetter(null);
              }}
              className="mt-4 text-sm font-medium text-red-800 hover:text-red-900"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        ) : (
          <>
            <div className="mb-4 text-xs font-medium text-gray-400 dark:text-gray-500">
              {filteredCategories.length} catégorie{filteredCategories.length > 1 ? "s" : ""}
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              key={`${selectedLetter}-${searchQuery}`}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            >
              {filteredCategories.map((cat) => {
                const Icon = iconMap[cat.icon] || Package;
                return (
                  <motion.div key={cat.id} variants={staggerItem}>
                    <Link to={`/categories/${cat.slug}`}>
                      <motion.div
                        whileHover={{ y: -6, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                      >
                        <div
                          className={cn(
                            "relative flex h-28 items-center justify-center sm:h-32",
                            hexToBg(cat.color) + "/10"
                          )}
                        >
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${cat.color}15`,
                              color: cat.color,
                            }}
                          >
                            <Icon className="h-7 w-7" />
                          </div>
                          <Badge
                            variant="secondary"
                            size="sm"
                            className="absolute right-2 top-2 bg-white/80 backdrop-blur-sm dark:bg-gray-900/80"
                          >
                            {cat.productCount}
                          </Badge>
                        </div>

                        <div className="p-4">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-800 transition-colors">
                            {cat.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                            {cat.description}
                          </p>
                          <div className="mt-3 flex items-center gap-1 text-xs font-medium text-red-800 opacity-0 transition-opacity group-hover:opacity-100">
                            Explorer
                            <ChevronRight className="h-3.5 w-3.5" />
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
