import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as notificationsController from './notifications.controller.js';

const router = Router();

router.get('/', auth, pagination, notificationsController.listNotifications);
router.get('/unread-count', auth, notificationsController.getUnreadCount);
router.put('/read-all', auth, notificationsController.markAllAsRead);
router.put('/:id/read', auth, notificationsController.markAsRead);
router.delete('/:id', auth, notificationsController.deleteNotification);

export default router;
