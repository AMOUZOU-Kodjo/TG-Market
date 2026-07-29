import { useState } from "react";
import { CreditCard, CheckCircle, Loader2, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);
  const [confirmEscrow, setConfirmEscrow] = useState(null);
  const qc = useQueryClient();

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

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  const statusColors = {
    completed: "success",
    pending: "warning",
    paid: "primary",
    pending_delivery: "info",
    delivered: "info",
    disputed: "danger",
    refunded: "danger",
    cancelled: "secondary",
  };

  const statusLabels = {
    completed: "Terminé",
    pending: "En attente",
    paid: "Payé",
    pending_delivery: "Expédié",
    delivered: "Livré",
    disputed: "Litige",
    refunded: "Remboursé",
    cancelled: "Annulé",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Paiements & Escrow</h1>
        <span className="text-sm text-gray-400">{meta?.total ?? 0} transactions</span>
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3">Produit</th>
                  <th className="px-6 py-3 hidden md:table-cell">Montant</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Frais</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Acheteur</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Vendeur</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{tx.product?.title ?? "—"}</p>
                      <p className="text-xs text-gray-400 md:hidden">{formatCFA(tx.amount)}</p>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-sm text-gray-900 font-medium">{formatCFA(tx.amount)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">{formatCFA(tx.fee ?? 0)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">
                      {tx.buyer?.firstName} {tx.buyer?.lastName}
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">
                      {tx.seller?.firstName} {tx.seller?.lastName}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusColors[tx.status] ?? "secondary"}>
                        {statusLabels[tx.status] ?? tx.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      {tx.status === "pending" && (
                        <button
                          onClick={() => setConfirmEscrow(tx)}
                          className="flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 transition-colors"
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Créditer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  );
}