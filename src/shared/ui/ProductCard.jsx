import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";

export default function ProductCard({
  image,
  title,
  price,
  originalPrice,
  location,
  seller,
  condition,
  negotiable = false,
  isFavorite = false,
  onFavoriteToggle,
  onClick,
  className,
  ...rest
}) {
  const [liked, setLiked] = useState(isFavorite);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    onFavoriteToggle?.(!liked);
  };

  const formatPrice = (p) => {
    return new Intl.NumberFormat("fr-FR").format(p) + " FCFA";
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className={cn(
        "group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...rest}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
        )}
        <img
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />
        <button
          onClick={handleFavorite}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-gray-900/90 dark:hover:bg-gray-900"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              liked ? "fill-red-700 text-red-700" : "text-gray-600 dark:text-gray-400"
            )}
          />
        </button>
        {condition && (
          <div className="absolute left-3 top-3">
            <Badge variant={condition === "Neuf" ? "success" : "warning"}>
              {condition}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-brand-800">
            {formatPrice(price)}
          </span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        {negotiable && (
          <span className="mb-2 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-900 dark:bg-brand-800/10 dark:text-brand-700">
            Négociable
          </span>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{location}</span>
        </div>
        {seller && (
          <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <Avatar
              src={seller.avatar}
              name={seller.name}
              size="xs"
              online={seller.online}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {seller.name}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
