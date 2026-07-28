import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as bundlesController from './bundles.controller.js';

const router = Router();

router.get('/', pagination, bundlesController.getPublicBundles);
router.get('/my', auth, pagination, bundlesController.getMyBundles);
router.get('/:id', bundlesController.getBundleById);
router.post('/', auth, bundlesController.createBundle);
router.put('/:id', auth, bundlesController.updateBundle);
router.delete('/:id', auth, bundlesController.deleteBundle);
router.post('/:id/products', auth, bundlesController.addProductToBundle);
router.delete('/:id/products/:productId', auth, bundlesController.removeProductFromBundle);

export default router;