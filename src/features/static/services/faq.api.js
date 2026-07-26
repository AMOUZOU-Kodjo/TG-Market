import api from "@/shared/services/api";

export const faqApi = {
  getAll: () => api.get("/faqs").then((r) => r.data),
};
