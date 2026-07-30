import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare, Check, X, Loader2, Tag, User, Package,
  Calendar, Clock,
} from "lucide-react";
import { useOffers, useAcceptOffer, useRejectOffer } from "@/features/offers/hooks/useOffers";
import { useAuth } from "@/shared/contexts/AuthContext";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import Textarea from "@/shared/ui/Textarea";
import EmptyState from "@/shared/ui/EmptyState";
import toast from "react-hot-toast";

function OfferCard({ offer, isReceived, onAccept, onReject }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const isPending = offer.status === "pending";

  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    accepted: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    cancelled: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  };

  const statusLabels = {
    pending: "En attente",
    accepted: "Acceptée",
    rejected: "Refusée",
    cancelled: "Annulée",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
    >
      <div className="flex gap-4 p-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700">
          {offer.product?.thumbnail ? (
            <img src={offer.product.thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Package className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {offer.product?.title || "Produit"}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <User className="h-3 w-3" />
                {isReceived ? (offer.buyer?.name || "Acheteur") : "Vous"}
              </p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[offer.status]}`}>
              {statusLabels[offer.status]}
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold text-brand-800">{formatCFA(offer.amount)}</span>
            <span className="text-xs text-gray-400">
              <Clock className="inline h-3 w-3 mr-0.5" />
              {formatRelativeTime(offer.createdAt)}
            </span>
          </div>
          {offer.message && (
            <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              "{offer.message}"
            </p>
          )}
        </div>
      </div>

      {isPending && isReceived && (
        <div className="flex gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
          <Button
            size="sm"
            variant="primary"
            icon={Check}
            onClick={() => onAccept(offer.id)}
          >
            Accepter
          </Button>
          <Button
            size="sm"
            variant="outline"
            icon={X}
            onClick={() => setShowReject(true)}
          >
            Refuser
          </Button>
        </div>
      )}

      <Modal open={showReject} onClose={() => setShowReject(false)} title="Refuser l'offre">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Expliquez pourquoi vous refusez cette offre (optionnel).
          </p>
          <Textarea
            placeholder="Votre message..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            rows={3}
          />
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setShowReject(false)}>
              Annuler
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => {
                onReject(offer.id, rejectReason);
                setShowReject(false);
                setRejectReason("");
              }}
            >
              Refuser l'offre
            </Button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
}

export default function OffersPage() {
  const { user } = useAuth();
  const { data, isLoading } = useOffers();
  const acceptOffer = useAcceptOffer();
  const rejectOffer = useRejectOffer();
  const navigate = useNavigate();

  const offers = data?.data || data || [];

  const handleAccept = async (id) => {
    try {
      await acceptOffer.mutateAsync(id);
      toast.success("Offre acceptée ! Une transaction a été créée.");
    } catch {
      toast.error("Erreur lors de l'acceptation");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await rejectOffer.mutateAsync({ id, reason });
      toast.success("Offre refusée");
    } catch {
      toast.error("Erreur lors du refus");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Offres</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gérez les offres reçues et envoyées
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Aucune offre"
          description="Les offres que vous recevez ou envoyez apparaîtront ici."
        />
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isReceived={offer.sellerId === user?.id}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}
    </div>
  );
}
