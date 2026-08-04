import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare, Check, X, Loader2, Tag, User, Package,
  Clock, MessageCircle, ExternalLink, XCircle,
} from "lucide-react";
import { useOffers, useAcceptOffer, useRejectOffer, useCancelOffer } from "@/features/offers/hooks/useOffers";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useCreateConversation } from "@/features/chat/hooks/useConversations";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Avatar from "@/shared/ui/Avatar";
import Button from "@/shared/ui/Button";
import Modal from "@/shared/ui/Modal";
import Textarea from "@/shared/ui/Textarea";
import EmptyState from "@/shared/ui/EmptyState";
import BackButton from "@/shared/ui/BackButton";
import toast from "react-hot-toast";

function OfferCard({ offer, isReceived, onAccept, onReject, onCancel, onContact, onViewProduct }) {
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const navigate = useNavigate();

  const isPending = offer.status === "pending";
  const isAccepted = offer.status === "accepted";
  const isRejected = offer.status === "rejected";
  const isSent = !isReceived;

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

  const otherUser = isReceived ? offer.buyer : offer.seller;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="cursor-pointer overflow-hidden"
      onClick={() => onViewProduct(offer)}
    >
      <div className="flex gap-3">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[inset_0_0_25px_rgba(0,0,0,0.35)] dark:border-gray-600 dark:bg-gray-800">
          {offer.product?.thumbnail ? (
            <img src={offer.product.thumbnail} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.1)]" />
          <span className={`absolute right-1 top-1 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyles[offer.status]}`}>
            {statusLabels[offer.status]}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-gray-900 dark:text-white">
            {offer.product?.title || "Produit"}
          </h3>
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-sm font-extrabold text-brand-800">{formatCFA(offer.amount)}</span>
            <span className="text-xs text-gray-400">
              <Clock className="mr-0.5 inline h-3 w-3" />
              {formatRelativeTime(offer.createdAt)}
            </span>
          </div>
          <div className="mb-1.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            {otherUser?.avatar ? (
              <Avatar src={otherUser.avatar} name={otherUser.name} size="xs" />
            ) : (
              <User className="h-3 w-3" />
            )}
            <span className="truncate">
              {isReceived ? (offer.buyer?.name || "Acheteur") : (offer.seller?.name || "Vendeur")}
            </span>
          </div>
          {offer.message && (
            <p className="mb-1.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">"{offer.message}"</p>
          )}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {isPending && isReceived && (
          <>
            <Button
              size="sm"
              variant="primary"
              icon={Check}
              onClick={(e) => {
                e.stopPropagation();
                onAccept(offer.id);
              }}
            >
              Accepter
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={X}
              onClick={(e) => {
                e.stopPropagation();
                setShowReject(true);
              }}
            >
              Refuser
            </Button>
          </>
        )}

        {isPending && isSent && (
          <Button
            size="sm"
            variant="outline"
            icon={XCircle}
            onClick={(e) => {
              e.stopPropagation();
              onCancel(offer.id);
            }}
          >
            Annuler l'offre
          </Button>
        )}

        {isAccepted && (
          <Button
            size="sm"
            variant="primary"
            icon={ExternalLink}
            onClick={(e) => {
              e.stopPropagation();
              offer.escrowId
                ? navigate(`/commandes/${offer.escrowId}`)
                : toast.error("Transaction introuvable");
            }}
          >
            Voir la transaction
          </Button>
        )}

        {isRejected && isSent && (
          <Button
            size="sm"
            variant="primary"
            icon={Tag}
            onClick={(e) => {
              e.stopPropagation();
              onViewProduct(offer);
            }}
          >
            Faire une nouvelle offre
          </Button>
        )}

        <Button
          size="sm"
          variant="outline"
          icon={MessageCircle}
          onClick={(e) => {
            e.stopPropagation();
            onContact(offer);
          }}
        >
          Discuter
        </Button>
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
  const cancelOffer = useCancelOffer();
  const createConversation = useCreateConversation();
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

  const handleCancel = async (id) => {
    try {
      await cancelOffer.mutateAsync(id);
      toast.success("Offre annulée");
    } catch {
      toast.error("Erreur lors de l'annulation");
    }
  };

  const handleContact = async (offer) => {
    const otherUser = offer.sellerId === user?.id ? offer.buyer : offer.seller;
    if (!otherUser?.id) {
      toast.error("Utilisateur introuvable");
      return;
    }
    try {
      const conv = await createConversation.mutateAsync({
        participantId: otherUser.id,
        productId: offer.productId,
      });
      navigate(`/messages/${conv.id}`);
    } catch {
      toast.error("Impossible d'ouvrir la discussion");
    }
  };

  const handleViewProduct = (offer) => {
    navigate(`/produit/${offer.productId}`);
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
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {offers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isReceived={offer.sellerId === user?.id}
              onAccept={handleAccept}
              onReject={handleReject}
              onCancel={handleCancel}
              onContact={handleContact}
              onViewProduct={handleViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}
