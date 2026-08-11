import api from "@/shared/services/api";

export const authApi = {
  forgotPassword: (data) => api.post("/auth/forgot-password", data).then((r) => r.data),
  resetPassword: (data) => api.post("/auth/reset-password", data).then((r) => r.data),
  getSessions: () => api.get("/auth/sessions").then((r) => r.data),
  revokeOtherSessions: () => api.delete("/auth/sessions/others").then((r) => r.data),
  getLoginHistory: () => api.get("/auth/login-history").then((r) => r.data),

  // 2FA
  get2FAStatus: () => api.get("/auth/2fa/status").then((r) => r.data),
  generate2FASecret: () => api.post("/auth/2fa/generate").then((r) => r.data),
  enable2FA: (data) => api.post("/auth/2fa/enable", data).then((r) => r.data),
  disable2FA: (data) => api.post("/auth/2fa/disable", data).then((r) => r.data),
  verify2FA: (data) => api.post("/auth/2fa/verify", data).then((r) => r.data),
  deleteAccount: () => api.delete("/auth/account").then((r) => r.data),
};