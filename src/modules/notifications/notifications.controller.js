import * as notificationsService from './notifications.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function listNotifications(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { notifications, total } = await notificationsService.listNotifications(req.user.id, {
      page,
      perPage,
    });

    res.json({
      data: notifications,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const count = await notificationsService.getUnreadCount(req.user.id);
    res.json({ count });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const id = Number(req.params.id);
    const notification = await notificationsService.markAsRead(id, req.user.id);
    res.json(notification);
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await notificationsService.markAllAsRead(req.user.id);
    res.json({ message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    const id = Number(req.params.id);
    await notificationsService.deleteNotification(id, req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function deleteAllNotifications(req, res, next) {
  try {
    await notificationsService.deleteAllNotifications(req.user.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}
