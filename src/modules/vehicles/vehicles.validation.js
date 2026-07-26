import { z } from 'zod';

const sortEnum = z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'popular']);
const conditionEnum = z.enum(['new', 'like_new', 'good', 'fair', 'poor']);
const vehicleTypeEnum = z.enum(['car', 'moto']);

export const listVehiclesSchema = z.object({
  query: z.object({
    q: z.string().max(200).optional(),
    type: vehicleTypeEnum.optional(),
    brands: z.string().optional(),
    models: z.string().optional(),
    minYear: z.coerce.number().int().min(1950).optional(),
    maxYear: z.coerce.number().int().max(new Date().getFullYear() + 1).optional(),
    minMileage: z.coerce.number().int().min(0).optional(),
    maxMileage: z.coerce.number().int().min(0).optional(),
    fuel: z.string().optional(),
    transmission: z.string().optional(),
    conditions: z.string().optional(),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    city: z.string().max(100).optional(),
    sort: sortEnum.optional(),
    page: z.coerce.number().int().positive().optional(),
    perPage: z.coerce.number().int().min(1).max(50).optional(),
  }),
});

export const getVehicleSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

export const createVehicleSchema = z.object({
  body: z.object({
    categoryId: z.number().int().positive(),
    title: z.string().min(5).max(100),
    description: z.string().min(20).max(5000),
    condition: conditionEnum,
    tags: z.array(z.string()).max(10).optional(),
    images: z.array(z.string().url()).min(1).max(10),
    price: z.number().int().min(0).max(100000000),
    originalPrice: z.number().int().positive().optional(),
    negotiable: z.boolean().default(false),
    deliveryAvailable: z.boolean().default(false),
    deliveryPrice: z.number().int().positive().optional(),
    city: z.string().min(1).max(100),
    neighborhood: z.string().max(100).optional(),
    specifications: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
    type: vehicleTypeEnum,
    brand: z.string().min(1).max(50),
    model: z.string().min(1).max(50),
    year: z.number().int().min(1950).max(new Date().getFullYear() + 1),
    mileage: z.number().int().min(0),
    fuel: z.string().min(1).max(20),
    transmission: z.string().min(1).max(20),
    engineSize: z.string().max(20).optional(),
    horsepower: z.number().int().positive().optional(),
    color: z.string().max(30).optional(),
    owners: z.number().int().min(1).optional(),
    documentsAvailable: z
      .object({
        carteGrise: z.boolean().default(false),
        insurance: z.boolean().default(false),
        technicalInspection: z.boolean().default(false),
      })
      .optional(),
  }),
});

export const updateVehicleSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
  body: z
    .object({
      categoryId: z.number().int().positive().optional(),
      title: z.string().min(5).max(100).optional(),
      description: z.string().min(20).max(5000).optional(),
      condition: conditionEnum.optional(),
      tags: z.array(z.string()).max(10).optional(),
      images: z.array(z.string().url()).min(1).max(10).optional(),
      price: z.number().int().min(0).max(100000000).optional(),
      originalPrice: z.number().int().positive().optional().nullable(),
      negotiable: z.boolean().optional(),
      deliveryAvailable: z.boolean().optional(),
      deliveryPrice: z.number().int().positive().optional().nullable(),
      city: z.string().min(1).max(100).optional(),
      neighborhood: z.string().max(100).optional().nullable(),
      specifications: z
        .array(z.object({ label: z.string(), value: z.string() }))
        .optional(),
      type: vehicleTypeEnum.optional(),
      brand: z.string().min(1).max(50).optional(),
      model: z.string().min(1).max(50).optional(),
      year: z.number().int().min(1950).max(new Date().getFullYear() + 1).optional(),
      mileage: z.number().int().min(0).optional(),
      fuel: z.string().min(1).max(20).optional(),
      transmission: z.string().min(1).max(20).optional(),
      engineSize: z.string().max(20).optional().nullable(),
      horsepower: z.number().int().positive().optional().nullable(),
      color: z.string().max(30).optional().nullable(),
      owners: z.number().int().min(1).optional().nullable(),
      documentsAvailable: z
        .object({
          carteGrise: z.boolean().default(false),
          insurance: z.boolean().default(false),
          technicalInspection: z.boolean().default(false),
        })
        .optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: 'Au moins un champ doit être fourni',
    }),
});
