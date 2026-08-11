import { motion } from "framer-motion";
import { cn } from "@/shared/utils/cn";
import Avatar from "@/shared/ui/Avatar";
import { formatRelativeTime } from "@/shared/utils/format";
import { ShieldCheck, X } from "lucide-react";
import { useTheme } from "@/shared/contexts/ThemeContext";

const userColors = [
  "#014D46",
  "#01796F",
  "#4F46E5",
  "#2563EB",
  "#059669",
  "#D97706",
  "#E11D48",
  "#0891B2",
];

function getColor(name) {
  if (!name) return userColors[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return userColors[Math.abs(hash) % userColors.length];
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ConversationItem({
  conversation,
  isSelected = false,
  onClick,
  onDelete,
}) {
  const { participant, lastMessage, lastMessageAt, unreadCount, product } = conversation;
  const { isDark } = useTheme();
  const userColor = getColor(participant?.name);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "group relative flex w-full cursor-pointer items-start gap-3 px-4 py-4 text-left transition-colors",
        isSelected
          ? "bg-brand-50 dark:bg-brand-800/10"
          : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}
      style={
        !isSelected ? { backgroundColor: hexToRgba(userColor, isDark ? 0.12 : 0.06) } : undefined
      }
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

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(conversation.id);
          }}
          className="absolute right-2 top-2 hidden rounded-full p-1 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 group-hover:block dark:hover:bg-red-950/20 dark:hover:text-red-400"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
