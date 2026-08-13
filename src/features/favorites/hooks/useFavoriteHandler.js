import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useCheckFavorite, useToggleFavorite } from "@/features/favorites/hooks/useFavorites";

export function useFavoriteHandler(productId, fallbackFavorite = false) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: favData } = useCheckFavorite(productId, isAuthenticated);
  const toggleFav = useToggleFavorite();

  const isFavorite = favData?.isFavorite ?? fallbackFavorite;

  const handleFavorite = useCallback(
    async (e, id = productId) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      if (toggleFav.isPending) return;
      if (!id) return;
      if (!isAuthenticated) {
        toast.error("Connectez-vous pour ajouter aux favoris");
        navigate("/connexion");
        return;
      }
      try {
        await toggleFav.mutateAsync(id);
        toast.success(isFavorite ? "Retiré des favoris" : "Ajouté aux favoris");
      } catch {
        toast.error("Erreur lors de la modification du favori");
      }
    },
    [isAuthenticated, navigate, toggleFav, isFavorite, productId]
  );

  return { isFavorite, handleFavorite, toggleFav };
}