import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const { data } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => api.get("/settings/public").then((r) => r.data),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const value = {
    siteName: data?.siteName ?? "TG-Market",
    siteVersion: data?.siteVersion ?? "1.0.0",
    siteDescription: data?.siteDescription ?? "",
    maintenanceMode: data?.maintenanceMode ?? false,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext) ?? {
    siteName: "TG-Market",
    siteVersion: "1.0.0",
    siteDescription: "",
    maintenanceMode: false,
  };
}
