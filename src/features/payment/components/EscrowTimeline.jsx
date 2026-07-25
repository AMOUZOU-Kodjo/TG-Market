import { motion } from "framer-motion";
import { Package, Truck, CheckCircle2, AlertTriangle, RotateCcw, XCircle } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";

const statusIcons = {
  pending_delivery: Package,
  delivered: Truck,
  completed: CheckCircle2,
  disputed: AlertTriangle,
  refunded: RotateCcw,
};

const statusColors = {
  pending_delivery: "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20",
  delivered: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  completed: "text-brand-500 bg-brand-50 dark:bg-brand-900/20",
  disputed: "text-red-500 bg-red-50 dark:bg-red-900/20",
  refunded: "text-gray-500 bg-gray-50 dark:bg-gray-800",
};

const statusLabels = {
  pending_delivery: "En attente de livraison",
  delivered: "Livrée — Confirmation requise",
  completed: "Transaction complétée",
  disputed: "Litige en cours",
  refunded: "Remboursée",
};

const steps = [
  { key: "created", label: "Paiement reçu", icon: Package },
  { key: "pending_delivery", label: "En attente de livraison", icon: Truck },
  { key: "confirmed", label: "Confirmé par l'acheteur", icon: CheckCircle2 },
  { key: "released", label: "Fonds libérés au vendeur", icon: CheckCircle2 },
];

const completedSteps = {
  pending_delivery: [0],
  delivered: [0, 1],
  completed: [0, 1, 2, 3],
  disputed: [0],
  refunded: [0],
};

export default function EscrowTimeline({ transaction }) {
  const done = completedSteps[transaction.status] || [];
  const StatusIcon = statusIcons[transaction.status] || Package;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusColors[transaction.status]}`}>
          <StatusIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{statusLabels[transaction.status]}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Montant : {formatCFA(transaction.amount)}</p>
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
                  : "border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-900"
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
        <button className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          Contacter le support
        </button>
      )}
    </div>
  );
}
