import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, CheckCheck, Trash2, X, ExternalLink } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { formatTime, formatCFA } from "@/shared/utils/format";
import { Link } from "react-router-dom";

export default function MessageBubble({
  message,
  isOwn = false,
  showTimestamp = true,
  onDelete,
  selectionMode = false,
  selected = false,
  onSelect,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  if (message.type === "system" && message.metadata?.id) {
    const prod = message.metadata;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center"
      >
        <Link
           to={`/annonce/${prod.id}`}
          className="mx-4 flex max-w-xs items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <img
            src={prod.image}
            alt={prod.title}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">
              {prod.title}
            </p>
            <p className="mt-0.5 text-sm font-bold text-brand-800">
              {formatCFA(prod.price)}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
        </Link>
      </motion.div>
    );
  }

  if (message.deleted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn("flex", isOwn ? "justify-end" : "justify-start")}
      >
        <div className="flex items-center gap-1.5 rounded-2xl bg-gray-50 px-4 py-2 text-xs italic text-gray-400 dark:bg-gray-800/50 dark:text-gray-500">
          <X className="h-3 w-3" />
          Message supprimé
        </div>
      </motion.div>
    );
  }

  if (selectionMode) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className={cn("flex items-center gap-2", isOwn ? "justify-end" : "justify-start")}
      >
        <div
          onClick={() => onSelect?.(message.id)}
          className={cn(
            "max-w-[75%] rounded-2xl px-4 py-2.5 cursor-pointer transition-all",
            isOwn
              ? "bg-brand-800 text-white rounded-br-md"
              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white rounded-bl-md",
            selected && "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-gray-900"
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
                <span className={message.read ? "text-red-500" : "text-brand-300"}>
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

        <div
          onClick={() => onSelect?.(message.id)}
          className={cn(
            "flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-brand-800 bg-brand-800"
              : "border-gray-300 dark:border-gray-600"
          )}
        >
          {selected && <Check className="h-3.5 w-3.5 text-white" />}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("group relative flex", isOwn ? "justify-end" : "justify-start")}
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
              <span className={message.read ? "text-red-500" : "text-brand-300"}>
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

      <div className="absolute top-0 hidden group-hover:flex" style={{ [isOwn ? "left" : "right"]: "-28px" }}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((p) => !p); }}
          className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {menuOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-0 z-50 w-48 rounded-xl bg-white py-1 shadow-lg ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700",
            isOwn ? "right-0" : "left-0"
          )}
          style={{ [isOwn ? "right" : "left"]: "0", top: "100%", marginTop: "4px" }}
        >
          <button
            onClick={() => { setMenuOpen(false); onDelete?.("me"); }}
            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
            Supprimer pour moi
          </button>
          {isOwn && (
            <button
              onClick={() => { setMenuOpen(false); onDelete?.("everyone"); }}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
            >
              <Trash2 className="h-4 w-4" />
              Supprimer pour tout le monde
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
}
