import axios from "axios";
import { API_BASE_URL } from "../constants";
import { dispatchLogout } from "./navigation";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ak_access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("ak_refresh_token");

      if (!refreshToken) {
        isRefreshing = false;
        localStorage.removeItem("ak_access_token");
        localStorage.removeItem("ak_refresh_token");
        dispatchLogout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken || refreshToken;

        localStorage.setItem("ak_access_token", newToken);
        localStorage.setItem("ak_refresh_token", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("ak_access_token");
        localStorage.removeItem("ak_refresh_token");
        dispatchLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || data?.error;

      switch (status) {
        case 403:
          console.error("Accès interdit:", message);
          break;
        case 404:
          console.error("Ressource non trouvée:", message);
          break;
        case 422:
          console.error("Erreur de validation:", message);
          break;
        case 429:
          console.error("Trop de requêtes. Réessayez plus tard.");
          break;
        case 500:
          console.error("Erreur serveur:", message);
          break;
        default:
          break;
      }
    } else if (error.request) {
      console.error("Erreur réseau. Vérifiez votre connexion.");
    }

    return Promise.reject(error);
  }
);

export default api;

export const setAuthTokens = (accessToken, refreshToken) => {
  localStorage.setItem("ak_access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("ak_refresh_token", refreshToken);
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("ak_access_token");
  localStorage.removeItem("ak_refresh_token");
};

export const getAccessToken = () =>
  localStorage.getItem("ak_access_token");
