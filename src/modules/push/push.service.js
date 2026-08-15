import webpush from 'web-push';
import prisma from '../../config/database.js';

const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const subject = process.env.VAPID_SUBJECT || 'mailto:support@akmarket.tg';

export const pushEnabled = Boolean(publicKey && privateKey);

if (pushEnabled) {
  webpush.setVapidDetails(subject, publicKey, privateKey);
} else {
  console.warn('[push] VAPID keys manquantes — notifications push désactivées');
}

export async function subscribePush(userId, subscription, userAgent = null) {
  const { endpoint, keys } = subscription ?? {};
  const p256dh = keys?.p256dh ?? '';
  const auth = keys?.auth ?? '';
  if (!endpoint || !p256dh || !auth) {
    const error = new Error('Abonnement push invalide');
    error.status = 422;
    throw error;
  }

  return prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { user_id: userId, p256dh, auth, user_agent: userAgent },
    create: { user_id: userId, endpoint, p256dh, auth, user_agent: userAgent },
  });
}

export async function unsubscribePush(userId, endpoint) {
  if (!endpoint) return 0;
  const result = await prisma.pushSubscription.deleteMany({ where: { user_id: userId, endpoint } });
  return result.count;
}

export async function sendPush(userId, payload) {
  if (!pushEnabled || !userId) return;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { user_id: userId, user: { notifications_push: true } },
  });
  if (subscriptions.length === 0) return;

  const body = JSON.stringify(payload);

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          body,
        );
      } catch (err) {
        if (err.statusCode >= 400 && err.statusCode < 500) {
          await prisma.pushSubscription.deleteMany({ where: { id: sub.id } });
        }
      }
    }),
  );
}