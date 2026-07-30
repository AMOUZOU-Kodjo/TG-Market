import api from "@/shared/services/api";

export const paymentApi = {
  initiate: (data) => api.post("/payments/initiate", data).then((r) => r.data),
  getConfig: () => api.get("/payments/config").then((r) => r.data),
};
