import * as conversationsService from './conversations.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function listConversations(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { conversations, total } = await conversationsService.listConversations(req.user.id, {
      page,
      perPage,
    });

    res.json({
      data: conversations,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getConversationById(req, res, next) {
  try {
    const conversation = await conversationsService.getConversationById(
      Number(req.params.id),
      req.user.id,
    );
    res.json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function createConversation(req, res, next) {
  try {
    const { participantId, productId } = req.body;

    if (!participantId || isNaN(Number(participantId))) {
      return res.status(422).json({ error: 'participantId est requis et doit être un nombre' });
    }

    const conversation = await conversationsService.createConversation(
      req.user.id,
      Number(participantId),
      productId ? Number(productId) : undefined,
    );

    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const result = await conversationsService.markAsRead(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteConversation(req, res, next) {
  try {
    const result = await conversationsService.deleteConversation(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
