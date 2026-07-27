import api from "@/shared/services/api";

export const authApi = {
  getSessions: () => api.get("/auth/sessions").then((r) => r.data),
  revokeOtherSessions: () => api.delete("/auth/sessions/others").then((r) => r.data),
  getLoginHistory: () => api.get("/auth/login-history").then((r) => r.data),
};