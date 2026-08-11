import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

export default function Breadcrumb({ items = [], className, ...rest }) {
  return (
    <nav
      className={cn("flex items-center flex-wrap gap-1", className)}
      aria-label="Breadcrumb"
      {...rest}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={index} className="flex items-center gap-1">
            {index > 0 && (
              <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            )}
            {item.icon && (
              <item.icon className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "text-sm font-medium",
                  isLast
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
