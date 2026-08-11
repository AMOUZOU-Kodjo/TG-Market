import api from "@/shared/services/api";

export const favoritesApi = {
  getMy: (params) => api.get("/favorites", { params }).then((r) => r.data),
  toggle: (productId) => api.post(`/favorites/${productId}`).then((r) => r.data),
  remove: (productId) => api.delete(`/favorites/${productId}`).then((r) => r.data),
  check: (productId) => api.get(`/favorites/check/${productId}`).then((r) => r.data),
};
