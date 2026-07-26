import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as conversationsController from './conversations.controller.js';
import messagesRouter from '../messages/messages.routes.js';

const router = Router();

router.get('/', auth, pagination, conversationsController.listConversations);
router.post('/', auth, conversationsController.createConversation);
router.get('/:id', auth, conversationsController.getConversationById);
router.put('/:id/read', auth, conversationsController.markAsRead);
router.delete('/:id', auth, conversationsController.deleteConversation);

router.use('/:id/messages', auth, messagesRouter);

export default router;
