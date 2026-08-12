import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Smile, Image as ImageIcon, Paperclip, X, Plus, Loader2, FileText } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import api from "@/shared/services/api";
import { formatFileSize } from "@/shared/utils/format";

const emojiCategories = [
  {
    name: "Fréquents",
    emojis: ["👍", "❤️", "😂", "😍", "🙏", "👍🏾", "💪", "🎉"],
  },
  {
    name: "Visages",
    emojis: ["😀", "😁", "😂", "😊", "😍", "🥰", "😘", "🤔", "😐", "😮", "😢", "😭", "😤", "😡", "🤯", "😱", "😰", "🥹", "😅", "🤣", "🙂", "😇", "🤩", "🤑", "🤗", "🤭", "🤫", "😏", "😒", "🙄", "😬", "💀", "👻"],
  },
  {
    name: "Gestes",
    emojis: ["👋", "🤚", "✋", "👌", "🤏", "✌️", "🤞", "👍", "👎", "✊", "👊", "🤛", "👏", "🙌", "🫶", "👐", "🤲", "🤝", "🙏", "💪"],
  },
  {
    name: "Objets",
    emojis: ["💰", "💸", "💵", "💳", "💎", "⚖️", "🔧", "📱", "💻", "⌨️", "📷", "📸", "🎥", "📺", "📦", "🚚", "🚗", "🏠", "🔔", "📬"],
  },
  {
    name: "Drapeaux",
    emojis: ["🇹🇬", "🇬🇭", "🇳🇬", "🇨🇮", "🇧🇯", "🇫🇷", "🇺🇸", "🇬🇧", "🇨🇲", "🇸🇳", "🇲🇱", "🇧🇫"],
  },
];

const MAX_IMAGES = 10;
const MAX_FILES = 5;
const ALLOWED_FILE_TYPES = /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt|csv|zip|rar|json)$/i;

let attachmentId = 0;

