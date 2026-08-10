import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
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
  Building2,
  Cable,
  Calendar,
  Coffee,
  Glasses,
  Heart,
  LayoutGrid,
  BaggageClaim,
  ChevronRight,
  Tablet,
  Tv,
  User,
  Watch,
} from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";
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
  Building2,
  Cable,
  Calendar,
  Coffee,
  Glasses,
  Heart,
  BaggageClaim,
  Tablet,
  Tv,
  User,
  Watch,
};

const hexToBg = (hex) => {
  const map = {
    "#3B82F6": "bg-brand-700",
    "#EF4444": "bg-brand-700",
    "#8B5CF6": "bg-brand-700",
    "#F59E0B": "bg-yellow-500",
    "#EC4899": "bg-brand-700",
    "#10B981": "bg-brand-700",
    "#06B6D4": "bg-brand-700",
    "#7C3AED": "bg-brand-700",
    "#F97316": "bg-brand-800",
    "#F472B6": "bg-brand-700",
    "#FB923C": "bg-brand-700",
    "#22C55E": "bg-brand-700",
    "#6366F1": "bg-brand-700",
    "#A855F7": "bg-brand-700",
    "#0EA5E9": "bg-brand-700",
    "#D946EF": "bg-brand-700",
    "#E11D48": "bg-brand-700",
    "#16A34A": "bg-brand-800",
    "#C8102E": "bg-brand-800",
    "#D97706": "bg-yellow-500",
    "#BE185D": "bg-brand-700",
    "#78716C": "bg-brand-700",
    "#0D9488": "bg-brand-800",
    "#C084FC": "bg-brand-700",
    "#475569": "bg-brand-700",
    "#DC2626": "bg-brand-700",
    "#92400E": "bg-yellow-600",
    "#7C2D12": "bg-brand-700",
    "#CA8A04": "bg-yellow-500",
    "#DB2777": "bg-brand-700",
    "#B45309": "bg-yellow-500",
    "#FACC15": "bg-yellow-500",
    "#6B7280": "bg-brand-700",
  };
  return map[hex] || "bg-brand-800";
};

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState(null);

  const alphabet = useMemo(() => {
    const letters = new Set(
      categories.map((c) => c.name.charAt(0).toUpperCase())
    );
    return [...letters].sort();
  }, [categories]);

  const filtered = useMemo(() => {
    let megas = categories;

    if (selectedLetter) {
      megas = megas.filter(
        (c) => c.name.charAt(0).toUpperCase() === selectedLetter
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      megas = megas
        .map((mega) => {
          const megaMatches =
            mega.name.toLowerCase().includes(q) ||
            (mega.description && mega.description.toLowerCase().includes(q));
          const children = (mega.children ?? []).filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              (c.description && c.description.toLowerCase().includes(q))
          );
          if (megaMatches) return { ...mega, children: mega.children ?? [] };
          if (children.length) return { ...mega, children };
          return null;
        })
        .filter(Boolean);
    }

    return megas;
  }, [categories, searchQuery, selectedLetter]);

  const totalProducts = categories.reduce(
    (sum, c) => sum + (c.productCount ?? 0),
    0
  );

  const scrollToSection = (slug) => {
    document
      .getElementById(slug)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Catégories" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <Breadcrumb items={breadcrumbItems} className="mb-6" />

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Toutes les catégories
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {categories.length} catégories ·{" "}
                {new Intl.NumberFormat("fr-FR").format(totalProducts)} annonces au total
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
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
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="mb-4 -mx-4 flex gap-1.5 overflow-x-auto px-4 hide-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            onClick={() => {
              setSelectedLetter(null);
              setSearchQuery("");
            }}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition-colors",
              !selectedLetter && !searchQuery
                ? "bg-brand-800 text-white"
                : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
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
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                selectedLetter === letter
                  ? "bg-brand-800 text-white"
                  : "bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
              )}
            >
              {letter}
            </button>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="mb-8 -mx-4 flex items-center gap-2 overflow-x-auto px-4 hide-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
            {filtered.map((mega) => {
              const QuickIcon = iconMap[mega.icon] || Package;
              return (
                <button
                  key={mega.id}
                  onClick={() => scrollToSection(mega.slug)}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 transition-colors hover:border-brand-800 hover:text-brand-800 sm:shrink dark:border-gray-700 dark:bg-gray-700/50 dark:text-gray-200 dark:hover:border-brand-600 dark:hover:text-brand-400"
                >
                  <QuickIcon className="h-3.5 w-3.5 text-gray-400" />
                  {mega.name}
                </button>
              );
            })}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
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
              className="mt-4 text-sm font-medium text-brand-800 hover:text-brand-900"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {filtered.map((mega) => {
              const MegaIcon = iconMap[mega.icon] || Package;
              const children = mega.children ?? [];
              const megaCount = mega.productCount ?? 0;
              return (
                <section
                  key={mega.id}
                  id={mega.slug}
                  className="scroll-mt-6"
                >
                  <div className="mb-4 flex items-start gap-3 border-b border-gray-100 pb-4 dark:border-gray-700">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor: `${mega.color || "#01796F"}15`,
                        color: mega.color || "#01796F",
                      }}
                    >
                      <MegaIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                          {mega.name}
                        </h2>
                        {megaCount > 0 && (
                          <Badge variant="secondary" size="sm">
                            {megaCount} annonces
                          </Badge>
                        )}
                      </div>
                      {mega.description && (
                        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                          {mega.description}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/categories/${mega.slug}`}
                      className="flex shrink-0 items-center gap-1 text-xs font-medium text-brand-800 hover:text-brand-900"
                    >
                      <span className="hidden sm:inline">Voir tout</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {children.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-6">
                      {children.map((child) => {
                        const ChildIcon = iconMap[child.icon] || Package;
                        return (
                          <Link
                            key={child.id}
                            to={`/categories/${child.slug}`}
                            className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-3 transition-colors dark:border-gray-700 dark:bg-gray-700/50"
                          >
                            <div
                              className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: `${child.color || "#01796F"}12`,
                                color: child.color || "#01796F",
                              }}
                            >
                              <ChildIcon className="h-4.5 w-4.5" />
                            </div>
                            <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                              {child.name}
                            </h3>
                            {(child.productCount ?? 0) > 0 && (
                              <p className="mt-1 text-[11px] text-gray-400">
                                {child.productCount} annonces
                              </p>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">
                      Aucune sous-catégorie
                    </p>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
