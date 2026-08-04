import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Edit3,
  Trash2,
  Loader2,
} from "lucide-react";
import { useMyBundles, useDeleteBundle } from "@/features/bundles/hooks/useBundles";
import { formatCFA } from "@/shared/utils/format";
import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import EmptyState from "@/shared/ui/EmptyState";
import BackButton from "@/shared/ui/BackButton";
import { toast } from "react-hot-toast";

export default function BundlesManagePage() {
  const navigate = useNavigate();
  const { data, isLoading } = useMyBundles({ perPage: 50 });
  const deleteBundle = useDeleteBundle();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const bundles = data?.data || [];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBundle.mutateAsync(deleteTarget.id);
      toast.success("Lot supprimé");
      setDeleteTarget(null);
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mes lots</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gérez vos packs de produits
            </p>
          </div>
        </div>
        <Button variant="primary" icon={Plus} onClick={() => navigate("/lot/creer")}>
          Créer un lot
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
        </div>
      ) : bundles.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Aucun lot"
          description="Vous n'avez pas encore créé de lot"
          action={
            <Button variant="primary" icon={Plus} onClick={() => navigate("/lot/creer")}>
              Créer un lot
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {bundles.map((bundle) => {
            const items = bundle.items ?? [];
            const firstImage = items[0]?.product?.images?.[0];
            return (
              <div
                key={bundle.id}
                className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
                  {firstImage ? (
                    <img src={firstImage} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/lot/${bundle.id}`}
                    className="text-sm font-semibold text-gray-900 hover:text-brand-800 dark:text-white dark:hover:text-brand-600"
                  >
                    {bundle.title}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-brand-800 dark:text-brand-600">
                      {formatCFA(bundle.bundlePrice ?? 0)}
                    </span>
                    <span>{bundle.itemCount ?? items.length} produit{(bundle.itemCount ?? items.length) > 1 ? "s" : ""}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/lot/${bundle.id}`)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-800 dark:hover:bg-gray-700 dark:hover:text-brand-600"
                    title="Voir"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(bundle)}
                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Supprimer le lot"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Êtes-vous sûr de vouloir supprimer <strong>{deleteTarget?.title}</strong> ? Cette action est irréversible.
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => setDeleteTarget(null)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700"
            loading={deleteBundle.isPending}
            onClick={handleDelete}
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
