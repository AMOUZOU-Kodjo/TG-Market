import { z } from 'zod';

const phoneRegex = /^\+?228[279]\d{7}$/;

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre');

export const registerSchema = z.object({
  body: z.object({
    firstName: z.string().min(1, 'Prénom requis').max(50),
    lastName: z.string().min(1, 'Nom requis').max(50),
    email: z.string().email('Email invalide'),
    phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide'),
    password: passwordSchema,
    city: z.string().min(1, 'Ville requise').max(100),
    acceptedTerms: z.literal(true, {
      message: 'Vous devez accepter les conditions d\'utilisation',
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    password: z.string().min(1, 'Mot de passe requis'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Email invalide'),
    otp: z.string().length(6, 'Le code OTP doit contenir 6 chiffres'),
    password: passwordSchema,
  }),
});

export const updateProfileSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide').optional(),
      city: z.string().min(1).max(100).optional(),
      district: z.string().max(100).optional(),
      bio: z.string().max(200).optional(),
      preferredLanguage: z.enum(['fr', 'ee', 'en']).optional(),
      preferredCurrency: z.enum(['FCFA', 'EUR', 'USD']).optional(),
      notificationsEmail: z.boolean().optional(),
      notificationsPush: z.boolean().optional(),
      notificationsSms: z.boolean().optional(),
      profileVisibility: z.enum(['public', 'contacts', 'private']).optional(),
      showPhone: z.boolean().optional(),
      showLocation: z.boolean().optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Au moins un champ doit être fourni',
    }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Mot de passe actuel requis'),
    newPassword: passwordSchema,
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Token de rafraîchissement requis'),
  }),
});

export const enableTwoFactorSchema = z.object({
  body: z.object({
    token: z.string().length(6, 'Le code doit contenir 6 chiffres'),
  }),
});

export const disableTwoFactorSchema = z.object({
  body: z.object({
    password: z.string().min(1, 'Mot de passe requis'),
  }),
});

export const verifyTwoFactorSchema = z.object({
  body: z.object({
    tempToken: z.string().min(1, 'Token temporaire requis'),
    token: z.string().length(6, 'Le code doit contenir 6 chiffres'),
  }),
});
