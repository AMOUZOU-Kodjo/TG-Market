import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function ActiveFilters({ filters = [], onRemove, onClearAll }) {
  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((filter, index) => (
        <motion.button
          key={filter.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: index * 0.03 }}
          onClick={() => onRemove?.(filter.key)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            "border-brand-300 bg-brand-50 text-brand-950",
            "hover:border-brand-400 hover:bg-brand-200",
            "dark:border-brand-800/30 dark:bg-brand-800/10 dark:text-brand-700",
            "dark:hover:border-brand-800/50 dark:hover:bg-brand-800/20"
          )}
        >
          <span>{filter.label}</span>
          <X className="h-3 w-3" />
        </motion.button>
      ))}

      {filters.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClearAll}
          className="text-xs font-medium text-gray-500 underline-offset-2 hover:underline dark:text-gray-400"
        >
          Tout effacer
        </motion.button>
      )}
    </div>
  );
}
