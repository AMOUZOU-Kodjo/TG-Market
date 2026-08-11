import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";

export default function QrScanner({ onScan, onClose }) {
  const previewRef = useRef(null);
  const scannerRef = useRef(null);
  const stoppedRef = useRef(false);
  const [status, setStatus] = useState("scanning");
  const [error, setError] = useState(null);

  const handleStop = () => {
    if (stoppedRef.current || !scannerRef.current) return;
    stoppedRef.current = true;
    scannerRef.current.stop().catch(() => {});
  };

  useEffect(() => {
    let mounted = true;

    const start = async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        if (!mounted) return;

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            if (mounted) {
              handleStop();
              setStatus("success");
              setTimeout(() => onScan(decodedText), 500);
            }
          },
          () => {}
        );
      } catch (err) {
        if (mounted) {
          setError("Impossible d'accéder à la caméra. Autorisez l'accès à la caméra dans les paramètres.");
          setStatus("error");
        }
      }
    };

    start();

    return () => {
      mounted = false;
      handleStop();
    };
  }, [onScan]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    >
      <div className="relative w-full max-w-sm">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white z-10"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="overflow-hidden rounded-2xl bg-white">
          <div className="p-4 text-center">
            <h3 className="text-sm font-semibold text-gray-900">
              Scanner le QR code
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Placez le QR code du vendeur dans le cadre
            </p>
          </div>

          <div className="relative mx-auto w-64 h-64">
            <div id="qr-reader" ref={previewRef} className="w-full h-full" />

            {status === "scanning" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="h-48 w-48 rounded-xl border-2 border-brand-800 opacity-60" />
              </div>
            )}
          </div>

          <div className="p-4 text-center">
            {status === "scanning" && (
              <p className="text-xs text-gray-400 animate-pulse">Recherche d'un QR code...</p>
            )}
            {status === "success" && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                QR code scanné !
              </div>
            )}
            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
