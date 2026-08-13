import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Search,
  X,
  Check,
  Package,
} from "lucide-react";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CATEGORY_ICON_MAP } from "@/shared/constants/categories";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";

const hexToColorKey = (hex) => {
  const map = {
    "#3B82F6": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#EF4444": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#8B5CF6": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#F59E0B": "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    "#EC4899": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#10B981": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#06B6D4": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#7C3AED": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#F97316": "text-brand-800 bg-brand-50 dark:bg-brand-800/10",
    "#F472B6": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#FB923C": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#22C55E": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#6366F1": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#A855F7": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#0EA5E9": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#D946EF": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#E11D48": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#16A34A": "text-brand-800 bg-brand-50 dark:bg-brand-800/10",
    "#C8102E": "text-brand-800 bg-brand-50 dark:bg-brand-800/10",
    "#D97706": "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    "#BE185D": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#78716C": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#0D9488": "text-brand-800 bg-brand-50 dark:bg-brand-800/10",
    "#C084FC": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#475569": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#DC2626": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#92400E": "text-yellow-600 bg-yellow-50 dark:bg-yellow-600/10",
    "#7C2D12": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#CA8A04": "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    "#DB2777": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
    "#B45309": "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    "#FACC15": "text-yellow-500 bg-yellow-50 dark:bg-yellow-500/10",
    "#6B7280": "text-brand-700 bg-brand-50 dark:bg-brand-700/10",
  };
  return map[hex] || "text-brand-800 bg-brand-50 dark:bg-brand-800/10";
};

const hexToActiveBg = (hex) => {
  const base = hexToColorKey(hex).split(" ").find((c) => c.startsWith("bg-"));
  return base ? base.replace("/10", "/20") : "bg-brand-200";
};

export default function CategoryFilter({
  selectedCategories = [],
  onCategoryChange,
  className,
  collapsible = true,
  maxVisible = 10,
}) {
  const [expanded, setExpanded] = useState(!collapsible);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: categories = [] } = useCategories();

  const filteredCategories = searchQuery
    ? categories.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories;

  const visibleCategories = expanded
    ? filteredCategories
    : filteredCategories.slice(0, maxVisible);

  const hiddenCount = filteredCategories.length - maxVisible;

  const isSelected = (id) => selectedCategories.includes(id);

  const handleToggle = (id) => {
    if (onCategoryChange) {
      if (isSelected(id)) {
        onCategoryChange(selectedCategories.filter((c) => c !== id));
      } else {
        onCategoryChange([...selectedCategories, id]);
      }
    }
  };

  const handleClear = () => {
    if (onCategoryChange) onCategoryChange([]);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Catégories
          </h3>
          {selectedCategories.length > 0 && (
            <Badge variant="primary" size="sm">
              {selectedCategories.length}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {selectedCategories.length > 0 && (
            <button
              onClick={handleClear}
              className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              title="Effacer la sélection"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={cn(
              "rounded-lg p-1 transition-colors",
              isSearchOpen
                ? "bg-brand-50 text-brand-800 dark:bg-brand-800/10"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            )}
            title="Rechercher"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filtrer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-8 text-xs text-gray-900 transition-colors placeholder:text-gray-400 focus:border-brand-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-h-[480px] overflow-y-auto p-2 scrollbar-thin">
        <div className="space-y-0.5">
          {visibleCategories.map((category) => {
            const Icon = CATEGORY_ICON_MAP[category.icon] || Package;
            const selected = isSelected(category.id);
            const colorStyle = hexToColorKey(category.color);

            return (
              <motion.button
                key={category.id}
                onClick={() => handleToggle(category.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all",
                  selected
                    ? "bg-brand-50 dark:bg-brand-800/10"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    selected ? hexToActiveBg(category.color) : colorStyle
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block truncate text-xs font-medium transition-colors",
                      selected
                        ? "text-brand-900 dark:text-brand-700"
                        : "text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {category.name}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {category.productCount} annonces
                  </span>
                </div>

                <div
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-all",
                    selected
                      ? "border-brand-800 bg-brand-800 text-white"
                      : "border-gray-200 dark:border-gray-700"
                  )}
                >
                  {selected && <Check className="h-3 w-3" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {!searchQuery && !expanded && hiddenCount > 0 && collapsible && (
        <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-800">
          <button
            onClick={() => setExpanded(true)}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-brand-800 transition-colors hover:bg-brand-50 dark:hover:bg-brand-800/10"
          >
            <ChevronDown className="h-3.5 w-3.5" />
            Voir {hiddenCount} de plus
          </button>
        </div>
      )}

      {expanded && !searchQuery && collapsible && hiddenCount > 0 && (
        <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-800">
          <button
            onClick={() => setExpanded(false)}
            className="flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronDown className="h-3.5 w-3.5 rotate-180" />
            Voir moins
          </button>
        </div>
      )}

      {selectedCategories.length > 0 && (
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Sélectionnées
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedCategories.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <button
                  key={catId}
                  onClick={() => handleToggle(catId)}
                  className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-medium text-brand-900 transition-colors hover:bg-brand-200 dark:bg-brand-800/10 dark:text-brand-700"
                >
                  {cat.name}
                  <X className="h-3 w-3" />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
