import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RefreshCw, Home, AlertOctagon, ArrowLeft } from "lucide-react";
import Button from "@/shared/ui/Button";
import { useState } from "react";
import { useSiteSettings } from "@/shared/contexts/SiteSettingsContext";

export default function ErrorPage() {
  const [retrying, setRetrying] = useState(false);
  const { supportEmail } = useSiteSettings();

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Animated Illustration */}
          <div className="relative mx-auto mb-8 h-48 w-48">
            <motion.div
              animate={{
                rotate: [0, -5, 5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-red-50 dark:bg-red-700/10">
                <AlertOctagon className="h-16 w-16 text-red-700" />
              </div>
            </motion.div>

            {/* Glitch effect lines */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
                className="absolute left-0 right-0 h-0.5 bg-red-400/30"
                style={{ top: `${20 + i * 15}%` }}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Erreur serveur
          </h1>
          <p className="mx-auto mb-8 max-w-md text-gray-500 dark:text-gray-400">
            Une erreur inattendue s'est produite. Notre équipe a été notifiée
            et travaille à résoudre le problème. Veuillez réessayer dans quelques instants.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              icon={RefreshCw}
              loading={retrying}
              onClick={handleRetry}
            >
              Réessayer
            </Button>
            <Link to="/">
              <Button variant="outline" size="lg" icon={Home}>
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Error info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mx-auto mt-12 max-w-md rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-800/50"
        >
          <div className="space-y-2 text-left text-xs text-gray-500 dark:text-gray-400">
            <p className="font-medium text-gray-700 dark:text-gray-300">Informations de diagnostic :</p>
            <p>Code d'erreur : 500 - Internal Server Error</p>
            <p>Heure : {new Date().toLocaleString("fr-FR")}</p>
            <p>
              Si le problème persiste, contactez le support à{" "}
              <a href={`mailto:${supportEmail}`} className="text-red-800 hover:underline">
                {supportEmail}
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
