import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";

export function usePublicStats() {
  return useQuery({
    queryKey: ["publicStats"],
    queryFn: () => api.get("/stats/public").then((r) => r.data),
    staleTime: 60_000,
    placeholderData: { totalUsers: 5000, totalListings: 1000, totalSales: 500, verifiedUsers: 2000, cities: 30, moderationTime: 24 },
  });
}

export function usePublicReviews() {
  return useQuery({
    queryKey: ["publicReviews"],
    queryFn: () => api.get("/public/reviews").then((r) => r.data),
    staleTime: 60_000,
    placeholderData: [],
  });
}
