import { useState } from "react";
import { Send, Loader2, CheckCircle, Phone } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

const statusLabels = {
  pending: "En attente",
  sent: "Envoyé",
  paid: "Payé",
  failed: "Échec",
};

const statusColors = {
  pending: "warning",
  sent: "info",
  paid: "success",
  failed: "danger",
};

export default function AdminPayoutsPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminPayouts", page],
    queryFn: () => api.get(`/admin/payouts?page=${page}&perPage=20`).then((r) => r.data),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/payouts/${id}/mark-paid`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminPayouts"] });
      toast.success("Paiement marqué comme payé");
    },
    onError: (err) => toast.error(err?.response?.data?.error || "Erreur"),
  });

  const retryMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/payouts/${id}/retry`).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminPayouts"] });
      toast.success("Tentative relancée");
    },
    onError: (err) => toast.error(err?.response?.data?.error || "Erreur"),
  });

  const payouts = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Paiements vendeurs</h1>
        <p className="mt-1 text-sm text-gray-500">
          Fonds envoyés directement aux vendeurs après confirmation de la livraison.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : payouts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Send className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucun paiement vendeur</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {payouts.map((p) => (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="text-sm font-medium text-gray-900 truncate flex-1">
                    #{p.id} · {p.productTitle ?? "Vente"}
                  </p>
                  <Badge variant={statusColors[p.status] ?? "secondary"} size="sm" className="shrink-0">
                    {statusLabels[p.status] ?? p.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-gray-500 flex-1">
                  <div className="flex justify-between">
                    <span>Montant</span>
                    <span className="font-medium text-gray-900">{formatCFA(p.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commission</span>
                    <span className="font-medium text-gray-900">{formatCFA(p.fee ?? 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vendeur</span>
                    <span className="text-gray-700 truncate max-w-[140px] text-right">
                      {p.seller ? `${p.seller.firstName} ${p.seller.lastName}` : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compte</span>
                    <span className="font-medium text-gray-700 truncate max-w-[140px] text-right">
                      <Phone className="inline h-3 w-3 mr-1" />
                      {p.provider ?? "?"} {p.account ?? "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span>{formatRelativeTime(p.createdAt)}</span>
                  </div>
                  {p.errorMessage && (
                    <div className="mt-1 rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/30 dark:text-red-400">
                      {p.errorMessage}
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2">
                  {p.status === "pending" && (
                    <button
                      onClick={() => markPaidMutation.mutate(p.id)}
                      disabled={markPaidMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {markPaidMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                      Marquer payé
                    </button>
                  )}
                  {(p.status === "failed" || p.status === "pending") && (
                    <button
                      onClick={() => retryMutation.mutate(p.id)}
                      disabled={retryMutation.isPending}
                      className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700 transition-colors disabled:opacity-50"
                    >
                      {retryMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Phone className="h-3.5 w-3.5" />}
                      Relancer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-400">
              {meta.total} paiements · Page {meta.page}/{meta.totalPages}
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
    </div>
  );
}