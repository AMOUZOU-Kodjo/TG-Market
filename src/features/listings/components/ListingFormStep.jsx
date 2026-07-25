import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

export default function ListingFormStep({
  title,
  description,
  children,
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn("w-full", className)}
    >
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </motion.div>
  );
}
