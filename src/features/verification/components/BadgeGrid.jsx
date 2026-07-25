import { motion } from "framer-motion";
import { Phone, Mail, ShieldCheck, Briefcase, Star, Zap, Lock } from "lucide-react";

const iconMap = { Phone, Mail, ShieldCheck, Briefcase, Star, Zap };

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function BadgeGrid({ badges }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {badges.map((badge) => {
        const Icon = iconMap[badge.icon] || ShieldCheck;
        return (
          <motion.div
            key={badge.id}
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
