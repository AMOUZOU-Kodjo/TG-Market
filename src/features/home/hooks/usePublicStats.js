import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";

export function usePublicStats() {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: () => api.get("/stats/public").then((r) => r.data),
    staleTime: 60_000,
    placeholderData: { totalUsers: 5000, totalListings: 1000 },
  });
}
