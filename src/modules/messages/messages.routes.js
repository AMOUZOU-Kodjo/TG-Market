import { Router } from 'express';
import { pagination } from '../../utils/pagination.js';
import * as messagesController from './messages.controller.js';

const router = Router({ mergeParams: true });

router.get('/', pagination, messagesController.getMessages);
router.post('/', messagesController.sendMessage);

export default router;
