import { useState } from "react";
import { Mail, MessageSquare, Send, Check, ChevronLeft, ChevronRight, Loader2, Reply, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/services/api";
import toast from "react-hot-toast";

export default function AdminContactMessagesPage() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["adminContactMessages", page],
    queryFn: () => api.get(`/admin/contact-messages?page=${page}&perPage=20`).then((r) => r.data),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const markRead = useMutation({
    mutationFn: (id) => api.put(`/admin/contact-messages/${id}/read`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adminContactMessages"] });
    },
  });

  const sendReply = useMutation({
    mutationFn: ({ id, reply }) => api.post(`/admin/contact-messages/${id}/reply`, { reply }),
    onSuccess: () => {
      toast.success("Réponse envoyée");
      setReplyText("");
      setSelected(null);
      qc.invalidateQueries({ queryKey: ["adminContactMessages"] });
    },
    onError: (e) => toast.error(e.response?.data?.error ?? "Erreur d'envoi"),
  });

  const openMessage = (msg) => {
    setSelected(msg);
    setReplyText("");
    if (!msg.read) markRead.mutate(msg.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  const messages = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Messages reçus</h1>
        <span className="text-sm text-gray-400">{meta?.total ?? 0} message(s)</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* List */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Mail className="w-12 h-12 mb-3" />
              <p className="text-sm">Aucun message</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selected?.id === msg.id ? "bg-brand-50" : ""
                  } ${!msg.read ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className={`text-sm truncate ${!msg.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                        {msg.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{msg.subject || "(Sans objet)"}</p>
                    </div>
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-600 shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs text-gray-500">{page} / {meta.totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={page >= meta.totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="xl:col-span-2">
          {!selected ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p className="text-sm">Sélectionnez un message pour voir son contenu</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selected.subject || "(Sans objet)"}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {selected.name} &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(selected.created_at).toLocaleString("fr-FR", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${selected.email}`}
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
                    title="Ouvrir dans le client email"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {selected.read && (
                    <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                      <Check className="w-3 h-3" /> Lu
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Reply className="w-4 h-4 inline mr-1" />
                  Répondre
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                  placeholder="Écrivez votre réponse..."
                  className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none"
                />
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => sendReply.mutate({ id: selected.id, reply: replyText })}
                    disabled={!replyText.trim() || sendReply.isPending}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-xl hover:bg-brand-600 disabled:opacity-50 transition-colors"
                  >
                    {sendReply.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
