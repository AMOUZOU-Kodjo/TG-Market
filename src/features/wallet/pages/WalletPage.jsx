import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  Smartphone,
  Plus,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Eye,
  EyeOff,
  Smartphone as PhoneIcon,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import StatCard from "@/shared/ui/StatCard";
import { formatCFA, formatDate } from "@/shared/utils/format";
import toast from "react-hot-toast";

const mockTransactions = [
  {
    id: 1,
    type: "sale",
    description: "Vente Samsung Galaxy S24 Ultra",
    amount: 850000,
    status: "completed",
    date: "2025-07-20T10:30:00Z",
    counterparty: "Mathieu Tossou",
  },
  {
    id: 2,
    type: "purchase",
    description: "Achat PS5 + 2 Manettes + 3 Jeux",
    amount: -380000,
    status: "completed",
    date: "2025-07-19T14:20:00Z",
    counterparty: "Kévin Agbéké",
  },
  {
    id: 3,
    type: "withdrawal",
    description: "Retrait vers T-Money",
    amount: -200000,
    status: "completed",
    date: "2025-07-18T09:15:00Z",
    counterparty: "Mobile Money",
  },
  {
    id: 4,
    type: "sale",
    description: "Vente MacBook Air M2 13 pouces",
    amount: 650000,
    status: "completed",
    date: "2025-07-17T16:45:00Z",
    counterparty: "Prosper Degan",
  },
  {
    id: 5,
    type: "purchase",
    description: "Achat Kit Panneaux Solaires 300W",
    amount: -650000,
    status: "pending",
    date: "2025-07-16T11:00:00Z",
    counterparty: "Kwame Dogbo",
  },
  {
    id: 6,
    type: "sale",
    description: "Vente Pagne Wax Hollandais 6 yards",
    amount: 25000,
    status: "completed",
    date: "2025-07-15T08:30:00Z",
    counterparty: "Abra Povi",
  },
  {
    id: 7,
    type: "withdrawal",
    description: "Retrait vers Moov Money",
    amount: -150000,
    status: "completed",
    date: "2025-07-14T14:00:00Z",
    counterparty: "Mobile Money",
  },
  {
    id: 8,
    type: "sale",
    description: "Vente Robe Bazin brodée - Taille 40",
    amount: 45000,
    status: "pending",
    date: "2025-07-13T10:15:00Z",
    counterparty: "Nana Akua",
  },
];

const paymentMethods = [
  {
    id: 1,
    name: "T-Money",
    number: "+228 99 12 34 56",
    type: "mobile",
    icon: "📱",
    color: "bg-green-700",
    linked: true,
  },
  {
    id: 2,
    name: "Moov Money",
    number: "+228 90 98 76 54",
    type: "mobile",
    icon: "📱",
    color: "bg-red-700",
    linked: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(true);
  const balance = 590000;
  const totalEarnings = 1570000;
  const totalSpending = 1030000;
  const pendingPayments = 695000;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon portefeuille</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez votre solde et vos transactions
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Balance Card */}
        <motion.div variants={itemVariants}>
          <div className="relative overflow-hidden rounded-2xl bg-red-800 p-6 text-white shadow-xl sm:p-8">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-6 w-6" />
                  <span className="text-sm font-medium text-white/80">Solde disponible</span>
                </div>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="rounded-lg bg-white/10 p-1.5 transition-colors hover:bg-white/20"
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold sm:text-4xl">
                  {showBalance ? formatCFA(balance) : "•••••••"}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => toast.success("Fonctionnalité de retrait bientôt disponible")}
                >
                  Retirer
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Upload}
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => toast.success("Fonctionnalité de recharge bientôt disponible")}
                >
                  Recharger
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={TrendingUp}
            value={formatCFA(totalEarnings)}
            label="Gains totaux"
            trend={12}
            trendLabel="ce mois"
          />
          <StatCard
            icon={TrendingDown}
            value={formatCFA(totalSpending)}
            label="Dépenses totales"
            trend={-5}
            trendLabel="ce mois"
          />
          <StatCard
            icon={Clock}
            value={formatCFA(pendingPayments)}
            label="Paiements en attente"
            trendLabel="2 transactions"
          />
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Transaction History */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2"
          >
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Historique des transactions
                </h2>
                <Badge variant="secondary">{mockTransactions.length}</Badge>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockTransactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        tx.amount > 0
                          ? "bg-green-50 dark:bg-green-700/10"
                          : "bg-red-50 dark:bg-red-700/10"
                      }`}
                    >
                      {tx.amount > 0 ? (
                        <ArrowDownLeft className="h-5 w-5 text-green-700" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5 text-red-700" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tx.counterparty} · {formatDate(tx.date, { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.amount > 0 ? "text-green-800 dark:text-green-600" : "text-red-800 dark:text-red-400"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}{formatCFA(tx.amount)}
                      </p>
                      <Badge
                        variant={tx.status === "completed" ? "success" : "warning"}
                        size="sm"
                      >
                        {tx.status === "completed" ? "Complété" : "En attente"}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Moyens de paiement
                </h2>
              </div>
              <div className="space-y-3 p-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${method.color} text-white text-lg`}
                    >
                      {method.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{method.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{method.number}</p>
                    </div>
                    <Badge variant={method.linked ? "success" : "secondary"} size="sm">
                      {method.linked ? "Connecté" : "Non lié"}
                    </Badge>
                  </div>
                ))}
                <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm font-medium text-gray-500 transition-colors hover:border-red-400 hover:text-red-800 dark:border-gray-700 dark:hover:border-red-800/50 dark:hover:text-red-700">
                  <Plus className="h-4 w-4" />
                  Ajouter un moyen de paiement
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
