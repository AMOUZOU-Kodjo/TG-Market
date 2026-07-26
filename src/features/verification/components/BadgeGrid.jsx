import { motion } from "framer-motion";
import { Phone, Mail, ShieldCheck, Briefcase, Star, Zap, Lock } from "lucide-react";

const badgeConfig = {
  phone_verified: { icon: Phone, color: "bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400", name: "Téléphone vérifié", description: "Votre numéro de téléphone a été confirmé" },
  email_verified: { icon: Mail, color: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400", name: "Email vérifié", description: "Votre adresse email a été confirmée" },
  identity_verified: { icon: ShieldCheck, color: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400", name: "Identité vérifiée", description: "Votre pièce d'identité a été validée" },
  professional_seller: { icon: Briefcase, color: "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400", name: "Vendeur professionnel", description: "Statut de vendeur professionnel obtenu" },
  trusted_seller: { icon: Star, color: "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400", name: "Vendeur de confiance", description: "Badge de confiance obtenu" },
  first_sale: { icon: Zap, color: "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400", name: "Première vente", description: "Vous avez réalisé votre première vente" },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function BadgeGrid({ badges = [] }) {
  const earnedKeys = new Set(badges.map((b) => b.key));

  const allBadges = Object.entries(badgeConfig).map(([key, config]) => ({
    key,
    ...config,
    earned: earnedKeys.has(key),
  }));

  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {allBadges.map((badge) => {
        const Icon = badge.icon;
        return (
          <motion.div
            key={badge.key}
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            className={`relative overflow-hidden rounded-2xl border p-4 transition-shadow ${
              badge.earned
                ? "border-gray-100 bg-white shadow-sm hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                : "border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50"
            }`}
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${badge.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h3 className={`text-sm font-semibold ${badge.earned ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500"}`}>
              {badge.name}
            </h3>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{badge.description}</p>
            {!badge.earned && (
              <div className="absolute right-3 top-3">
                <Lock className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              </div>
            )}
            {badge.earned && (
              <div className="mt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-medium text-brand-700 dark:bg-brand-900/20 dark:text-brand-400">
                  ✓ Obtenu
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
