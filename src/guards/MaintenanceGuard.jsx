import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

export function MaintenanceGuard({ children }) {
  const { maintenanceMode } = useSiteSettings();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isMaintenancePage = location.pathname === "/maintenance";

  useEffect(() => {
    if (isLoading) return;
    if (maintenanceMode && user?.role !== "admin" && !isMaintenancePage) {
      navigate("/maintenance", { replace: true });
    }
  }, [maintenanceMode, isLoading, user, isMaintenancePage, navigate]);

  if (isLoading) return null;

  if (maintenanceMode && user?.role !== "admin" && !isMaintenancePage) {
    return null;
  }

  return children;
}
