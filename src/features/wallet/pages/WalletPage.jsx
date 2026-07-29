import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import BackButton from "@/shared/ui/BackButton";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Tabs from "@/shared/ui/Tabs";
import { formatCFA, formatRelativeTime } from "@/shared/utils/format";
import { useWalletBalance, useWalletTransactions, useEscrowList, usePaymentMethods } from "@/features/wallet/hooks/useWallet";
import WalletBalance from "@/features/payment/components/WalletBalance";
import EscrowCard from "@/features/payment/components/EscrowCard";
import EscrowTimeline from "@/features/payment/components/EscrowTimeline";
import WithdrawModal from "@/features/payment/components/WithdrawModal";
import toast from "react-hot-toast";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

const providerConfig = {
  tmoney: { name: "T-Money", color: "bg-brand-700" },
  flooz: { name: "Flooz", color: "bg-orange-600" },
  mobile_money: { name: "Mobile Money", color: "bg-blue-600" },
  card: { name: "Carte bancaire", color: "bg-purple-600" },
};

const txTypeIcons = {
  sale: { icon: ArrowDownLeft, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  purchase: { icon: ArrowUpRight, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
  withdrawal: { icon: ArrowUpRight, color: "text-orange-700", bg: "bg-orange-50 dark:bg-orange-700/10" },
  deposit: { icon: ArrowDownLeft, color: "text-blue-700", bg: "bg-blue-50 dark:bg-blue-700/10" },
  refund: { icon: RefreshCw, color: "text-brand-700", bg: "bg-brand-50 dark:bg-brand-700/10" },
};

export default function WalletPage() {
  const navigate = useNavigate();
  const { data: balanceData } = useWalletBalance();
  const { data: txData } = useWalletTransactions();
  const { data: escrowData } = useEscrowList();
  const { data: methodsData } = usePaymentMethods();

  const walletBalance = balanceData?.data || balanceData || { available: 0, pending: 0, totalEarned: 0 };
  const walletTransactions = txData?.data || txData || [];
  const escrowTransactions = escrowData?.data || escrowData || [];
  const paymentMethods = methodsData?.data || methodsData || [];

  const [activeTab, setActiveTab] = useState("transactions");
  const [showBalance, setShowBalance] = useState(true);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const tabs = [
    { id: "transactions", label: "Transactions" },
    { id: "escrow", label: "Séquestre", badge: escrowTransactions.filter(t => t.status !== "completed").length },
    { id: "methods", label: "Moyens de paiement" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <BackButton />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mon portefeuille</h1>
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Gérez votre solde, vos transactions et vos paiements sécurisés
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
          <div className="relative overflow-hidden rounded-2xl bg-brand-800 p-6 text-white shadow-xl sm:p-8">
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
                  {showBalance ? formatCFA(walletBalance.available) : "•••••••"}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setShowWithdraw(true)}
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
        <motion.div variants={itemVariants}>
          <WalletBalance balance={walletBalance} />
        </motion.div>

        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
        </motion.div>

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Historique des transactions
              </h2>
              <Badge variant="secondary">{walletTransactions.length}</Badge>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {walletTransactions.map((tx, i) => {
                const config = txTypeIcons[tx.type] || txTypeIcons.sale;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${config.bg}`}>
                      <Icon className={`h-5 w-5 ${config.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {tx.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tx.counterparty} · {formatRelativeTime(tx.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          tx.amount > 0 ? "text-brand-800 dark:text-brand-600" : "text-brand-800 dark:text-brand-400"
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
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Escrow Tab */}
        {activeTab === "escrow" && (
          <motion.div variants={itemVariants} className="space-y-4">
            {selectedEscrow ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 dark:border-gray-800 dark:bg-gray-800">
                <button
                  onClick={() => setSelectedEscrow(null)}
                  className="mb-4 text-sm font-medium text-brand-800 hover:text-brand-900"
                >
                  ← Retour à la liste
                </button>
                <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedEscrow.productTitle}
                </h3>
                <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                  Transaction #{selectedEscrow.id} · {formatRelativeTime(selectedEscrow.createdAt)}
                </p>
                <EscrowTimeline transaction={selectedEscrow} />
              </div>
            ) : (
              <>
                {escrowTransactions.length === 0 ? (
                  <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-800">
                    <Shield className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                    <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                      Aucune transaction séquestre
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Vos paiements sécurisés apparaîtront ici.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {escrowTransactions.map((tx) => (
                      <EscrowCard
                        key={tx.id}
                        transaction={tx}
                        onClick={() => setSelectedEscrow(tx)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "methods" && (
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Moyens de paiement
              </h2>
            </div>
            <div className="space-y-3 p-4">
              {paymentMethods.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-400">Aucun moyen de paiement enregistré</div>
              ) : (
                paymentMethods.map((method) => {
                  const cfg = providerConfig[method.provider] || { name: method.provider, color: "bg-gray-600" };
                  return (
                    <div
                      key={method.id}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:border-gray-200 dark:border-gray-800 dark:hover:border-gray-700"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${cfg.color} text-white text-lg`}>
                        📱
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{cfg.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{method.providerUserId ?? method.label ?? "—"}</p>
                      </div>
                      <Badge variant={method.isDefault ? "success" : "secondary"} size="sm">
                        {method.isDefault ? "Principal" : "Connecté"}
                      </Badge>
                    </div>
                  );
                })
              )}
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-4 text-sm font-medium text-gray-500 transition-colors hover:border-brand-400 hover:text-brand-800 dark:border-gray-700 dark:hover:border-brand-800/50 dark:hover:text-brand-700">
                <Plus className="h-4 w-4" />
                Ajouter un moyen de paiement
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <WithdrawModal
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        balance={walletBalance.available}
        method="flooz"
      />
    </div>
  );
}
