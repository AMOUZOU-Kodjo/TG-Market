import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  SlidersHorizontal,
  Grid3X3,
  List,
  SearchX,
} from "lucide-react";
import BackButton from "@/shared/ui/BackButton";
import { cn } from "@/shared/utils/cn";
import Button from "@/shared/ui/Button";
import Pagination from "@/shared/ui/Pagination";
import EmptyState from "@/shared/ui/EmptyState";
import ProductCard from "@/shared/ui/ProductCard";
import SearchBar from "@/shared/ui/SearchBar";
import SortDropdown from "@/features/search/components/SortDropdown";
import FilterSidebar from "@/features/search/components/FilterSidebar";
import FilterBand from "@/features/search/components/FilterBand";
import ActiveFilters from "@/features/search/components/ActiveFilters";
import { useSearch } from "@/features/search/hooks/useSearch";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useIsMobile } from "@/shared/hooks/useMediaQuery";

function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
      <div className="aspect-[100/120] animate-pulse bg-gray-200 dark:bg-gray-800" />
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
            className="flex overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
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
  const [view, setView] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 20 : 40;

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

  const searchParamsObj = useMemo(() => {
    const params = {
      q: query || undefined,
      sort,
      perPage: itemsPerPage,
    };
    if (filters.categories.length > 0) params.categories = filters.categories.join(",");
    if (filters.minPrice) params.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
    if (filters.conditions.length > 0) params.conditions = filters.conditions.join(",");
    if (filters.city) params.city = filters.city;
    if (filters.verifiedSeller) params.verifiedSeller = true;
    if (filters.deliveryAvailable) params.deliveryAvailable = true;
    if (filters.negotiable) params.negotiable = true;
    if (filters.urgent) params.urgent = true;
    if (filters.onPromotion) params.onPromotion = true;
    return params;
  }, [query, sort, page, filters]);

  const { data: searchData, isLoading } = useSearch(searchParamsObj);
  const filteredProducts = searchData?.data || [];
  const totalPages = searchData?.meta?.lastPage || Math.max(1, Math.ceil((searchData?.meta?.total || 0) / itemsPerPage));
  const paginatedProducts = filteredProducts;

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
        <div className="sticky top-0 z-40 -mx-4 sm:-mx-6 lg:-mx-8 bg-gray-50 dark:bg-gray-950 px-4 sm:px-6 lg:px-8 pb-4">
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <BackButton />
              <span className="text-[11px] sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {searchData?.total || filteredProducts.length}
                </span>{" "}
                annonce{filteredProducts.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-full max-w-md">
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
            <div className="flex items-center gap-2 shrink-0">
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
              <div className="hidden items-center gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-gray-700 dark:bg-gray-800 sm:flex">
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
              <SortDropdown value={sort} onChange={handleSortChange} className="hidden sm:block" />
            </div>
          </div>

          {activeFilterChips.length > 0 && (
            <div className="mt-3">
              <ActiveFilters
                filters={activeFilterChips}
                onRemove={handleRemoveFilter}
                onClearAll={handleResetFilters}
              />
            </div>
          )}

          <FilterBand
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
            className="mt-3 hidden lg:block"
          />
        </div>

        {query && (
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-400 sm:hidden">
            <span className="font-semibold text-gray-900 dark:text-white">
              {searchData?.total || filteredProducts.length}
            </span>{" "}
            annonce{filteredProducts.length !== 1 ? "s" : ""} trouvée
            {filteredProducts.length !== 1 ? "s" : ""}
            {" "}pour « <span className="font-medium text-brand-800">{query}</span> »
          </div>
        )}

        <div className="flex gap-6">
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
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => navigate(`/annonce/${product.id}`)}
                    className="flex h-[190px] cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-800"
                  >
                    <div className="w-2/5 shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={product.images?.[0]}
                        alt={product.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between px-4 py-3">
                      <div>
                        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
                          {product.title}
                        </h3>
                        <p className="mt-1 text-sm font-bold text-brand-800">
                          {new Intl.NumberFormat("fr-FR").format(product.price)} FCFA
                        </p>
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {product.city && `${product.city}, `}Togo
                        </p>
                        {product.negotiable && (
                          <span className="text-xs font-semibold text-green-600">Négociable</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              >
                {paginatedProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants}>
                    <ProductCard
                      productId={product.id}
                      image={product.images[0]}
                      title={product.title}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      location={product.city}
                      neighborhood={product.neighborhood}
                      condition={product.condition}
                      hasActiveNegotiation={product.hasActiveNegotiation}
                      hasActiveEscrow={product.hasActiveEscrow}
                      quantity={product.quantity}
                      status={product.status}
                      isUrgent={product.isUrgent}
                      isPromoted={product.isPromoted}
                      isFeatured={product.isFeatured}
                      negotiable={product.negotiable}
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
