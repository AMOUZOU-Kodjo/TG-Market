import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import Button from "@/shared/ui/Button";

export default function NotFoundPage() {
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
            {/* Main number */}
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, -2, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="text-[120px] font-black leading-none text-brand-800/20 dark:text-brand-800/10">
                404
              </span>
            </motion.div>

            {/* Floating elements */}
            <motion.div
              animate={{
                y: [0, -12, 0],
                x: [0, 5, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute left-4 top-4 rounded-xl bg-brand-200 p-3 dark:bg-brand-800/10"
            >
              <Search className="h-6 w-6 text-brand-800" />
            </motion.div>

            <motion.div
              animate={{
                y: [0, -8, 0],
                x: [0, -6, 0],
                rotate: [0, -8, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute right-4 top-8 rounded-xl bg-brand-100 p-3 dark:bg-brand-700/10"
            >
              <span className="text-2xl">📦</span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute bottom-4 left-8 rounded-xl bg-brand-100 p-3 dark:bg-brand-700/10"
            >
              <span className="text-2xl">🔍</span>
            </motion.div>

            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, -12, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.8,
              }}
              className="absolute bottom-2 right-6 rounded-xl bg-brand-100 p-3 dark:bg-brand-700/10"
            >
              <span className="text-2xl">❓</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
            Page non trouvée
          </h1>
          <p className="mx-auto mb-8 max-w-md text-gray-500 dark:text-gray-400">
            Oups ! Il semblerait que cette page se soit perdue entre Lomé et Kara.
            Elle n'est plus disponible ou l'adresse est incorrecte.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/">
              <Button size="lg" icon={Home}>
                Retour à l'accueil
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              icon={ArrowLeft}
              onClick={() => window.history.back()}
            >
              Page précédente
            </Button>
          </div>
        </motion.div>

        {/* Fun suggestion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/50"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            En attendant, pourquoi ne pas{" "}
            <Link to="/" className="font-medium text-brand-800 hover:underline">
              explorer les annonces
            </Link>
            {" "}ou{" "}
            <Link to="/vendre" className="font-medium text-brand-800 hover:underline">
              publier une annonce
            </Link>
            ?
          </p>
        </motion.div>
      </div>
    </div>
  );
}
