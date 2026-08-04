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
import BackButton from "@/shared/ui/BackButton";
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
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-gray-700">
        {offer.product?.thumbnail ? (
          <img src={offer.product.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-10 w-10 text-gray-400" />
          </div>
        )}
        <span className={`absolute right-2 top-2 shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${statusStyles[offer.status]}`}>
          {statusLabels[offer.status]}
        </span>
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {offer.product?.title || "Produit"}
        </h3>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <User className="h-3 w-3" />
          {isReceived ? (offer.buyer?.name || "Acheteur") : "Vous"}
        </p>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="text-base font-bold text-brand-800">{formatCFA(offer.amount)}</span>
          <span className="text-xs text-gray-400">
            <Clock className="mr-0.5 inline h-3 w-3" />
            {formatRelativeTime(offer.createdAt)}
          </span>
        </div>
        {offer.message && (
          <p className="mt-1.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            "{offer.message}"
          </p>
        )}

        {isPending && isReceived && (
          <div className="mt-3 flex gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
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
      </div>

      <Modal isOpen={showReject} onClose={() => setShowReject(false)} title="Refuser l'offre">
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
        <div className="flex items-center gap-3">
          <BackButton />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Offres</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Gérez les offres reçues et envoyées
            </p>
          </div>
        </div>
      </div>

      {offers.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Aucune offre"
          description="Les offres que vous recevez ou envoyez apparaîtront ici."
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-5 ">
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
