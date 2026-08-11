import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../services/users.api";

export function useSellerProfile(id) {
  return useQuery({
    queryKey: ["seller", id],
    queryFn: () => usersApi.getPublicProfile(id),
    enabled: !!id,
  });
}

export function useFollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.follow,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["seller", String(id)] });
      qc.invalidateQueries({ queryKey: ["sellers"] });
    },
  });
}

export function useUnfollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.unfollow,
    onSuccess: (_, id) => {
      qc.invalidateQueries({ queryKey: ["seller", String(id)] });
      qc.invalidateQueries({ queryKey: ["sellers"] });
    },
  });
}
