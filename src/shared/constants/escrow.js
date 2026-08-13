export const ESCROW_STATUS_CONFIG = {
  pending: { label: "En attente de paiement", variant: "warning" },
  awaiting_verification: { label: "Paiement en vérification", variant: "warning" },
  paid: { label: "Payée", variant: "primary" },
  pending_delivery: { label: "Expédiée", variant: "info" },
  delivered: { label: "Livrée", variant: "info" },
  completed: { label: "Terminée", variant: "success" },
  disputed: { label: "Litige", variant: "danger" },
  refunded: { label: "Remboursée", variant: "secondary" },
  cancelled: { label: "Annulée", variant: "danger" },
};

export const ESCROW_PAYOUT_CONFIG = {
  sent: { label: "Paiement envoyé", variant: "success" },
  paid: { label: "Paiement reçu", variant: "success" },
  pending: { label: "Paiement en cours", variant: "warning" },
  failed: { label: "Échec du paiement", variant: "danger" },
};