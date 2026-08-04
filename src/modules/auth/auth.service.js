import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database.js';
import jwtConfig from '../../config/jwt.js';
import redis from '../../config/redis.js';
import { generateOtp } from '../../utils/helpers.js';
import { sendEmail, passwordResetEmail } from '../../utils/email.js';

export function formatUser(user, unreadMessages = 0, unreadNotifications = 0) {
  const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  return {
    id: user.id,
    name,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    city: user.city,
    bio: user.bio || null,
    role: user.role,
    avatar: user.avatar,
    verified: user.identity_verified,
    rating: user.rating_avg,
    reviewCount: user.review_count,
    productCount: user.product_count,
    followerCount: user.follower_count,
    followingCount: user.following_count,
    unreadMessages,
    unreadNotifications,
  };
}

export async function getUnreadCounts(userId) {
  const [unreadMessagesResult, unreadNotifications] = await Promise.all([
    prisma.conversationParticipant.aggregate({
      where: { user_id: userId },
      _sum: { unread_count: true },
    }),
    prisma.notification.count({
      where: { user_id: userId, read: false },
    }),
  ]);

  return {
    unreadMessages: unreadMessagesResult._sum.unread_count || 0,
    unreadNotifications,
  };
}

export function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    jwtConfig.secret,
    { expiresIn: jwtConfig.expiresIn },
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn },
  );

  return { accessToken, refreshToken };
}

export async function storeRefreshToken(userId, token, req) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const forwardedFor = req?.headers?.['x-forwarded-for'];
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : req?.ip || null;

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      token,
      user_agent: req?.headers?.['user-agent'] || null,
      ip_address: ip,
      expires_at: expiresAt,
    },
  });
}

export async function register(data, req) {
  const { firstName, lastName, email, phone, password, city, acceptedTerms } = data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { phone }] },
    select: { email: true, phone: true },
  });

  if (existing) {
    const field = existing.email === email ? 'email' : 'téléphone';
    const error = new Error(`Cet ${field} est déjà utilisé`);
    error.status = 409;
    throw error;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password: hashedPassword,
      city,
      accepted_terms_at: acceptedTerms ? new Date() : null,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user);
  await storeRefreshToken(user.id, refreshToken, req);

  return {
    accessToken,
    refreshToken,
    user: formatUser(user),
  };
}

export async function login(data, req) {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    const error = new Error('Email ou mot de passe incorrect');
    error.status = 401;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error('Compte désactivé');
    error.status = 403;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Email ou mot de passe incorrect');
    error.status = 401;
    throw error;
  }

  if (user.two_factor_enabled) {
    const tempToken = jwt.sign(
      { userId: user.id, purpose: '2fa' },
      jwtConfig.secret,
      { expiresIn: '5m' },
    );
    return { requiresTwoFactor: true, tempToken };
  }

  const { accessToken, refreshToken } = generateTokens(user);
  await storeRefreshToken(user.id, refreshToken, req);

  const { unreadMessages, unreadNotifications } = await getUnreadCounts(user.id);

  return {
    accessToken,
    refreshToken,
    user: formatUser(user, unreadMessages, unreadNotifications),
  };
}

export async function logout(userId) {
  await prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });

  return { message: 'Déconnexion réussie' };
}

export async function refresh(refreshTokenValue, req) {
  let decoded;
  try {
    decoded = jwt.verify(refreshTokenValue, jwtConfig.refreshSecret);
  } catch {
    const error = new Error('Token de rafraîchissement invalide ou expiré');
    error.status = 401;
    throw error;
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
    include: { user: true },
  });

  if (!storedToken) {
    const error = new Error('Token de rafraîchissement révoqué');
    error.status = 401;
    throw error;
  }

  await prisma.refreshToken.delete({
    where: { id: storedToken.id },
  });

  const user = storedToken.user;
  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
  await storeRefreshToken(user.id, newRefreshToken, req);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: formatUser(user),
  };
}

export async function getMe(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      city: true,
      district: true,
      avatar: true,
      bio: true,
      role: true,
      identity_verified: true,
      is_professional: true,
      is_trusted: true,
      rating_avg: true,
      review_count: true,
      product_count: true,
      follower_count: true,
      following_count: true,
      preferred_language: true,
      preferred_currency: true,
      notifications_email: true,
      notifications_push: true,
      notifications_sms: true,
      profile_visibility: true,
      show_phone: true,
      show_location: true,
      created_at: true,
    },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const { unreadMessages, unreadNotifications } = await getUnreadCounts(userId);

  return {
    ...formatUser(user, unreadMessages, unreadNotifications),
    district: user.district,
    bio: user.bio,
    preferredLanguage: user.preferred_language,
    preferredCurrency: user.preferred_currency,
    notificationsEmail: user.notifications_email,
    notificationsPush: user.notifications_push,
    notificationsSms: user.notifications_sms,
    profileVisibility: user.profile_visibility,
    showPhone: user.show_phone,
    showLocation: user.show_location,
    isProfessional: user.is_professional,
    isTrusted: user.is_trusted,
    createdAt: user.created_at,
  };
}

