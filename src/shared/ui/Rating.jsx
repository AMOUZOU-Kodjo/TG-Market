import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function Rating({
  value = 0,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
  ...rest
}) {
  const [hoverValue, setHoverValue] = useState(0);
  const displayValue = interactive && hoverValue > 0 ? hoverValue : value;

  const sizes = {
    sm: "h-3.5 w-3.5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <div
      className={cn("inline-flex items-center gap-0.5", className)}
      {...rest}
    >
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= displayValue;
        const halfFilled = !filled && starIndex - 0.5 <= displayValue;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHoverValue(starIndex)}
            onMouseLeave={() => interactive && setHoverValue(0)}
            className={cn(
              "relative shrink-0 focus:outline-none",
              interactive && "cursor-pointer",
              !interactive && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizes[size],
                "transition-colors",
                filled
                  ? "fill-yellow-500 text-yellow-500"
                  : halfFilled
                    ? "fill-yellow-500/50 text-yellow-500"
                    : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
