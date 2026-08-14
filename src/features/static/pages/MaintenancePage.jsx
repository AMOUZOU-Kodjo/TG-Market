import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Wrench, Clock, Mail, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";
import api from "@/shared/services/api";
import toast from "react-hot-toast";
import tgLogo from "@/assets/logo-tg.png";

export default function MaintenancePage() {
  const { siteName, siteLogo, maintenanceMode, maintenanceMessage, maintenanceEstimatedReturn, maintenanceImprovements, socialFacebook, socialTwitter, socialInstagram, socialLinkedin, socialGithub } = useSiteSettings();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!maintenanceMode) {
      navigate("/", { replace: true });
    }
  }, [maintenanceMode, navigate]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    setSubscribing(true);
    try {
      await api.post("/maintenance/subscribe", { email });
      setSubscribed(true);
      toast.success("Inscription réussie !");
    } catch (err) {
      toast.error(err.response?.data?.error ?? "Erreur lors de l'inscription");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center overflow-y-auto bg-white px-4 py-8 dark:bg-gray-950">
      <div className="m-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="rounded-3xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-800 sm:p-10"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={siteLogo || tgLogo}
              alt={siteName}
              className="h-16 w-auto object-contain"
            />
          </div>

          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white flex flex-wrap items-center justify-center gap-3">
              <div className="relative h-10 w-10 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-brand-300"
                />
                <Wrench className="text-xl text-brand-800 relative" />
              </div>
              Maintenance en cours
            </h1>
            <p className="mb-6 break-words text-gray-500 dark:text-gray-400">
              {siteName} {maintenanceMessage}
            </p>
          </div>

          {/* Estimated Time */}
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-brand-50 p-4 dark:bg-brand-800/5">
            <Clock className="h-5 w-5 shrink-0 text-brand-800" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Retour estimé
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {maintenanceEstimatedReturn}
              </p>
            </div>
          </div>

          {/* What we're doing */}
          <div className="mb-6 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              En cours d'amélioration
            </p>
            <ul className="space-y-2">
              {(Array.isArray(maintenanceImprovements) ? maintenanceImprovements : []).map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-800" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Email Signup */}
          {!subscribed ? (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Inscrivez-vous pour être notifié lorsque le site sera de retour :
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={subscribing} icon={subscribing ? Loader2 : ArrowRight} className="w-full sm:w-auto shrink-0">
                  {subscribing ? "..." : "Notifier"}
                </Button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 rounded-xl bg-brand-50 p-4 dark:bg-brand-700/10"
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-700" />
              <p className="text-sm text-brand-700 dark:text-brand-600">
                Parfait ! Vous recevrez un email à <strong>{email}</strong> dès que le site sera de retour.
              </p>
            </motion.div>
          )}

          {/* Social/Contact */}
          <div className="mt-6 border-t border-gray-100 pt-6 text-center dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Suivez-nous sur les réseaux sociaux pour les dernières mises à jour
            </p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-200 transition-colors dark:bg-brand-700/10 dark:text-brand-400">
                Facebook
              </a>
              <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-600 hover:bg-sky-200 transition-colors dark:bg-sky-500/10 dark:text-sky-400">
                Twitter
              </a>
              <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 hover:bg-brand-200 transition-colors dark:bg-brand-700/10 dark:text-brand-400">
                Instagram
              </a>
              <a href={socialLinkedin} target="_blank" rel="noopener noreferrer" className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-600 hover:bg-sky-200 transition-colors dark:bg-sky-500/10 dark:text-sky-400">
                LinkedIn
              </a>
              <a href={socialGithub} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors dark:bg-gray-700/10 dark:text-gray-400">
                GitHub
              </a>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          © 2025 {siteName}. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
