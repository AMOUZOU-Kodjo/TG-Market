import prisma from '../../config/database.js';

function formatMessage(message, otherLastReadAt = null) {
  const isDeleted = !!message.deleted_at;
  return {
    id: message.id,
    senderId: message.sender?.id ?? null,
    senderName: message.sender ? `${message.sender.first_name} ${message.sender.last_name}` : null,
    senderAvatar: message.sender?.avatar ?? null,
    text: isDeleted ? null : message.text,
    type: isDeleted ? 'deleted' : message.type,
    metadata: message.metadata,
    createdAt: message.created_at,
    read: otherLastReadAt ? new Date(message.created_at) <= new Date(otherLastReadAt) : false,
    deleted: isDeleted,
  };
}

const senderInclude = {
  sender: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      avatar: true,
    },
  },
};

export async function getMessages(conversationId, userId, { page, perPage }) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });

  if (!participant) {
    const error = new Error('Non autorisé à accéder à cette conversation');
    error.status = 403;
    throw error;
  }

  const skip = (page - 1) * perPage;

  const otherParticipant = await prisma.conversationParticipant.findFirst({
    where: { conversation_id: conversationId, user_id: { not: userId } },
    select: { last_read_at: true },
  });

  const clearFilter = participant.last_cleared_at
    ? { created_at: { gte: participant.last_cleared_at } }
    : {};

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: {
        conversation_id: conversationId,
        deleted_at: null,
        NOT: { deleted_by_ids: { has: userId } },
        ...clearFilter,
      },
      include: senderInclude,
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.message.count({
      where: {
        conversation_id: conversationId,
        deleted_at: null,
        NOT: { deleted_by_ids: { has: userId } },
        ...clearFilter,
      },
    }),
  ]);

  return {
    messages: messages.map((m) => formatMessage(m, otherParticipant?.last_read_at || null)),
    total,
  };
}

export async function sendMessage(conversationId, senderId, text, type = 'text', metadata = null) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: senderId,
      },
    },
  });

  if (!participant) {
    const error = new Error('Non autorisé à envoyer des messages dans cette conversation');
    error.status = 403;
    throw error;
  }

  const [createdMessage] = await prisma.$transaction([
    prisma.message.create({
      data: {
        conversation_id: conversationId,
        sender_id: senderId,
        text,
        type,
        metadata: metadata || undefined,
      },
      include: senderInclude,
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { updated_at: new Date() },
    }),
    prisma.conversationParticipant.updateMany({
      where: {
        conversation_id: conversationId,
        user_id: { not: senderId },
      },
      data: {
        unread_count: { increment: 1 },
        deleted_at: null,
      },
    }),
  ]);

  return formatMessage(createdMessage);
}

export async function deleteForSelf(messageId, userId) {
  const message = await prisma.message.findUnique({ where: { id: messageId }, select: { id: true, deleted_by_ids: true } });
  if (!message) {
    const error = new Error('Message introuvable');
    error.status = 404;
    throw error;
  }

  if (message.deleted_by_ids.includes(userId)) return { id: messageId, deleted: true };

  await prisma.message.update({
    where: { id: messageId },
    data: { deleted_by_ids: { push: userId } },
  });

  return { id: messageId, deleted: true };
}

export async function deleteForEveryone(messageId, userId) {
  const message = await prisma.message.findUnique({
    where: { id: messageId },
    select: { id: true, sender_id: true, conversation_id: true },
  });

  if (!message) {
    const error = new Error('Message introuvable');
    error.status = 404;
    throw error;
  }

  if (message.sender_id !== userId) {
    const error = new Error('Vous ne pouvez supprimer que vos propres messages');
    error.status = 403;
    throw error;
  }

  await prisma.message.update({
    where: { id: messageId },
    data: { deleted_at: new Date() },
  });

  return { id: messageId, deleted: true, conversationId: message.conversation_id };
}

export async function bulkDeleteForSelf(messageIds, userId) {
  const messages = await prisma.message.findMany({
    where: { id: { in: messageIds } },
    select: { id: true, deleted_by_ids: true },
  });

  const toUpdate = messages.filter((m) => !m.deleted_by_ids.includes(userId)).map((m) => m.id);
  if (toUpdate.length === 0) return { deletedIds: messageIds };

  await prisma.message.updateMany({
    where: { id: { in: toUpdate } },
    data: { deleted_by_ids: { push: userId } },
  });

  return { deletedIds: messageIds };
}

export async function bulkDeleteForEveryone(messageIds, userId) {
  const messages = await prisma.message.findMany({
    where: { id: { in: messageIds } },
    select: { id: true, sender_id: true, conversation_id: true },
  });

  const ownIds = messages.filter((m) => m.sender_id === userId).map((m) => m.id);
  if (ownIds.length === 0) return { deletedIds: [], conversationIds: [] };

  await prisma.message.updateMany({
    where: { id: { in: ownIds } },
    data: { deleted_at: new Date() },
  });

  const convIds = [...new Set(messages.filter((m) => ownIds.includes(m.id)).map((m) => m.conversation_id))];

  return { deletedIds: ownIds, conversationIds: convIds };
}
