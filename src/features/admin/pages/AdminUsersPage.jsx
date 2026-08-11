import { useState } from "react";
import { Search, Ban, CheckCircle, Trash2, Loader2, ShieldCheck, ChevronRight, UserCheck, UserX, Star, BadgeCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";
import Modal from "@/shared/ui/Modal";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionUser, setActionUser] = useState(null);
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

  const toggleProfessional = useMutation({
    mutationFn: ({ id, enabled }) => api.put(`/admin/users/${id}/professional`, { enabled }),
    onSuccess: () => { toast.success("Statut professionnel mis à jour"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const toggleTrusted = useMutation({
    mutationFn: ({ id, enabled }) => api.put(`/admin/users/${id}/trusted`, { enabled }),
    onSuccess: () => { toast.success("Statut de confiance mis à jour"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur"),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { setActionUser(null); toast.success("Utilisateur supprimé"); qc.invalidateQueries({ queryKey: ["adminUsers"] }); },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de la suppression"),
  });

  const users = data?.data ?? [];
  const meta = data?.meta;
  const filtered = users.filter((u) => {
    const text = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const pending = toggleStatus.isPending || changeRole.isPending || toggleProfessional.isPending || toggleTrusted.isPending || deleteUser.isPending;

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

      {isLoading ? (
        <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-200">
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <>
          {/* Cartes utilisateurs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {filtered.map((user) => (
              <button
                key={user.id}
                onClick={() => setActionUser(user)}
                className="w-full h-full text-left bg-white rounded-2xl border border-gray-200 shadow-sm p-4 transition-all hover:border-gray-300 hover:shadow-md active:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <Avatar src={user.avatar} name={`${user.firstName} ${user.lastName}`} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                      {user.role === "admin" && (
                        <ShieldCheck className="inline w-3.5 h-3.5 ml-1.5 text-purple-500" />
                      )}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    {user.city && <p className="text-xs text-gray-400 truncate mt-0.5">{user.city}</p>}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge variant={user.role === "admin" ? "primary" : "secondary"}>
                        {user.role === "admin" ? "Admin" : "Utilisateur"}
                      </Badge>
                      <Badge variant={user.isActive ? "success" : "danger"}>
                        {user.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <Badge variant={user.identityVerified ? "success" : "warning"}>
                        {user.identityVerified ? "Vérifié" : "Non vérifié"}
                      </Badge>
                      {user.isProfessional && <Badge variant="primary">Pro</Badge>}
                      {user.isTrusted && <Badge variant="success">De confiance</Badge>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 mt-1 shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-100 bg-white rounded-2xl border border-gray-200 shadow-sm px-6 py-3">
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

      {/* Sheet d'actions */}
      <Modal
        isOpen={!!actionUser}
        onClose={() => setActionUser(null)}
        title="Actions"
        size="sm"
      >
        {actionUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar src={actionUser.avatar} name={`${actionUser.firstName} ${actionUser.lastName}`} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {actionUser.firstName} {actionUser.lastName}
                </p>
                <p className="text-xs text-gray-400 truncate">{actionUser.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant={actionUser.role === "admin" ? "primary" : "secondary"}>
                {actionUser.role === "admin" ? "Admin" : "Utilisateur"}
              </Badge>
              <Badge variant={actionUser.isActive ? "success" : "danger"}>
                {actionUser.isActive ? "Actif" : "Inactif"}
              </Badge>
              <Badge variant={actionUser.identityVerified ? "success" : "warning"}>
                {actionUser.identityVerified ? "Vérifié" : "Non vérifié"}
              </Badge>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => toggleStatus.mutate({ id: actionUser.id, isActive: !actionUser.isActive })}
                disabled={pending}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              >
                {toggleStatus.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : actionUser.isActive ? (
                  <Ban className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
                {actionUser.isActive ? "Désactiver le compte" : "Activer le compte"}
              </button>

              <div className="px-4 py-3 rounded-xl bg-gray-50">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Rôle</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => changeRole.mutate({ id: actionUser.id, role: "user" })}
                    disabled={pending || actionUser.role === "user"}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors disabled:cursor-default ${
                      actionUser.role === "user"
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <UserX className="w-3.5 h-3.5" />
                    Utilisateur
                  </button>
                  <button
                    onClick={() => changeRole.mutate({ id: actionUser.id, role: "admin" })}
                    disabled={pending || actionUser.role === "admin"}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors disabled:cursor-default ${
                      actionUser.role === "admin"
                        ? "bg-purple-600 text-white border-purple-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Admin
                  </button>
                </div>
              </div>

              <div className="px-4 py-3 rounded-xl bg-gray-50">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Statuts vendeur</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleProfessional.mutate({ id: actionUser.id, enabled: !actionUser.isProfessional })}
                    disabled={pending}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                      actionUser.isProfessional
                        ? "bg-brand-600 text-white border-brand-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Star className="w-3.5 h-3.5" />
                      Vendeur professionnel
                    </span>
                    {toggleProfessional.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : actionUser.isProfessional ? (
                      "Actif"
                    ) : (
                      "Inactif"
                    )}
                  </button>
                  <button
                    onClick={() => toggleTrusted.mutate({ id: actionUser.id, enabled: !actionUser.isTrusted })}
                    disabled={pending}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                      actionUser.isTrusted
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-100"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BadgeCheck className="w-3.5 h-3.5" />
                      Vendeur de confiance
                    </span>
                    {toggleTrusted.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : actionUser.isTrusted ? (
                      "Actif"
                    ) : (
                      "Inactif"
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={() => { if (confirm("Supprimer cet utilisateur ?")) deleteUser.mutate(actionUser.id); }}
                disabled={pending || actionUser.role === "admin"}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                {deleteUser.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Supprimer l'utilisateur
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
