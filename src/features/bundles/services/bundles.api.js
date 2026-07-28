import api from "@/shared/services/api";

export const bundlesApi = {
  getPublic: (params) =>
    api.get("/bundles", { params }).then((r) => r.data),
  getMyBundles: (params) =>
    api.get("/bundles/my", { params }).then((r) => r.data),
  getById: (id) => api.get(`/bundles/${id}`).then((r) => r.data),
  create: (data) => api.post("/bundles", data).then((r) => r.data),
  update: (id, data) => api.put(`/bundles/${id}`, data).then((r) => r.data),
  delete: (id) => api.delete(`/bundles/${id}`).then((r) => r.data),
  addProduct: (bundleId, productId) =>
    api.post(`/bundles/${bundleId}/products`, { productId }).then((r) => r.data),
  removeProduct: (bundleId, productId) =>
    api.delete(`/bundles/${bundleId}/products/${productId}`).then((r) => r.data),
};