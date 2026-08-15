import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  MoreVertical,
  Phone,
  ExternalLink,
  CheckCheck,
  Trash2,
  X,
} from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import MessageBubble from "@/features/chat/components/MessageBubble";
import MessageInput from "@/features/chat/components/MessageInput";
import { useAuth } from "@/shared/contexts/AuthContext";
import { useSocket } from "@/shared/contexts/SocketContext";
import { formatCFA } from "@/shared/utils/format";
import { useSendMessage, useMarkAsRead } from "@/features/chat/hooks/useConversations";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { conversationsApi } from "@/features/chat/services/conversations.api";

export default function ConversationPanel({ conversation, messages: initialMessages = [] }) {
  const { user, setUser } = useAuth();
  const { emit, on, off, connected } = useSocket();
  const qc = useQueryClient();

  const convId = conversation?.id;
  const { mutateAsync: sendMessage, isPending: isSending } = useSendMessage(convId);
  const { mutateAsync: markAsRead } = useMarkAsRead();

  const remoteParticipant = useMemo(() => {
    if (!conversation) return null;
    if (conversation.participant) return conversation.participant;
    const other = conversation.participants?.find((p) => p.id !== user?.id);
    return other || null;
  }, [conversation, user]);

  const product = useMemo(() => {
    if (!conversation?.product) return null;
    if (conversation.product.image) return conversation.product;
    return {
      ...conversation.product,
      image: conversation.product.images?.[0] || null,
    };
  }, [conversation]);

  const [messages, setMessages] = useState(() =>
    [...initialMessages].reverse()
  );
  const [otherTyping, setOtherTyping] = useState(false);
  const [participantOnline, setParticipantOnline] = useState(remoteParticipant?.online ?? false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteScope, setDeleteScope] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  }, []);

  useEffect(() => {
    if (initialMessages.length > 0) setMessages([...initialMessages].reverse());
  }, [initialMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!convId) return;

    const room = `conversation:${convId}`;
    if (connected) emit("join_room", { room });

    const unsubMessage = on("new_message", (data) => {
      if (data.conversationId !== convId) return;
      if (data.message.senderId !== user?.id) {
        setUser((prev) => prev ? { ...prev, unreadMessages: prev.unreadMessages + 1 } : prev);
      }
      setMessages((prev) => {
        if (prev.some((m) => m.id === data.message.id)) return prev;
        if (data.message.senderId === user?.id) {
          return [...prev.filter((m) => !String(m.id).startsWith("optimistic-")), data.message];
        }
        return [...prev, data.message];
      });
    });

    const unsubTyping = on("user_typing", (data) => {
      if (data.conversationId === convId && data.userId !== user?.id) {
        setOtherTyping(true);
      }
    });

    const unsubStopTyping = on("user_stop_typing", (data) => {
      if (data.conversationId === convId) {
        setOtherTyping(false);
      }
    });

    const unsubDeleted = on("message_deleted", (data) => {
      if (data.conversationId !== convId) return;
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    });

    const unsubBulkDeleted = on("messages_deleted", (data) => {
      if (data.conversationId && data.conversationId !== convId) return;
      setMessages((prev) => prev.filter((m) => !data.messageIds.includes(m.id)));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        data.messageIds.forEach((id) => next.delete(id));
        return next;
      });
    });

    const unsubRejected = on("message_rejected", (data) => {
      if (data.conversationId !== convId) return;
      setMessages((prev) => {
        const lastIndex = [...prev]
          .reverse()
          .findIndex((m) => m.id.startsWith("optimistic-") && m.senderId === user?.id);
        if (lastIndex === -1) return prev;
        const copy = [...prev];
        copy.splice(copy.length - 1 - lastIndex, 1);
        return copy;
      });
      toast.error(data.error || "Votre message a été refusé");
    });

    return () => {
      if (connected) emit("leave_room", { room });
      unsubMessage();
      unsubTyping();
      unsubStopTyping();
      unsubDeleted();
      unsubBulkDeleted();
      unsubRejected();
    };
  }, [convId, connected, emit, on, user]);

  useEffect(() => {
    if (!connected || !remoteParticipant) return;

    const unsubOnline = on("user_online", ({ userId }) => {
      if (userId === remoteParticipant.id) setParticipantOnline(true);
    });

    const unsubOffline = on("user_offline", ({ userId }) => {
      if (userId === remoteParticipant.id) setParticipantOnline(false);
    });

    const unsubNotif = on("message_notification", ({ conversationId }) => {
      if (conversationId !== convId) {
        setUser((prev) => prev ? { ...prev, unreadMessages: prev.unreadMessages + 1 } : prev);
      }
    });

    return () => {
      unsubOnline();
      unsubOffline();
      unsubNotif();
    };
  }, [connected, on, remoteParticipant, convId, user, setUser]);

  useEffect(() => {
    if (convId) markAsRead(convId).catch(() => {});
  }, [convId, markAsRead]);

  const handleSend = useCallback(async (text, attachments) => {
    if (!convId) return;

    const trimmed = (text || "").trim();
    const images = attachments?.images || [];
    const files = attachments?.files || [];
    const hasMedia = images.length > 0 || files.length > 0;
    if (!trimmed && !hasMedia) return;

    const type = hasMedia ? "image" : "text";
    const metadata = hasMedia ? { images, files } : null;
    const displayText = trimmed || (images.length ? "📷 Photo" : "📎 Fichier");

    const optimisticMsg = {
      id: `optimistic-${Date.now()}`,
      senderId: user?.id,
      text: displayText,
      type,
      metadata,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    scrollToBottom();

    if (connected) {
      emit("send_message", { conversationId: convId, content: trimmed, type, metadata });
    } else {
      try {
        await sendMessage({ text: trimmed, type, metadata });
        qc.invalidateQueries({ queryKey: ["messages", convId] });
      } catch (err) {
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        toast.error(err?.response?.data?.error || "Votre message n'a pas pu être envoyé");
      }
    }
    qc.invalidateQueries({ queryKey: ["conversations"] });
  }, [convId, user, sendMessage, qc, scrollToBottom, connected, emit]);

  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const exitSelectionMode = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
    setDeleteScope(null);
  }, []);

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    const scope = deleteScope || "me";

    if (connected) {
      emit("bulk_delete_messages", { messageIds: ids, scope });
    } else {
      try {
        await conversationsApi.bulkDeleteMessages(convId, ids, scope);
        setMessages((prev) => prev.filter((m) => !ids.includes(m.id)));
      } catch {
        // silencieux
      }
    }
    exitSelectionMode();
  }, [selectedIds, deleteScope, connected, emit, convId, exitSelectionMode]);

  const handleDelete = useCallback(async (msgId, scope) => {
    if (connected) {
      emit("delete_message", { messageId: msgId, scope });
    } else {
      try {
        await conversationsApi.deleteMessage(convId, msgId, scope);
        setMessages((prev) => prev.filter((m) => m.id !== msgId));
      } catch {
        // silencieux
      }
    }
  }, [convId, connected, emit]);

  const handleTyping = useCallback((isTyping) => {
    if (!convId || !connected) return;
    if (isTyping) {
      emit("typing_start", { conversationId: convId });
    } else {
      emit("typing_stop", { conversationId: convId });
    }
  }, [convId, connected, emit]);

  if (!conversation) return null;

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar
            src={remoteParticipant?.avatar}
            name={remoteParticipant?.name}
            size="md"
            online={remoteParticipant?.online}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {remoteParticipant?.name}
              </span>
              {remoteParticipant?.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {participantOnline ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {selectionMode ? (
            <button
              onClick={exitSelectionMode}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <>
              <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
                <Phone className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectionMode(true)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {product && (
        <Link
          to={`/annonce/${product.id}`}
          className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-2.5 hover:bg-gray-100 transition-colors dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
        >
          <img
            src={product.image}
            alt={product.title}
            className="h-10 w-10 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {product.title}
            </p>
            <p className="text-sm font-bold text-red-800">
              {formatCFA(product.price)}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 shrink-0 text-gray-400" />
        </Link>
      )}

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-8">
              Aucun message. Écrivez un message pour commencer la conversation.
            </p>
          )}
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === user?.id}
              onDelete={(scope) => handleDelete(msg.id, scope)}
              selectionMode={selectionMode}
              selected={selectedIds.has(msg.id)}
              onSelect={selectionMode ? toggleSelect : undefined}
            />
          ))}

          {otherTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="rounded-2xl rounded-bl-md bg-gray-100 px-4 py-3 dark:bg-gray-800">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <AnimatePresence>
        {selectionMode && selectedIds.size > 0 && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-800"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {selectedIds.size} sélectionné{selectedIds.size > 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setDeleteScope("me"); setTimeout(handleBulkDelete, 50); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Trash2 className="h-4 w-4" />
                Pour moi
              </button>
              <button
                onClick={() => { setDeleteScope("everyone"); setTimeout(handleBulkDelete, 50); }}
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-4 w-4" />
                Pour tout le monde
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectionMode && <MessageInput onSend={handleSend} onTyping={handleTyping} disabled={isSending} />}
    </div>
  );
}