import { z } from 'zod';

export const getReviewsBySellerSchema = z.object({
  query: z.object({
    sellerId: z.coerce.number().int().positive(),
    page: z.coerce.number().int().positive().optional(),
    perPage: z.coerce.number().int().min(1).max(50).optional(),
  }),
});

export const createReviewSchema = z.object({
  body: z.object({
    escrowId: z.number().int().positive(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(10).max(1000),
  }),
});
