import { cn } from "@/shared/utils/cn";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  ...rest
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
      {...rest}
    >
      {Icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
          <Icon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
        </div>
      )}
      {title && (
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      )}
      {description && (
        <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
