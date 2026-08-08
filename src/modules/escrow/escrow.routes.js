import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { confirmCodeLimiter } from '../../middleware/rateLimiter.js';
import { pagination } from '../../utils/pagination.js';
import * as escrowController from './escrow.controller.js';
import {
  createEscrowSchema,
  getEscrowSchema,
  disputeEscrowSchema,
  scanConfirmSchema,
  confirmCodeSchema,
} from './escrow.validation.js';

const router = Router();

router.post('/', auth, validate(createEscrowSchema), escrowController.createEscrow);
router.get('/', auth, pagination, escrowController.listEscrow);
router.get('/:id', auth, validate(getEscrowSchema), escrowController.getEscrowById);
router.put('/:id/confirm-payment', auth, validate(getEscrowSchema), escrowController.confirmPayment);
router.put('/:id/mark-shipped', auth, validate(getEscrowSchema), escrowController.markAsShipped);
router.put('/:id/confirm-delivery', auth, validate(getEscrowSchema), escrowController.confirmDelivery);
router.put('/:id/dispute', auth, validate(disputeEscrowSchema), escrowController.disputeEscrow);
router.post('/scan-confirm', auth, validate(scanConfirmSchema), escrowController.scanConfirm);
router.put('/:id/cancel', auth, validate(getEscrowSchema), escrowController.cancelEscrow);
router.put('/:id/confirm-code', auth, confirmCodeLimiter, validate(confirmCodeSchema), escrowController.confirmWithCode);

export default router;
