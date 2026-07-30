import * as offersService from './offers.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { notifyUser } from '../notifications/notifications.service.js';

export async function createOffer(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const { amount, message } = req.body;
    const buyerId = req.user.id;
    const result = await offersService.createOffer(productId, buyerId, amount, message);

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, result.sellerId, {
        type: 'new_offer',
        title: 'Nouvelle offre reçue',
        description: `${result.buyer?.name || 'Un acheteur'} a proposé ${new Intl.NumberFormat('fr-FR').format(result.amount)} FCFA`,
        productId,
        metadata: { offerId: result.id, amount: result.amount },
      });
    }

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

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, result.buyerId, {
        type: 'offer_accepted',
        title: 'Offre acceptée',
        description: `Votre offre de ${new Intl.NumberFormat('fr-FR').format(result.amount)} FCFA a été acceptée`,
        productId: result.productId,
        metadata: { offerId, amount: result.amount },
      });
    }

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

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, result.buyerId, {
        type: 'offer_rejected',
        title: 'Offre refusée',
        description: reason
          ? `Votre offre a été refusée : ${reason}`
          : `Votre offre de ${new Intl.NumberFormat('fr-FR').format(result.amount)} FCFA a été refusée`,
        productId: result.productId,
        metadata: { offerId, amount: result.amount, reason },
      });
    }

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

    const io = req.app.get('io');
    if (io) {
      await notifyUser(io, result.sellerId, {
        type: 'offer_cancelled',
        title: 'Offre annulée',
        description: `L'acheteur a annulé son offre de ${new Intl.NumberFormat('fr-FR').format(result.amount)} FCFA`,
        productId: result.productId,
        metadata: { offerId, amount: result.amount },
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}