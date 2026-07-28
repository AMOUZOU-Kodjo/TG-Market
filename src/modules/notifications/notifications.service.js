import prisma from '../../config/database.js';

function formatNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    title: notification.title,
    description: notification.description,
    productName: notification.product?.title ?? null,
    productId: notification.product_id,
    read: notification.read,
    createdAt: notification.created_at,
    metadata: notification.metadata,
  };
}

const productSelect = {
  select: { title: true },
};

export async function listNotifications(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { user_id: userId },
      include: { product: productSelect },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.notification.count({ where: { user_id: userId } }),
  ]);

  return {
    notifications: notifications.map(formatNotification),
    total,
  };
}

export async function getUnreadCount(userId) {
  return prisma.notification.count({
    where: { user_id: userId, read: false },
  });
}

export async function markAsRead(id, userId) {
  const notification = await prisma.notification.findFirst({
    where: { id, user_id: userId },
  });

  if (!notification) {
    const error = new Error('Notification introuvable');
    error.status = 404;
    throw error;
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { read: true },
    include: { product: productSelect },
  });

  return formatNotification(updated);
}

export async function markAllAsRead(userId) {
  await prisma.notification.updateMany({
    where: { user_id: userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(id, userId) {
  const notification = await prisma.notification.findFirst({
    where: { id, user_id: userId },
  });

  if (!notification) {
    const error = new Error('Notification introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.notification.delete({ where: { id } });
}

export async function createNotification({ userId, type, title, description, productId = null, metadata = null }) {
  const notification = await prisma.notification.create({
    data: {
      user_id: userId,
      type,
      title,
      description,
      product_id: productId,
      metadata,
    },
    include: { product: productSelect },
  });

  return formatNotification(notification);
}

export async function notifyUser(io, userId, { type, title, description, productId = null, metadata = null }) {
  const notification = await createNotification({ userId, type, title, description, productId, metadata });

  const { getUserSockets } = await import('../../sockets/socketHandler.js');
  getUserSockets(userId).forEach((sid) => {
    io.to(sid).emit('notification', notification);
  });

  return notification;
}
