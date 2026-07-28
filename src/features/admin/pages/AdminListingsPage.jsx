import { useState } from "react";
import { Search, Package, CheckCircle, XCircle, Trash2, Edit2, Eye, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import api from "@/shared/services/api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

const statusLabels = {
  active: "Actif",
  pending: "En attente",
  rejected: "Rejeté",
  sold: "Vendu",
  inactive: "Inactif",
};

export default function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  const params = new URLSearchParams({ page, perPage: 20 });
  if (statusFilter !== "all") params.set("status", statusFilter);

  const { data, isLoading } = useQuery({
    queryKey: ["adminProducts", page, statusFilter],
    queryFn: () => api.get(`/admin/products?${params}`).then((r) => r.data),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => api.put(`/admin/products/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const deleteProduct = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => {
      toast.success("Annonce supprimée");
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.invalidateQueries({ queryKey: ["adminStats"] });
    },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de la suppression"),
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
    pending: "warning",
    rejected: "danger",
    sold: "primary",
    inactive: "secondary",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Annonces</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="rejected">Rejeté</option>
            <option value="sold">Vendu</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucune annonce trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-6 py-3">Annonce</th>
                  <th className="px-6 py-3 hidden md:table-cell">Prix</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Vendeur</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Catégorie</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{product.title}</p>
                      <p className="text-xs text-gray-400 md:hidden">{formatCFA(product.price)}</p>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-sm text-gray-900 font-medium">{formatCFA(product.price)}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">
                      {product.user?.firstName} {product.user?.lastName}
                    </td>
                    <td className="px-6 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500">{product.category?.name}</span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={statusColors[product.status] ?? "secondary"}>
                        {statusLabels[product.status] ?? product.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-1">
                        {product.status !== "active" && (
                          <button
                            onClick={() => updateStatus.mutate({ id: product.id, status: "active" })}
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {product.status !== "rejected" && (
                          <button
                            onClick={() => updateStatus.mutate({ id: product.id, status: "rejected" })}
                            className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <Link
                          to={`/produit/${product.id}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          title="Voir l'annonce"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => { if (confirm("Supprimer cette annonce ?")) deleteProduct.mutate(product.id); }}
                          disabled={deleteProduct.isPending}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
              {meta.total} annonces · Page {meta.page}/{meta.totalPages}
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
