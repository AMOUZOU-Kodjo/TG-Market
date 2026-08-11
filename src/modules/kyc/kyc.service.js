import prisma from '../../config/database.js';
import redis from '../../config/redis.js';
import { generateOtp } from '../../utils/helpers.js';
import { sendEmail } from '../../utils/email.js';
import { grantBadge } from '../../utils/badges.js';

export async function getStatus(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      phone_verified_at: true,
      email_verified_at: true,
      identity_verified: true,
      is_professional: true,
      is_trusted: true,
    },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  const latestKyc = await prisma.kycVerification.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' },
    select: {
      document_type: true,
      status: true,
      submitted_at: true,
      reviewed_at: true,
      rejection_reason: true,
    },
  });

  return {
    phoneVerified: user.phone_verified_at !== null,
    emailVerified: user.email_verified_at !== null,
    identityVerified: user.identity_verified,
    professionalSeller: user.is_professional,
    trustedSeller: user.is_trusted,
    documentType: latestKyc?.document_type ?? null,
    documentStatus: latestKyc?.status ?? 'none',
    selfieStatus: latestKyc?.status ?? 'none',
    submittedAt: latestKyc?.submitted_at ?? null,
    verifiedAt: latestKyc?.reviewed_at ?? null,
    rejectionReason: latestKyc?.rejection_reason ?? null,
  };
}

export async function submitKyc(userId, data) {
  const existing = await prisma.kycVerification.findFirst({
    where: {
      user_id: userId,
      status: 'pending',
    },
    select: { id: true },
  });

  if (existing) {
    const error = new Error('Une demande de vérification est déjà en cours');
    error.status = 409;
    throw error;
  }

  const kyc = await prisma.kycVerification.create({
    data: {
      user_id: userId,
      document_type: data.documentType,
      document_front_url: data.documentFrontUrl,
      document_back_url: data.documentBackUrl ?? null,
      selfie_url: data.selfieUrl,
      status: 'pending',
      submitted_at: new Date(),
    },
  });

  return {
    id: kyc.id,
    status: kyc.status,
    submittedAt: kyc.submitted_at,
  };
}

export async function sendOtp(userId) {
  const otp = generateOtp();
  await redis.set(`otp:${userId}`, otp, 'EX', 300);

  return { message: 'Code OTP envoyé' };
}

export async function verifyOtp(userId, otp) {
  const storedOtp = await redis.get(`otp:${userId}`);

  if (!storedOtp || storedOtp !== otp) {
    const error = new Error('Code OTP invalide ou expiré');
    error.status = 400;
    throw error;
  }

  await redis.del(`otp:${userId}`);

  await prisma.user.update({
    where: { id: userId },
    data: { phone_verified_at: new Date() },
  });

  await grantBadge(userId, 'phone_verified');

  return { message: 'Téléphone vérifié avec succès' };
}

export async function getBadges(userId) {
  const badges = await prisma.userBadge.findMany({
    where: { user_id: userId },
    orderBy: { earned_at: 'desc' },
    select: {
      badge_key: true,
      earned_at: true,
    },
  });

  return badges.map((b) => ({
    key: b.badge_key,
    earnedAt: b.earned_at,
  }));
}

function emailOtpTemplate(otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #01796F;">TG-Market — Vérification de votre email</h2>
      <p>Vous avez demandé la vérification de votre adresse email.</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">Votre code de vérification :</p>
        <p style="font-size: 32px; font-weight: bold; color: #01796F; letter-spacing: 8px;">${otp}</p>
      </div>
      <p style="color: #999; font-size: 12px;">Ce code expire dans 5 minutes. Ne partagez ce code avec personne.</p>
      <p style="color: #999; font-size: 12px;">Si vous n'avez pas demandé cette vérification, ignorez cet email.</p>
    </div>
  `;
}

export async function sendEmailOtp(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true, email_verified_at: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  if (user.email_verified_at) {
    const error = new Error('Email déjà vérifié');
    error.status = 400;
    throw error;
  }

  const otp = generateOtp();
  await redis.set(`otp:email:${userId}`, otp, 'EX', 300);

  const result = await sendEmail({
    to: user.email,
    subject: 'TG-Market — Code de vérification',
    html: emailOtpTemplate(otp),
  });

  if (!result.success) {
    const error = new Error("Échec de l'envoi de l'email");
    error.status = 500;
    throw error;
  }

  return { message: 'Code de vérification envoyé par email' };
}

export async function verifyEmailOtp(userId, otp) {
  const storedOtp = await redis.get(`otp:email:${userId}`);

  if (!storedOtp || storedOtp !== otp) {
    const error = new Error('Code OTP invalide ou expiré');
    error.status = 400;
    throw error;
  }

  await redis.del(`otp:email:${userId}`);

  await prisma.user.update({
    where: { id: userId },
    data: { email_verified_at: new Date() },
  });

  await grantBadge(userId, 'email_verified');

  return { message: 'Email vérifié avec succès' };
}
