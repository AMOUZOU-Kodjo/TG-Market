import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as bundlesController from './bundles.controller.js';

const router = Router();

router.get('/', pagination, bundlesController.getPublicBundles);
router.get('/my', auth, pagination, bundlesController.getMyBundles);
router.get('/proposals/mine', auth, pagination, bundlesController.getMyBundleProposals);
router.get('/proposals/received', auth, pagination, bundlesController.getReceivedBundleProposals);
router.put('/proposals/:proposalId/accept', auth, bundlesController.acceptBundleProposal);
router.put('/proposals/:proposalId/reject', auth, bundlesController.rejectBundleProposal);
router.put('/proposals/:proposalId/cancel', auth, bundlesController.cancelBundleProposal);
router.post('/:id/purchase', auth, bundlesController.purchaseBundle);
router.get('/:id', bundlesController.getBundleById);
router.post('/', auth, bundlesController.createBundle);
router.post('/:id/proposals', auth, bundlesController.createBundleProposal);
router.get('/:id/proposals', auth, bundlesController.getBundleProposals);
router.put('/:id', auth, bundlesController.updateBundle);
router.delete('/:id', auth, bundlesController.deleteBundle);
router.post('/:id/products', auth, bundlesController.addProductToBundle);
router.delete('/:id/products/:productId', auth, bundlesController.removeProductFromBundle);

export default router;