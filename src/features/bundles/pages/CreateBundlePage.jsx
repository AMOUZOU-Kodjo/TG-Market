import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Check, X, MapPin, AlertTriangle, Search } from "lucide-react";
import { useCreateBundle } from "@/features/bundles/hooks/useBundles";
import { useMyProducts } from "@/features/products/hooks/useProducts";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA } from "@/shared/utils/format";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import toast from "react-hot-toast";

export default function CreateBundlePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: myProducts = [], isLoading, isError } = useMyProducts({ limit: 50 });
  const createBundle = useCreateBundle();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [bundlePrice, setBundlePrice] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [search, setSearch] = useState("");

  const products = myProducts?.data || myProducts || [];

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.brand?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const selectedProducts = products.filter((p) => selectedIds.includes(p.id));
  const totalPrice = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const discountPct =
    totalPrice > 0 && bundlePrice
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
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Créer un lot
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Informations du lot
              </h3>
              <div className="space-y-4">
                <Input
                  label="Titre du lot"
                  placeholder="ex : Lot électronique d'occasion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  icon={Package}
                />
                <Textarea
                  label="Description (optionnel)"
                  placeholder="Décrivez ce lot et ses caractéristiques..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  maxLength={500}
                />
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
            </motion.div>

            {selectedProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Produits sélectionnés ({selectedProducts.length})
                  </h3>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Tout désélectionner
                  </button>
                </div>
                <div className="space-y-2">
                  {selectedProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                        {p.images?.[0] && (
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatCFA(p.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleProduct(p.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 dark:border-gray-800">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Prix total</span>
                    <span className="font-medium text-gray-500 line-through dark:text-gray-400">
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
                    <div className="rounded-lg bg-green-50 p-2 text-center text-xs font-medium text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Économie de {discountPct}% (-{formatCFA(totalPrice - Number(bundlePrice))})
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={createBundle.isPending}
                  icon={Package}
                  className="mt-4"
                  onClick={handleSubmit}
                >
                  Créer le lot
                </Button>
              </motion.div>
            )}

            {selectedProducts.length === 0 && (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-6 text-center dark:border-gray-700 dark:bg-gray-900">
                <Package className="mx-auto mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Sélectionnez au moins 2 produits
                </p>
              </div>
            )}
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Mes annonces
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProducts.length} annonce{filteredProducts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {products.length > 0 && (
                <div className="relative mb-4">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher dans mes annonces..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-brand-800 focus:outline-none focus:ring-1 focus:ring-brand-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder-gray-500 dark:focus:border-brand-400 dark:focus:ring-brand-400"
                  />
                </div>
              )}

              {filteredProducts.length === 0 ? (
                <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <Package className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" />
                  {search ? (
                    <>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Aucune annonce trouvée
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Essayez un autre terme de recherche.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Vous n'avez pas encore d'annonces
                      </p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Créez des annonces pour pouvoir les regrouper en lots.
                      </p>
                      <Link
                        to="/vendre"
                        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-900"
                      >
                        Créer une annonce
                      </Link>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {filteredProducts.map((product) => {
                    const selected = selectedIds.includes(product.id);
                    return (
                      <motion.button
                        key={product.id}
                        type="button"
                        onClick={() => toggleProduct(product.id)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`relative overflow-hidden rounded-2xl border bg-white text-left shadow-sm transition-all dark:bg-gray-900 ${
                          selected
                            ? "border-brand-800 ring-2 ring-brand-800 dark:border-brand-400 dark:ring-brand-400"
                            : "border-gray-100 hover:border-gray-200 hover:shadow-md dark:border-gray-800 dark:hover:border-gray-700"
                        }`}
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Package className="h-8 w-8 text-gray-300 dark:text-gray-600" />
                            </div>
                          )}
                          <div
                            className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors ${
                              selected
                                ? "border-brand-800 bg-brand-800 text-white dark:border-brand-400 dark:bg-brand-400"
                                : "border-white bg-white/80 text-transparent dark:border-gray-600 dark:bg-gray-800/80"
                            }`}
                          >
                            {selected && <Check className="h-4 w-4" />}
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="mb-1 truncate text-sm font-medium text-gray-900 dark:text-white">
                            {product.title}
                          </p>
                          <p className="text-sm font-bold text-brand-800 dark:text-brand-400">
                            {formatCFA(product.price)}
                          </p>
                          {product.city && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{product.city}</span>
                            </p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