const profileFieldMap = {
  firstName: 'first_name',
  lastName: 'last_name',
  phone: 'phone',
  city: 'city',
  district: 'district',
  bio: 'bio',
  preferredLanguage: 'preferred_language',
  preferredCurrency: 'preferred_currency',
  notificationsEmail: 'notifications_email',
  notificationsPush: 'notifications_push',
  notificationsSms: 'notifications_sms',
  profileVisibility: 'profile_visibility',
  showPhone: 'show_phone',
  showLocation: 'show_location',
};

export async function updateProfile(userId, data) {
  if (data.phone) {
    const existing = await prisma.user.findFirst({
      where: {
        phone: data.phone,
        id: { not: userId },
      },
      select: { id: true },
    });

    if (existing) {
      const error = new Error('Ce numéro de téléphone est déjà utilisé');
      error.status = 409;
      throw error;
    }
  }

  const updateData = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && profileFieldMap[key]) {
      updateData[profileFieldMap[key]] = value;
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error('Aucune donnée à mettre à jour');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return formatUser(user);
}

export async function changePassword(userId, data, req) {
  const { currentPassword, newPassword } = data;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const error = new Error('Mot de passe actuel incorrect');
    error.status = 401;
    throw error;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  await prisma.refreshToken.deleteMany({
    where: { user_id: userId },
  });

  const fullUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  const { accessToken, refreshToken } = generateTokens(fullUser);
  await storeRefreshToken(userId, refreshToken, req);

  return {
    message: 'Mot de passe modifié avec succès',
    accessToken,
    refreshToken,
  };
}

export async function forgotPassword(email) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, is_active: true },
  });

  if (!user) {
    const error = new Error('Aucun compte associé à cet email');
    error.status = 404;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error('Compte désactivé');
    error.status = 403;
    throw error;
  }

  const otp = generateOtp();
  await redis.set(`otp:${user.id}`, otp, 'EX', 300);

  const emailResult = await sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe - TG-Market',
    html: passwordResetEmail(otp),
  });

  if (!emailResult.success) {
    console.error('[ForgotPassword] Failed to send email:', emailResult.error);
    await redis.del(`otp:${user.id}`);
    const error = new Error("L'email n'a pas pu être envoyé, réessayez dans un instant");
    error.status = 502;
    throw error;
  }

  return { message: 'Code de réinitialisation envoyé' };
}

export async function resetPassword(data) {
  const { email, otp, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, is_active: true },
  });

  if (!user) {
    const error = new Error('Aucun compte associé à cet email');
    error.status = 404;
    throw error;
  }

  if (!user.is_active) {
    const error = new Error('Compte désactivé');
    error.status = 403;
    throw error;
  }

  const storedOtp = await redis.get(`otp:${user.id}`);

  if (!storedOtp || storedOtp !== otp) {
    const error = new Error('Code OTP invalide ou expiré');
    error.status = 400;
    throw error;
  }

  await redis.del(`otp:${user.id}`);

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  await prisma.refreshToken.deleteMany({
    where: { user_id: user.id },
  });

  return { message: 'Mot de passe réinitialisé avec succès' };
}

export async function getSessions(userId) {
  const tokens = await prisma.refreshToken.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 20,
  });

  const now = Date.now();
  const sessions = tokens.map((t, i) => ({
    id: t.id,
    device: t.user_agent || 'Appareil inconnu',
    ip: t.ip_address || 'Inconnu',
    location: 'Togo',
    lastActive: i === 0 ? 'Maintenant' : formatDistance(t.created_at, now),
    isCurrent: i === 0,
  }));

  return sessions;
}

function formatDistance(date, now) {
  const diff = now - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Maintenant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days} j`;
}

export async function revokeOtherSessions(userId) {
  const tokens = await prisma.refreshToken.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 1,
  });

  if (tokens.length === 0) {
    return { message: 'Aucune session à révoquer' };
  }

  const currentTokenId = tokens[0].id;

  await prisma.refreshToken.deleteMany({
    where: {
      user_id: userId,
      id: { not: currentTokenId },
    },
  });

  return { message: 'Autres sessions déconnectées avec succès' };
}

export async function deleteAccount(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  if (user.role === 'admin') {
    const error = new Error('Impossible de supprimer un compte administrateur');
    error.status = 403;
    throw error;
  }

  await prisma.refreshToken.deleteMany({ where: { user_id: userId } });
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'Compte supprimé avec succès' };
}

export async function getLoginHistory(userId) {
  const tokens = await prisma.refreshToken.findMany({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    take: 50,
    select: {
      id: true,
      user_agent: true,
      ip_address: true,
      created_at: true,
    },
  });

  return tokens.map((t) => ({
    id: t.id,
    date: t.created_at.toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    location: 'Togo',
    device: t.user_agent || 'Appareil inconnu',
    success: true,
  }));
}
