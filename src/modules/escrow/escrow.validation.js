import { z } from 'zod';

export const createEscrowSchema = z.object({
  body: z.object({
    productId: z.number().int().positive(),
    sellerId: z.number().int().positive(),
    paymentMethod: z.string().max(30).optional(),
  }),
});

export const getEscrowSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const disputeEscrowSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    reason: z.string().min(10, 'La raison doit contenir au moins 10 caractères').max(2000),
  }),
});
