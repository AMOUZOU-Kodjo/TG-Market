import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as offersController from './offers.controller.js';

const router = Router();

router.get('/', auth, pagination, offersController.getMyOffers);
router.get('/:id', auth, offersController.getOfferById);
router.post('/:productId', auth, offersController.createOffer);
router.put('/:id/accept', auth, offersController.acceptOffer);
router.put('/:id/reject', auth, offersController.rejectOffer);
router.put('/:id/cancel', auth, offersController.cancelOffer);

export default router;