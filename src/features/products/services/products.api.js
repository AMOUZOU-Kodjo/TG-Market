import api from "@/shared/services/api";

export const productsApi = {
  list: (params) => api.get("/products", { params }).then((r) => r.data),
  getById: (id) => api.get(`/products/${id}`).then((r) => r.data),
  create: (data) => api.post("/products", data).then((r) => r.data),
  update: (id, data) => api.put(`/products/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  updateStatus: (id, status) => api.put(`/products/${id}/status`, { status }).then((r) => r.data),
  incrementViews: (id) => api.post(`/products/${id}/view`).then((r) => r.data),
  getSimilar: (id) => api.get(`/products/${id}/similar`).then((r) => r.data),
  getMy: (params) => api.get("/products/my", { params }).then((r) => r.data),
};
