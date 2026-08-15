import api from "@/shared/services/api";

export const pushApi = {
  getConfig: () => api.get("/push/config").then((r) => r.data),
  subscribe: (subscription) => api.post("/push/subscribe", subscription).then((r) => r.data),
  unsubscribe: (endpoint) => api.delete("/push/subscribe", { data: { endpoint } }).then((r) => r.data),
};
