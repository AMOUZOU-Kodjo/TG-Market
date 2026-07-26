import { z } from 'zod';

export const withdrawSchema = z.object({
  body: z.object({
    amount: z.number().int().positive('Le montant doit être positif').min(500, 'Montant minimum : 500 FCFA'),
    paymentMethodId: z.number().int().positive(),
  }),
});

export const addPaymentMethodSchema = z.object({
  body: z.object({
    provider: z.enum(['flooz', 'tmoney', 'mobile_money', 'card']),
    providerUserId: z.string().max(100).optional(),
    label: z.string().max(100).optional(),
    isDefault: z.boolean().optional(),
  }),
});

export const deletePaymentMethodSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
