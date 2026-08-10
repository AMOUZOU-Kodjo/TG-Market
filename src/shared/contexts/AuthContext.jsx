import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthTokens, clearAuthTokens } from "../services/api";
import { onLogout } from "../services/navigation";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  const initializeAuth = useCallback(async (retries = 3) => {
    const token = sessionStorage.getItem("ak_access_token") || localStorage.getItem("ak_access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user || data);
        setIsLoading(false);
        return;
      } catch (error) {
        if (error.response?.status === 401) {
          clearAuthTokens();
          setUser(null);
          setIsLoading(false);
          return;
        }
        if (attempt < retries - 1) {
          await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        }
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = useCallback(async (email, password, rememberMe = true) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.requiresTwoFactor) {
        return { success: false, requiresTwoFactor: true, tempToken: data.tempToken };
      }
      setAuthTokens(data.accessToken, data.refreshToken, rememberMe);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de la connexion";
      return { success: false, error: message };
    }
  }, []);

  const verifyTwoFactor = useCallback(async (tempToken, code, rememberMe = true) => {
    try {
      const { data } = await api.post("/auth/2fa/verify", { tempToken, token: code });
      setAuthTokens(data.accessToken, data.refreshToken, rememberMe);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error || "Code 2FA invalide";
      return { success: false, error: message };
    }
  }, []);

  const googleLogin = useCallback(async (code, rememberMe = true) => {
    try {
      const { data } = await api.post("/auth/google", { code });
      if (data.requiresTwoFactor) {
        return { success: false, requiresTwoFactor: true, tempToken: data.tempToken };
      }
      setAuthTokens(data.accessToken, data.refreshToken, rememberMe);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de la connexion Google";
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      const { data } = await api.post("/auth/register", userData);
      setAuthTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const message =
        error.response?.data?.error || "Erreur lors de l'inscription";
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
        error.response?.data?.error || "Erreur lors de la mise à jour";
      return { success: false, error: message };
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user || data);
    } catch {
      // Silent fail
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        isAuthenticated,
        isAdmin,
        login,
        verifyTwoFactor,
        googleLogin,
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

export function AuthLogoutHandler() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const unsub = onLogout(() => {
      clearAuthTokens();
      setUser(null);
      navigate("/connexion");
    });
    return unsub;
  }, [navigate, setUser]);

  return null;
}
