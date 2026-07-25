import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, CreditCard, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Button from "@/shared/ui/Button";
import { formatCFA } from "@/shared/utils/format";

export default function WithdrawModal({ isOpen, onClose, balance = 0, method = "flooz" }) {
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const numAmount = parseInt(amount) || 0;
  const fee = Math.round(numAmount * 0.02);
  const net = numAmount - fee;
  const isValid = numAmount > 0 && numAmount <= balance && phone.length >= 8;

  const handleWithdraw = () => {
    if (!isValid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 2500);
  };

  const handleClose = () => {
    setSuccess(false);
    setAmount("");
    setPhone("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-900">
            <button onClick={handleClose} className="absolute right-4 top-4 text-gray-400 hover:text-gray-600">
              <X className="h-5 w-5" />
            </button>

            {success ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Retrait initié</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {formatCFA(net)} seront envoyés au {phone} dans quelques minutes.
                </p>
                <Button onClick={handleClose} className="mt-6 w-full">Fermer</Button>
              </motion.div>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Retirer des fonds</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Solde disponible : <span className="font-medium text-gray-900 dark:text-white">{formatCFA(balance)}</span>
                </p>

                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Montant (FCFA)</label>
                    <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-bold text-gray-900 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Numéro {method === "card" ? "de carte" : "de téléphone"}</label>
                    <div className="mt-1 flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 dark:border-gray-600 dark:bg-gray-800">
                      {method === "card" ? <CreditCard className="h-4 w-4 text-gray-400" /> : <Smartphone className="h-4 w-4 text-gray-400" />}
                      {method !== "card" && <span className="text-sm text-gray-500">+228</span>}
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={method === "card" ? "XXXX XXXX XXXX" : "90 12 34 56"} className="flex-1 bg-transparent text-sm text-gray-900 focus:outline-none dark:text-white" />
                    </div>
                  </div>

                  {numAmount > 0 && (
                    <div className="rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Commission (2%)</span>
                        <span className="text-gray-700 dark:text-gray-300">-{formatCFA(fee)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-sm font-semibold">
                        <span className="text-gray-700 dark:text-gray-300">Montant net</span>
                        <span className="text-green-600">{formatCFA(net)}</span>
                      </div>
                    </div>
                  )}

                  {numAmount > balance && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" /> Solde insuffisant
                    </div>
                  )}

                  <Button onClick={handleWithdraw} disabled={!isValid || loading} loading={loading} className="w-full">
                    Confirmer le retrait
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
