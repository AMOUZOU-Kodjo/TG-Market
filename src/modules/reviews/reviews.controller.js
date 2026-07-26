import * as reviewsService from './reviews.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function getReviewsBySeller(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const sellerId = Number(req.validated.query.sellerId);

    const { reviews, total } = await reviewsService.getReviewsBySeller(sellerId, { page, perPage });

    res.json({
      data: reviews,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyReviews(req, res, next) {
  try {
    const { page, perPage } = req.pagination;

    const { reviews, total } = await reviewsService.getMyReviews(req.user.id, { page, perPage });

    res.json({
      data: reviews,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function createReview(req, res, next) {
  try {
    const review = await reviewsService.createReview(req.user.id, req.validated.body);
    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}
