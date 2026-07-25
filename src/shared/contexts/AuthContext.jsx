import { createContext, useContext, useState, useCallback } from "react";
import api, { setAuthTokens, clearAuthTokens } from "../services/api";

const AuthContext = createContext(undefined);

const MOCK_USER = {
  id: "user_1",
  firstName: "Kofi",
  lastName: "Mensah",
  email: "kofi@example.com",
  phone: "90123456",
  city: "Lomé",
  neighborhood: "Agbalepedogan",
  bio: "Vendeur passionné depuis 5 ans sur TG-Market.",
  avatar: null,
  role: "user",
  createdAt: "2024-01-15T00:00:00.000Z",
  listingsCount: 12,
  rating: 4.7,
  reviewCount: 23,
};

const MOCK_ADMIN = {
  ...MOCK_USER,
  id: "admin_1",
  firstName: "Admin",
  lastName: "TG-Market",
  email: "admin@akmarket.tg",
  role: "admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem("ak_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      clearAuthTokens();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAuthTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la connexion";
      return { success: false, error: message };
    }
  }, []);

  const loginWithMock = useCallback((type = "user") => {
    const mockUser = type === "admin" ? MOCK_ADMIN : MOCK_USER;
    setAuthTokens("mock_access_token", "mock_refresh_token");
    setUser(mockUser);
    return { success: true };
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setAuthTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de l'inscription";
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout API errors
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const { data } = await api.put("/auth/profile", profileData);
      setUser((prev) => ({ ...prev, ...data.user }));
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Erreur lors de la mise à jour";
      return { success: false, error: message };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      // Silent fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        loginWithMock,
        register,
        logout,
        updateProfile,
        refreshUser,
        initializeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }

  return context;
}
