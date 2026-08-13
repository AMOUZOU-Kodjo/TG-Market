import { cn } from "@/shared/utils/cn";

const variants = {
  primary:
    "bg-brand-200 text-brand-950 dark:bg-brand-800/15 dark:text-brand-700",
  secondary:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  success:
    "bg-green-100 text-green-700 dark:bg-green-700/15 dark:text-green-600",
  warning:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-500/15 dark:text-yellow-500",
  danger:
    "bg-red-100 text-red-900 dark:bg-red-700/15 dark:text-red-400",
  neutral:
    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const sizes = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-xs",
};

export default function Badge({
  variant = "primary",
  size = "sm",
  children,
  className,
  dot = false,
  ...rest
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5  font-bold",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            variant === "success" && "bg-green-700",
            variant === "warning" && "bg-yellow-500",
            variant === "danger" && "bg-red-700",
            variant === "primary" && "bg-brand-800",
            variant === "secondary" && "bg-gray-500",
            variant === "neutral" && "bg-gray-400"
          )}
        />
      )}
      {children}
    </span>
  );
}
