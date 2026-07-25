import { motion } from "framer-motion";
import { Wallet, Clock, TrendingUp, ArrowUpRight, ArrowDownLeft, Minus, Plus, RefreshCw } from "lucide-react";
import { formatCFA } from "@/shared/utils/format";

const cards = [
  { key: "available", label: "Solde disponible", icon: Wallet, color: "text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400", trend: "+12%" },
  { key: "pending", label: "En attente", icon: Clock, color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400", trend: null },
  { key: "totalEarned", label: "Total gagné", icon: TrendingUp, color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400", trend: "+8%" },
];

export default function WalletBalance({ balance }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        const value = balance[c.key];
        return (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              {c.trend && (
                <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                  <ArrowUpRight className="h-3 w-3" /> {c.trend}
                </span>
              )}
            </div>
            <p className="mt-3 text-2xl font-bold text-gray-900 dark:text-white">{formatCFA(value)}</p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{c.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
