import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as escrowController from './escrow.controller.js';
import {
  createEscrowSchema,
  getEscrowSchema,
  disputeEscrowSchema,
} from './escrow.validation.js';

const router = Router();

router.post('/', auth, validate(createEscrowSchema), escrowController.createEscrow);
router.get('/', auth, pagination, escrowController.listEscrow);
router.get('/:id', auth, validate(getEscrowSchema), escrowController.getEscrowById);
router.put('/:id/confirm-delivery', auth, validate(getEscrowSchema), escrowController.confirmDelivery);
router.put('/:id/dispute', auth, validate(disputeEscrowSchema), escrowController.disputeEscrow);
router.put('/:id/cancel', auth, validate(getEscrowSchema), escrowController.cancelEscrow);

export default router;
