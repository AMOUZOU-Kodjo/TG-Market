import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const variants = {
  primary:
    "bg-brand-800 text-white hover:bg-brand-900 shadow-sm shadow-brand-800/25 dark:bg-brand-800 dark:hover:bg-brand-900",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  outline:
    "border-2 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800",
  ghost:
    "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800",
  danger:
    "bg-red-700 text-white hover:bg-red-800 shadow-sm shadow-red-700/25 dark:bg-red-700 dark:hover:bg-red-800",
  link: "text-brand-800 hover:text-brand-900 underline-offset-4 hover:underline dark:text-brand-700 dark:hover:text-brand-400",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5 rounded-lg",
  md: "px-4 py-2 text-sm gap-2 rounded-xl",
  lg: "px-6 py-3 text-base gap-2.5 rounded-xl",
  xl: "px-8 py-4 text-lg gap-3 rounded-2xl",
};

const iconSizes = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

const Spinner = ({ size = "md" }) => (
  <Loader2 className={cn("animate-spin", iconSizes[size])} />
);

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? {} : { scale: 1.02 }}
        whileTap={isDisabled ? {} : { scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-800 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          fullWidth && "w-full",
          className
        )}
        {...rest}
      >
        {loading && <Spinner size={size} />}
        {!loading && Icon && iconPosition === "left" && (
          <Icon className={iconSizes[size]} />
        )}
        {children && <span>{children}</span>}
        {!loading && Icon && iconPosition === "right" && (
          <Icon className={iconSizes[size]} />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
