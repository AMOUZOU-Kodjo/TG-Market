import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PaymentMethodSelector({ methods, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {methods.map((m) => (
        <motion.button
          key={m.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(m.id)}
          className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all ${
            selected === m.id
              ? "border-red-800 bg-red-50 dark:border-red-700 dark:bg-red-900/20"
              : "border-gray-100 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-800"
          }`}
        >
          {selected === m.id && (
            <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-800 text-white">
              <Check className="h-3 w-3" />
            </div>
          )}
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${m.bgClass}`}>
            <div className="h-6 w-6 rounded-full" style={{ backgroundColor: m.color }} />
          </div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
