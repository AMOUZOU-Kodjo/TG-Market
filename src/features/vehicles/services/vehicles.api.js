import api from "@/shared/services/api";

export const vehiclesApi = {
  list: (params) => api.get("/vehicles", { params }).then((r) => r.data),
  getById: (id) => api.get(`/vehicles/${id}`).then((r) => r.data),
  getBrands: () => api.get("/vehicles/brands").then((r) => r.data),
  getModels: (brand) => api.get("/vehicles/models", { params: { brand } }).then((r) => r.data),
  create: (data) => api.post("/vehicles", data).then((r) => r.data),
  update: (id, data) => api.put(`/vehicles/${id}`, data).then((r) => r.data),
};
