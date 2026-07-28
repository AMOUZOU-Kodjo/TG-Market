import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Package,
  Tag,
  MapPin,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Euro,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Breadcrumb from "@/shared/ui/Breadcrumb";
import ImageGallery from "@/shared/ui/ImageGallery";
import { useBundle } from "@/features/bundles/hooks/useBundles";
import { useBundleProposals, useCreateBundleProposal } from "@/features/bundles/hooks/useBundleProposals";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { formatCFA } from "@/shared/utils/format";
import { toast } from "react-hot-toast";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function BundleDetailPage() {
  const { id: bundleId } = useParams();
  const navigate = useNavigate();

  const { data: bundle, isLoading } = useBundle(bundleId);
  const { user } = useAuth();
  const { settings } = useSiteSettings();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Package className="mb-4 h-12 w-12 text-red-700" />
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Lot introuvable
        </h1>
        <p className="mb-6 text-gray-500 dark:text-gray-400">
          Ce lot n'existe pas ou a été supprimé.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-900"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const items = bundle.items ?? [];
  const products = items.map((item) => item.product).filter(Boolean);
  const totalIndividualPrice = products.reduce(
    (sum, p) => sum + (p.price || 0),
    0
  );
  const bundlePrice = bundle.bundlePrice ?? totalIndividualPrice;
  const savings = totalIndividualPrice - bundlePrice;
  const savingsPct =
    totalIndividualPrice > 0
      ? Math.round((savings / totalIndividualPrice) * 100)
      : 0;

  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    { label: "Lots", href: "/lot" },
    { label: bundle.title },
  ];

  const seller = bundle.seller;
  const isOwnBundle = user && seller && user.id === seller.id;
  const { data: proposalsData } = useBundleProposals(isOwnBundle ? bundleId : undefined);
  const createProposal = useCreateBundleProposal();
  const [proposedPrice, setProposedPrice] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");

  const userProposal = !isOwnBundle && user
    ? proposalsData?.data?.find((p) => p.buyerId === user.id)
    : null;

  const handleSubmitProposal = async () => {
    if (!user) {
      toast.error("Connectez-vous pour faire une proposition");
      navigate("/connexion");
      return;
    }
    const price = parseInt(proposedPrice, 10);
    if (!price || price <= 0) {
      toast.error("Entrez un prix valide");
      return;
    }
    try {
      await createProposal.mutateAsync({ bundleId, proposedPrice: price, message: proposalMessage });
      toast.success("Proposition envoyée !");
      setProposedPrice("");
      setProposalMessage("");
    } catch {
      toast.error("Erreur lors de l'envoi");
    }
  };

  const proposalStatusBadge = (status) => {
    const map = {
      pending: { label: "En attente", icon: Clock, class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
      accepted: { label: "Acceptée", icon: CheckCircle, class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
      rejected: { label: "Refusée", icon: XCircle, class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
      cancelled: { label: "Annulée", icon: XCircle, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
    };
    const s = map[status] || map.pending;
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.class}`}>
        <s.icon className="h-3 w-3" />
        {s.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              {bundle.title}
            </h1>
          </div>
        </div>

        <Breadcrumb items={breadcrumbItems} className="mb-5" />

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <motion.div {...fadeUp} transition={{ delay: 0.05 }}>
              <ImageGallery images={products.flatMap((p) => p.images ?? [])} />
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                À propos de ce lot
              </h3>
              <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                {bundle.description}
              </p>

              {bundle.location && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-800" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {bundle.location}
                  </span>
                </div>
              )}

              {bundle.tags && bundle.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {bundle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-brand-400 hover:text-brand-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-brand-800/30 dark:hover:text-brand-700"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              {...fadeUp}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-gray-900 dark:text-white">
                <Package className="h-5 w-5 text-brand-800" />
                Produits dans ce lot ({products.length})
              </h3>
              <div className="space-y-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produit/${product.id}`}
                    className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-colors hover:border-brand-400 hover:bg-brand-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-800/30 dark:hover:bg-brand-900/10"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-600">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-600">
                        {product.title}
                      </h4>
                      <p className="mt-0.5 text-sm font-semibold text-brand-800 dark:text-brand-600">
                        {formatCFA(product.price)}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-800 group-hover:underline dark:text-brand-600">
                        Voir l'annonce
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-brand-800 dark:group-hover:text-brand-600" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-5">
            <div className="lg:sticky lg:top-24">
              <motion.div
                {...fadeUp}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h3 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
                  Résumé du lot
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Prix total individuel</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCFA(totalIndividualPrice)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                    <span>Prix du lot</span>
                    <span className="font-semibold text-brand-800 dark:text-brand-600">
                      {formatCFA(bundlePrice)}
                    </span>
                  </div>

                  {savings > 0 && (
                    <>
                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                        <span>Économie</span>
                        <span className="font-medium text-green-700 dark:text-green-600">
                          {formatCFA(savings)} ({savingsPct}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700">
                        <div
                          className="h-full rounded-full bg-green-600"
                          style={{ width: `${Math.min(savingsPct, 100)}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-5 space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    icon={ShoppingCart}
                    onClick={() => toast("Fonctionnalité à venir")}
                  >
                    Acheter le lot
                  </Button>

                  {!isOwnBundle && user && !userProposal && (
                    <Button
                      variant="outline"
                      fullWidth
                      size="md"
                      icon={MessageCircle}
                      onClick={() => document.getElementById("proposal-form")?.classList.toggle("hidden")}
                    >
                      Faire une proposition
                    </Button>
                  )}
                </div>

                {!isOwnBundle && user && (
                  <div id="proposal-form" className="mt-4 hidden space-y-3 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Votre proposition
                    </h4>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Prix proposé (FCFA)</label>
                      <div className="relative">
                        <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={proposedPrice}
                          onChange={(e) => setProposedPrice(e.target.value)}
                          placeholder="ex: 25000"
                          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">Message (optionnel)</label>
                      <textarea
                        value={proposalMessage}
                        onChange={(e) => setProposalMessage(e.target.value)}
                        placeholder="Expliquez votre proposition..."
                        rows={3}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-white p-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
                      />
                    </div>
                    <Button
                      variant="primary"
                      fullWidth
                      size="sm"
                      icon={Send}
                      onClick={handleSubmitProposal}
                      loading={createProposal.isPending}
                    >
                      Envoyer la proposition
                    </Button>
                  </div>
                )}

                {userProposal && (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Ma proposition</h4>
                      {proposalStatusBadge(userProposal.status)}
                    </div>
                    <p className="mt-2 text-lg font-bold text-brand-800 dark:text-brand-600">
                      {formatCFA(userProposal.proposedPrice)}
                    </p>
                    {userProposal.message && (
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{userProposal.message}</p>
                    )}
                  </div>
                )}

                {isOwnBundle && proposalsData?.data?.length > 0 && (
                  <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Propositions ({proposalsData.data.length})
                    </h4>
                    <div className="space-y-2">
                      {proposalsData.data.slice(0, 3).map((p) => (
                        <div key={p.id} className="rounded-lg bg-white p-3 text-sm dark:bg-gray-900">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {[p.buyer?.firstName, p.buyer?.lastName].filter(Boolean).join(" ")}
                            </span>
                            {proposalStatusBadge(p.status)}
                          </div>
                          <p className="mt-1 font-bold text-brand-800 dark:text-brand-600">
                            {formatCFA(p.proposedPrice)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {seller && (
                  <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-700">
                    <h4 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                      Vendeur
                    </h4>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        {seller.avatar ? (
                          <img
                            src={seller.avatar}
                            alt={`${seller.firstName ?? ""} ${seller.lastName ?? ""}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400 dark:text-gray-600">
                            <span className="text-sm font-medium">
                              {((seller.firstName?.[0] ?? "") + (seller.lastName?.[0] ?? "") || "?")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {[seller.firstName, seller.lastName].filter(Boolean).join(" ") || "Vendeur"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}