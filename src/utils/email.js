import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'TG-Market <noreply@tgmarket.tg>',
      to,
      subject,
      html,
    });
    console.log('[Email] Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('[Email] Error:', err.message);
    return { success: false, error: err.message };
  }
}

export function passwordResetEmail(otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #01796F;">TG-Market — Réinitialisation du mot de passe</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
        <p style="font-size: 14px; color: #666;">Votre code de vérification :</p>
        <p style="font-size: 32px; font-weight: bold; color: #01796F; letter-spacing: 8px;">${otp}</p>
      </div>
      <p style="color: #999; font-size: 12px;">Ce code expire dans 5 minutes. Ne partagez ce code avec personne.</p>
      <p style="color: #999; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>
  `;
}
