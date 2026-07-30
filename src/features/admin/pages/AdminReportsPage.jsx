import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Loader2, Flag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

const statusColors = {
  pending: "warning",
  resolved: "success",
  dismissed: "secondary",
};

const statusLabels = {
  pending: "En attente",
  resolved: "Résolu",
  dismissed: "Rejeté",
};

const reasonLabels = {
  inappropriate: "Contenu inapproprié",
  scam: "Arnaque",
  counterfeit: "Contrefaçon",
  spam: "Spam",
  wrong_category: "Mauvaise catégorie",
  duplicate: "Doublon",
  other: "Autre",
};

export default function AdminReportsPage() {
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminReports", page],
    queryFn: () => api.get(`/admin/reports?page=${page}&perPage=20`).then((r) => r.data),
  });

  const resolveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/reports/${id}/resolve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminReports"] });
      toast.success("Signalement résolu");
    },
    onError: () => toast.error("Erreur"),
  });

  const dismissMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/reports/${id}/dismiss`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminReports"] });
      toast.success("Signalement rejeté");
    },
    onError: () => toast.error("Erreur"),
  });

  const reports = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Signalements</h1>
        <span className="text-sm text-gray-400">{meta?.total ?? 0} signalements</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Flag className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Aucun signalement</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {reports.map((report) => (
              <div key={report.id} className="p-4 sm:px-6 sm:py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-gray-900">{report.productTitle}</p>
                      <Badge variant={statusColors[report.status]} size="sm">
                        {statusLabels[report.status]}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <strong>Raison :</strong> {reasonLabels[report.reason] || report.reason}
                    </p>
                    {report.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{report.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Signalé par {report.reporterName} · {new Date(report.createdAt).toLocaleDateString("fr-FR")}
                      {report.resolverName && ` · Traité par ${report.resolverName}`}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => resolveMutation.mutate(report.id)}
                        disabled={resolveMutation.isPending}
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors" title="Résoudre">
                        {resolveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => dismissMutation.mutate(report.id)}
                        disabled={dismissMutation.isPending}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors" title="Rejeter">
                        <XCircle className="w-4 h-4" />
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
              {meta.total} signalements · Page {meta.page}/{meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                Précédent
              </button>
              <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-3 py-1 text-xs rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 disabled:opacity-30">
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
