import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bundlesApi } from "@/features/bundles/services/bundles.api";

export function usePublicBundles(params) {
  return useQuery({
    queryKey: ["bundles", params],
    queryFn: () => bundlesApi.getPublic(params ?? {}),
    staleTime: 30000,
  });
}

export function useMyBundles(params) {
  return useQuery({
    queryKey: ["myBundles", params],
    queryFn: () => bundlesApi.getMyBundles(params ?? {}),
    staleTime: 30000,
  });
}

export function useBundle(id) {
  return useQuery({
    queryKey: ["bundle", id],
    queryFn: () => bundlesApi.getById(id),
    staleTime: 30000,
  });
}

export function useCreateBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => bundlesApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBundles"] }),
  });
}

export function useUpdateBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => bundlesApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}

export function useDeleteBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => bundlesApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBundles"] }),
  });
}

export function useAddProductToBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, productId }) => bundlesApi.addProduct(bundleId, productId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["bundle", vars.bundleId] });
      qc.invalidateQueries({ queryKey: ["myBundles"] });
    },
  });
}

export function useRemoveProductFromBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, productId }) => bundlesApi.removeProduct(bundleId, productId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["bundle", vars.bundleId] });
      qc.invalidateQueries({ queryKey: ["myBundles"] });
    },
  });
}

export function usePurchaseBundle() {
  return useMutation({
    mutationFn: (bundleId) => bundlesApi.purchase(bundleId),
  });
}