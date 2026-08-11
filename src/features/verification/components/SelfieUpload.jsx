import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

const statusConfig = {
  none: { label: "", color: "" },
  pending: { label: "Selfie en cours de vérification", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
  approved: { label: "Selfie validé", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" },
  rejected: { label: "Selfie rejeté", color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

export default function SelfieUpload({ onUpload, status = "none" }) {
  const [preview, setPreview] = useState(null);
  const st = statusConfig[status] || statusConfig.none;

  const handleFile = (file) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onUpload?.(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Photo de vérification (Selfie)
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Prenez une photo de vous tenant votre document d'identité à côté de votre visage.
      </p>

      {preview ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
            <img src={preview} alt="Selfie" className="h-64 w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-40 rounded-full border-2 border-dashed border-white/60" />
            </div>
            <button onClick={() => setPreview(null)} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
              <X className="h-4 w-4" />
            </button>
          </div>
          {status === "none" && (
            <button onClick={() => setPreview(null)} className="mt-2 flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-800">
              <RefreshCw className="h-3.5 w-3.5" /> Reprendre
            </button>
          )}
        </motion.div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition-colors hover:border-red-400 dark:border-gray-600">
          <Camera className="mb-2 h-10 w-10 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Prendre un selfie</p>
          <p className="mt-1 text-xs text-gray-400">Visage bien visible, bonne luminosité</p>
          <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
      )}

      {status !== "none" && (
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${st.color}`}>
          {status === "approved" && <CheckCircle2 className="h-4 w-4" />}
          {status === "rejected" && <AlertCircle className="h-4 w-4" />}
          {status === "pending" && <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />}
          {st.label}
        </div>
      )}
    </div>
  );
}
