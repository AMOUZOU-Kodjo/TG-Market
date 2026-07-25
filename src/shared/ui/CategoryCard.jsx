import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export default function CategoryCard({
  icon: Icon,
  name,
  count,
  color = "orange",
  onClick,
  className,
  ...rest
}) {
  const colors = {
    orange: "bg-brand-50 text-brand-800 dark:bg-brand-800/10",
    blue: "bg-brand-50 text-brand-700 dark:bg-brand-700/10",
    green: "bg-brand-50 text-brand-700 dark:bg-brand-700/10",
    purple: "bg-brand-50 text-brand-700 dark:bg-brand-700/10",
    pink: "bg-brand-50 text-brand-700 dark:bg-brand-700/10",
    teal: "bg-brand-50 text-brand-700 dark:bg-brand-700/10",
    red: "bg-red-50 text-red-700 dark:bg-red-700/10",
    yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/10",
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...rest}
    >
      {Icon && (
        <div
          className={cn(
            "mb-3 flex h-12 w-12 items-center justify-center rounded-xl",
            colors[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
        {name}
      </h3>
      {count !== undefined && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          {count} annonces
        </p>
      )}
    </motion.div>
  );
}
