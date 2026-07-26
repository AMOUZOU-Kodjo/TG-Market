import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import prisma from '../config/database.js';

const onlineUsers = new Map();

export function setupSocketIO(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error'));

      const decoded = jwt.verify(token, jwtConfig.secret);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, first_name: true, last_name: true, avatar: true, identity_verified: true },
      });

      if (!user || !user.is_active) return next(new Error('Authentication error'));

      socket.user = {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        avatar: user.avatar,
        verified: user.identity_verified,
      };
      next();
    } catch {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.user.id;
    console.log(`Socket connected: user ${userId}`);

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    socket.broadcast.emit('user_online', { userId });

    socket.on('join_room', ({ room }) => {
      socket.join(room);
    });

    socket.on('leave_room', ({ room }) => {
      socket.leave(room);
    });

    socket.on('send_message', async ({ conversationId, content }) => {
      try {
        const participant = await prisma.conversationParticipant.findUnique({
          where: { conversation_id_user_id: { conversation_id: conversationId, user_id: userId } },
        });
        if (!participant) return;

        const message = await prisma.message.create({
          data: { conversation_id: conversationId, sender_id: userId, text: content, type: 'text' },
          include: { sender: { select: { id: true, first_name: true, last_name: true, avatar: true } } },
        });

        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updated_at: new Date() },
        });

        await prisma.conversationParticipant.updateMany({
          where: { conversation_id: conversationId, user_id: { not: userId } },
          data: { unread_count: { increment: 1 } },
        });

        const formattedMessage = {
          id: message.id,
          senderId: message.sender.id,
          senderName: `${message.sender.first_name} ${message.sender.last_name}`,
          senderAvatar: message.sender.avatar,
          text: message.text,
          type: message.type,
          createdAt: message.created_at,
        };

        io.to(`conversation:${conversationId}`).emit('new_message', {
          conversationId,
          message: formattedMessage,
        });
      } catch (err) {
        console.error('Error sending message:', err.message);
      }
    });

    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', {
        conversationId,
        userId,
      });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stop_typing', {
        conversationId,
        userId,
      });
    });

    socket.on('notification_read', async ({ notificationId }) => {
      try {
        await prisma.notification.updateMany({
          where: { id: notificationId, user_id: userId },
          data: { read: true },
        });
      } catch {}
    });

    socket.on('notifications_read_all', async () => {
      try {
        await prisma.notification.updateMany({
          where: { user_id: userId, read: false },
          data: { read: true },
        });
      } catch {}
    });

    socket.on('disconnect', () => {
      onlineUsers.get(userId)?.delete(socket.id);
      if (onlineUsers.get(userId)?.size === 0) {
        onlineUsers.delete(userId);
        io.emit('user_offline', { userId });
      }
      console.log(`Socket disconnected: user ${userId}`);
    });
  });
}

export function isUserOnline(userId) {
  return onlineUsers.has(userId);
}

export function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}
