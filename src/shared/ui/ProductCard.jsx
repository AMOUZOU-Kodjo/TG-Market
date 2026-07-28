import { useState } from "react";
import { Heart, MapPin, MessageCircle, Zap, Star } from "lucide-react";
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
  neighborhood,
  condition,
  hasActiveNegotiation = false,
  isUrgent = false,
  isPromoted = false,
  isFeatured = false,
  negotiable = false,
  productId,
  isFavorite: isFavoriteProp,
  onClick,
  className,
  ...rest
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: favData } = useCheckFavorite(productId, isAuthenticated);
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
    <div
      onClick={onClick}
      className={cn(
        "cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800",
        isPromoted && "ring-2 ring-brand-500",
        className
      )}
      {...rest}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700" />
        )}
        <img
          src={image}
          alt={title}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Chap-Chap badge (urgent) - top left */}
        {isUrgent && (
          <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 shadow-md">
            <Zap className="h-3 w-3 fill-white text-white" />
            <span className="text-[10px] font-bold text-white">Chap-Chap</span>
          </div>
        )}

        {/* Condition badge - top right (or below Chap-Chap) */}
        {condition && (
          <div className={cn("absolute top-3 z-10", isUrgent ? "right-3 top-11" : "right-3")}>
            <Badge variant={condition === "new" ? "success" : "warning"}>
              {condition === "new" ? "Neuf" : condition === "like_new" ? "Très bon état" : condition === "good" ? "Bon état" : condition === "fair" ? "Usé" : condition}
            </Badge>
          </div>
        )}

        {/* Heart button - top right corner */}
        {productId && (
          <button
            onClick={handleFavorite}
            disabled={toggleFav.isPending}
            className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:shadow-md dark:bg-gray-800/90 dark:hover:bg-gray-900"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-700 text-red-700" : "text-gray-600 dark:text-gray-400"
              )}
            />
          </button>
        )}

        {/* Promoted badge */}
        {isPromoted && (
          <div className="absolute bottom-12 left-3 z-10 flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 shadow-md">
            <Star className="h-3 w-3 fill-white text-white" />
            <span className="text-[10px] font-bold text-white">Promu</span>
          </div>
        )}

        {/* Negotiation in progress overlay - yellow like FIZZ */}
        {hasActiveNegotiation && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-yellow-500/95 backdrop-blur-sm px-3 py-1.5">
            <span className="text-[9px] font-bold text-white flex items-center justify-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5" />
              Négociation en cours
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1.5 line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="mb-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-bold text-brand-800">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
          {negotiable && (
            <span className="text-sm text-green-600 font-semibold ml-2">Négociable</span>
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{neighborhood ? `${neighborhood}, ${location}, Togo` : `${location}, Togo`}</span>
        </div>
      </div>
    </div>
  );
}
