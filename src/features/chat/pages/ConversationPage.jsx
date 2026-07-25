import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  MoreVertical,
  Phone,
  ExternalLink,
} from "lucide-react";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import MessageBubble from "@/features/chat/components/MessageBubble";
import MessageInput from "@/features/chat/components/MessageInput";
import { mockCurrentUser } from "@/data/users";
import { formatCFA } from "@/shared/utils/format";

export default function ConversationPage({ conversation, messages: initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      senderId: mockCurrentUser.id,
      text,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, newMessage]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          senderId: conversation.participant?.id,
          text: "Merci pour votre message, je vous réponds rapidement !",
          createdAt: new Date().toISOString(),
          read: true,
        },
      ]);
    }, 2000);
  };

  const participant = conversation.participant;
  const product = conversation.product;

  return (
    <div className="flex flex-1 flex-col">
      {/* Conversation Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Avatar
            src={participant?.avatar}
            name={participant?.name}
            size="md"
            online={participant?.online}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {participant?.name}
              </span>
              {participant?.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-red-700" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {participant?.online ? "En ligne" : "Hors ligne"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <Phone className="h-4 w-4" />
          </button>
          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Product Card Header */}
      {product && (
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/50 px-4 py-2.5 dark:border-gray-800 dark:bg-gray-800/50">
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
          <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800">
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-3">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.senderId === mockCurrentUser.id}
            />
          ))}

          {isTyping && (
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

      {/* Message Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
}
