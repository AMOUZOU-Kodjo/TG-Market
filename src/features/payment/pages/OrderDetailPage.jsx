import { useState, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  MessageCircle,
  Truck,
  QrCode,
  ScanLine,
  Loader2,
  Smartphone,
  Star,
  RotateCcw,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import QrScanner from "@/features/payment/components/QrScanner";
import { useEscrow, useConfirmDelivery, useMarkAsShipped } from "@/features/wallet/hooks/useWallet";
import { escrowApi } from "@/features/wallet/services/wallet.api";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA, formatDate } from "@/shared/utils/format";
import EscrowTimeline from "@/features/payment/components/EscrowTimeline";
import PayoutNotice from "@/features/payment/components/PayoutNotice";
import Badge from "@/shared/ui/Badge";
import { ESCROW_STATUS_CONFIG } from "@/shared/constants/escrow";
import toast from "react-hot-toast";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: escrow, isLoading, refetch } = useEscrow(id);
  const { mutateAsync: confirmDelivery } = useConfirmDelivery();
  const { mutateAsync: markAsShipped } = useMarkAsShipped();
  const [disputeReason, setDisputeReason] = useState("");
  const [showDispute, setShowDispute] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [sellerCode, setSellerCode] = useState("");
  const [scannedCode, setScannedCode] = useState(
    () => sessionStorage.getItem(`escrow-code-${id}`) || null
  );

  const handleScan = useCallback(async (token) => {
    setShowScanner(false);
    setActionLoading("scan");
    try {
      const data = await escrowApi.scanConfirm(token);
      setScannedCode(data.confirmationCode);
      sessionStorage.setItem(`escrow-code-${id}`, data.confirmationCode || "");
      toast.success("QR code scanné ! Communiquez le code à 4 chiffres au vendeur.");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "QR code invalide");
    } finally {
      setActionLoading(null);
    }
  }, [refetch]);

  const handleConfirmCode = async () => {
    if (sellerCode.length !== 4) {
      toast.error("Le code doit contenir exactement 4 chiffres");
      return;
    }
    setActionLoading("confirmCode");
    try {
      await escrowApi.confirmWithCode(escrow.id, sellerCode);
      toast.success("Livraison confirmée ! Les fonds ont été libérés.");
      setSellerCode("");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Code invalide");
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
      </div>
    );
  }

  if (!escrow) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <p className="text-gray-500">Commande introuvable</p>
        <Link to="/dashboard/history" className="mt-4 text-sm text-brand-800 hover:underline">Voir mes commandes</Link>
      </div>
    );
  }

  const isBuyer = escrow.buyerId === user?.id;
  const statusInfo = ESCROW_STATUS_CONFIG[escrow.status] || { label: escrow.status, variant: "neutral" };

  const handleConfirm = async () => {
    setActionLoading("confirm");
    try {
      await confirmDelivery(escrow.id);
      toast.success("Livraison confirmée !");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkShipped = async () => {
    setActionLoading("ship");
    try {
      await markAsShipped(escrow.id);
      toast.success("Commande marquée comme envoyée");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Annuler cette commande ? Cette action est irréversible.")) return;
    setActionLoading("cancel");
    try {
      await escrowApi.cancel(escrow.id);
      toast.success("Commande annulée");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  const handleDispute = async () => {
    if (!disputeReason || disputeReason.length < 10) {
      toast.error("Veuillez décrire le problème (min. 10 caractères)");
      return;
    }
    setActionLoading("dispute");
    try {
      await escrowApi.dispute(escrow.id, { reason: disputeReason });
      toast.success("Litige ouvert");
      setShowDispute(false);
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelDispute = async () => {
    setActionLoading("cancelDispute");
    try {
      await escrowApi.cancelDispute(escrow.id);
      toast.success("Litige refermé, la vente reprend");
      refetch();
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    } finally {
      setActionLoading(null);
    }
  };

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

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Commande de {escrow.productTitle ?? "mon produit"}</h1>
            <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{formatDate(escrow.createdAt)}</p>
          </div>
          <Badge variant={statusInfo.variant} dot>{statusInfo.label}</Badge>
        </div>

        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
          >
            <Link
              to={`/annonce/${escrow.productId}`}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity"
            >
              <img
                src={escrow.productImage}
                alt={escrow.productTitle}
                className="h-16 w-16 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {escrow.productTitle}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isBuyer ? `Vendu par ${escrow.sellerName}` : `Acheté par ${escrow.buyerName}`}
                </p>
                <p className="mt-0.5 text-sm font-bold text-brand-800">{formatCFA(escrow.amount)}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-gray-400 shrink-0" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Détails</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Prix</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCFA(escrow.amount)}</span>
              </div>
              {escrow.buyerFee > 0 && (
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Frais d'achat</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatCFA(escrow.buyerFee)}</span>
                </div>
              )}
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-base font-bold text-gray-900 dark:text-white">
                <span>Total payé</span>
                <span>{formatCFA(escrow.amount + escrow.buyerFee)}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800"
          >
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Suivi</h2>
            <EscrowTimeline transaction={escrow} />
          </motion.div>

          {escrow.status === "awaiting_verification" && isBuyer && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-900/10">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-800/30">
                <Smartphone className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Paiement en cours de vérification</p>
              <p className="mt-1 text-xs text-amber-600 dark:text-amber-500">
                Votre paiement est en cours de vérification par notre équipe. Vous serez notifié dès confirmation.
              </p>
            </div>
          )}

          {escrow.status === "paid" && !isBuyer && (
            <div className="space-y-2">
              <div className="rounded-xl bg-amber-50 p-3 dark:bg-amber-900/10">
                <p className="text-xs text-amber-700 dark:text-amber-500">
                  L'acheteur a payé <strong>{formatCFA(escrow.amount + (escrow.buyerFee ?? 0))}</strong>. Préparez la commande et marquez-la comme envoyée.
                </p>
              </div>
              <button
                onClick={handleMarkShipped}
                disabled={actionLoading === "ship"}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900 disabled:opacity-50"
              >
                {actionLoading === "ship" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />}
                Marquer comme envoyé
              </button>
            </div>
          )}

          {escrow.status === "pending_delivery" && isBuyer && (
            <div className="space-y-3">
              {scannedCode ? (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-900/10">
                  <p className="text-sm font-medium text-green-800 dark:text-green-400">
                    QR code vérifié !
                  </p>
                  <p className="mt-3 text-4xl font-bold tracking-widest text-green-700 dark:text-green-300">
                    {scannedCode}
                  </p>
                  <p className="mt-3 text-xs text-green-600 dark:text-green-500">
                    Communiquez ce code à 4 chiffres au vendeur pour finaliser la transaction.
                  </p>
                  <button
                    onClick={() => { setScannedCode(null); sessionStorage.removeItem(`escrow-code-${id}`); }}
                    className="mt-4 text-xs text-green-600 underline hover:text-green-800 dark:text-green-500"
                  >
                    Masquer le code
                  </button>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-blue-50 p-3 dark:bg-blue-900/10">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      Scannez le QR code du vendeur pour afficher votre code de confirmation.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowScanner(true)}
                    disabled={actionLoading === "scan"}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900 disabled:opacity-50"
                  >
                    {actionLoading === "scan" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ScanLine className="h-4 w-4" />}
                    Scanner le QR code
                  </button>
                </>
              )}
            </div>
          )}

          {escrow.status === "pending_delivery" && !isBuyer && (
            <div className="space-y-3">
              <div className="rounded-xl bg-green-50 p-3 text-center dark:bg-green-900/10">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">
                  Faites scanner ce QR code par l'acheteur, puis saisissez le code à 4 chiffres qu'il vous communique.
                </p>
              </div>
              {showQrCode ? (
                <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
                  <QRCodeSVG value={escrow.confirmationToken} size={200} />
                  <p className="mt-3 text-xs text-gray-400">
                    Produit : {escrow.productTitle ?? "mon produit"}
                  </p>
                  <button
                    onClick={() => setShowQrCode(false)}
                    className="mt-3 text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Masquer le QR code
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowQrCode(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  <QrCode className="h-4 w-4" />
                  Afficher le QR code
                </button>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={sellerCode}
                  onChange={(e) => setSellerCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="Code à 4 chiffres"
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-lg font-bold tracking-widest text-gray-900 placeholder:text-sm placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <button
                  onClick={handleConfirmCode}
                  disabled={actionLoading === "confirmCode" || sellerCode.length !== 4}
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-800 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-brand-800/25 transition-colors hover:bg-brand-900 disabled:opacity-50"
                >
                  {actionLoading === "confirmCode" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Confirmer
                </button>
              </div>
            </div>
          )}

          {!["completed", "cancelled", "refunded", "disputed"].includes(escrow.status) && (
            <button
              onClick={handleCancel}
              disabled={actionLoading === "cancel"}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
            >
              {actionLoading === "cancel" ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Annuler la commande
            </button>
          )}

          {(escrow.status === "pending" || escrow.status === "paid" || escrow.status === "pending_delivery" || escrow.status === "delivered") && (
            <div className="space-y-3">
              {showDispute ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/10">
                  <p className="mb-2 text-sm font-medium text-red-800 dark:text-red-400">
                    Décrivez le problème
                  </p>
                  <textarea
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    rows={3}
                    placeholder="Expliquez le problème (min. 10 caractères)..."
                    className="w-full rounded-xl border border-red-200 bg-white p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 dark:border-red-800 dark:bg-gray-800 dark:text-white"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => { setShowDispute(false); setDisputeReason(""); }}
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleDispute}
                      disabled={actionLoading === "dispute" || disputeReason.length < 10}
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading === "dispute" ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "Ouvrir un litige"}
                    </button>
                  </div>
                </div>
              ) : escrow.status === "disputed" ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-center dark:border-red-800 dark:bg-red-900/10">
                  <AlertTriangle className="mx-auto mb-2 h-6 w-6 text-red-600" />
                  <p className="text-sm font-medium text-red-800 dark:text-red-400">Litige en cours</p>
                  <p className="mt-1 text-xs text-red-600 dark:text-red-500">Notre équipe va examiner votre dossier</p>
                  {escrow.disputedBy === user?.id && (
                    <button
                      onClick={handleCancelDispute}
                      disabled={actionLoading === "cancelDispute"}
                      className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gray-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
                    >
                      {actionLoading === "cancelDispute" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                      Reprendre la vente
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowDispute(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Signaler un problème
                </button>
              )}
            </div>
          )}

          {escrow.status === "completed" && (
            <div className="space-y-3">
              <PayoutNotice payout={escrow.payout} isSeller={!isBuyer} />
              <div className="rounded-2xl border border-green-100 bg-green-50 p-4 text-center dark:border-green-800 dark:bg-green-900/10">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-600" />
                <p className="text-sm font-medium text-green-800 dark:text-green-400">Transaction terminée</p>
                <button
                  onClick={() => navigate("/avis")}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                >
                  <Star className="h-3.5 w-3.5" />
                  Laisser un avis
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showScanner && (
          <QrScanner
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
