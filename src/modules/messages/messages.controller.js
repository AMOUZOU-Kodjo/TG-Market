import * as messagesService from './messages.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { getUserSockets } from '../../sockets/socketHandler.js';
import prisma from '../../config/database.js';

const VALID_MESSAGE_TYPES = ['text', 'image', 'offer', 'system'];

export async function getMessages(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const conversationId = Number(req.params.id);
    const { messages, total } = await messagesService.getMessages(conversationId, req.user.id, {
      page,
      perPage,
    });

    res.json({
      data: messages,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { text, type, metadata } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(422).json({ error: 'Le message texte est requis' });
    }

    if (type && !VALID_MESSAGE_TYPES.includes(type)) {
      return res.status(422).json({ error: 'Type de message invalide' });
    }

    const conversationId = Number(req.params.id);
    const message = await messagesService.sendMessage(
      conversationId,
      req.user.id,
      text.trim(),
      type,
      metadata,
    );

    const io = req.app.get('io');
    if (io) {
      io.to(`conversation:${conversationId}`).emit('new_message', {
        conversationId,
        message,
      });

      const other = await prisma.conversationParticipant.findFirst({
        where: { conversation_id: conversationId, user_id: { not: req.user.id } },
        select: { user_id: true, conversation: { select: { product_id: true } } },
      });
      if (other) {
        getUserSockets(other.user_id).forEach((sid) => {
          io.to(sid).emit('message_notification', { conversationId });
        });

        await prisma.notification.create({
          data: {
            user_id: other.user_id,
            type: 'message',
            title: `Nouveau message de ${req.user.first_name || req.user.name}`,
            description: text.trim().substring(0, 120),
            product_id: other.conversation?.product_id || null,
            metadata: { conversationId },
          },
        });

        getUserSockets(other.user_id).forEach((sid) => {
          io.to(sid).emit('notification', {
            id: Date.now(),
            type: 'message',
            title: `Nouveau message de ${req.user.first_name || req.user.name}`,
            description: text.trim().substring(0, 120),
            productId: other.conversation?.product_id || null,
            read: false,
            createdAt: new Date().toISOString(),
            metadata: { conversationId },
          });
        });
      }
    }

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const messageId = Number(req.params.messageId);
    const scope = req.query.scope || 'me';

    if (scope === 'everyone') {
      const result = await messagesService.deleteForEveryone(messageId, req.user.id);
      const io = req.app.get('io');
      if (io) {
        io.to(`conversation:${result.conversationId}`).emit('message_deleted', {
          conversationId: result.conversationId,
          messageId: result.id,
          deleted: true,
        });
      }
      return res.json(result);
    }

    const result = await messagesService.deleteForSelf(messageId, req.user.id);
    const io = req.app.get('io');
    if (io) {
      const message = await prisma.message.findUnique({ where: { id: messageId }, select: { conversation_id: true, sender_id: true } });
      if (message) {
        getUserSockets(req.user.id).forEach((sid) => {
          io.to(sid).emit('message_deleted', {
            conversationId: message.conversation_id,
            messageId: result.id,
            deleted: true,
          });
        });
      }
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function bulkDeleteMessages(req, res, next) {
  try {
    const { messageIds, scope } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(422).json({ error: 'La liste des messages est requise' });
    }

    const ids = messageIds.map(Number);

    if (scope === 'everyone') {
      const result = await messagesService.bulkDeleteForEveryone(ids, req.user.id);
      const io = req.app.get('io');
      if (io && result.conversationIds?.length) {
        result.conversationIds.forEach((convId) => {
          io.to(`conversation:${convId}`).emit('messages_deleted', {
            conversationId: convId,
            messageIds: result.deletedIds,
          });
        });
      }
      return res.json(result);
    }

    const result = await messagesService.bulkDeleteForSelf(ids, req.user.id);
    const io = req.app.get('io');
    if (io) {
      getUserSockets(req.user.id).forEach((sid) => {
        io.to(sid).emit('messages_deleted', {
          messageIds: result.deletedIds,
        });
      });
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
}
