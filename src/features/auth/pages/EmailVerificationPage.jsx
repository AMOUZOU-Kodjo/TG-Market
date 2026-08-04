import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MailCheck, MailX, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import api from "@/shared/services/api";
import Button from "@/shared/ui/Button";
import toast from "react-hot-toast";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [state, setState] = useState(token ? "verifying" : "check-inbox");
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const verify = async () => {
      try {
        const res = await api.post("/auth/verify-email", { token });
        if (cancelled) return;
        setState("success");
        if (res.data?.user) {
          localStorage.setItem("auth_verified", "true");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err.response?.data?.error || err.response?.data?.message || "Lien invalide ou expiré");
        setState("error");
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await api.post("/auth/resend-verification");
      toast.success(res.data?.message || "Email renvoyé");
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Erreur lors du renvoi");
    } finally {
      setResending(false);
    }
  };

  if (state === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-brand-800" />
        <p className="mt-4 text-sm text-gray-500">Vérification de votre email en cours...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-md py-12"
    >
      {state === "success" && (
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <MailCheck className="h-10 w-10 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email vérifié !</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Votre adresse email a été confirmée avec succès. Votre compte est maintenant actif.
            </p>
          </div>
          <Button fullWidth icon={ArrowRight} onClick={() => navigate("/")}>
            Aller à l'accueil
          </Button>
        </div>
      )}

      {state === "error" && (
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <MailX className="h-10 w-10 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lien invalide ou expiré</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{error}</p>
          </div>
          <div className="space-y-2">
            <Button fullWidth variant="primary" icon={RefreshCw} loading={resending} onClick={handleResend}>
              Renvoyer l'email de vérification
            </Button>
            <Button fullWidth variant="outline" onClick={() => navigate("/")}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      )}

      {state === "check-inbox" && (
        <div className="text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-50">
            <MailCheck className="h-10 w-10 text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Vérifiez votre boîte mail</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu'il contient
              pour activer votre compte.
            </p>
            <p className="mt-2 text-xs text-gray-400">
              Vous n'avez rien reçu ? Vérifiez vos spams ou renvoyez l'email.
            </p>
          </div>
          <div className="space-y-2">
            <Button fullWidth variant="primary" icon={RefreshCw} loading={resending} onClick={handleResend}>
              Renvoyer l'email
            </Button>
            <Link to="/connexion" className="block text-sm font-medium text-brand-700 hover:text-brand-800">
              J'ai déjà vérifié, me connecter
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
