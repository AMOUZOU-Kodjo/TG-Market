import prisma from '../../config/database.js';

function formatConversationList(participation, userId) {
  const conversation = participation.conversation;
  const otherParticipant = conversation.participants.find((p) => p.user_id !== userId);
  const lastMessage = conversation.messages[0] || null;
  const product = conversation.product;

  return {
    id: conversation.id,
    participant: otherParticipant
      ? {
          id: otherParticipant.user.id,
          name: `${otherParticipant.user.first_name} ${otherParticipant.user.last_name}`,
          avatar: otherParticipant.user.avatar,
          verified: otherParticipant.user.identity_verified,
        }
      : null,
    product: product
      ? {
          id: product.id,
          title: product.title,
          image: product.images[0]?.url || null,
          price: product.price,
        }
      : null,
    lastMessage: lastMessage?.text || null,
    lastMessageAt: lastMessage?.created_at || null,
    unreadCount: participation.unread_count,
  };
}

function formatConversationDetail(conversation) {
  return {
    id: conversation.id,
    participants: conversation.participants.map((p) => ({
      id: p.user.id,
      name: `${p.user.first_name} ${p.user.last_name}`,
      avatar: p.user.avatar,
      verified: p.user.identity_verified,
    })),
    product: conversation.product
      ? {
          id: conversation.product.id,
          title: conversation.product.title,
          images: conversation.product.images.map((i) => i.url),
          price: conversation.product.price,
        }
      : null,
    createdAt: conversation.created_at,
    updatedAt: conversation.updated_at,
  };
}

const conversationParticipantInclude = {
  user: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      avatar: true,
      identity_verified: true,
    },
  },
};

const conversationDetailInclude = {
  participants: { include: conversationParticipantInclude },
  product: {
    where: { status: { not: 'deleted' } },
    select: {
      id: true,
      title: true,
      price: true,
      images: {
        select: { url: true },
        orderBy: { sort_order: 'asc' },
      },
    },
  },
};

export async function listConversations(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const [participations, total] = await Promise.all([
    prisma.conversationParticipant.findMany({
      where: { user_id: userId, deleted_at: null },
      include: {
        conversation: {
          include: {
            participants: { include: conversationParticipantInclude },
            product: {
              where: { status: { not: 'deleted' } },
              select: {
                id: true,
                title: true,
                price: true,
                images: {
                  select: { url: true },
                  take: 1,
                  orderBy: { sort_order: 'asc' },
                },
              },
            },
            messages: {
              orderBy: { created_at: 'desc' },
              take: 1,
              select: { text: true, created_at: true },
            },
          },
        },
      },
      orderBy: { conversation: { updated_at: 'desc' } },
      skip,
      take: perPage,
    }),
    prisma.conversationParticipant.count({ where: { user_id: userId, deleted_at: null } }),
  ]);

  return {
    conversations: participations.map((p) => formatConversationList(p, userId)),
    total,
  };
}

export async function getConversationById(id, userId) {
  const conversation = await prisma.conversation.findUnique({
    where: { id },
    include: conversationDetailInclude,
  });

  if (!conversation) {
    const error = new Error('Conversation introuvable');
    error.status = 404;
    throw error;
  }

  const myParticipation = conversation.participants.find((p) => p.user_id === userId);
  if (!myParticipation) {
    const error = new Error('Non autorisé à accéder à cette conversation');
    error.status = 403;
    throw error;
  }

  return formatConversationDetail(conversation);
}

export async function createConversation(userId, participantId, productId = null) {
  if (participantId === userId) {
    const error = new Error('Vous ne pouvez pas créer une conversation avec vous-même');
    error.status = 400;
    throw error;
  }

  const participant = await prisma.user.findUnique({
    where: { id: participantId },
    select: { id: true },
  });

  if (!participant) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  let productData = null;
  if (productId) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        price: true,
        images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
      },
    });

    if (!product) {
      const error = new Error('Produit introuvable');
      error.status = 404;
      throw error;
    }

    productData = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0]?.url || null,
    };
  }

  const existing = await prisma.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { user_id: userId } } },
        { participants: { some: { user_id: participantId } } },
      ],
    },
    include: conversationDetailInclude,
    orderBy: { updated_at: 'desc' },
  });

  const insertedMessageSelect = { id: true, text: true, type: true, metadata: true, created_at: true, sender_id: true };

  async function insertProductMessage(convId) {
    if (!productData) return;
    await prisma.message.create({
      data: {
        conversation_id: convId,
        sender_id: participantId,
        text: productData.title,
        type: 'system',
        metadata: productData,
      },
    });
  }

  if (existing) {
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: { has_active_negotiation: true },
      });
      if (existing.product_id !== productId) {
        await prisma.conversation.update({
          where: { id: existing.id },
          data: { product_id: productId, updated_at: new Date() },
        });
        await insertProductMessage(existing.id);
      }
    }
    await prisma.conversationParticipant.updateMany({
      where: { conversation_id: existing.id, deleted_at: { not: null } },
      data: { deleted_at: null, last_cleared_at: null },
    });
    const updated = await prisma.conversation.findUnique({
      where: { id: existing.id },
      include: conversationDetailInclude,
    });
    return formatConversationDetail(updated);
  }

  const conversation = await prisma.conversation.create({
    data: {
      product_id: productId,
      participants: {
        create: [{ user_id: userId }, { user_id: participantId }],
      },
    },
    include: conversationDetailInclude,
  });

  if (productId) {
    await prisma.product.update({
      where: { id: productId },
      data: { has_active_negotiation: true },
    });
  }

  await insertProductMessage(conversation.id);

  return formatConversationDetail(conversation);
}

export async function markAsRead(conversationId, userId) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
  });

  if (!participant) {
    const error = new Error('Non autorisé');
    error.status = 403;
    throw error;
  }

  await prisma.conversationParticipant.update({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
    data: {
      last_read_at: new Date(),
      unread_count: 0,
    },
  });

  return { message: 'Conversation marquée comme lue' };
}

export async function deleteConversation(conversationId, userId) {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
    include: { conversation: { select: { product_id: true } } },
  });

  if (!participant) {
    const error = new Error('Non autorisé');
    error.status = 403;
    throw error;
  }

  await prisma.conversationParticipant.update({
    where: {
      conversation_id_user_id: {
        conversation_id: conversationId,
        user_id: userId,
      },
    },
    data: { deleted_at: new Date(), last_cleared_at: new Date() },
  });

  if (participant.conversation.product_id) {
    await prisma.product.update({
      where: { id: participant.conversation.product_id },
      data: { has_active_negotiation: false },
    });
  }

  return { message: 'Conversation supprimée' };
}
