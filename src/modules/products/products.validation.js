import { z } from 'zod';

const sortEnum = z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'popular']);
const conditionEnum = z.enum(['new', 'like_new', 'good', 'fair', 'poor']);
const statusEnum = z.enum(['active', 'reserved', 'sold', 'expired', 'deleted']);

export const listProductsSchema = z.object({
  query: z.object({
    q: z.string().max(200).optional(),
    categories: z.string().optional(),
    conditions: z.string().optional(),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    city: z.string().max(100).optional(),
    sort: sortEnum.optional(),
    page: z.coerce.number().int().positive().optional(),
    perPage: z.coerce.number().int().min(1).max(50).optional(),
    sellerId: z.coerce.number().int().positive().optional(),
  }),
});

export const getProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    categoryId: z.number().int().positive(),
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(5000),
    condition: conditionEnum,
    brand: z.string().max(50).optional(),
    tags: z.array(z.string()).max(10).optional(),
    images: z.array(z.string().url()).min(1).max(10),
    price: z.number().int().min(0).max(100000000),
    originalPrice: z.number().int().positive().optional(),
    negotiable: z.boolean().default(false),
    deliveryAvailable: z.boolean().default(false),
    deliveryPrice: z.number().int().positive().optional(),
    quantity: z.number().int().min(1).max(999).optional(),
    city: z.string().min(1),
    neighborhood: z.string().max(100).optional(),
    specifications: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z
    .object({
      categoryId: z.number().int().positive().optional(),
      title: z.string().min(5).max(100).optional(),
      description: z.string().min(20).max(5000).optional(),
      condition: conditionEnum.optional(),
      brand: z.string().max(50).optional().nullable(),
      tags: z.array(z.string()).max(10).optional(),
      images: z.array(z.string().url()).min(1).max(10).optional(),
      price: z.number().int().min(0).max(100000000).optional(),
      originalPrice: z.number().int().positive().optional().nullable(),
      negotiable: z.boolean().optional(),
      deliveryAvailable: z.boolean().optional(),
      deliveryPrice: z.number().int().positive().optional().nullable(),
      quantity: z.number().int().min(1).max(999).optional(),
      city: z.string().min(1).optional(),
      neighborhood: z.string().max(100).optional().nullable(),
      specifications: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Au moins un champ doit être fourni',
    }),
});

export const updateStatusSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z.object({
    status: statusEnum,
  }),
});

export const viewProductSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});
