import prisma from '../../config/database.js';

function formatMessage(message) {
  return {
    id: message.id,
    senderId: message.sender.id,
    senderName: `${message.sender.first_name} ${message.sender.last_name}`,
    senderAvatar: message.sender.avatar,
    text: message.text,
    type: message.type,
    createdAt: message.created_at,
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

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversation_id: conversationId },
      include: senderInclude,
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.message.count({ where: { conversation_id: conversationId } }),
  ]);

  return {
    messages: messages.map(formatMessage),
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
      },
    }),
  ]);

  return formatMessage(createdMessage);
}
