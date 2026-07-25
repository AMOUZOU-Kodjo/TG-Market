import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  trendLabel,
  className,
  ...rest
}) {
  const isPositive = trend > 0;

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...rest}
    >
      <div className="mb-3 flex items-center justify-between">
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-800/10">
            <Icon className="h-5 w-5 text-red-800" />
          </div>
        )}
        {trend !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              isPositive
                ? "bg-green-50 text-green-800 dark:bg-green-700/10 dark:text-green-600"
                : "bg-red-50 text-red-800 dark:bg-red-700/10 dark:text-red-400"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {trend}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </div>
      <div className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
        {label}
      </div>
      {trendLabel && (
        <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {trendLabel}
        </div>
      )}
    </div>
  );
}
