import { useState } from "react";
import { CreditCard, CheckCircle, Loader2, X, Scale, RotateCcw, MessageCircle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/shared/services/api";
import { conversationsApi } from "@/features/chat/services/conversations.api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import { ESCROW_STATUS_CONFIG } from "@/shared/constants/escrow";
import toast from "react-hot-toast";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [confirmEscrow, setConfirmEscrow] = useState(null);
  const [resolveEscrow, setResolveEscrow] = useState(null);
  const [contacting, setContacting] = useState(false);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const contactSeller = async (tx) => {
    setContacting(true);
    try {
      const conversation = await conversationsApi.create({
        participantId: tx.seller?.id,
        productId: tx.product?.id,
      });
      navigate(`/messages/${conversation.id}`);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur lors de la création de la conversation");
    } finally {
      setContacting(false);
    }
  };

  const { data, isLoading } = useQuery({
    queryKey: ["adminEscrow", page],
    queryFn: () => api.get(`/admin/escrow?page=${page}&perPage=20`).then((r) => r.data),
  });

  const creditMutation = useMutation({
    mutationFn: ({ userId, amount, escrowId }) =>
      api.post("/admin/wallet/credit", { userId, amount, description: `Paiement manuel escrow #${escrowId}` }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminEscrow"] });
      toast.success("Wallet crédité avec succès");
      setConfirmEscrow(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Erreur");
    },
  });

  const verifyMutation = useMutation({
    mutationFn: (escrowId) => api.put(`/admin/escrow/${escrowId}/verify`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminEscrow"] });
      toast.success("Paiement vérifié avec succès");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Erreur");
    },
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, action }) => api.put(`/admin/escrow/${id}/resolve`, { action }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminEscrow"] });
      toast.success("Litige résolu");
      setResolveEscrow(null);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "Erreur");
    },
  });

  const transactions = (data?.data ?? []).filter(
    (t) => t.status !== "cancelled"
  );
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Paiements & Escrow</h1>
        <span className="text-sm text-gray-400">{transactions.length} transactions</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <CreditCard className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune transaction</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate flex-1">{tx.product?.title ?? "—"}</p>
                  <Badge variant={ESCROW_STATUS_CONFIG[tx.status]?.variant ?? "secondary"} size="sm" className="shrink-0">
                    {ESCROW_STATUS_CONFIG[tx.status]?.label ?? tx.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-500 flex-1">
                  <div className="flex justify-between">
                    <span>Montant</span>
                    <span className="font-medium text-gray-900">{formatCFA(tx.amount)}</span>
                  </div>
                  {tx.paymentRef && (
                    <div className="flex justify-between">
                      <span>Référence</span>
                      <span className="font-medium text-gray-900 truncate max-w-[140px] text-right">{tx.paymentRef}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Frais</span>
                    <span className="font-medium text-gray-900">{formatCFA(tx.fee ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Acheteur</span>
                    <span className="text-gray-700 truncate max-w-[140px] text-right">{tx.buyer?.firstName} {tx.buyer?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendeur</span>
                    <span className="text-gray-700 truncate max-w-[140px] text-right">{tx.seller?.firstName} {tx.seller?.lastName}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {tx.status === "awaiting_verification" && (
                    <button onClick={() => verifyMutation.mutate(tx.id)}
                      disabled={verifyMutation.isPending}
                      className="w-full flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50">
                      {verifyMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                      Vérifier
                    </button>
                  )}
                  {tx.status === "pending" && (
                    <button onClick={() => setConfirmEscrow(tx)}
                      className="w-full flex items-center justify-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700 transition-colors">
                      <CheckCircle className="h-3.5 w-3.5" />
                      Créditer
                    </button>
                  )}
                  {tx.status === "disputed" && (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => setResolveEscrow({ tx, action: "refund" })}
                        className="w-full flex items-center justify-center gap-1 rounded-lg bg-amber-500 px-3 py-2 text-xs font-medium text-white hover:bg-amber-600 transition-colors">
                        <RotateCcw className="h-3.5 w-3.5" />
                        Rembourser
                      </button>
                      <button onClick={() => setResolveEscrow({ tx, action: "complete" })}
                        className="w-full flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Terminer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-400">
              {meta.total} transactions · Page {meta.page}/{meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <button
              onClick={() => setConfirmEscrow(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Confirmer le paiement
            </h2>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Produit :</strong> {confirmEscrow.product?.title}</p>
              <p><strong>Acheteur :</strong> {confirmEscrow.buyer?.firstName} {confirmEscrow.buyer?.lastName} (#{confirmEscrow.buyer?.id})</p>
              <p><strong>Montant :</strong> {formatCFA(confirmEscrow.amount)}</p>
              <p className="text-xs text-amber-600">
                Cette action créditera le wallet de l'acheteur et confirmera le paiement.
              </p>
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmEscrow(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => creditMutation.mutate({ userId: confirmEscrow.buyerId, amount: confirmEscrow.amount, escrowId: confirmEscrow.id })}
                disabled={creditMutation.isPending}
                className="flex-1 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creditMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                {creditMutation.isPending ? "Traitement..." : "Créditer + Valider"}
              </button>
            </div>
          </div>
        </div>
      )}

      {resolveEscrow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800">
            <button
              onClick={() => setResolveEscrow(null)}
              className="absolute right-4 top-4 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Résoudre le litige
            </h2>
            <p className="text-xs text-gray-400 mb-4">Transaction #{resolveEscrow.tx.id}</p>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p><strong>Produit :</strong> {resolveEscrow.tx.product?.title}</p>
              <p><strong>Acheteur :</strong> {resolveEscrow.tx.buyer?.firstName} {resolveEscrow.tx.buyer?.lastName}</p>
              <p><strong>Vendeur :</strong> {resolveEscrow.tx.seller?.firstName} {resolveEscrow.tx.seller?.lastName}</p>
              <p><strong>Montant :</strong> {formatCFA(resolveEscrow.tx.amount)} (dont frais {formatCFA(resolveEscrow.tx.fee ?? 0)})</p>
              {resolveEscrow.tx.disputeReason && (
                <p className="rounded-lg bg-red-50 dark:bg-red-900/20 p-2 text-xs">
                  <strong>Motif :</strong> {resolveEscrow.tx.disputeReason}
                </p>
              )}
              {resolveEscrow.action === "refund" ? (
                <p className="text-xs text-amber-600">
                  <RotateCcw className="inline h-3.5 w-3.5 mr-1" />
                  Rembourse l'acheteur ({formatCFA(resolveEscrow.tx.amount + (resolveEscrow.tx.buyerFee ?? 0))}) et remet le produit en vente. Le vendeur ne reçoit rien.
                </p>
              ) : (
                <p className="text-xs text-green-600">
                  <CheckCircle className="inline h-3.5 w-3.5 mr-1" />
                  Verse au vendeur {formatCFA(resolveEscrow.tx.amount - (resolveEscrow.tx.fee ?? 0))} (frais de la plateforme déduits) et finalise la vente.
                </p>
              )}
            </div>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setResolveEscrow(null)}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={() => contactSeller(resolveEscrow.tx)}
                disabled={contacting}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {contacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                {contacting ? "Ouverture..." : "Contacter le vendeur"}
              </button>
              <button
                onClick={() => resolveMutation.mutate({ id: resolveEscrow.tx.id, action: resolveEscrow.action })}
                disabled={resolveMutation.isPending}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50 flex items-center justify-center gap-2 ${
                  resolveEscrow.action === "refund" ? "bg-amber-500 hover:bg-amber-600" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {resolveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scale className="h-4 w-4" />}
                {resolveMutation.isPending ? "Traitement..." : resolveEscrow.action === "refund" ? "Confirmer le remboursement" : "Confirmer pour le vendeur"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}