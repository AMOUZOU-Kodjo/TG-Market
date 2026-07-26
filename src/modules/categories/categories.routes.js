import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as categoriesController from './categories.controller.js';

const router = Router();

const categoryProductsQuerySchema = z.object({
  query: z.object({
    condition: z.enum(['new', 'like_new', 'good', 'fair', 'poor']).optional(),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().min(0).optional(),
    city: z.string().max(100).optional(),
    sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'popular']).optional(),
  }),
});

router.get('/', categoriesController.getAllCategories);
router.get('/:slug', categoriesController.getCategoryBySlug);
router.get('/:slug/products', pagination, validate(categoryProductsQuerySchema), categoriesController.getCategoryProducts);

export default router;
