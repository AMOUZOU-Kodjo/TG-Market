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
  hasActiveEscrow = false,
  status,
  quantity = 1,
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
    e.preventDefault();
    e.stopPropagation();
    if (toggleFav.isPending) return;
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
        "cursor-pointer overflow-hidden  dark:border-gray-800 ",
        isPromoted && "ring-2 ring-brand-500",
        className
      )}
      {...rest}
    >
      {/* <div className="relative aspect-[4/5]  overflow-hidden border border-gray-200 bg-white rounded-2xl dark:border-gray-600 dark:bg-gray-800"> */}
      <div className="relative aspect-[4/5] overflow-hidden border border-gray-200 bg-white rounded-2xl shadow-[inset_0_0_25px_rgba(0,0,0,0.35)] dark:border-gray-600 dark:bg-gray-800">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-500 dark:bg-gray-700" />
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
        <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]" />

        {/* Chap-Chap badge (urgent) - top left */}
        {isUrgent && (
          <div className="absolute left-3 top-11 z-10 flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 shadow-md">
            <Zap className="h-3 w-3 fill-white text-white" />
            <span className="text-[10px] font-bold text-white">Chap-Chap</span>
          </div>
        )}

        {/* Condition badge - top right (or below Chap-Chap) */}
        {condition && (
          <div className="absolute left-3 top-3 z-10">
            <Badge variant={condition === "new" ? "success" : "warning"}>
              {condition === "new" ? "Neuf" : condition === "like_new" ? "Très bon état" : condition === "good" ? "Bon état" : condition === "fair" ? "Usé" : condition}
            </Badge>
          </div>
        )}

        {/* Heart button - top left corner */}
        {productId && (
          <button
            type="button"
            onClick={handleFavorite}
            className="absolute right-3 top-3 z-30 cursor-pointer rounded-full border-2 border-white bg-white p-1 shadow-sm transition-transform hover:scale-110"
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-red-700 text-red-700" : "text-gray-600 text-bold dark:text-gray-400"
              )}
            />
          </button>
        )}

        {/* Vendu badge - bottom band */}
        {status === "sold" && (
          <div className="absolute bottom-0 left-0 right-0 z-20 bg-fuchsia-600/90 px-3 py-2 backdrop-blur-sm">
            <span className="flex items-center justify-center gap-1.5 text-xs font-bold text-white">Vendu</span>
          </div>
        )}

        {/* Déjà commandé badge - only if single item */}
        {hasActiveEscrow && quantity <= 1 && status !== "sold" && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-orange-500/95 backdrop-blur-sm px-3 py-2">
            <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              Déjà commandé
            </span>
          </div>
        )}

        {/* Stock badge */}
        {quantity >= 1 && status !== "sold" && (
          <div className="absolute bottom-2 left-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-300">
            {quantity} en stock
          </div>
        )}

        {/* Promoted badge */}
        {isPromoted && status !== "sold" && (
          <div className="absolute bottom-12 left-3 z-10 flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 shadow-md">
            <Star className="h-3 w-3 fill-white text-white" />
            <span className="text-[10px] font-bold text-white">Promu</span>
          </div>
        )}

        {/* Negotiation in progress overlay */}
        {hasActiveNegotiation && status !== "sold" && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-brand-500/95 backdrop-blur-sm px-3 py-2">
            <span className="text-xs font-bold text-white flex items-center justify-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              Négociation en cours
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="mb-1.5 line-clamp-1 text-sm  font-semibold text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="mb-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-sm font-extrabold text-brand-800">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">{formatPrice(originalPrice)}</span>
          )}
          {/* {negotiable && (
            <span className="text-sm text-brand-600 font-semibold ml-2">Négociable</span>
          )} */}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{neighborhood ? `${neighborhood}, ${location}, Togo` : `${location}, Togo`}</span>
        </div>
      </div>
    </div>
  );
}
