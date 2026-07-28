import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MessageSquare, AlertTriangle } from "lucide-react";
import { useCreateOffer } from "@/features/offers/hooks/useOffers";
import { useProduct } from "@/features/products/hooks/useProducts";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import { formatCFA } from "@/shared/utils/format";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import Textarea from "@/shared/ui/Textarea";
import toast from "react-hot-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function MakeOfferPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { siteName } = useSiteSettings();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const { data: product, isLoading, error } = useProduct(id);
  const createOffer = useCreateOffer();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-800 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-700" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Erreur de chargement</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Impossible de charger cette annonce. Réessayez plus tard.
          </p>
        </div>
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

  if (!user) {
    navigate("/connexion");
    return null;
  }

  if (product.seller?.id === user.id) {
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
        amount: Number(amount) * 100,
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
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-6 lg:px-8">
        <motion.div {...fadeUp}>
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </button>

          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            Faire une offre
          </h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center gap-4">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="h-20 w-20 rounded-xl object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{product.title}</h3>
                <p className="mt-1 text-lg font-bold text-brand-800 dark:text-brand-400">
                  {formatCFA(product.price)}
                </p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              label="Montant de votre offre (FCFA)"
              placeholder={String(Math.round(product.price * 0.9))}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min={1}
              required
              icon={MessageSquare}
            />
            <Textarea
              label="Message au vendeur (optionnel)"
              placeholder="Bonjour, je suis intéressé par votre annonce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
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
  );
}