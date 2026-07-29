import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import prisma from '../../config/database.js';
import jwtConfig from '../../config/jwt.js';
import { generateTokens, storeRefreshToken, formatUser, getUnreadCounts } from './auth.service.js';

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL || 'postmessage'
);

function generatePassword() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 24; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function googleLogin(authCode, req) {
  const { tokens } = await googleClient.getToken(authCode);
  googleClient.setCredentials(tokens);

  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const googleId = payload.sub;
  const email = payload.email;
  const firstName = payload.given_name || '';
  const lastName = payload.family_name || '';
  const avatar = payload.picture || null;

  let user = await prisma.user.findUnique({ where: { google_id: googleId } });

  if (!user) {
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      await prisma.user.update({
        where: { id: existingEmail.id },
        data: { google_id: googleId, avatar: avatar || existingEmail.avatar },
      });
      user = await prisma.user.findUnique({ where: { id: existingEmail.id } });
    } else {
      const hashedPassword = bcrypt.hashSync(generatePassword(), 12);
      const basePhone = `+228${String(Math.floor(10000000 + Math.random() * 90000000))}`;
      let phone = basePhone;
      let phoneExists = await prisma.user.findUnique({ where: { phone } });
      while (phoneExists) {
        phone = `+228${String(Math.floor(10000000 + Math.random() * 90000000))}`;
        phoneExists = await prisma.user.findUnique({ where: { phone } });
      }
      user = await prisma.user.create({
        data: {
          first_name: firstName || email.split('@')[0],
          last_name: lastName || 'Utilisateur',
          email,
          phone,
          password: hashedPassword,
          city: 'Lomé',
          google_id: googleId,
          avatar,
          email_verified_at: new Date(),
        },
      });
    }
  }

  if (!user.is_active) {
    const error = new Error('Compte désactivé');
    error.status = 403;
    throw error;
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
