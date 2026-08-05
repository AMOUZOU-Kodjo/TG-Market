import nodemailer from 'nodemailer';
import prisma from '../config/database.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://ak-market.pages.dev';

async function getBranding() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: 'site_name' },
    select: { value: true },
  });
  const siteName = setting?.value || 'TG-Market';
  const logoUrl = `${FRONTEND_URL}/logo-tg.png`;
  return { siteName, logoUrl };
}

function brandHeader({ siteName, logoUrl }) {
  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #f0f0f0;">
      <img src="${logoUrl}" alt="${siteName}" style="width:44px;height:44px;object-fit:contain;border-radius:10px;" />
      <span style="font-size:20px;font-weight:bold;color:#01796F;">${siteName}</span>
    </div>
  `;
}

function brandFooter({ siteName }) {
  return `
    <div style="margin-top:28px;padding-top:16px;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} ${siteName} — Tous droits réservés</p>
      <p style="color:#bbb;font-size:11px;margin:4px 0 0;">${FRONTEND_URL}</p>
    </div>
  `;
}

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await Promise.race([
      transporter.sendMail({
        from: process.env.SMTP_FROM || 'TG-Market <noreply@tgmarket.tg>',
        to,
        subject,
        html,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('SMTP timeout après 12s')), 12000)
      ),
    ]);
    console.log('[Email] Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email] Error:', err.message);
    return { success: false, error: err.message };
  }
}

export async function passwordResetEmail(otp) {
  const { siteName, logoUrl } = await getBranding();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${brandHeader({ siteName, logoUrl })}
      <h2 style="color: #01796F;">Réinitialisation du mot de passe</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe sur ${siteName}.</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">Votre code de vérification :</p>
        <p style="font-size: 32px; font-weight: bold; color: #01796F; letter-spacing: 8px;">${otp}</p>
      </div>
      <p style="color: #999; font-size: 12px;">Ce code expire dans 5 minutes. Ne partagez ce code avec personne.</p>
      <p style="color: #999; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      ${brandFooter({ siteName })}
    </div>
  `;
}

export async function verificationEmail(firstName, link) {
  const { siteName, logoUrl } = await getBranding();
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      ${brandHeader({ siteName, logoUrl })}
      <h2 style="color: #01796F;">Confirmez votre email</h2>
      <p>Bonjour ${firstName},</p>
      <p>Merci de vous être inscrit sur ${siteName} ! Cliquez sur le bouton ci-dessous pour confirmer votre adresse email et activer votre compte.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background: #01796F; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: bold; display: inline-block;">
          Confirmer mon email
        </a>
      </div>
      <p style="color: #999; font-size: 12px;">Ce lien expire dans 24 heures.</p>
      <p style="color: #999; font-size: 12px;">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
      <p style="color: #01796F; font-size: 12px; word-break: break-all;">${link}</p>
      <p style="color: #999; font-size: 12px;">Si vous n'avez pas créé de compte sur ${siteName}, ignorez cet email.</p>
      ${brandFooter({ siteName })}
    </div>
  `;
}
