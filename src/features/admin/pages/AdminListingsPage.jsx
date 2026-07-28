import { useState } from "react";
import { Search, Package, CheckCircle, XCircle, Eye, Tag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

export default function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminProducts", page],
    queryFn: () => api.get(`/admin/products?page=${page}&perPage=20`).then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/products/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.invalidateQueries({ queryKey: ["products"] });
      qc.invalidateQueries({ queryKey: ["myProducts"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;
  const filtered = products.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.firstName?.toLowerCase().includes(search.toLowerCase())
  );

  const statusColors = {
    active: "success",
    sold: "warning",
    rejected: "danger",
    pending: "warning",
    inactive: "secondary",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white">Annonces</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une annonce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-brand-800 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-600/50"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Package className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune annonce trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Annonce</th>
                  <th className="px-6 py-3 hidden md:table-cell">Prix</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Vendeur</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Catégorie</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-white truncate max-w-[200px]">{product.title}</p>
                      <p className="text-xs text-gray-500 md:hidden">{formatCFA(product.price)}</p>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-sm text-white">{formatCFA(product.price)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-400">
                      {product.user?.firstName} {product.user?.lastName}
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-400">{product.category?.name}</span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusColors[product.status] ?? "secondary"}>
                        {product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        {product.status !== "active" && (
                          <button
                            onClick={() => updateStatus.mutate({ id: product.id, status: "active" })}
                            className="p-1.5 rounded-lg text-brand-400 hover:bg-brand-700/10 transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {product.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus.mutate({ id: product.id, status: "rejected" })}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-700/10 transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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
              {meta.total} annonces · Page {meta.page}/{meta.totalPages}
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
