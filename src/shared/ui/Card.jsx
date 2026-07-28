import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";

const variants = {
  default:
    "bg-white border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-800",
  interactive:
    "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer dark:bg-gray-800 dark:border-gray-800 dark:hover:border-gray-700",
  flat: "bg-gray-50 dark:bg-gray-800/50",
};

export default function Card({
  variant = "default",
  image,
  imageAlt,
  badges,
  children,
  footer,
  className,
  ...rest
}) {
  const Component = variant === "interactive" ? motion.div : "div";
  const motionProps =
    variant === "interactive"
      ? {
          whileHover: { y: -2 },
          transition: { type: "spring", stiffness: 300, damping: 20 },
        }
      : {};

  return (
    <Component
      className={cn(
        "overflow-hidden rounded-2xl transition-colors duration-200",
        variants[variant],
        className
      )}
      {...motionProps}
      {...rest}
    >
      {image && (
        <div className="relative">
          <img
            src={image}
            alt={imageAlt || ""}
            className="h-48 w-full object-cover"
          />
          {badges && (
            <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
              {badges}
            </div>
          )}
        </div>
      )}
      {!image && badges && (
        <div className="flex flex-wrap gap-1.5 px-4 pt-4">{badges}</div>
      )}
      {children && <div className="p-4">{children}</div>}
      {footer && (
        <div className="border-t border-gray-100 px-4 py-3 dark:border-gray-800">
          {footer}
        </div>
      )}
    </Component>
  );
}
