import api from "@/shared/services/api";

export const conversationsApi = {
  list: (params) => api.get("/conversations", { params }).then((r) => r.data),
  create: (data) => api.post("/conversations", data).then((r) => r.data),
  getById: (id) => api.get(`/conversations/${id}`).then((r) => r.data),
  markAsRead: (id) => api.put(`/conversations/${id}/read`).then((r) => r.data),
  getMessages: (id, params) => api.get(`/conversations/${id}/messages`, { params }).then((r) => r.data),
  sendMessage: (id, data) => api.post(`/conversations/${id}/messages`, data).then((r) => r.data),
  deleteMessage: (conversationId, messageId, scope = "me") =>
    api.delete(`/conversations/${conversationId}/messages/${messageId}`, { params: { scope } }).then((r) => r.data),
  bulkDeleteMessages: (conversationId, messageIds, scope = "me") =>
    api.post(`/conversations/${conversationId}/messages/bulk-delete`, { messageIds, scope }).then((r) => r.data),
  remove: (id) => api.delete(`/conversations/${id}`).then((r) => r.data),
};
