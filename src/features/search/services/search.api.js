import api from "@/shared/services/api";

export const searchApi = {
  search: (params) => api.get("/search", { params }).then((r) => r.data),
};
