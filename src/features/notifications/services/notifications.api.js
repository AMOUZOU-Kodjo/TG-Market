import api from "@/shared/services/api";

export const notificationsApi = {
  list: (params) => api.get("/notifications", { params }).then((r) => r.data),
  getUnreadCount: () => api.get("/notifications/unread-count").then((r) => r.data),
  markAsRead: (id) => api.put(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => api.put("/notifications/read-all").then((r) => r.data),
  delete: (id) => api.delete(`/notifications/${id}`).then((r) => r.data),
  deleteAll: () => api.delete("/notifications").then((r) => r.data),
};
