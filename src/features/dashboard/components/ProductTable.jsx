import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Package,
} from "lucide-react";
import Badge from "@/shared/ui/Badge";
import { cn } from "@/shared/utils/cn";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import { useMyProducts, useDeleteProduct } from "@/features/products/hooks/useProducts";
import { productsApi } from "@/features/products/services/products.api";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const statusConfig = {
  active: { label: "En ligne", variant: "success" },
  paused: { label: "En pause", variant: "warning" },
  sold: { label: "Vendu", variant: "secondary" },
  draft: { label: "Brouillon", variant: "neutral" },
};

export default function ProductTable() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const products = data?.data ?? [];

  const handleDelete = async (product) => {
    if (!window.confirm(`Supprimer « ${product.title} » ?`)) return;
    try {
      await deleteProduct.mutateAsync(product.id);
      toast.success("Annonce supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleToggleStatus = async (product) => {
    const newStatus = product.status === "active" ? "paused" : "active";
    try {
      await productsApi.updateStatus(product.id, newStatus);
      queryClient.invalidateQueries({ queryKey: ["myProducts"] });
      toast.success(newStatus === "active" ? "Annonce réactivée" : "Annonce mise en pause");
    } catch {
      toast.error("Erreur lors du changement de statut");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
        <p className="mt-3 text-sm text-gray-500">Chargement des annonces...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900">
        <Package className="mx-auto h-10 w-10 text-gray-300" />
        <p className="mt-3 text-sm text-gray-500">Aucune annonce publiée</p>
        <button
          onClick={() => navigate("/publier")}
          className="mt-3 text-sm font-medium text-brand-800 hover:underline"
        >
          Créer une annonce
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Produit
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 sm:table-cell">
                Prix
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 md:table-cell">
                Statut
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                Vues
              </th>
              <th className="hidden px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 lg:table-cell">
                Favoris
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {products.map((product) => {
              const productImage = product.images?.[0] || null;
              const st = statusConfig[product.status] || { label: product.status, variant: "neutral" };
              return (
                <motion.tr key={product.id} layout className="group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {productImage ? (
                        <img
                          src={productImage}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                          <span className="text-xs text-gray-400">📷</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p
                          className="cursor-pointer truncate text-sm font-medium text-gray-900 hover:text-brand-800 dark:text-white dark:hover:text-brand-400"
                          onClick={() => navigate(`/annonces/${product.id}`)}
                        >
                          {product.title}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 sm:hidden">
                          {formatCFA(product.price)}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400 md:hidden">
                          <span
                            className={cn(
                              "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                              st.variant === "success" && "bg-brand-100 text-brand-700",
                              st.variant === "warning" && "bg-yellow-50 text-yellow-600",
                              st.variant === "secondary" && "bg-gray-100 text-gray-700"
                            )}
                          >
                            {st.label}
                          </span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white sm:table-cell">
                    {formatCFA(product.price)}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge variant={st.variant}>{st.label}</Badge>
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 lg:table-cell">
                    {product.views ?? 0}
                  </td>
                  <td className="hidden whitespace-nowrap px-4 py-3 text-sm text-gray-600 dark:text-gray-400 lg:table-cell">
                    {product.favorites ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleStatus(product)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                        title={product.status === "active" ? "Mettre en pause" : "Réactiver"}
                      >
                        {product.status === "active" ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        // onClick={() => navigate(`/annonces/${product.id}/modifier`)}
                        onClick={() => navigate(`/modifier/${product.id}`)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-brand-800 dark:hover:bg-gray-800 dark:hover:text-brand-400"
                        title="Modifier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-800 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
