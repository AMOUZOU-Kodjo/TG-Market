import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as walletController from './wallet.controller.js';
import {
  withdrawSchema,
  addPaymentMethodSchema,
  deletePaymentMethodSchema,
} from './wallet.validation.js';

const router = Router();

router.get('/balance', auth, walletController.getBalance);
router.get('/transactions', auth, pagination, walletController.getTransactions);
router.post('/withdraw', auth, validate(withdrawSchema), walletController.withdraw);

router.get('/payment-methods', auth, walletController.getPaymentMethods);
router.post('/payment-methods', auth, validate(addPaymentMethodSchema), walletController.addPaymentMethod);
router.delete('/payment-methods/:id', auth, validate(deletePaymentMethodSchema), walletController.deletePaymentMethod);

export default router;
