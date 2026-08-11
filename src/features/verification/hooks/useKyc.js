import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { kycApi } from "../services/kyc.api";

export function useKycStatus() {
  return useQuery({
    queryKey: ["kycStatus"],
    queryFn: kycApi.getStatus,
  });
}

export function useSubmitKyc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: kycApi.submit,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kycStatus"] }),
  });
}

export function useKycBadges() {
  return useQuery({
    queryKey: ["kycBadges"],
    queryFn: kycApi.getBadges,
  });
}

export function useSendOtp() {
  return useMutation({ mutationFn: kycApi.sendOtp });
}

export function useVerifyOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: kycApi.verifyOtp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kycStatus"] });
      qc.invalidateQueries({ queryKey: ["kycBadges"] });
    },
  });
}

export function useSendEmailOtp() {
  return useMutation({ mutationFn: kycApi.sendEmailOtp });
}

export function useVerifyEmailOtp() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: kycApi.verifyEmailOtp,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["kycStatus"] });
      qc.invalidateQueries({ queryKey: ["kycBadges"] });
    },
  });
}
