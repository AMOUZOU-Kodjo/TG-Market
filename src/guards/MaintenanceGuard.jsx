import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

const ALLOWED_DURING_MAINTENANCE = ["/maintenance", "/connexion", "/inscription"];

export function MaintenanceGuard({ children }) {
  const { maintenanceMode } = useSiteSettings();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { pathname } = location;
  const isAllowed = ALLOWED_DURING_MAINTENANCE.includes(pathname);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (isLoading || !maintenanceMode) return;
    if (isAdmin) {
      if (pathname === "/maintenance") navigate("/", { replace: true });
      return;
    }
    if (!isAllowed) navigate("/maintenance", { replace: true });
  }, [maintenanceMode, isLoading, user, isAdmin, pathname, isAllowed, navigate]);

  if (isLoading) return null;
  if (!maintenanceMode) return children;
  if (isAdmin || isAllowed) return children;
  return null;
}