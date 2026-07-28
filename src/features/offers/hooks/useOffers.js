import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "@/features/offers/services/offers.api";

export function useOffers(params) {
  return useQuery({
    queryKey: ["offers", params],
    queryFn: () => offersApi.getMyOffers(params),
    staleTime: 30000,
  });
}

export function useOffer(id) {
  return useQuery({
    queryKey: ["offer", id],
    queryFn: () => offersApi.getById(id),
    staleTime: 30000,
  });
}

export function useCreateOffer(productId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => offersApi.create(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["offers"] });
      qc.invalidateQueries({ queryKey: ["product", productId] });
    },
  });
}

export function useAcceptOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => offersApi.accept(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offers"] }),
  });
}

export function useRejectOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }) => offersApi.reject(id, reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offers"] }),
  });
}

export function useCancelOffer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => offersApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["offers"] }),
  });
}