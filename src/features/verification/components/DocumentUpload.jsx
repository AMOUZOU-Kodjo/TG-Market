import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileCheck, X, AlertCircle, CheckCircle2 } from "lucide-react";

const statusConfig = {
  none: { label: "", color: "" },
  pending: { label: "En cours de vérification", color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400" },
  approved: { label: "Document validé", color: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400" },
  rejected: { label: "Document rejeté", color: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" },
};

const docLabels = {
  cni: "Carte Nationale d'Identité",
  passport: "Passeport",
  driver: "Permis de conduire",
};

export default function DocumentUpload({ documentType = "cni", onUpload, status = "none", rejectionReason }) {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onUpload?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const st = statusConfig[status] || statusConfig.none;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {docLabels[documentType] || "Document d'identité"}
      </label>

      {preview || status !== "none" ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
          {preview && (
            <div className="relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <img src={preview} alt="Document" className="h-48 w-full object-cover" />
              <button onClick={() => { setPreview(null); }} className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          {status !== "none" && (
            <div className={`mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${st.color}`}>
              {status === "approved" && <CheckCircle2 className="h-4 w-4" />}
              {status === "rejected" && <AlertCircle className="h-4 w-4" />}
              {status === "pending" && <div className="h-4 w-4 animate-spin rounded-full border-2 border-yellow-600 border-t-transparent" />}
              {st.label}
            </div>
          )}
          {status === "rejected" && rejectionReason && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">{rejectionReason}</p>
          )}
          {status === "none" && (
            <button onClick={() => setPreview(null)} className="mt-2 text-sm font-medium text-red-700 hover:text-red-800">
              Changer de document
            </button>
          )}
        </motion.div>
      ) : (
        <label
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed p-8 transition-colors ${
            dragOver ? "border-brand-800 bg-brand-50 dark:bg-brand-900/10" : "border-gray-300 hover:border-brand-400 dark:border-gray-600"
          }`}
        >
          <Upload className="mb-2 h-8 w-8 text-gray-400" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cliquez ou glissez votre document ici</p>
          <p className="mt-1 text-xs text-gray-400">PNG, JPG ou PDF — Max 5 MB</p>
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
      )}
    </div>
  );
}
