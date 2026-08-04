import { useState } from "react";
import { Search, Package, CheckCircle, XCircle, Trash2, Eye, X, Loader2, Save } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import { formatCFA } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";
import toast from "react-hot-toast";

const statusLabels = {
  active: "Actif",
  pending: "En attente",
  rejected: "Rejeté",
  sold: "Vendu",
  inactive: "Inactif",
  deleted: "Supprimé",
};

const statusColors = {
  active: "success",
  pending: "warning",
  rejected: "danger",
  sold: "primary",
  inactive: "secondary",
  deleted: "danger",
};

const conditionLabels = { new: "Neuf", like_new: "Comme neuf", good: "Bon état", fair: "État correct", poor: "Usé" };

function ProductModal({ productId, onClose }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["adminProduct", productId],
    queryFn: () => api.get(`/admin/products/${productId}`).then((r) => r.data),
    enabled: !!productId,
  });

  const updateProduct = useMutation({
    mutationFn: (data) => api.put(`/admin/products/${productId}`, data),
    onSuccess: (updated) => {
      toast.success("Annonce mise à jour");
      setForm(null);
      setEditing(false);
      qc.invalidateQueries({ queryKey: ["adminProducts"] });
      qc.setQueryData(["adminProduct", productId], updated);
    },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur lors de la mise à jour"),
  });

  const startEdit = () => {
    setForm({
      title: product.title,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? "",
      condition: product.condition,
      brand: product.brand ?? "",
      city: product.city,
      neighborhood: product.neighborhood ?? "",
      negotiable: product.negotiable,
      deliveryAvailable: product.deliveryAvailable,
      deliveryPrice: product.deliveryPrice ?? "",
      status: product.status,
      isUrgent: product.isUrgent,
      isPromoted: product.isPromoted,
      isFeatured: product.isFeatured,
    });
    setEditing(true);
  };

  const handleSave = () => {
    const payload = { ...form };
    payload.price = Number(payload.price);
    if (payload.originalPrice !== "" && payload.originalPrice != null) payload.originalPrice = Number(payload.originalPrice);
    else payload.originalPrice = null;
    if (payload.deliveryPrice !== "" && payload.deliveryPrice != null) payload.deliveryPrice = Number(payload.deliveryPrice);
    else payload.deliveryPrice = null;
    updateProduct.mutate(payload);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8" onClick={(e) => e.stopPropagation()}>
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 truncate pr-4">{product.title}</h2>
          <div className="flex items-center gap-2">
            {!editing && (
              <button onClick={startEdit} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 transition-colors">
                Modifier
              </button>
            )}
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {product.images?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((url, i) => (
                <img key={i} src={url} alt="" className="w-24 h-24 object-cover rounded-xl shrink-0" />
              ))}
            </div>
          )}

          {editing && form ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Titre</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prix (FCFA)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Prix original</label>
                  <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">État</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                    {Object.entries(conditionLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Statut</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/50">
                    {Object.entries(statusLabels).filter(([k]) => k !== "deleted").map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Ville</label>
                  <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Quartier</label>
                  <input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })} className="w-full px-3 py-2 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50" />
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" checked={form.negotiable} onChange={(e) => setForm({ ...form, negotiable: e.target.checked })} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  Négociable
                </label>
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" checked={form.deliveryAvailable} onChange={(e) => setForm({ ...form, deliveryAvailable: e.target.checked })} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  Livraison
                </label>
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" checked={form.isUrgent} onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  Urgent
                </label>
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" checked={form.isPromoted} onChange={(e) => setForm({ ...form, isPromoted: e.target.checked })} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  Promu
                </label>
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-gray-300 text-brand-500 focus:ring-brand-500" />
                  En avant
                </label>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={statusColors[product.status] ?? "secondary"}>{statusLabels[product.status] ?? product.status}</Badge>
                <Badge variant="secondary">{conditionLabels[product.condition] ?? product.condition}</Badge>
                {product.isUrgent && <Badge variant="danger">Urgent</Badge>}
                {product.isPromoted && <Badge variant="primary">Promu</Badge>}
                {product.isFeatured && <Badge variant="warning">En avant</Badge>}
              </div>

              <div className="text-2xl font-bold text-gray-900">{formatCFA(product.price)}</div>

              <p className="text-sm text-gray-600 whitespace-pre-line">{product.description}</p>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-400">Ville :</span> <span className="text-gray-900">{product.city}{product.neighborhood ? `, ${product.neighborhood}` : ""}</span></div>
                <div><span className="text-gray-400">Catégorie :</span> <span className="text-gray-900">{product.category?.name}</span></div>
                <div><span className="text-gray-400">Négociable :</span> <span className="text-gray-900">{product.negotiable ? "Oui" : "Non"}</span></div>
                <div><span className="text-gray-400">Livraison :</span> <span className="text-gray-900">{product.deliveryAvailable ? `Oui${product.deliveryPrice ? ` (${formatCFA(product.deliveryPrice)})` : ""}` : "Non"}</span></div>
                <div><span className="text-gray-400">Vues :</span> <span className="text-gray-900">{product.views}</span></div>
                <div><span className="text-gray-400">Favoris :</span> <span className="text-gray-900">{product.favoritesCount}</span></div>
              </div>

              {product.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {product.tags.map((t, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">{t}</span>
                  ))}
                </div>
              )}

              {product.specifications?.length > 0 && (
                <div className="space-y-1 text-sm">
                  {product.specifications.map((s, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-400">{s.label}</span>
                      <span className="text-gray-900">{s.value}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                <Avatar src={product.user?.avatar} name={`${product.user?.firstName} ${product.user?.lastName}`} size="sm" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{product.user?.firstName} {product.user?.lastName}</p>
                  <p className="text-xs text-gray-400">{product.user?.phone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {editing && (
          <div className="flex justify-end gap-3 p-4 border-t border-gray-100">
            <button onClick={() => { setEditing(false); setForm(null); }} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700">Annuler</button>
            <button onClick={handleSave} disabled={updateProduct.isPending} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-colors">
              {updateProduct.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Enregistrer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminListingsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewProduct, setViewProduct] = useState(null);
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

      <div className=" overflow-hidden">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
            {filtered.map((product) => (
              <div key={product.id} className="   overflow-hidden hover:shadow-xs transition-shadow flex flex-col">
                <div className="relative aspect-[3/3] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[inset_0_0_25px_rgba(0,0,0,0.35)] dark:border-gray-600 dark:bg-gray-800">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300"><Package className="w-10 h-10" /></div>
                  )}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]" />
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant={statusColors[product.status] ?? "secondary"} size="sm">
                      {statusLabels[product.status] ?? product.status}
                    </Badge>
                  </div>
                </div>
                <div className="p-2 min-w-0">
                  <p className="text-xs font-medium text-gray-900 truncate">{product.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{product.user?.firstName} {product.user?.lastName}</p>
                  <p className="text-xs font-bold text-brand-700 mt-0.5">{formatCFA(product.price)}</p>
                  <div className="flex items-center justify-center gap-2 mt-1 pt-1 border-t border-gray-100">
                    {product.status !== "active" && (
                      <button onClick={() => updateStatus.mutate({ id: product.id, status: "active" })}
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors" title="Approuver">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {product.status !== "rejected" && (
                      <button onClick={() => updateStatus.mutate({ id: product.id, status: "rejected" })}
                        className="p-1.5 rounded-lg text-orange-500 hover:bg-orange-50 transition-colors" title="Rejeter">
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setViewProduct(product.id)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors" title="Voir / Modifier">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => { if (confirm("Supprimer cette annonce ?")) deleteProduct.mutate(product.id); }}
                      disabled={deleteProduct.isPending}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-30" title="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {viewProduct && <ProductModal productId={viewProduct} onClose={() => setViewProduct(null)} />}
    </div>
  );
}
