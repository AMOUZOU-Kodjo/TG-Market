import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Copy,
  Check,
} from "lucide-react";
import { useProduct } from "@/features/products/hooks/useProducts";
import { escrowApi } from "@/features/wallet/services/wallet.api";
import { paymentApi } from "@/features/payment/services/payment.api";
import { formatCFA } from "@/shared/utils/format";
import PaymentMethodSelector from "@/features/payment/components/PaymentMethodSelector";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "flooz", name: "Flooz", color: "#E60000", bgClass: "bg-red-50" },
  { id: "tmoney", name: "TMoney", color: "#00A651", bgClass: "bg-green-50" },
];

const PLATFORM_ACCOUNTS = {
  flooz: { number: "+228 90 00 00 01", name: "TG-Market Flooz" },
  tmoney: { number: "+228 90 00 00 02", name: "TG-Market T-Money" },
};

export default function CheckoutPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { platformBuyerFeePercent } = useSiteSettings();
  const { data: product, isLoading } = useProduct(productId);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [phone, setPhone] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdEscrow, setCreatedEscrow] = useState(null);
  const [paymentStep, setPaymentStep] = useState(null);
  const [copied, setCopied] = useState(false);

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
  const buyerFee = Math.round(amount * (platformBuyerFeePercent / 100));
  const total = amount + buyerFee;
  const methodName = PAYMENT_METHODS.find((m) => m.id === selectedMethod)?.name || selectedMethod;
  const account = PLATFORM_ACCOUNTS[selectedMethod];
  const refCode = createdEscrow ? `TGM-${createdEscrow.id}` : "";
  const autoMode = paymentStep === "success";

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

      const formattedPhone = phone.startsWith("+") ? phone : `+228${phone}`;
      try {
        const payment = await paymentApi.initiate({
          escrowId: escrow.id,
          method: selectedMethod,
          phone: formattedPhone,
        });
        if (payment.mode === "auto") {
          setPaymentStep("success");
          return;
        }
      } catch {
        // Flutterwave failed — fall through to manual
      }
      setPaymentStep("instructions");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur lors de l'achat");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmPayment = async () => {
    if (!transactionRef.trim()) {
      toast.error("Veuillez entrer le numéro de transaction Flooz/TMoney");
      return;
    }
    setSubmitting(true);
    try {
      await escrowApi.confirmPayment(createdEscrow.id);
      setPaymentStep("success");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur lors de la confirmation");
    } finally {
      setSubmitting(false);
    }
  };

  if (paymentStep === "success") {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="space-y-5">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl border border-amber-100 bg-amber-50 p-8 text-center dark:border-amber-800 dark:bg-amber-900/10"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-800/30">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-xl font-bold text-emerald-800 dark:text-emerald-400">
                Paiement réussi !
              </h1>
              <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-500">
                {formatCFA(total)} via {methodName}
              </p>
              <p className="mt-4 text-xs text-emerald-600 dark:text-emerald-400">
                Votre paiement a été traité automatiquement. Le vendeur sera notifié.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous recevrez une notification dès que votre paiement sera vérifié.
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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
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
                  {buyerFee > 0 && (
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>Frais d'achat ({platformBuyerFeePercent}%)</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCFA(buyerFee)}</span>
                    </div>
                  )}
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
                  placeholder="Votre numéro Flooz / TMoney"
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
              Instructions de paiement
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

              <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-900/10">
                <h3 className="mb-3 text-sm font-bold text-amber-900 dark:text-amber-400">
                  Envoyez l'argent sur ce compte
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-gray-800">
                    <div>
                      <p className="text-xs text-gray-500">Compte</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{account?.name}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(account?.number)}
                      className="flex items-center gap-1 rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-200 dark:bg-amber-800/30 dark:text-amber-400"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {account?.number}
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 dark:bg-gray-800">
                    <div>
                      <p className="text-xs text-gray-500">Montant</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCFA(total)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Référence</p>
                      <p className="text-sm font-mono font-bold text-amber-700 dark:text-amber-400">{refCode}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-800">
                <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">
                  Numéro de transaction reçu
                </h3>
                <p className="mb-3 text-xs text-gray-500">
                  Après avoir envoyé l'argent, entrez le numéro de transaction Flooz/TMoney reçu par SMS.
                </p>
                <input
                  type="text"
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  placeholder="Ex: TRX789XYZ"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={submitting || !transactionRef.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3.5 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Smartphone className="h-4 w-4" />
                )}
                {submitting ? "Confirmation..." : "J'ai payé"}
              </button>

              <div className="flex items-start gap-2 rounded-xl bg-blue-50 p-3 dark:bg-blue-900/10">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Votre paiement sera vérifié et la commande sera traitée. Les fonds sont sécurisés jusqu'à la livraison.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}