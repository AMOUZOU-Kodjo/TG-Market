import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "../services/favorites.api";

export function useFavorites(params) {
  return useQuery({
    queryKey: ["favorites", params],
    queryFn: () => favoritesApi.getMy(params),
  });
}

// export function useCheckFavorite(productId) {
//   return useQuery({
//     queryKey: ["favorite", productId],
//     queryFn: () => favoritesApi.check(productId),
//     enabled: !!productId,
//   });
// }
export function useCheckFavorite(productId, isAuthenticated) {
  return useQuery({
    queryKey: ["favorite", productId],
    queryFn: () => favoritesApi.check(productId),
    enabled: !!productId && !!isAuthenticated, // ← ajout de la condition d'auth
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.toggle,
    onSuccess: (_, productId) => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["favorite"] });
      qc.invalidateQueries({ queryKey: ["product", String(productId)] });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: (_, productId) => {
      qc.invalidateQueries({ queryKey: ["favorites"] });
      qc.invalidateQueries({ queryKey: ["favorite"] });
      qc.invalidateQueries({ queryKey: ["product", String(productId)] });
    },
  });
}
