import axios from "axios";
import { API_BASE_URL } from "../constants";
import { dispatchLogout } from "./navigation";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
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

function getToken(key) {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

api.interceptors.request.use(
  (config) => {
    const token = getToken("ak_access_token");
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
    const isTwoFactorVerify =
      originalRequest.url?.includes("/auth/2fa/verify");

    if (error.response?.status === 401 && !originalRequest._retry && !isTwoFactorVerify) {
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

      const refreshToken = getToken("ak_refresh_token");

      if (!refreshToken) {
        isRefreshing = false;
        clearAuthTokens();
        dispatchLogout();
        return Promise.reject(error);
      }

      const useSession = !!sessionStorage.getItem("ak_refresh_token");
      const storage = useSession ? sessionStorage : localStorage;

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newToken = data.accessToken;
        const newRefreshToken = data.refreshToken || refreshToken;

        storage.setItem("ak_access_token", newToken);
        storage.setItem("ak_refresh_token", newRefreshToken);

        api.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuthTokens();
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

export const setAuthTokens = (accessToken, refreshToken, rememberMe = true) => {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("ak_access_token", accessToken);
  if (refreshToken) {
    storage.setItem("ak_refresh_token", refreshToken);
  }
  if (!rememberMe) {
    localStorage.removeItem("ak_access_token");
    localStorage.removeItem("ak_refresh_token");
  }
};

export const clearAuthTokens = () => {
  localStorage.removeItem("ak_access_token");
  localStorage.removeItem("ak_refresh_token");
  sessionStorage.removeItem("ak_access_token");
  sessionStorage.removeItem("ak_refresh_token");
};

export const getAccessToken = () => getToken("ak_access_token");
