import { useState } from "react";
import { Search, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";

export default function AdminPaymentsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["adminEscrow", page],
    queryFn: () => api.get(`/admin/escrow?page=${page}&perPage=20`).then((r) => r.data),
  });

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  const statusColors = {
    completed: "success",
    pending: "warning",
    released: "primary",
    refunded: "danger",
    cancelled: "secondary",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">Paiements & Escrow</h1>
        <span className="text-sm text-gray-500">{meta?.total ?? 0} transactions</span>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <CreditCard className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune transaction</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Produit</th>
                  <th className="px-6 py-3 hidden md:table-cell">Montant</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Frais</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Acheteur</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Vendeur</th>
                  <th className="px-6 py-3">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-white truncate max-w-[180px]">{tx.product?.title ?? "—"}</p>
                      <p className="text-xs text-gray-500 md:hidden">{formatCFA(tx.amount)}</p>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-sm text-white font-medium">{formatCFA(tx.amount)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-400">{formatCFA(tx.fee ?? 0)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-400">
                      {tx.buyer?.firstName} {tx.buyer?.lastName}
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-400">
                      {tx.seller?.firstName} {tx.seller?.lastName}
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusColors[tx.status] ?? "secondary"}>
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-800 px-6 py-3">
            <p className="text-xs text-gray-500">
              {meta.total} transactions · Page {meta.page}/{meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 text-xs rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="px-3 py-1 text-xs rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-30"
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
