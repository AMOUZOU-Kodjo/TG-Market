import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  SearchX,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Button from "@/shared/ui/Button";
import Pagination from "@/shared/ui/Pagination";
import EmptyState from "@/shared/ui/EmptyState";
import ProductCard from "@/shared/ui/ProductCard";
import SearchBar from "@/shared/ui/SearchBar";
import SortDropdown from "@/features/search/components/SortDropdown";
import FilterSidebar from "@/features/search/components/FilterSidebar";
import ActiveFilters from "@/features/search/components/ActiveFilters";
import { mockProducts } from "@/data/products";

const ITEMS_PER_PAGE = 12;

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-gray-800" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  );
}

function LoadingSkeleton({ view }) {
  if (view === "list") {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="h-40 w-48 shrink-0 animate-pulse bg-gray-200 dark:bg-gray-800" />
            <div className="flex-1 space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

const initialFilters = {
  categories: [],
  minPrice: "",
  maxPrice: "",
  city: "",
  conditions: [],
  verifiedSeller: false,
  deliveryAvailable: false,
  negotiable: false,
  urgent: false,
  onPromotion: false,
};

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading] = useState(false);
  const [view, setView] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const query = searchParams.get("q") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState(() => {
    const params = {};
    const cats = searchParams.get("categories");
    if (cats) params.categories = cats.split(",");
    const conds = searchParams.get("conditions");
    if (conds) params.conditions = conds.split(",");
    if (searchParams.get("minPrice")) params.minPrice = searchParams.get("minPrice");
    if (searchParams.get("maxPrice")) params.maxPrice = searchParams.get("maxPrice");
    if (searchParams.get("city")) params.city = searchParams.get("city");
    if (searchParams.get("verifiedSeller") === "true") params.verifiedSeller = true;
    if (searchParams.get("deliveryAvailable") === "true") params.deliveryAvailable = true;
    if (searchParams.get("negotiable") === "true") params.negotiable = true;
    if (searchParams.get("urgent") === "true") params.urgent = true;
    if (searchParams.get("onPromotion") === "true") params.onPromotion = true;
    return { ...initialFilters, ...params };
  });

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([k, v]) => {
        if (v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0)) {
          next.delete(k);
        } else if (Array.isArray(v)) {
          next.set(k, v.join(","));
        } else {
          next.set(k, String(v));
        }
      });
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      updateParams({
        ...newFilters,
        page: 1,
      });
    },
    [updateParams]
  );

  const handleSortChange = useCallback(
    (newSort) => {
      updateParams({ sort: newSort, page: 1 });
    },
    [updateParams]
  );

  const handlePageChange = useCallback(
    (newPage) => {
      updateParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateParams]
  );

  const handleSearch = useCallback(
    (searchQuery) => {
      updateParams({ q: searchQuery, page: 1 });
    },
    [updateParams]
  );

  const handleRemoveFilter = useCallback(
    (key) => {
      if (key === "categories" || key === "conditions") {
        handleFilterChange({ ...filters, [key]: [] });
      } else if (
        key === "verifiedSeller" ||
        key === "deliveryAvailable" ||
        key === "negotiable" ||
        key === "urgent" ||
        key === "onPromotion"
      ) {
        handleFilterChange({ ...filters, [key]: false });
      } else {
        handleFilterChange({ ...filters, [key]: "" });
      }
    },
    [filters, handleFilterChange]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams();
        if (prev.get("q")) next.set("q", prev.get("q"));
        if (prev.get("sort")) next.set("sort", prev.get("sort"));
        return next;
      },
      { replace: true }
    );
  }, [setSearchParams]);

  const activeFilterChips = useMemo(() => {
    const chips = [];
    filters.categories.forEach((cat) => {
      chips.push({ key: `cat-${cat}`, label: cat.replace(/-/g, " "), type: "categories" });
    });
    filters.conditions.forEach((cond) => {
      chips.push({ key: `cond-${cond}`, label: cond, type: "conditions" });
    });
    if (filters.minPrice) chips.push({ key: "minPrice", label: `Min: ${filters.minPrice} FCFA` });
    if (filters.maxPrice) chips.push({ key: "maxPrice", label: `Max: ${filters.maxPrice} FCFA` });
    if (filters.city) chips.push({ key: "city", label: filters.city });
    if (filters.verifiedSeller) chips.push({ key: "verifiedSeller", label: "Vendeur vérifié" });
    if (filters.deliveryAvailable) chips.push({ key: "deliveryAvailable", label: "Livraison" });
    if (filters.negotiable) chips.push({ key: "negotiable", label: "Négociable" });
    if (filters.urgent) chips.push({ key: "urgent", label: "Urgent" });
    if (filters.onPromotion) chips.push({ key: "onPromotion", label: "Promotion" });
    return chips;
  }, [filters]);

  const filteredProducts = useMemo(() => {
    let result = [...mockProducts];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters.categories.length > 0) {
      result = result.filter((p) =>
        filters.categories.includes(p.categorySlug)
      );
    }

    if (filters.conditions.length > 0) {
      result = result.filter((p) =>
        filters.conditions.some((c) => {
          const condMap = { new: "Neuf", like_new: "Comme neuf", good: "Bon état", fair: "État correct", poor: "Usé" };
          return condMap[c] === p.condition || c === p.condition;
        })
      );
    }

    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice));
    }

    if (filters.city) {
      result = result.filter((p) => p.city === filters.city);
    }

    if (filters.verifiedSeller) result = result.filter((p) => p.seller?.verified);
    if (filters.deliveryAvailable) result = result.filter((p) => p.deliveryAvailable);
    if (filters.negotiable) result = result.filter((p) => p.negotiable);
    if (filters.urgent) result = result.filter((p) => p.urgent);
    if (filters.onPromotion) result = result.filter((p) => p.onPromotion);

    switch (sort) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return result;
  }, [query, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <div className="mx-auto max-w-2xl">
            <SearchBar
              value={query}
              onSearch={handleSearch}
              onChange={(val) => {
                if (!val) handleSearch("");
              }}
              placeholder="Rechercher un article..."
            />
          </div>
        </div>

        {activeFilterChips.length > 0 && (
          <div className="mb-4">
            <ActiveFilters
              filters={activeFilterChips}
              onRemove={handleRemoveFilter}
              onClearAll={handleResetFilters}
            />
          </div>
        )}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              {filteredProducts.length}
            </span>{" "}
            annonce{filteredProducts.length !== 1 ? "s" : ""} trouvée
            {filteredProducts.length !== 1 ? "s" : ""}
            {query && (
              <span>
                {" "}
                pour « <span className="font-medium text-brand-800">{query}</span> »
              </span>
            )}
          </p>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              icon={SlidersHorizontal}
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden"
            >
              Filtres
              {activeFilterChips.length > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-800 px-1 text-[10px] font-bold text-white">
                  {activeFilterChips.length}
                </span>
              )}
            </Button>

            <div className="hidden items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-900 sm:flex">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "grid"
                    ? "bg-brand-800 text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  view === "list"
                    ? "bg-brand-800 text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <SortDropdown value={sort} onChange={handleSortChange} />
          </div>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            {isLoading ? (
              <LoadingSkeleton view={view} />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Aucun résultat trouvé"
                description="Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez."
                action={
                  <Button variant="outline" onClick={handleResetFilters}>
                    Réinitialiser les filtres
                  </Button>
                }
              />
            ) : view === "list" ? (
              <div className="space-y-4">
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <ProductCard
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      location={`${product.neighborhood ? product.neighborhood + ", " : ""}${product.city}`}
                      seller={product.seller}
                      condition={product.condition}
                      hasActiveNegotiation={product.hasActiveNegotiation}
                      onClick={() => navigate(`/annonce/${product.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
              >
                {paginatedProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      location={`${product.neighborhood ? product.neighborhood + ", " : ""}${product.city}`}
                      seller={product.seller}
                      condition={product.condition}
                      hasActiveNegotiation={product.hasActiveNegotiation}
                      onClick={() => navigate(`/annonce/${product.id}`)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-sm"
            >
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onReset={handleResetFilters}
                mobile
                onClose={() => setShowMobileFilters(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
