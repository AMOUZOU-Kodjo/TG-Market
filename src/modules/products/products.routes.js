import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as productsController from './products.controller.js';
import {
  listProductsSchema,
  getProductSchema,
  createProductSchema,
  updateProductSchema,
  updateStatusSchema,
  viewProductSchema,
} from './products.validation.js';

const router = Router();

router.get('/my', auth, pagination, productsController.getMyProducts);
router.post('/:id/view', validate(viewProductSchema), productsController.incrementViews);
router.get('/:id/similar', validate(getProductSchema), productsController.getSimilarProducts);

router.get('/', pagination, validate(listProductsSchema), productsController.listProducts);
router.get('/:id', validate(getProductSchema), productsController.getProductById);
router.post('/', auth, validate(createProductSchema), productsController.createProduct);
router.put('/:id', auth, validate(updateProductSchema), productsController.updateProduct);
router.delete('/:id', auth, validate(getProductSchema), productsController.deleteProduct);
router.put('/:id/status', auth, validate(updateStatusSchema), productsController.updateProductStatus);

export default router;
