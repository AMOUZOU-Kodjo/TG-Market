import { Clock, CheckCircle, XCircle } from "lucide-react";

const PROPOSAL_STATUS_MAP = {
  pending: { label: "En attente", icon: Clock, class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  accepted: { label: "Acceptée", icon: CheckCircle, class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  rejected: { label: "Refusée", icon: XCircle, class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  cancelled: { label: "Annulée", icon: XCircle, class: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

export default function ProposalStatusBadge({ status }) {
  const s = PROPOSAL_STATUS_MAP[status] || PROPOSAL_STATUS_MAP.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${s.class}`}>
      <s.icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}