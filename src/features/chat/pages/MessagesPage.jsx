import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MessageSquare,
  ArrowLeft,
  X,
} from "lucide-react";
import ConversationItem from "@/features/chat/components/ConversationItem";
import ConversationPage from "@/features/chat/pages/ConversationPage";
import EmptyState from "@/shared/ui/EmptyState";
import { useConversations } from "@/features/chat/hooks/useConversations";
import { useAuth } from "@/shared/contexts/AuthContext";
import { cn } from "@/shared/utils/cn";

export default function MessagesPage() {
  const { user } = useAuth();
  const { data: conversationsData = [] } = useConversations();
  const conversations = conversationsData?.data || conversationsData || [];

  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);

  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const q = searchQuery.toLowerCase();
    return conversations.filter(
      (c) =>
        c.participant?.name?.toLowerCase().includes(q) ||
        c.lastMessage?.toLowerCase().includes(q) ||
        c.product?.title?.toLowerCase().includes(q)
    );
  }, [searchQuery, conversations]);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setShowMobileList(false);
  };

  const handleBack = () => {
    setShowMobileList(true);
    setSelectedId(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-900">
      {/* Conversation List Sidebar */}
      <div
        className={cn(
          "flex w-full flex-col border-r border-gray-100 dark:border-gray-800 sm:w-80 lg:w-96",
          showMobileList ? "flex" : "hidden sm:flex"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
          <button className="rounded-lg bg-brand-800 p-2 text-white shadow-sm shadow-brand-800/25 hover:bg-brand-900 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-800/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="px-4 py-8">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Aucune conversation trouvée.
              </p>
            </div>
          ) : (
            <div className="px-2 space-y-0.5">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation.id}
                  conversation={conversation}
                  isSelected={selectedId === conversation.id}
                  onClick={() => handleSelect(conversation.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Conversation Panel */}
      <div
        className={cn(
          "flex flex-1 flex-col",
          showMobileList ? "hidden sm:flex" : "flex"
        )}
      >
        {selectedConversation ? (
          <>
            {/* Mobile back button */}
            <div className="flex items-center border-b border-gray-100 px-2 py-2 sm:hidden dark:border-gray-800">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </button>
            </div>
            <ConversationPage
              conversation={selectedConversation}
              messages={selectedConversation?.messages || []}
            />
          </>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title="Sélectionnez une conversation"
            description="Choisissez une conversation dans la liste pour commencer à discuter."
          />
        )}
      </div>
    </div>
  );
}
