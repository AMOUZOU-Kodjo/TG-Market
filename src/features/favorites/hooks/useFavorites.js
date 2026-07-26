import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "../services/favorites.api";

export function useFavorites(params) {
  return useQuery({
    queryKey: ["favorites", params],
    queryFn: () => favoritesApi.getMy(params),
  });
}

export function useCheckFavorite(productId) {
  return useQuery({
    queryKey: ["favorite", productId],
    queryFn: () => favoritesApi.check(productId),
    enabled: !!productId,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.toggle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["favorite"] });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["favorite"] });
    },
  });
}
