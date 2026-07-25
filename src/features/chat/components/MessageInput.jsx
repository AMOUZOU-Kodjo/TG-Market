import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Smile, Image, Paperclip } from "lucide-react";
import { cn } from "@/shared/utils/cn";

export default function MessageInput({ onSend, disabled = false, className }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-2 border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Joindre une image"
        >
          <Image className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Joindre un fichier"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          title="Emoji"
        >
          <Smile className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          rows={1}
          disabled={disabled}
          className={cn(
            "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm",
            "text-gray-900 placeholder:text-gray-400",
            "focus:border-red-800 focus:outline-none focus:ring-2 focus:ring-red-800/20",
            "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
            "dark:focus:border-red-800 dark:focus:ring-red-800/20",
            "transition-colors duration-200",
            disabled && "cursor-not-allowed opacity-50"
          )}
          style={{ minHeight: "42px", maxHeight: "120px" }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
          }}
        />
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={disabled || !text.trim()}
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          text.trim()
            ? "bg-red-800 text-white shadow-sm shadow-red-800/25 hover:bg-red-900"
            : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
        )}
      >
        <Send className="h-4 w-4" />
      </motion.button>
    </form>
  );
}
