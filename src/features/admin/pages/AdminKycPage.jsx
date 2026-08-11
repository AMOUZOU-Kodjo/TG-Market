import { useState } from "react";
import { ShieldCheck, CheckCircle, XCircle, Loader2, FileQuestion } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

const docTypeLabels = {
  cni: "Carte Nationale d'Identité",
  peris: "Permis de conduire",
  passeport: "Passeport",
};

export default function AdminKycPage() {
  const [page, setPage] = useState(1);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminKyc", page],
    queryFn: () => api.get(`/admin/kyc/pending?page=${page}&perPage=20`).then((r) => r.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/kyc/${id}/approve`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminKyc"] });
      toast.success("Vérification approuvée");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Erreur lors de l'approbation"),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }) => api.put(`/admin/kyc/${id}/reject`, { reason }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminKyc"] });
      setRejecting(null);
      setReason("");
      toast.success("Vérification rejetée");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Erreur lors du rejet"),
  });

  const kycs = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Vérifications KYC</h1>
        <span className="text-sm text-gray-400">{meta?.total ?? 0} en attente</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : kycs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldCheck className="w-12 h-12 mb-3 opacity-50" />
            <p className="text-sm font-medium">Aucune demande de vérification en attente</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {kycs.map((kyc) => (
              <div key={kyc.id} className="p-4 sm:px-6 sm:py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <img
                        src={kyc.user?.avatar}
                        alt={kyc.user?.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <p className="text-sm font-medium text-gray-900">
                        {kyc.user?.firstName} {kyc.user?.lastName}
                      </p>
                      <Badge variant="warning" size="sm">En attente</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {kyc.user?.email} · {kyc.user?.phone}
                    </p>
                    <p className="text-xs text-gray-500">
                      <strong>Document :</strong> {docTypeLabels[kyc.documentType] || kyc.documentType}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Soumis le {new Date(kyc.submittedAt).toLocaleString("fr-FR")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={kyc.documentFrontUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative block w-24 h-24 overflow-hidden rounded-lg border border-gray-200 group"
                      >
                        <img src={kyc.documentFrontUrl} alt="Recto" className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-0.5">Recto</span>
                      </a>
                      {kyc.documentBackUrl && (
                        <a
                          href={kyc.documentBackUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block w-24 h-24 overflow-hidden rounded-lg border border-gray-200 group"
                        >
                          <img src={kyc.documentBackUrl} alt="Verso" className="w-full h-full object-cover" />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-0.5">Verso</span>
                        </a>
                      )}
                      {kyc.selfieUrl && (
                        <a
                          href={kyc.selfieUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative block w-24 h-24 overflow-hidden rounded-lg border border-gray-200 group"
                        >
                          <img src={kyc.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                          <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] text-center py-0.5">Selfie</span>
                        </a>
                      )}
                      {!kyc.documentFrontUrl && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <FileQuestion className="w-4 h-4" /> Aucune image fournie
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <button
                      onClick={() => approveMutation.mutate(kyc.id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors disabled:opacity-50"
                    >
                      {approveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Approuver
                    </button>
                    {rejecting === kyc.id ? (
                      <div className="flex flex-col items-end gap-2">
                        <textarea
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          rows={2}
                          placeholder="Motif du rejet (visible par l'utilisateur)"
                          className="w-64 rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => rejectMutation.mutate({ id: kyc.id, reason: reason.trim() })}
                            disabled={rejectMutation.isPending || !reason.trim()}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                          >
                            {rejectMutation.isPending ? "..." : "Confirmer"}
                          </button>
                          <button
                            onClick={() => { setRejecting(null); setReason(""); }}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setRejecting(kyc.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {meta && meta.lastPage > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-400">
              {meta.total} demandes · Page {meta.currentPage}/{meta.lastPage}
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
                onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                disabled={page >= meta.lastPage}
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