export default function MessageInput({ onSend, onTyping, disabled = false, className }) {
  const [text, setText] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [items, setItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const addFiles = (fileList, kind) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    const images = items.filter((i) => i.kind === "image").length;
    const filesCount = items.filter((i) => i.kind === "file").length;

    const accepted = files
      .map((file) => {
        if (kind === "file" && !ALLOWED_FILE_TYPES.test(file.name)) return null;
        return file;
      })
      .filter(Boolean);

    if (kind === "image") {
      const room = MAX_IMAGES - images;
      accepted.slice(0, room).forEach((file) => {
        setItems((prev) => [
          ...prev,
          { id: ++attachmentId, kind: "image", file, preview: URL.createObjectURL(file), name: file.name, size: file.size },
        ]);
      });
    } else {
      const room = MAX_FILES - filesCount;
      accepted.slice(0, room).forEach((file) => {
        setItems((prev) => [
          ...prev,
          { id: ++attachmentId, kind: "file", file, preview: null, name: file.name, size: file.size },
        ]);
      });
    }
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (uploading || disabled) return;
    if (!trimmed && items.length === 0) return;

    setUploading(true);

    const imageItems = items.filter((i) => i.kind === "image");
    const fileItems = items.filter((i) => i.kind === "file");

    try {
      const images = [];
      const files = [];

      if (imageItems.length > 0) {
        const formData = new FormData();
        imageItems.forEach((i) => formData.append("files", i.file));
        const res = await api.post("/upload/images", formData);
        (res.data.data || []).forEach((img) => {
          images.push({ url: img.url, thumbnail: img.thumbnail || img.url, name: img.name || "", size: 0 });
        });
      }

      for (const item of fileItems) {
        const formData = new FormData();
        formData.append("file", item.file);
        const res = await api.post("/upload/file", formData);
        files.push({ url: res.data.url, downloadUrl: res.data.downloadUrl || res.data.url, name: res.data.name || item.name, size: res.data.size || item.size });
      }

      onSend(trimmed, { images, files });
      items.forEach((i) => i.preview && URL.revokeObjectURL(i.preview));
      setItems([]);
      setText("");
      setShowEmojis(false);
      setShowMenu(false);
      if (onTyping) onTyping(false);
    } catch {
      // l'utilisateur peut réessayer
    } finally {
      setUploading(false);
    }
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);

    if (!onTyping) return;

    if (newText.trim()) {
      onTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => onTyping(false), 2000);
    } else {
      onTyping(false);
      clearTimeout(typingTimeoutRef.current);
    }
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

  const openImagePicker = () => {
    setShowMenu(false);
    setShowEmojis(false);
    imageInputRef.current?.click();
  };

  const openFilePicker = () => {
    setShowMenu(false);
    setShowEmojis(false);
    fileInputRef.current?.click();
  };

  const hasContent = text.trim().length > 0 || items.length > 0;

  const menuItemClass =
    "flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700";
  const actionButtonClass =
    "rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300";

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
            className="absolute bottom-full left-0 right-0 z-20 mb-2 mx-4 max-h-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 sm:left-4 sm:right-auto sm:w-80"
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

      {/* Attachments preview */}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-gray-100 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-800"
          >
            <div className="flex flex-wrap items-center gap-2">
              {items.map((item) => (
                <div key={item.id} className="group relative">
                  {item.kind === "image" ? (
                    <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                      <img src={item.preview} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-16 max-w-44 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 dark:border-gray-700 dark:bg-gray-800">
                      <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                      <div className="min-w-0">
                        <p className="max-w-28 truncate text-xs font-medium text-gray-700 dark:text-gray-300">{item.name}</p>
                        <p className="text-[10px] text-gray-400">{formatFileSize(item.size)}</p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={uploading}
                    className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-900 text-white shadow-md transition-colors hover:bg-red-600 disabled:opacity-50"
                    title="Retirer"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {uploading && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi...
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-800"
      >
        {/* Mobile: grouped + button */}
        <div className="relative lg:hidden">
          <button
            type="button"
            onClick={() => { setShowMenu((p) => !p); setShowEmojis(false); }}
            className={cn(
              "rounded-lg p-2 transition-colors",
              showMenu
                ? "bg-brand-50 text-brand-800 dark:bg-brand-900/20"
                : "text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            )}
            title="Ajouter"
          >
            <Plus className="h-5 w-5" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className="absolute bottom-full left-0 z-20 mb-2 w-52 overflow-hidden rounded-2xl border border-gray-200 bg-white py-1 shadow-xl dark:border-gray-700 dark:bg-gray-800"
              >
                <button type="button" onClick={openImagePicker} className={menuItemClass}>
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                  Photo
                </button>
                <button type="button" onClick={openFilePicker} className={menuItemClass}>
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  Fichier
                </button>
                <button
                  type="button"
                  onClick={() => { setShowMenu(false); setShowEmojis((p) => !p); }}
                  className={menuItemClass}
                >
                  <Smile className="h-4 w-4 text-gray-400" />
                  Emoji
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop: visible buttons */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            type="button"
            onClick={openImagePicker}
            className={actionButtonClass}
            title="Joindre une image"
          >
            <ImageIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={openFilePicker}
            className={actionButtonClass}
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
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Écrire un message..."
            rows={1}
            disabled={disabled || uploading}
            className={cn(
              "w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm",
              "text-gray-900 placeholder:text-gray-400",
              "focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20",
              "dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500",
              "dark:focus:border-brand-800 dark:focus:ring-brand-800/20",
              "transition-colors duration-200",
              (disabled || uploading) && "cursor-not-allowed opacity-50"
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
          disabled={disabled || uploading || !hasContent}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
            hasContent && !uploading
              ? "bg-brand-800 text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900"
              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
          )}
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </motion.button>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => { addFiles(e.target.files, "image"); e.target.value = ""; }}
      />
      <input
        ref={fileInputRef}
        type="file"
        multiple
        hidden
        onChange={(e) => { addFiles(e.target.files, "file"); e.target.value = ""; }}
      />
    </div>
  );
}
