import { useNavigate } from "react-router-dom";
import { Handshake, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import ProposalStatusBadge from "@/shared/ui/ProposalStatusBadge";
import { useReceivedBundleProposals, useAcceptBundleProposal, useRejectBundleProposal } from "@/features/bundles/hooks/useBundleProposals";

export default function BundleProposalsTab() {
  const navigate = useNavigate();
  const { data, isLoading } = useReceivedBundleProposals();
  const acceptProposal = useAcceptBundleProposal();
  const rejectProposal = useRejectBundleProposal();
  const proposals = data?.data ?? [];

  const handleAccept = async (proposalId) => {
    try {
      await acceptProposal.mutateAsync(proposalId);
    } catch {
      // toast already handled
    }
  };

  const handleReject = async (proposalId) => {
    try {
      await rejectProposal.mutateAsync(proposalId);
    } catch {
      // toast already handled
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">
        Propositions de lots
      </h3>
      {isLoading ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-brand-800" />
          <p className="mt-3 text-sm text-gray-500">Chargement...</p>
        </div>
      ) : proposals.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
          <Handshake className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm text-gray-500">Aucune proposition reçue</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Acheteur</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Lot</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">Montant proposé</th>
                  <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Statut</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                {proposals.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                    <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                      <button onClick={() => navigate(`/vendeur/${p.buyerId}`)} className="hover:underline">
                        {[p.buyer?.firstName, p.buyer?.lastName].filter(Boolean).join(" ") || "Acheteur"}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      <button onClick={() => navigate(`/lot/${p.bundleId}`)} className="hover:text-brand-800 dark:hover:text-brand-600">
                        {p.bundle?.title ?? `Lot #${p.bundleId}`}
                      </button>
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                      {formatCFA(p.proposedPrice)}
                    </td>
                    <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-500 dark:text-gray-400 md:table-cell">
                      {formatRelativeTime(p.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <ProposalStatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {p.status === "pending" ? (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleAccept(p.id)}
                            disabled={acceptProposal.isPending}
                            className="rounded-lg bg-green-50 p-1.5 text-green-700 hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
                            title="Accepter"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleReject(p.id)}
                            disabled={rejectProposal.isPending}
                            className="rounded-lg bg-red-50 p-1.5 text-red-700 hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                            title="Refuser"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          {p.message && (
                            <div className="group relative">
                              <button className="rounded-lg bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700" title="Message">
                                <MessageCircle className="h-4 w-4" />
                              </button>
                              <div className="absolute right-0 top-full z-10 mt-1 hidden w-64 rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {p.message}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}