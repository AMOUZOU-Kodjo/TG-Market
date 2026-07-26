import api from "@/shared/services/api";

export const usersApi = {
  getPublicProfile: (id) => api.get(`/users/${id}`).then((r) => r.data),
  follow: (id) => api.post(`/users/${id}/follow`).then((r) => r.data),
  unfollow: (id) => api.delete(`/users/${id}/follow`).then((r) => r.data),
  getFollowers: (id, params) => api.get(`/users/${id}/followers`, { params }).then((r) => r.data),
  getFollowing: (id, params) => api.get(`/users/${id}/following`, { params }).then((r) => r.data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post("/users/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then((r) => r.data);
  },
};
