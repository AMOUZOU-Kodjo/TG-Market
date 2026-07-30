import { useState, useCallback } from "react";
import { RotateCcw, MapPin, ChevronDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CITIES, PRODUCT_CONDITIONS } from "@/shared/constants";

function FilterPill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-brand-800 bg-brand-800 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      )}
    >
      {children}
    </button>
  );
}

function ToggleChip({ checked, onChange, label }) {
  return (
    <button
      type="button"
      onClick={() => onChange?.(!checked)}
      className={cn(
        "whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        checked
          ? "border-brand-800 bg-brand-800 text-white"
          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      )}
    >
      {checked ? "✓ " : ""}{label}
    </button>
  );
}

export default function FilterBand({ filters, onFilterChange, onReset, className }) {
  const { data: allCategories = [] } = useCategories();
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const {
    categories = [],
    minPrice = "",
    maxPrice = "",
    city = "",
    conditions = [],
    verifiedSeller = false,
    deliveryAvailable = false,
    negotiable = false,
    urgent = false,
    onPromotion = false,
  } = filters;

  const updateFilter = useCallback(
    (key, value) => {
      onFilterChange?.({ ...filters, [key]: value });
    },
    [filters, onFilterChange]
  );

  const activeCount =
    categories.length + conditions.length +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (city ? 1 : 0) +
    (verifiedSeller ? 1 : 0) + (deliveryAvailable ? 1 : 0) +
    (negotiable ? 1 : 0) + (urgent ? 1 : 0) + (onPromotion ? 1 : 0);

  return (
    <div className={cn("rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800", className)}>
      <div className="flex flex-col gap-3">
        {/* Categories row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <FilterPill
            active={categories.length === 0}
            onClick={() => updateFilter("categories", [])}
          >
            Toutes
          </FilterPill>
          {allCategories.slice(0, 15).map((cat) => (
            <FilterPill
              key={cat.id}
              active={categories.includes(String(cat.id))}
              onClick={() => {
                const id = String(cat.id);
                const next = categories.includes(id)
                  ? categories.filter((c) => c !== id)
                  : [...categories, id];
                updateFilter("categories", next);
              }}
            >
              {cat.name}
            </FilterPill>
          ))}
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Price inputs */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
            <span className="text-xs text-gray-400">—</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="w-20 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <span className="hidden h-4 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

          {/* City dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-600 transition-colors hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <MapPin className="h-3 w-3" />
              {city || "Ville"}
              <ChevronDown className="h-3 w-3" />
            </button>
            {showCityDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowCityDropdown(false)} />
                <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-44 overflow-y-auto rounded-xl border border-gray-100 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  {CITIES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => { updateFilter("city", city === c ? "" : c); setShowCityDropdown(false); }}
                      className={cn(
                        "w-full rounded-lg px-3 py-1.5 text-left text-xs transition-colors",
                        city === c
                          ? "bg-brand-800 text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700"
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="hidden h-4 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

          {/* Condition pills */}
          {PRODUCT_CONDITIONS.map((cond) => (
            <FilterPill
              key={cond.value}
              active={conditions.includes(cond.value)}
              onClick={() => {
                const next = conditions.includes(cond.value)
                  ? conditions.filter((c) => c !== cond.value)
                  : [...conditions, cond.value];
                updateFilter("conditions", next);
              }}
            >
              {cond.label}
            </FilterPill>
          ))}

          <span className="hidden h-4 w-px bg-gray-200 dark:bg-gray-700 sm:block" />

          {/* Toggle chips */}
          <ToggleChip checked={negotiable} onChange={(v) => updateFilter("negotiable", v)} label="Négociable" />
          <ToggleChip checked={urgent} onChange={(v) => updateFilter("urgent", v)} label="Urgent" />
          <ToggleChip checked={verifiedSeller} onChange={(v) => updateFilter("verifiedSeller", v)} label="Vérifié" />
          <ToggleChip checked={deliveryAvailable} onChange={(v) => updateFilter("deliveryAvailable", v)} label="Livraison" />
          <ToggleChip checked={onPromotion} onChange={(v) => updateFilter("onPromotion", v)} label="Promo" />

          {/* Reset */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-800 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
