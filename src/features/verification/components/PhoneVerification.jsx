import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Phone, Edit3, CheckCircle2 } from "lucide-react";
import Button from "@/shared/ui/Button";
import { useSendOtp, useVerifyOtp } from "@/features/verification/hooks/useKyc";
import toast from "react-hot-toast";

export default function PhoneVerification({ phone = "+228 90 12 34 56", onVerify }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [sent, setSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const { mutate: sendOtp, isPending: sendingOtp } = useSendOtp();
  const { mutate: verifyOtp, isPending: verifyingOtp } = useVerifyOtp();

  const handleSendCode = () => {
    sendOtp(
      { phone: phone.replace(/\D/g, "") },
      {
        onSuccess: () => {
          setSent(true);
          setCountdown(60);
        },
        onError: () => {
          toast.error("Erreur lors de l'envoi du code");
        },
      }
    );
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
    if (newOtp.every((d) => d !== "")) {
      const otpCode = newOtp.join("");
      verifyOtp(
        { phone: phone.replace(/\D/g, ""), otp: otpCode },
        {
          onSuccess: () => {
            setVerified(true);
            onVerify?.();
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || "Code OTP invalide");
            setOtp(["", "", "", "", "", ""]);
          },
        }
      );
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  if (verified) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 rounded-xl bg-brand-50 p-4 dark:bg-brand-900/20">
        <CheckCircle2 className="h-8 w-8 text-brand-600" />
        <div>
          <p className="font-medium text-brand-800 dark:text-brand-400">Téléphone vérifié</p>
          <p className="text-sm text-brand-600 dark:text-brand-500">{phone}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{phone}</span>
        </div>
        <button className="text-xs font-medium text-red-700 hover:text-red-800 flex items-center gap-1">
          <Edit3 className="h-3 w-3" /> Modifier
        </button>
      </div>

      {!sent ? (
        <Button onClick={handleSendCode} loading={sendingOtp} variant="secondary" className="w-full">
          Envoyer le code de vérification
        </Button>
      ) : (
        <>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Code envoyé au {phone}
          </p>
          <div className="flex justify-center gap-2">
            {otp.map((digit, i) => (
              <motion.input
                key={i}
                id={`otp-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="h-12 w-12 rounded-xl border border-gray-300 bg-white text-center text-lg font-bold text-gray-900 focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
            ))}
          </div>
          {verifyingOtp && (
            <div className="flex justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-800 border-t-transparent" />
            </div>
          )}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-xs text-gray-400">Renvoyer dans {countdown}s</p>
            ) : (
              <button onClick={handleSendCode} className="text-xs font-medium text-red-700 hover:text-red-800">
                Renvoyer le code
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
