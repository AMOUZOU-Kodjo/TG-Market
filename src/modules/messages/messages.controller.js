import * as messagesService from './messages.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

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

    res.status(201).json(message);
  } catch (err) {
    next(err);
  }
}
