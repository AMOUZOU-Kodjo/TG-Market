import { createContext, useContext, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { useSocket } from "./SocketContext";

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const qc = useQueryClient();
  const socket = useSocket();

  const { data } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: () => api.get("/settings/public").then((r) => r.data),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    const handler = () => {
      qc.refetchQueries({ queryKey: ["siteSettings"] });
    };

    socket.on("settings_changed", handler);

    return () => {
      socket.off("settings_changed", handler);
    };
  }, [socket, qc]);

  const value = {
    siteName: data?.siteName ?? "TG-Market",
    siteVersion: data?.siteVersion ?? "1.0.0",
    siteDescription: data?.siteDescription ?? "",
    maintenanceMode: data?.maintenanceMode ?? false,
    supportEmail: data?.supportEmail ?? "support@akmarket.tg",
    refreshSettings: () => qc.refetchQueries({ queryKey: ["siteSettings"] }),
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
    supportEmail: "support@akmarket.tg",
    refreshSettings: () => {},
  };
}
