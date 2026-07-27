import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Shield, Ban, CheckCircle, XCircle, Eye, UserCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page],
    queryFn: () => api.get(`/admin/users?page=${page}&perPage=20`).then((r) => r.data),
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["adminUsers"] });
    },
    onError: () => toast.error("Erreur lors de la mise à jour"),
  });

  const users = data?.data ?? [];
  const meta = data?.meta;
  const filtered = users.filter(
    (u) =>
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-white">Utilisateurs</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
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
            <UserCheck className="w-12 h-12 mb-3 opacity-50" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  <th className="px-6 py-3">Utilisateur</th>
                  <th className="px-6 py-3 hidden md:table-cell">Email</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Ville</th>
                  <th className="px-6 py-3">Rôle</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-700/20 flex items-center justify-center text-brand-400 text-sm font-bold shrink-0">
                          {user.firstName?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500 md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell text-sm text-gray-400">{user.email}</td>
                    <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-400">{user.city}</td>
                    <td className="px-6 py-3">
                      <Badge variant={user.role === "admin" ? "primary" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={user.isActive ? "success" : "danger"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() =>
                          toggleStatus.mutate({ id: user.id, isActive: !user.isActive })
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
                          user.isActive
                            ? "text-red-400 hover:bg-red-700/10"
                            : "text-brand-400 hover:bg-brand-700/10"
                        }`}
                        title={user.isActive ? "Désactiver" : "Activer"}
                      >
                        {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
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
              {meta.total} utilisateurs · Page {meta.page}/{meta.totalPages}
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
