import { motion } from "framer-motion";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import Badge from "@/shared/ui/Badge";
import Avatar from "@/shared/ui/Avatar";

const statusBadge = {
  pending: { label: "En attente", variant: "warning" },
  paid: { label: "Payée", variant: "primary" },
  pending_delivery: { label: "Expédiée", variant: "info" },
  delivered: { label: "Livrée", variant: "info" },
  completed: { label: "Terminée", variant: "success" },
  disputed: { label: "Litige", variant: "danger" },
  refunded: { label: "Remboursée", variant: "secondary" },
};

export default function EscrowCard({ transaction, onClick }) {
  const st = statusBadge[transaction.status] || statusBadge.pending_delivery;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-md cursor-pointer dark:border-gray-800 dark:bg-gray-800"
    >
      <img src={transaction.productImage} alt="" className="h-14 w-14 rounded-xl object-cover" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{transaction.productTitle}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {transaction.buyerName} → {transaction.sellerName}
        </p>
        <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(transaction.createdAt)}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCFA(transaction.amount)}</p>
        <Badge variant={st.variant} size="sm">{st.label}</Badge>
      </div>
    </motion.div>
  );
}
