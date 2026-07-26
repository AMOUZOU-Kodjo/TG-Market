import api from "@/shared/services/api";

export const conversationsApi = {
  list: (params) => api.get("/conversations", { params }).then((r) => r.data),
  create: (data) => api.post("/conversations", data).then((r) => r.data),
  getById: (id) => api.get(`/conversations/${id}`).then((r) => r.data),
  markAsRead: (id) => api.put(`/conversations/${id}/read`).then((r) => r.data),
  getMessages: (id, params) => api.get(`/conversations/${id}/messages`, { params }).then((r) => r.data),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data).then((r) => r.data),
};
