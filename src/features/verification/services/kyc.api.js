import api from "@/shared/services/api";

export const kycApi = {
  getStatus: () => api.get("/kyc/status").then((r) => r.data),
  submit: (data) => api.post("/kyc/submit", data).then((r) => r.data),
  sendOtp: (data) => api.post("/kyc/phone/send-otp", data).then((r) => r.data),
  verifyOtp: (data) => api.post("/kyc/phone/verify-otp", data).then((r) => r.data),
  getBadges: () => api.get("/kyc/badges").then((r) => r.data),
};
