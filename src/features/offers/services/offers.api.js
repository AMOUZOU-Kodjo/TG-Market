import api from "@/shared/services/api";

export const offersApi = {
  create: (productId, data) =>
    api.post(`/offers/${productId}`, data).then((r) => r.data),
  getMyOffers: (params) =>
    api.get("/offers", { params }).then((r) => r.data),
  getById: (id) => api.get(`/offers/${id}`).then((r) => r.data),
  accept: (id) => api.put(`/offers/${id}/accept`).then((r) => r.data),
  reject: (id, reason) =>
    api.put(`/offers/${id}/reject`, { reason }).then((r) => r.data),
  cancel: (id) => api.put(`/offers/${id}/cancel`).then((r) => r.data),
};