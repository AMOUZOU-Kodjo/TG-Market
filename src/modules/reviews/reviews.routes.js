import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as reviewsController from './reviews.controller.js';
import { getReviewsBySellerSchema, createReviewSchema } from './reviews.validation.js';

const router = Router();

router.get('/me', auth, pagination, reviewsController.getMyReviews);
router.get('/', pagination, validate(getReviewsBySellerSchema), reviewsController.getReviewsBySeller);
router.post('/', auth, validate(createReviewSchema), reviewsController.createReview);

export default router;
