import api from "@/shared/services/api";

export const categoriesApi = {
  getAll: () => api.get("/categories").then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
  getProducts: (slug, params) => api.get(`/categories/${slug}/products`, { params }).then((r) => r.data),
  getSpecTemplates: (id) => api.get(`/categories/${id}/spec-templates`).then((r) => r.data),
};
