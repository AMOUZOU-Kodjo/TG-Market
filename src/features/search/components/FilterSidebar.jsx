import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  RotateCcw,
  Tag,
  DollarSign,
  MapPin,
  Star,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Button from "@/shared/ui/Button";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { CITIES, PRODUCT_CONDITIONS } from "@/shared/constants";

function CollapsibleSection({ title, icon: Icon, defaultOpen = true, children }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-gray-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />}
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToggleSwitch({ checked, onChange, label }) {
  return (
    <div
      onClick={() => onChange?.(!checked)}
      className="flex cursor-pointer items-center justify-between py-1.5"
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={-1}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 pointer-events-none",
          checked
            ? "bg-brand-800"
            : "bg-gray-200 dark:bg-gray-700"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  className,
  mobile = false,
  onClose,
}) {
  const { data: allCategories = [] } = useCategories();
  const [showAllCities, setShowAllCities] = useState(false);
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
    categories.length +
    conditions.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (city ? 1 : 0) +
    (verifiedSeller ? 1 : 0) +
    (deliveryAvailable ? 1 : 0) +
    (negotiable ? 1 : 0) +
    (urgent ? 1 : 0) +
    (onPromotion ? 1 : 0);

  return (
    <div
      className={cn(
        "flex h-full flex-col",
        mobile
          ? "bg-white dark:bg-gray-800"
          : "rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800",
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">Filtres</h3>
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-800 px-1.5 text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 text-xs font-medium text-brand-800 hover:text-brand-900"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </button>
          )}
          {mobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CollapsibleSection title="Catégorie" icon={Tag}>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {allCategories.slice(0, 15).map((cat) => (
              <label
                key={cat.id}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  const id = String(cat.id);
                  const next = categories.includes(id)
                    ? categories.filter((c) => c !== id)
                    : [...categories, id];
                  updateFilter("categories", next);
                }}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    categories.includes(String(cat.id))
                      ? "border-brand-800 bg-brand-800"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {categories.includes(String(cat.id)) && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="flex-1 truncate text-sm text-gray-700 dark:text-gray-300">
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">{cat.productCount}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Prix" icon={DollarSign}>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">FCFA</span>
            </div>
            <span className="text-gray-400">-</span>
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">FCFA</span>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Ville" icon={MapPin} defaultOpen={false}>
          <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
            {(showAllCities ? CITIES : CITIES.slice(0, 12)).map((c) => (
              <label
                key={c}
                onClick={() => updateFilter("city", city === c ? "" : c)}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors",
                    city === c
                      ? "border-brand-800 bg-brand-800"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {city === c && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{c}</span>
              </label>
            ))}
            {CITIES.length > 12 && (
              <button
                onClick={() => setShowAllCities(!showAllCities)}
                className="w-full mt-1 text-xs font-medium text-brand-800 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
              >
                {showAllCities ? "Voir moins" : `Voir plus (${CITIES.length - 12})`}
              </button>
            )}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="État" icon={Star} defaultOpen={false}>
          <div className="space-y-1">
            {PRODUCT_CONDITIONS.map((cond) => (
              <label
                key={cond.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => {
                  const next = conditions.includes(cond.value)
                    ? conditions.filter((c) => c !== cond.value)
                    : [...conditions, cond.value];
                  updateFilter("conditions", next);
                }}
              >
                <div
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                    conditions.includes(cond.value)
                      ? "border-brand-800 bg-brand-800"
                      : "border-gray-300 dark:border-gray-600"
                  )}
                >
                  {conditions.includes(cond.value) && (
                    <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{cond.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Options" icon={ShieldCheck} defaultOpen={false}>
          <div className="space-y-0.5">
            <ToggleSwitch
              checked={verifiedSeller}
              onChange={(v) => updateFilter("verifiedSeller", v)}
              label="Vendeur vérifié"
            />
            <ToggleSwitch
              checked={deliveryAvailable}
              onChange={(v) => updateFilter("deliveryAvailable", v)}
              label="Livraison disponible"
            />
            <ToggleSwitch
              checked={negotiable}
              onChange={(v) => updateFilter("negotiable", v)}
              label="Prix négociable"
            />
            <ToggleSwitch
              checked={urgent}
              onChange={(v) => updateFilter("urgent", v)}
              label="Urgent"
            />
            <ToggleSwitch
              checked={onPromotion}
              onChange={(v) => updateFilter("onPromotion", v)}
              label="En promotion"
            />
          </div>
        </CollapsibleSection>
      </div>

      {mobile && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <Button fullWidth onClick={onClose}>
            Voir les résultats
          </Button>
        </div>
      )}
    </div>
  );
}
