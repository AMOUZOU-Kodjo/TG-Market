import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import * as paymentController from './payment.controller.js';

const router = Router();

router.post('/initiate', auth, paymentController.initiatePayment);
router.post('/webhook', paymentController.handleWebhook);
router.get('/config', auth, paymentController.getConfig);

export default router;
