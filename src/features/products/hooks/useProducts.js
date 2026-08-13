import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productsApi } from "../services/products.api";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => productsApi.list(params),
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useSimilarProducts(id) {
  return useQuery({
    queryKey: ["similarProducts", id],
    queryFn: () => productsApi.getSimilar(id),
    enabled: !!id,
  });
}

export function useMyProducts(params) {
  return useQuery({
    queryKey: ["myProducts", params],
    queryFn: () => productsApi.getMy(params),
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["product", id] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["myProducts"] });
    },
  });
}

export function useEndNegotiation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.endNegotiation,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["myProducts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProductHandler() {
  const deleteProduct = useDeleteProduct();
  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.title} » ?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Annonce supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };
  return { deleteProduct, handleDelete };
}
