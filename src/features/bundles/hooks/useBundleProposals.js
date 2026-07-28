import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bundlesApi } from "@/features/bundles/services/bundles.api";

export function useBundleProposals(bundleId) {
  return useQuery({
    queryKey: ["bundleProposals", bundleId],
    queryFn: () => bundlesApi.getProposals(bundleId),
    enabled: !!bundleId,
    staleTime: 15000,
  });
}

export function useMyBundleProposals(params) {
  return useQuery({
    queryKey: ["myBundleProposals", params],
    queryFn: () => bundlesApi.getMyProposals(params ?? {}),
    staleTime: 15000,
  });
}

export function useReceivedBundleProposals(params) {
  return useQuery({
    queryKey: ["receivedBundleProposals", params],
    queryFn: () => bundlesApi.getReceivedProposals(params ?? {}),
    staleTime: 15000,
  });
}

export function useCreateBundleProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ bundleId, ...data }) => bundlesApi.createProposal(bundleId, data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["bundleProposals", vars.bundleId] });
      qc.invalidateQueries({ queryKey: ["myBundleProposals"] });
    },
  });
}

export function useAcceptBundleProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (proposalId) => bundlesApi.acceptProposal(proposalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bundleProposals"] });
      qc.invalidateQueries({ queryKey: ["receivedBundleProposals"] });
    },
  });
}

export function useRejectBundleProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (proposalId) => bundlesApi.rejectProposal(proposalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bundleProposals"] });
      qc.invalidateQueries({ queryKey: ["receivedBundleProposals"] });
    },
  });
}

export function useCancelBundleProposal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (proposalId) => bundlesApi.cancelProposal(proposalId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bundleProposals"] });
      qc.invalidateQueries({ queryKey: ["myBundleProposals"] });
    },
  });
}
