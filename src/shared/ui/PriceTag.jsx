import { cn } from "@/shared/utils/cn";

export default function PriceTag({
  price,
  originalPrice,
  currency = "FCFA",
  discount,
  size = "md",
  className,
  ...rest
}) {
  const formatPrice = (p) => new Intl.NumberFormat("fr-FR").format(p);

  const sizes = {
    sm: { price: "text-base", original: "text-xs", badge: "text-[10px] px-1.5 py-0.5" },
    md: { price: "text-xl", original: "text-sm", badge: "text-xs px-2 py-0.5" },
    lg: { price: "text-2xl", original: "text-base", badge: "text-sm px-2.5 py-1" },
  };

  const discountPercent =
    discount || (originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : null);

  return (
    <div className={cn("inline-flex items-baseline gap-2", className)} {...rest}>
      <span
        className={cn(
          "font-bold text-brand-800",
          sizes[size].price
        )}
      >
        {formatPrice(price)} {currency}
      </span>
      {originalPrice && (
        <span
          className={cn(
            "text-gray-400 line-through dark:text-gray-500",
            sizes[size].original
          )}
        >
          {formatPrice(originalPrice)} {currency}
        </span>
      )}
      {discountPercent && (
        <span
          className={cn(
            "rounded-full bg-brand-100 font-semibold text-brand-800 dark:bg-brand-700/15 dark:text-brand-400",
            sizes[size].badge
          )}
        >
          -{discountPercent}%
        </span>
      )}
    </div>
  );
}
