import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import Badge from "@/shared/ui/Badge";
import { useCheckFavorite, useToggleFavorite } from "@/features/favorites/hooks/useFavorites";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProductCard({
  image,
  title,
  price,
  originalPrice,
  location,
  condition,
  hasActiveNegotiation = false,
  productId,
  isFavorite: isFavoriteProp,
  onClick,
  className,
  ...rest
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: favData } = useCheckFavorite(productId);
  const toggleFav = useToggleFavorite();

  const isFavorite = favData?.isFavorite ?? isFavoriteProp ?? false;
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      navigate("/connexion");
      return;
    }
    if (!productId) return;
    try {
      await toggleFav.mutateAsync(productId);
      toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch {
      toast.error("Erreur lors de la modification du favori");
    }
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
        "group cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white  dark:border-gray-800 dark:bg-gray-900",
        className
      )}
      {...rest}
    >
      <div className="relative aspect-5/5 md:aspect-5/4 overflow-hidden bg-gray-100 dark:bg-gray-800">
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
        {productId && (
          <button
            onClick={handleFavorite}
            disabled={toggleFav.isPending}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-gray-900/90 dark:hover:bg-gray-900"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-700 text-red-700" : "text-gray-600 dark:text-gray-400"
              )}
            />
          </button>
        )}
        {condition && (
          <div className="absolute left-3 top-3">
            <Badge variant={condition === "new" ? "success" : "warning"}>
              {condition === "new" ? "Neuf" : condition === "like_new" ? "Très bon état" : condition === "good" ? "Bon état" : condition === "fair" ? "Usé" : condition}
            </Badge>
          </div>
        )}
        {hasActiveNegotiation && (
          <div className="absolute bottom-0 left-0 right-0 bg-brand-700 backdrop-blur-sm px-3 py-1.5">
            <span className="text-[8px] font-semibold text-white flex items-center justify-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Négociation en cours
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="mb-3 flex items-baseline gap-2">
          <span className="text-xs font-bold text-brand-800">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3.5 w-3.5" />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </motion.div>
  );
}
