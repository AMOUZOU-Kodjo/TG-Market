import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { conversationsApi } from "../services/conversations.api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: conversationsApi.list,
  });
}

export function useConversation(id) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => conversationsApi.getById(id),
    enabled: !!id,
  });
}

export function useMessages(conversationId, params) {
  return useQuery({
    queryKey: ["messages", conversationId, params],
    queryFn: () => conversationsApi.getMessages(conversationId, params),
    enabled: !!conversationId,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: conversationsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useSendMessage(conversationId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => conversationsApi.sendMessage(conversationId, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", conversationId] }),
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: conversationsApi.markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}

export function useDeleteConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: conversationsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["conversations"] }),
  });
}
