import { motion } from "framer-motion";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatTime } from "@/shared/utils/format";

export default function MessageBubble({ message, isOwn = false, showTimestamp = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5",
          isOwn
            ? "bg-brand-800 text-white rounded-br-md"
            : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white rounded-bl-md"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {showTimestamp && (
          <div
            className={cn(
              "mt-1 flex items-center justify-end gap-1",
              isOwn ? "text-brand-200" : "text-gray-400 dark:text-gray-500"
            )}
          >
            <span className="text-[10px]">{formatTime(message.createdAt)}</span>
            {isOwn && (
              <span className="text-brand-300">
                {message.read ? (
                  <CheckCheck className="h-3.5 w-3.5" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
