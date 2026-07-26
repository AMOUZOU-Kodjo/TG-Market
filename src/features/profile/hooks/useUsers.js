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
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seller"] }),
  });
}

export function useUnfollowUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.unfollow,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seller"] }),
  });
}
