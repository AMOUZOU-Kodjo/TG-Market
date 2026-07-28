import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2, Flag, Copy, Check } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/shared/utils/cn";
import { useCheckFavorite, useToggleFavorite } from "@/features/favorites/hooks/useFavorites";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { useNavigate } from "react-router-dom";

export default function ProductActions({ product }) {
  const { isAuthenticated } = useAuth();
  const { siteName } = useSiteSettings();
  const navigate = useNavigate();
  const { data: favData } = useCheckFavorite(product?.id, isAuthenticated);
  const toggleFav = useToggleFavorite();

  const isFavorite = favData?.isFavorite ?? false;

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter aux favoris");
      navigate("/connexion");
      return;
    }
    try {
      await toggleFav.mutateAsync(product.id);
      toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
    } catch {
      toast.error("Erreur lors de la modification du favori");
    }
  };

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.title,
          text: `Regarde ${product.title} sur ${siteName}`,
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          toast.error("Erreur lors du partage");
        }
      }
    } else {
      handleCopyLink();
    }
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `${product.title} - ${product.price?.toLocaleString("fr-FR")} FCFA\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShareMenu(false);
  };

  const handleReport = () => {
    toast.success("Merci pour votre signalement. Nous examinerons cette annonce.");
  };

  return (
    <div className="flex items-center gap-2">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleFavorite}
        disabled={toggleFav.isPending}
        className={cn(
          "relative flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
          isFavorite
            ? "border-red-200 bg-red-50 text-red-800 dark:border-red-700/30 dark:bg-red-700/10 dark:text-red-400"
            : "border-gray-200 bg-white text-gray-700 hover:border-red-200 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-700/30 dark:hover:text-red-400"
        )}
      >
        <Heart
          className={cn(
            "h-5 w-5 transition-colors",
            isFavorite && "fill-red-700"
          )}
        />
        <span className="hidden sm:inline">
          {isFavorite ? "Favori" : "Favoris"}
        </span>
      </motion.button>

      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-red-200 hover:text-red-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-700/30 dark:hover:text-red-400"
        >
          <Share2 className="h-5 w-5" />
          <span className="hidden sm:inline">Partager</span>
        </motion.button>

        <AnimatePresence>
          {showShareMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowShareMenu(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  onClick={handleNativeShare}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <Share2 className="h-4 w-4" />
                  Partager...
                </button>
                <button
                  onClick={handleWhatsAppShare}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <span className="text-base">💬</span>
                  WhatsApp
                </button>
                <button
                  onClick={handleCopyLink}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-brand-700" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copied ? "Copié !" : "Copier le lien"}
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleReport}
        className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-red-300 hover:text-red-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-red-800/30 dark:hover:text-red-700"
      >
        <Flag className="h-5 w-5" />
        <span className="hidden sm:inline">Signaler</span>
      </motion.button>
    </div>
  );
}
