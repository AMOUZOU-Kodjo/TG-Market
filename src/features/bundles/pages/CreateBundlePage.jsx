import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Plus, Trash2, AlertTriangle } from "lucide-react";
import { useCreateBundle } from "@/features/bundles/hooks/useBundles";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA } from "@/shared/utils/format";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function CreateBundlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: myProducts = [], isLoading, isError } = useMyProducts({ status: "active", limit: 50 });
  const createBundle = useCreateBundle();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const products = myProducts?.data || myProducts || [];

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const discountPct = totalPrice > 0 && bundlePrice
    ? Math.round(((totalPrice - Number(bundlePrice)) / totalPrice) * 100)
    : 0;

  const toggleProduct = (productId) => {
    setSelectedIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Veuillez entrer un titre pour le lot");
      return;
    }
    if (selectedIds.length < 2) {
      toast.error("Sélectionnez au moins 2 produits pour créer un lot");
      return;
    }
    if (!bundlePrice || Number(bundlePrice) <= 0) {
      toast.error("Veuillez entrer un prix pour le lot");
      return;
    }
    try {
      const result = await createBundle.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        productIds: selectedIds,
        bundlePrice: Number(bundlePrice),
      });
      toast.success("Lot créé avec succès !");
      navigate(`/lot/${result.id}`);
    } catch {
      toast.error("Erreur lors de la création du lot");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    navigate("/connexion");
    return null;
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Erreur de chargement</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Impossible de charger vos annonces. Réessayez plus tard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <motion.div {...fadeUp}>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Créer un lot
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Informations du lot
              </h3>
              <Input
                label="Titre du lot"
                placeholder="ex : Lot électronique d'occasion"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                icon={Package}
              />
              <div className="mt-4">
                <Textarea
                  label="Description (optionnel)"
                  placeholder="Décrivez ce lot et ses caractéristiques..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
              </div>
              <div className="mt-4">
                <Input
                  type="number"
                  label="Prix du lot (FCFA)"
                  placeholder={String(totalPrice || "")}
                  value={bundlePrice}
                  onChange={(e) => setBundlePrice(e.target.value)}
                  min={1}
                  required
                  icon={Package}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Sélectionner les produits ({selectedIds.length} sélectionné{selectedIds.length !== 1 ? "s" : ""})
              </h3>
              {products.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vous n'avez pas d'annonces actives.{" "}
                  <a href="/vendre" className="text-brand-800 hover:underline dark:text-brand-400">
                    Créer une annonce
                  </a>{" "}
                  pour commencer.
                </p>
              ) : (
                <div className="space-y-2">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="h-4 w-4 rounded border-gray-300 text-brand-800 focus:ring-brand-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCFA(product.price)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {selectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Aperçu du lot
                </h3>
                <div className="space-y-2">
                  {selectedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate flex-1 mr-2 text-gray-700 dark:text-gray-300">
                        {p.title}
                      </span>
                      <span className="shrink-0 font-medium text-gray-900 dark:text-white">
                        {formatCFA(p.price)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-100 pt-2 mt-2 flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Prix total</span>
                    <span className="font-medium text-gray-500 dark:text-gray-400 line-through">
                      {formatCFA(totalPrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Prix du lot</span>
                    <span className="font-bold text-brand-800 dark:text-brand-400">
                      {formatCFA(Number(bundlePrice) || 0)}
                    </span>
                  </div>
                  {discountPct > 0 && (
                    <div className="text-center text-xs font-medium text-green-700 dark:text-green-400">
                      Économie de {discountPct}% (-{formatCFA(totalPrice - Number(bundlePrice))})
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={createBundle.isPending}
              icon={Package}
            >
              Créer le lot
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}