import { Router } from 'express';
import { auth, admin as adminMiddleware } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.use(auth, adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/users', pagination, adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.get('/products', pagination, adminController.getProducts);
router.put('/products/:id/status', adminController.updateProductStatus);
router.get('/kyc/pending', pagination, adminController.getKycPending);
router.put('/kyc/:id/approve', adminController.approveKyc);
router.put('/kyc/:id/reject', adminController.rejectKyc);
router.get('/escrow', pagination, adminController.getEscrowTransactions);
router.get('/activity', adminController.getRecentActivity);
router.post('/seed', adminController.runSeed);

export default router;
