import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, AlertTriangle, MapPin, Tag, Package } from "lucide-react";
import { useCreateOffer } from "@/features/offers/hooks/useOffers";
import { useProduct } from "@/features/products/hooks/useProducts";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA } from "@/shared/utils/format";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import toast from "react-hot-toast";

export default function MakeOfferPage() {
  const { productId: id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  const { data: product, isLoading } = useProduct(id);
  const createOffer = useCreateOffer(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-700" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Produit introuvable</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Cette annonce n'existe pas.</p>
        </div>
      </div>
    );
  }

  if (product.seller?.id === user?.id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Action impossible</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Vous ne pouvez pas faire une offre sur votre propre annonce.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error("Veuillez entrer un montant valide");
      return;
    }
    try {
      await createOffer.mutateAsync({
        amount: Number(amount),
        message,
      });
      toast.success("Votre offre a été soumise avec succès !");
      navigate(`/produit/${id}`);
    } catch {
      toast.error("Erreur lors de la soumission de l'offre");
    }
  };

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
          Faire une offre
        </h1>

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className="h-full space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 h-full"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                {product.images?.[activeImage] ? (
                  <img
                    src={product.images[activeImage]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Package className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
                {product.condition && (
                  <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm dark:bg-gray-900/90 dark:text-gray-300">
                    {product.condition === "new" ? "Neuf" : product.condition === "like_new" ? "Très bon état" : product.condition === "good" ? "Bon état" : product.condition === "fair" ? "Usé" : product.condition}
                  </div>
                )}
              </div>
              {product.images?.length > 1 && (
                <div className="flex gap-1.5 border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveImage(i)}
                      className={`h-12 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        i === activeImage
                          ? "border-brand-800 opacity-100 dark:border-brand-400"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              <div className="p-4">
                <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                  {product.title}
                </h2>
                <p className="mt-1 text-lg font-bold text-brand-800 dark:text-brand-400">
                  {formatCFA(product.price)}
                </p>
                {product.negotiable && (
                  <span className="mt-1 inline-block rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    Négociable
                  </span>
                )}
                <div className="mt-3 space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="truncate">{product.city}{product.neighborhood ? `, ${product.neighborhood}` : ""}</span>
                  </div>
                  {product.seller && (
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[9px] font-bold text-brand-800 dark:bg-brand-900/30 dark:text-brand-400">
                        {product.seller.name?.[0] || "?"}
                      </div>
                      <span className="truncate">{product.seller.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <h2 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
                Votre offre
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="number"
                  label="Montant de votre offre (FCFA)"
                  placeholder={String(Math.round(product.price * 0.9))}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                  required
                  icon={Tag}
                />
                <Textarea
                  label="Message au vendeur (optionnel)"
                  placeholder="Bonjour, je suis intéressé par votre annonce..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-400 dark:text-gray-600">
                  Le vendeur recevra votre offre et pourra l'accepter, la refuser ou proposer un
                  contre-prix.
                </p>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="lg"
                  loading={createOffer.isPending}
                  icon={MessageSquare}
                >
                  Soumettre l'offre
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
