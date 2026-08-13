import api from "@/shared/services/api";

export const reviewsApi = {
  getByProduct: (productId, params) => api.get("/reviews", { params: { productId, ...params } }).then((r) => r.data),
  getBySeller: (sellerId, params) => api.get("/reviews", { params: { sellerId, ...params } }).then((r) => r.data),
  getMy: (params) => api.get("/reviews/me", { params }).then((r) => r.data),
  create: (data) => api.post("/reviews", data).then((r) => r.data),
  vote: (reviewId, vote) => api.post(`/reviews/${reviewId}/vote`, { vote }).then((r) => r.data),
};
