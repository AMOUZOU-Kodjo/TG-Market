import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, LayoutDashboard } from "lucide-react";
import BackButton from "@/shared/ui/BackButton";
import { useConversations, useMessages, useDeleteConversation } from "@/features/chat/hooks/useConversations";
import ConversationPanel from "@/features/chat/components/ConversationPanel";
import ConversationItem from "@/features/chat/components/ConversationItem";

export default function ConversationPage() {
  const { conversationId } = useParams();
  const convId = Number(conversationId);
  const navigate = useNavigate();

  const { data: conversationsData = [], isLoading: conversationsLoading } = useConversations();
  const conversations = conversationsData?.data || conversationsData || [];
  const { mutate: deleteConversation } = useDeleteConversation();

  const { data: messagesData, isLoading: messagesLoading } = useMessages(convId, {});

  const selectedConversation = conversations.find((c) => c.id === convId);

  if (messagesLoading || conversationsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-800" />
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Conversation introuvable</p>
      </div>
    );
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-white dark:bg-gray-800">
      <div className="hidden sm:flex w-80 min-h-0 flex-col border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 border-b border-gray-200 px-3 py-3 dark:border-gray-700">
          <BackButton />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="px-4 py-8">
              <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                Aucune conversation
              </p>
            </div>
          ) : (
            <div className="px-2 space-y-0.5">
              {conversations.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conversation={conv}
                  isSelected={conv.id === convId}
                  onClick={() => navigate(`/messages/${conv.id}`)}
                  onDelete={() => deleteConversation(conv.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col min-h-0">
        <div className="flex items-center border-b border-gray-200 px-2 py-2 sm:hidden dark:border-gray-700">
          <Link
            to="/messages"
            className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
        </div>
        <ConversationPanel
          conversation={selectedConversation}
          messages={messagesData?.data || []}
        />
      </div>
    </div>
  );
}
