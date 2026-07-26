import { Router } from 'express';
import { pagination } from '../../utils/pagination.js';
import { validate } from '../../middleware/validate.js';
import * as searchController from './search.controller.js';
import { listProductsSchema } from '../products/products.validation.js';

const router = Router();

router.get('/', pagination, validate(listProductsSchema), searchController.search);

export default router;
