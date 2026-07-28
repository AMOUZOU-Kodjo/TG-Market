import * as offersService from './offers.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function createOffer(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const { amount, message } = req.body;
    const buyerId = req.user.id;
    const result = await offersService.createOffer(productId, buyerId, amount, message);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyOffers(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { offers, total } = await offersService.getMyOffers(req.user.id, { page, perPage });
    res.json({
      data: offers,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getOfferById(req, res, next) {
  try {
    const offerId = Number(req.params.id);
    const result = await offersService.getOfferById(offerId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function acceptOffer(req, res, next) {
  try {
    const offerId = Number(req.params.id);
    const sellerId = req.user.id;
    const result = await offersService.acceptOffer(offerId, sellerId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function rejectOffer(req, res, next) {
  try {
    const offerId = Number(req.params.id);
    const sellerId = req.user.id;
    const { reason } = req.body;
    const result = await offersService.rejectOffer(offerId, sellerId, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function cancelOffer(req, res, next) {
  try {
    const offerId = Number(req.params.id);
    const userId = req.user.id;
    const result = await offersService.cancelOffer(offerId, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}