import { generateSecret as otplibGenerateSecret, verifySync, generateURI } from 'otplib';
import qrcode from 'qrcode';
import prisma from '../../config/database.js';

export async function generateSecret(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, two_factor_enabled: true, email: true },
  });

  if (user.two_factor_enabled) {
    const error = new Error('L\'authentification à deux facteurs est déjà activée');
    error.status = 400;
    throw error;
  }

  const secret = otplibGenerateSecret();
  const otpauth = generateURI({ issuer: 'TG-Market', label: user.email, secret });
  const qrCode = await qrcode.toDataURL(otpauth);

  await prisma.user.update({
    where: { id: userId },
    data: { two_factor_secret: secret },
  });

  return { secret, qrCode };
}

export async function enableTwoFactor(userId, token) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, two_factor_enabled: true, two_factor_secret: true },
  });

  if (user.two_factor_enabled) {
    const error = new Error('2FA déjà activée');
    error.status = 400;
    throw error;
  }

  if (!user.two_factor_secret) {
    const error = new Error('Générez d\'abord un secret');
    error.status = 400;
    throw error;
  }

  const isValid = verifySync({ token, secret: user.two_factor_secret });
  if (!isValid.valid) {
    const error = new Error('Code invalide');
    error.status = 400;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { two_factor_enabled: true },
  });

  return { message: '2FA activée avec succès' };
}

export async function disableTwoFactor(userId, password, req) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, password: true, two_factor_enabled: true },
  });

  if (!user.two_factor_enabled) {
    const error = new Error('2FA n\'est pas activée');
    error.status = 400;
    throw error;
  }

  const { default: bcrypt } = await import('bcryptjs');
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Mot de passe incorrect');
    error.status = 401;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { two_factor_enabled: false, two_factor_secret: null },
  });

  return { message: '2FA désactivée avec succès' };
}

export async function verifyTwoFactor(tempToken, token, req) {
  let decoded;
  try {
    const { default: jwt } = await import('jsonwebtoken');
    const { default: jwtConfig } = await import('../../config/jwt.js');
    decoded = jwt.verify(tempToken, jwtConfig.secret);
  } catch {
    const error = new Error('Session expirée');
    error.status = 401;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { id: true, two_factor_enabled: true, two_factor_secret: true },
  });

  if (!user || !user.two_factor_enabled) {
    const error = new Error('2FA non requise');
    error.status = 400;
    throw error;
  }

  const isValid = verifySync({ token, secret: user.two_factor_secret });
  if (!isValid.valid) {
    const error = new Error('Code 2FA invalide');
    error.status = 401;
    throw error;
  }

  const fullUser = await prisma.user.findUnique({ where: { id: user.id } });

  const { generateTokens, storeRefreshToken, getUnreadCounts, formatUser } = await import('./auth.service.js');
  const { accessToken, refreshToken } = generateTokens(fullUser);
  await storeRefreshToken(fullUser.id, refreshToken, req);

  const { unreadMessages, unreadNotifications } = await getUnreadCounts(fullUser.id);

  return {
    accessToken,
    refreshToken,
    user: formatUser(fullUser, unreadMessages, unreadNotifications),
  };
}

export async function getTwoFactorStatus(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { two_factor_enabled: true },
  });

  return { enabled: user.two_factor_enabled };
}
