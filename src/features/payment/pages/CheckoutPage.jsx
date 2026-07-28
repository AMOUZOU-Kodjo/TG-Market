import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Info,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Phone,
  Smartphone,
} from "lucide-react";
import { useProduct } from "@/features/products/hooks/useProducts";
import { escrowApi } from "@/features/wallet/services/wallet.api";
import { formatCFA } from "@/shared/utils/format";
import PaymentMethodSelector from "@/features/payment/components/PaymentMethodSelector";
import { useAuth } from "@/shared/contexts/AuthContext";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "flooz", name: "Flooz", color: "#E60000", bgClass: "bg-red-50" },
  { id: "tmoney", name: "TMoney", color: "#00A651", bgClass: "bg-green-50" },
];

const PLATFORM_FEE = 0.05;

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: product, isLoading } = useProduct(productId);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdEscrow, setCreatedEscrow] = useState(null);
  const [paymentStep, setPaymentStep] = useState(null);
  const [countdown, setCountdown] = useState(5);
  const [paid, setPaid] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-gray-500">Produit introuvable</p>
        <Link to="/" className="mt-4 text-sm text-brand-800 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  if (product.seller?.id === user?.id) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-gray-500">Vous ne pouvez pas acheter votre propre annonce</p>
        <Link to="/" className="mt-4 text-sm text-brand-800 hover:underline">Retour à l'accueil</Link>
      </div>
    );
  }

  const amount = Number(product.price);
  const fee = Math.round(amount * PLATFORM_FEE);
  const total = amount + fee;

  const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || selectedMethod;

  const handleSubmit = async () => {
    if (!selectedMethod) {
      toast.error("Veuillez sélectionner un moyen de paiement");
      return;
    }
    if (!phone || phone.length < 8) {
      toast.error("Veuillez entrer votre numéro de téléphone");
      return;
    }

    setSubmitting(true);
    try {
      const escrow = await escrowApi.create({
        productId: Number(productId),
        sellerId: product.seller.id,
        paymentMethod: selectedMethod,
      });
      setCreatedEscrow(escrow);
      setPaymentStep("confirm");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur lors de l'achat");
    } finally {
      setSubmitting(false);
    }
  };

  const startSimulation = async () => {
    setPaymentStep("processing");
    setCountdown(5);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(async () => {
      try {
        await escrowApi.confirmPayment(createdEscrow.id);
        setPaid(true);
        setPaymentStep("success");
      } catch {
        toast.error("Erreur lors du paiement");
        setPaymentStep("confirm");
      }
    }, 6000);
  };

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-green-100 bg-green-50 p-8 text-center dark:border-green-800 dark:bg-green-900/10"
            >
              <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
              <h1 className="text-xl font-bold text-green-800 dark:text-green-400">
                Paiement confirmé !
              </h1>
              <p className="mt-2 text-sm text-green-700 dark:text-green-500">
                {formatCFA(total)} payé via {methodName}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Le vendeur a été notifié. Vous serez informé dès que la commande sera expédiée.
              </p>
            </motion.div>

            <button
              onClick={() => navigate(`/commandes/${createdEscrow.id}`)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900"
            >
              Voir ma commande
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStep === "processing") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800"
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 dark:bg-brand-800/20"
              >
                <Smartphone className="h-10 w-10 text-brand-800" />
              </motion.div>

              <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                Paiement en cours
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Une demande de paiement de <strong>{formatCFA(total)}</strong> a été envoyée à votre <strong>{methodName}</strong>
              </p>

              <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{phone}</span>
              </div>

              <div className="mt-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-4 border-brand-200 border-t-brand-800 animate-spin">
                  <span className="text-sm font-bold text-brand-800">{countdown}</span>
                </div>
                <p className="mt-3 text-xs text-gray-400">
                  Confirmation automatique dans {countdown} seconde{countdown > 1 ? "s" : ""}...
                </p>
              </div>

              <p className="mt-6 text-xs text-gray-400">
                Ne quittez pas cette page. Le paiement est en cours de traitement.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>

        {!createdEscrow ? (
          <>
            <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">Finaliser l'achat</h1>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Vendu par {product.seller?.name}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
              >
                <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Détails du paiement
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Prix</span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCFA(amount)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      Frais de service (5%)
                      <Info className="h-3 w-3" />
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">{formatCFA(fee)}</span>
                  </div>
                  <hr className="border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>{formatCFA(total)}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
              >
                <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Moyen de paiement
                </h2>
                <PaymentMethodSelector
                  methods={PAYMENT_METHODS}
                  selected={selectedMethod}
                  onSelect={setSelectedMethod}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
              >
                <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
                  Numéro de téléphone
                </h2>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Votre numéro {methodName === 'Flooz' ? 'Flooz' : 'TMoney'}"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/10"
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Paiement sécurisé. Les fonds sont bloqués jusqu'à confirmation de livraison.
                </p>
              </motion.div>

              <button
                onClick={handleSubmit}
                disabled={submitting || !selectedMethod || !phone}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-all hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingCart className="h-4 w-4" />
                )}
                {submitting ? "Traitement..." : `Payer ${formatCFA(total)}`}
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="mb-6 text-xl font-bold text-gray-900 dark:text-white">
              Confirmer le paiement
            </h1>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {product.title}
                    </p>
                    <p className="text-sm font-bold text-brand-800">{formatCFA(total)}</p>
                    <p className="text-xs text-gray-500">via {methodName}</p>
                  </div>
                </div>
              </motion.div>

              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/10">
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  Vous allez recevoir une demande de paiement de <strong>{formatCFA(total)}</strong> sur votre <strong>{methodName}</strong> au <strong>{phone}</strong>.
                </p>
              </div>

              <button
                onClick={startSimulation}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900"
              >
                <Smartphone className="h-4 w-4" />
                Confirmer le paiement
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
