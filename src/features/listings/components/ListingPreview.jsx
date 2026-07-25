import { MapPin, Tag, Truck, HandCoins, ShieldCheck, Zap } from "lucide-react";
import Badge from "@/shared/ui/Badge";
import { formatCFA } from "@/shared/utils/format";
import { CONDITION_MAP } from "@/shared/constants";

export default function ListingPreview({ data = {} }) {
  const {
    title,
    description,
    price,
    negotiable,
    category,
    condition,
    city,
    neighborhood,
    images = [],
    brand,
    deliveryAvailable,
    deliveryPrice,
    tags = [],
  } = data;

  const conditionInfo = CONDITION_MAP[condition];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {images.length > 0 ? (
          <img
            src={images[0].url || images[0]}
            alt={title || "Aperçu"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Tag className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-sm text-gray-400">Aucune photo</p>
            </div>
          </div>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            {images.length}
          </div>
        )}

        <div className="absolute left-3 top-3 flex gap-1.5">
          {conditionInfo && (
            <Badge variant={condition === "new" ? "success" : "warning"}>
              {conditionInfo.label}
            </Badge>
          )}
          {negotiable && <Badge variant="primary">Négociable</Badge>}
        </div>
      </div>

      <div className="p-5">
        {title && (
          <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        )}

        {price != null && price !== "" && (
          <div className="mb-4 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-red-800">
              {formatCFA(Number(price))}
            </span>
            {negotiable && (
              <span className="text-xs text-gray-400">(négociable)</span>
            )}
          </div>
        )}

        <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
          {category && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{category}</span>
            </div>
          )}

          {conditionInfo && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{conditionInfo.label}</span>
            </div>
          )}

          {brand && (
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 shrink-0 text-gray-400" />
              <span>{brand}</span>
            </div>
          )}

          {(city || neighborhood) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
              <span>
                {neighborhood ? `${neighborhood}, ` : ""}
                {city}
              </span>
            </div>
          )}

          {deliveryAvailable && (
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 shrink-0 text-gray-400" />
              <span>
                Livraison disponible
                {deliveryPrice ? ` — ${formatCFA(Number(deliveryPrice))}` : ""}
              </span>
            </div>
          )}

          {negotiable && (
            <div className="flex items-center gap-2">
              <HandCoins className="h-4 w-4 shrink-0 text-gray-400" />
              <span>Prix négociable</span>
            </div>
          )}
        </div>

        {description && (
          <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
