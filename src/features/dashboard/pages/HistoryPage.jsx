import { Package, ShoppingCart, Clock, CheckCircle2, AlertCircle, XCircle, Truck, Eye, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useEscrowList, useMarkAsShipped, useConfirmDelivery } from "@/features/wallet/hooks/useWallet";
import { escrowApi } from "@/features/wallet/services/wallet.api";
import { formatCFA } from "@/shared/utils/format";
import BackButton from "@/shared/ui/BackButton";
import Badge from "@/shared/ui/Badge";
import toast from "react-hot-toast";

const statusConfig = {
  awaiting_verification: { label: "En vérification", variant: "warning", icon: Clock },
  completed: { label: "Terminée", variant: "success", icon: CheckCircle2 },
  pending: { label: "En attente", variant: "warning", icon: Clock },
  paid: { label: "Payée", variant: "primary", icon: CheckCircle2 },
  pending_delivery: { label: "Expédiée", variant: "info", icon: Truck },
  delivered: { label: "Livrée", variant: "info", icon: Truck },
  disputed: { label: "Litige", variant: "danger", icon: AlertCircle },
  cancelled: { label: "Annulée", variant: "danger", icon: XCircle },
};

const payoutConfig = {
  sent: { label: "Paiement envoyé", variant: "success" },
  paid: { label: "Paiement reçu", variant: "success" },
  pending: { label: "Paiement en cours", variant: "warning" },
  failed: { label: "Échec du paiement", variant: "danger" },
};

function EscrowRow({ escrow, role, onAction }) {
  const isSeller = role === "seller";
  const navigate = useNavigate();
  const counterparty = isSeller ? escrow.buyerName : escrow.sellerName;
  const status = statusConfig[escrow.status] || { label: escrow.status, variant: "gray", icon: Clock };
  const StatusIcon = status.icon;
  const payout = escrow.payout;
  const payoutInfo = isSeller && payout ? payoutConfig[payout.status] : null;

  return (
    <div
      onClick={() => navigate(`/commandes/${escrow.id}`)}
      className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 hover:border-brand-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 shrink-0">
        <Package className="h-6 w-6 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {escrow.productTitle ?? "Produit"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {isSeller ? "Acheteur" : "Vendeur"} : {counterparty ?? "—"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <StatusIcon className="h-3.5 w-3.5 text-gray-400" />
          <Badge variant={status.variant}>{status.label}</Badge>
          {payoutInfo && <Badge variant={payoutInfo.variant}>{payoutInfo.label}</Badge>}
        </div>
      </div>
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <p className="text-sm font-bold text-brand-800 dark:text-brand-400">{formatCFA(escrow.amount)}</p>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Eye className="h-3 w-3" />
          Détails
        </span>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const markAsShipped = useMarkAsShipped();
  const confirmDelivery = useConfirmDelivery();

  const { data: escrowData, isLoading } = useEscrowList();
  const escrows = escrowData?.data ?? escrowData?.escrows ?? [];
  const activeEscrows = escrows.filter((e) => !["cancelled", "refunded"].includes(e.status));

  const sales = activeEscrows.filter((e) => e.sellerId === userId);
  const purchases = activeEscrows.filter((e) => e.buyerId === userId);

  const handleMarkShipped = async (id) => {
    try {
      await markAsShipped.mutateAsync(id);
      toast.success("Commande marquée comme envoyée");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    }
  };

  const handleConfirmDelivery = async (id) => {
    try {
      const data = await confirmDelivery.mutateAsync(id);
      const payout = data?.payout;
      if (payout && payout.status === "failed") {
        toast.error("Livraison confirmée, mais l'envoi du paiement a échoué. Le support va vous contacter.");
      } else if (payout && payout.status === "pending") {
        toast.success("Livraison confirmée ! Votre paiement est en cours de traitement.");
      } else {
        toast.success("Livraison confirmée !");
      }
    } catch (err) {
      toast.error(err?.response?.data?.error || "Erreur");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-1">
        <BackButton />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historique</h1>
      </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-10">
          Suivez et gérez vos ventes et achats
        </p>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">Ventes</p>
          <p className="text-2xl font-bold text-brand-800 dark:text-brand-400">{sales.length}</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">Achats</p>
          <p className="text-2xl font-bold text-brand-800 dark:text-brand-400">{purchases.length}</p>
        </div>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Package className="h-5 w-5 text-brand-800" />
          Mes Ventes
        </h2>
        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
          </div>
        ) : sales.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
            <Package className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Aucune vente pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((escrow) => (
              <EscrowRow key={escrow.id} escrow={escrow} role="seller" />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-brand-800" />
          Mes Achats
        </h2>
        {isLoading ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-800" />
          </div>
        ) : purchases.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
            <ShoppingCart className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Aucun achat pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {purchases.map((escrow) => (
              <EscrowRow key={escrow.id} escrow={escrow} role="buyer" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}