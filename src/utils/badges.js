import prisma from '../config/database.js';

export async function grantBadge(userId, badgeKey) {
  try {
    await prisma.userBadge.upsert({
      where: { user_id_badge_key: { user_id: userId, badge_key: badgeKey } },
      update: {},
      create: { user_id: userId, badge_key: badgeKey },
    });
    return true;
  } catch (err) {
    console.error(`[badges] Échec d'attribution du badge ${badgeKey} (user ${userId}) :`, err.message);
    return false;
  }
}
