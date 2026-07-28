import { useState } from "react";
import { Search, Ban, CheckCircle, Trash2, Loader2, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const qc = useQueryClient();

  const params = new URLSearchParams({ page, perPage: 20 });
  if (roleFilter !== "all") params.set("role", roleFilter);
  if (statusFilter !== "all") params.set("isActive", statusFilter === "active" ? "true" : "false");

  const { data, isLoading } = useQuery({
    queryKey: ["adminUsers", page, roleFilter, statusFilter],
    queryFn: () => api.get(`/admin/users?${params}`).then((r) => r.data),
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, isActive }) => api.put(`/admin/users/${id}/status`, { isActive }),
    onSuccess: () => { toast.success("Statut mis à jour"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { toast.success("Rôle mis à jour"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { toast.success("Utilisateur supprimé"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de la suppression"),
  });

  const users = data?.data ?? [];
  const meta = data?.meta;
  const filtered = users.filter((u) => {
    const text = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-xl font-bold text-gray-900">Utilisateurs</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher (nom, email)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="user">Utilisateur</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 bg-gray-100 border-0 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
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
            <p>Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                    <th className="px-6 py-3">Utilisateur</th>
                    <th className="px-6 py-3 hidden md:table-cell">Email</th>
                    <th className="px-6 py-3 hidden lg:table-cell">Ville</th>
                    <th className="px-6 py-3">Rôle</th>
                    <th className="px-6 py-3">Statut</th>
                    <th className="px-6 py-3">Vérifié</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-400 md:hidden">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-3 hidden lg:table-cell text-sm text-gray-500">{user.city ?? "—"}</td>
                      <td className="px-6 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => changeRole.mutate({ id: user.id, role: e.target.value })}
                          disabled={changeRole.isPending}
                          className={`text-xs font-medium rounded-lg px-2 py-1 border-0 cursor-pointer disabled:opacity-50 ${
                            user.role === "admin" ? "bg-purple-50 text-purple-600" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={user.isActive ? "success" : "danger"}>
                          {user.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={user.identityVerified ? "success" : "warning"}>
                          {user.identityVerified ? "Vérifié" : "Non vérifié"}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleStatus.mutate({ id: user.id, isActive: !user.isActive })}
                            disabled={toggleStatus.isPending}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.isActive ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                            }`}
                            title={user.isActive ? "Désactiver" : "Activer"}
                          >
                            {user.isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => { if (confirm("Supprimer cet utilisateur ?")) deleteUser.mutate(user.id); }}
                            disabled={deleteUser.isPending || user.role === "admin"}
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

            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3">
                <p className="text-xs text-gray-400">
                  {meta.total} utilisateurs · Page {meta.page}/{meta.totalPages}
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
          </>
        )}
      </div>
    </div>
  );
}
