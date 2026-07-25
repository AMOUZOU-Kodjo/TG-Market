import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Image, Paperclip, X } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const emojiCategories = [
  {
    name: "Fréquents",
    emojis: ["👍", "❤️", "😂", "😍", "🙏", "👍🏾", "💪", "🎉"],
  },
  {
    name: "Visages",
    emojis: ["😀", "😃", "😄", "😁", "😆", "🥹", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮", "🤯", "😱", "😰", "😢", "😭", "😤", "😡", "🤬", "😈", "👿", "💀", "👻"],
  },
  {
    name: "Gestes",
    emojis: ["👋", "🤚", "🖐️", "✋", "🖖", "🫱", "🫲", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏"],
  },
  {
    name: "Objets",
    emojis: ["💰", "💸", "💵", "💴", "💶", "💷", "🪙", "💳", "💎", "⚖️", "🔧", "🔨", "📱", "💻", "⌨️", "🖥️", "🖨️", "📷", "📸", "🎥", "📹", "📺", "📻", "🔔", "📦", "📫", "📬", "🚚", "🚗", "🏠"],
  },
  {
    name: "Drapeaux",
    emojis: ["🇹🇬", "🇬🇭", "🇳🇬", "🇨🇮", "🇧🇯", "🇫🇷", "🇺🇸", "🇬🇧", "🇨🇲", "🇸🇳", "🇲🇱", "🇧🇫"],
  },
];

export default function MessageInput({ onSend, disabled = false, className }) {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    setShowEmojis(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const insertEmoji = (emoji) => {
    setText((prev) => prev + emoji);
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      {/* Emoji Picker */}
      <AnimatePresence>
        {showEmojis && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 right-0 z-20 mb-2 mx-4 max-h-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:left-4 sm:right-auto sm:w-80"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2 dark:border-gray-800">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">Emojis</span>
              <button
                onClick={() => setShowEmojis(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="overflow-y-auto p-2" style={{ maxHeight: "calc(72rem - 8rem)" }}>
              {emojiCategories.map((cat) => (
                <div key={cat.name} className="mb-2">
                  <p className="mb-1 px-1 text-[10px] font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    {cat.name}
                  </p>
                  <div className="flex flex-wrap gap-0.5">
                    {cat.emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
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
            onClick={() => setShowEmojis(!showEmojis)}
            className={cn(
              "rounded-lg p-2 transition-colors",
              showEmojis
                ? "bg-brand-50 text-brand-800 dark:bg-brand-900/20"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            )}
            title="Emoji"
          >
            <Smile className="h-5 w-5" />
          </button>
        </div>

        <div className="relative flex-1">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message..."
            rows={1}
            disabled={disabled}
            className={cn(
              "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm",
              "text-gray-900 placeholder:text-gray-400",
              "focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              "dark:focus:border-brand-800 dark:focus:ring-brand-800/20",
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
              ? "bg-brand-800 text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          )}
        >
          <Send className="h-4 w-4" />
        </motion.button>
      </form>
    </div>
  );
}
