import { z } from 'zod';

const phoneRegex = /^\+?228[279]\d{7}$/;

const passwordSchema = z
  .string()
  .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
  .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
  .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
  .regex(/\d/, 'Le mot de passe doit contenir au moins un chiffre');

export const updateProfileSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1).max(50).optional(),
      lastName: z.string().min(1).max(50).optional(),
      phone: z.string().regex(phoneRegex, 'Numéro de téléphone invalide').optional(),
      city: z.string().min(1).max(100).optional(),
      district: z.string().max(100).optional().nullable(),
      bio: z.string().max(200).optional().nullable(),
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

export const updatePreferencesSchema = z.object({
  body: z
    .object({
      preferredLanguage: z.enum(['fr', 'ee', 'en']).optional(),
      preferredCurrency: z.enum(['FCFA', 'EUR', 'USD']).optional(),
      notificationsEmail: z.boolean().optional(),
      notificationsPush: z.boolean().optional(),
      notificationsSms: z.boolean().optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Au moins un champ doit être fourni',
    }),
});

export const updatePrivacySchema = z.object({
  body: z
    .object({
      profileVisibility: z.enum(['public', 'contacts', 'private']).optional(),
      showPhone: z.boolean().optional(),
      showLocation: z.boolean().optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Au moins un champ doit être fourni',
    }),
});
