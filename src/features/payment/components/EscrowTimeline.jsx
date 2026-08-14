import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle2, AlertTriangle, RotateCcw, DollarSign, LifeBuoy } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";

const statusIcons = {
  pending: DollarSign,
  paid: CheckCircle2,
  pending_delivery: Package,
  delivered: Truck,
  completed: CheckCircle2,
  disputed: AlertTriangle,
  refunded: RotateCcw,
};

const statusColors = {
  pending: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  paid: "text-brand-500 bg-brand-50 dark:bg-brand-900/20",
  pending_delivery: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  delivered: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  completed: "text-green-500 bg-green-50 dark:bg-green-900/20",
  disputed: "text-red-500 bg-red-50 dark:bg-red-900/20",
  refunded: "text-gray-500 bg-gray-50 dark:bg-gray-800",
};

const statusLabels = {
  pending: "En attente de paiement",
  paid: "Paiement confirmé",
  pending_delivery: "Expédiée",
  delivered: "Livrée — Confirmation requise",
  completed: "Transaction terminée",
  disputed: "Litige en cours",
  refunded: "Remboursée",
};

const steps = [
  { key: "paid", label: "Paiement reçu", icon: DollarSign },
  { key: "pending_delivery", label: "Expédiée", icon: Package },
  { key: "delivered", label: "Livrée", icon: Truck },
  { key: "completed", label: "Fonds libérés au vendeur", icon: CheckCircle2 },
];

const completedSteps = {
  paid: [0],
  pending_delivery: [0, 1],
  delivered: [0, 1, 2],
  completed: [0, 1, 2, 3],
  disputed: [0],
  refunded: [0],
};

export default function EscrowTimeline({ transaction }) {
  const navigate = useNavigate();
  const done = completedSteps[transaction.status] || [];
  const StatusIcon = statusIcons[transaction.status] || Package;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusColors[transaction.status]}`}>
          <StatusIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{statusLabels[transaction.status]}</p>
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">Montant : {formatCFA(transaction.amount)}</p>
        </div>
      </div>

      <div className="relative ml-5 border-l-2 border-gray-200 pl-6 dark:border-gray-700">
        {steps.map((step, i) => {
          const isCompleted = done.includes(i);
          const isCurrent = transaction.status === step.key;
          const StepIcon = step.icon;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative mb-6 last:mb-0"
            >
              <div className={`absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                isCompleted
                  ? "border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/20"
                  : isCurrent
                  ? "border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20"
                  : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-800"
              }`}>
                {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : <StepIcon className="h-3 w-3" />}
              </div>
              <p className={`text-sm font-medium ${isCompleted || isCurrent ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
                {step.label}
              </p>
            </motion.div>
          );
        })}
      </div>

      {transaction.status === "disputed" && (
        <button
          onClick={() =>
            navigate("/contact", {
              state: {
                escrowContext: {
                  productId: transaction.productId,
                  productTitle: transaction.productTitle,
                  sellerName: transaction.sellerName,
                  escrowId: transaction.id,
                },
              },
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"
        >
          <LifeBuoy className="h-4 w-4" />
          Contacter le support
        </button>
      )}
    </div>
  );
}
