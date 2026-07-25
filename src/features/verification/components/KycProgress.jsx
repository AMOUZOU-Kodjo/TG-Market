import { motion } from "framer-motion";
import { Phone, Mail, FileCheck, Camera, CheckCircle2 } from "lucide-react";

const iconMap = { Phone, Mail, FileCheck, Camera };

export default function KycProgress({ steps }) {
  return (
    <div className="flex items-start justify-between">
      {steps.map((step, i) => {
        const Icon = iconMap[step.icon] || FileCheck;
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "pending";
        return (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="flex flex-1 flex-col items-center relative"
          >
            {i > 0 && (
              <div className={`absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2 ${isCompleted || steps[i - 1].status === "completed" ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
            <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${
              isCompleted
                ? "border-green-500 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                : isCurrent
                ? "border-yellow-500 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                : "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-800"
            }`}>
              {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
            </div>
            <p className={`mt-2 text-xs font-medium text-center ${isCompleted ? "text-green-600 dark:text-green-400" : isCurrent ? "text-yellow-600 dark:text-yellow-400" : "text-gray-400"}`}>
              {step.title}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-400 dark:text-gray-500 text-center hidden sm:block">{step.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
