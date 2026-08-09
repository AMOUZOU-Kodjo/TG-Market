import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categories.api";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAll,
    staleTime: 10 * 60 * 1000,
  });
}

export function useCategory(slug) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => categoriesApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategoryProducts(slug, params) {
  return useQuery({
    queryKey: ["categoryProducts", slug, params],
    queryFn: () => categoriesApi.getProducts(slug, params),
    enabled: !!slug,
  });
}

export function useCategorySpecTemplates(categoryId) {
  return useQuery({
    queryKey: ["categorySpecTemplates", categoryId],
    queryFn: () => categoriesApi.getSpecTemplates(categoryId),
    enabled: !!categoryId,
  });
}
