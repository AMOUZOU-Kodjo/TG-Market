import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import Avatar from "@/shared/ui/Avatar";
import { formatRelativeTime } from "@/shared/utils/format";
import { ShieldCheck } from "lucide-react";

export default function ConversationItem({
  conversation,
  isSelected = false,
  onClick,
}) {
  const { participant, lastMessage, lastMessageAt, unreadCount, product } = conversation;

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors",
        isSelected
          ? "bg-brand-50 dark:bg-brand-800/10"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
    >
      <Avatar
        src={participant?.avatar}
        name={participant?.name}
        size="md"
        online={participant?.online}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className={cn(
                "truncate text-sm font-semibold",
                unreadCount > 0
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {participant?.name}
            </span>
            {participant?.verified && (
              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brand-700" />
            )}
          </div>
          <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
            {formatRelativeTime(lastMessageAt)}
          </span>
        </div>

        <p
          className={cn(
            "mt-0.5 line-clamp-1 text-xs",
            unreadCount > 0
              ? "font-medium text-gray-800 dark:text-gray-200"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          {lastMessage}
        </p>

        {product && (
          <div className="mt-1.5 flex items-center gap-2 rounded-lg bg-gray-50 px-2 py-1 dark:bg-gray-800">
            <img
              src={product.image}
              alt={product.title}
              className="h-7 w-7 rounded-md object-cover"
            />
            <span className="truncate text-[11px] text-gray-500 dark:text-gray-400">
              {product.title}
            </span>
          </div>
        )}
      </div>

      {unreadCount > 0 && (
        <span className="mt-0.5 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-800 px-1.5 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      )}
    </motion.button>
  );
}
