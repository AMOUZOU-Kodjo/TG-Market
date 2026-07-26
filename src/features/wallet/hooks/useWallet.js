import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletApi, escrowApi } from "../services/wallet.api";

export function useWalletBalance() {
  return useQuery({
    queryKey: ["walletBalance"],
    queryFn: walletApi.getBalance,
  });
}

export function useWalletTransactions(params) {
  return useQuery({
    queryKey: ["walletTransactions", params],
    queryFn: () => walletApi.getTransactions(params),
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: walletApi.withdraw,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["walletBalance"] }),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: ["paymentMethods"],
    queryFn: walletApi.getPaymentMethods,
  });
}

export function useEscrowList(params) {
  return useQuery({
    queryKey: ["escrow", params],
    queryFn: () => escrowApi.list(params),
  });
}

export function useEscrow(id) {
  return useQuery({
    queryKey: ["escrowItem", id],
    queryFn: () => escrowApi.getById(id),
    enabled: !!id,
  });
}

export function useConfirmPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: escrowApi.confirmPayment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrow"] }),
  });
}

export function useMarkAsShipped() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: escrowApi.markAsShipped,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrow"] }),
  });
}

export function useConfirmDelivery() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: escrowApi.confirmDelivery,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["escrow"] }),
  });
}
