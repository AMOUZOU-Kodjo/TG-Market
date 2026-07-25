import { useState } from "react";
import { motion } from "framer-motion";
import { Wrench, Clock, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "@/shared/ui/Button";
import Input from "@/shared/ui/Input";
import toast from "react-hot-toast";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const estimatedReturn = "24 juillet 2026 à 18h00 (GMT+0)";

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Veuillez entrer une adresse email");
      return;
    }
    setSubscribed(true);
    toast.success("Vous serez notifié lorsque le site sera de retour !");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 dark:bg-gray-950">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:p-10"
        >
          {/* Animated Icon */}
          <div className="relative mx-auto mb-6 h-24 w-24">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 rounded-full border-4 border-dashed border-brand-300 dark:border-brand-800/20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Wrench className="h-10 w-10 text-brand-800" />
              </motion.div>
            </div>
          </div>

          <div className="text-center">
            <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              Maintenance en cours
            </h1>
            <p className="mb-6 text-gray-500 dark:text-gray-400">
              TG-Market est actuellement en maintenance pour améliorer vos
              services. Nous serons de retour très bientôt !
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
                {estimatedReturn}
              </p>
            </div>
          </div>

          {/* What we're doing */}
          <div className="mb-6 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              En cours d'amélioration
            </p>
            <ul className="space-y-2">
              {[
                "Système de paiement sécurisé via Mobile Money",
                "Performance et vitesse de chargement",
                "Nouvelles fonctionnalités de messagerie",
              ].map((item, i) => (
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
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    type="email"
                    placeholder="votre@email.com"
                    icon={Mail}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" icon={ArrowRight}>
                  Notifier
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
            <div className="mt-3 flex justify-center gap-3">
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-700/10 dark:text-brand-400">
                Facebook
              </span>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
                Twitter
              </span>
              <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 dark:bg-brand-700/10 dark:text-brand-400">
                Instagram
              </span>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          © 2025 TG-Market. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}
