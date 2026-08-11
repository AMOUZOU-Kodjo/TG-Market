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
  purchase: (bundleId) =>
    api.post(`/bundles/${bundleId}/purchase`).then((r) => r.data),
  createProposal: (bundleId, data) =>
    api.post(`/bundles/${bundleId}/proposals`, data).then((r) => r.data),
  getProposals: (bundleId) =>
    api.get(`/bundles/${bundleId}/proposals`).then((r) => r.data),
  getMyProposals: (params) =>
    api.get("/bundles/proposals/mine", { params }).then((r) => r.data),
  getReceivedProposals: (params) =>
    api.get("/bundles/proposals/received", { params }).then((r) => r.data),
  acceptProposal: (proposalId) =>
    api.put(`/bundles/proposals/${proposalId}/accept`).then((r) => r.data),
  rejectProposal: (proposalId) =>
    api.put(`/bundles/proposals/${proposalId}/reject`).then((r) => r.data),
  cancelProposal: (proposalId) =>
    api.put(`/bundles/proposals/${proposalId}/cancel`).then((r) => r.data),
};