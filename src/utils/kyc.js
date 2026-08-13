import prisma from '../config/database.js';

export async function requireVerifiedSeller(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { identity_verified: true, role: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  if (user.role === 'admin') return;

  if (!user.identity_verified) {
    const error = new Error(
      'Votre compte doit être vérifié (KYC) avant de pouvoir vendre. Rendez-vous dans vos paramètres pour soumettre votre vérification.'
    );
    error.status = 403;
    throw error;
  }
}