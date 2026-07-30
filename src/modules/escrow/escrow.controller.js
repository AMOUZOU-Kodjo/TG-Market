import * as escrowService from './escrow.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function createEscrow(req, res, next) {
  try {
    const escrow = await escrowService.createEscrow(req.user.id, req.validated.body);
    try { req.app.get('io')?.emit('escrow_created', { escrow }); } catch {}
    res.status(201).json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function listEscrow(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { escrows, total } = await escrowService.listEscrow(req.user.id, req.pagination);
    res.json({
      data: escrows,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getEscrowById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.getEscrowById(id, req.user.id);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function scanConfirm(req, res, next) {
  try {
    const { token } = req.validated.body;
    const escrow = await escrowService.scanConfirm(token, req.user.id);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function confirmPayment(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.confirmPayment(id, req.user.id);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      await notifyUser(io, escrow.sellerId, {
        type: 'payment_confirmed',
        title: 'Paiement confirmé',
        description: `Le paiement pour "${escrow.productTitle}" a été confirmé`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function markAsShipped(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.markAsShipped(id, req.user.id);
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function confirmDelivery(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.confirmDelivery(id, req.user.id);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      await notifyUser(io, escrow.sellerId, {
        type: 'delivery_confirmed',
        title: 'Livraison confirmée',
        description: `La livraison pour "${escrow.productTitle}" a été confirmée`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function disputeEscrow(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { reason } = req.validated.body;
    const escrow = await escrowService.disputeEscrow(id, req.user.id, reason);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      const recipientId = escrow.buyerId === req.user.id ? escrow.sellerId : escrow.buyerId;
      await notifyUser(io, recipientId, {
        type: 'escrow_disputed',
        title: 'Litige ouvert',
        description: `Un litige a été ouvert pour "${escrow.productTitle}"`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id, reason },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function cancelEscrow(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.cancelEscrow(id, req.user.id);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      const notifiedUserId = req.user.id === escrow.buyerId ? escrow.sellerId : escrow.buyerId;
      await notifyUser(io, notifiedUserId, {
        type: 'escrow_cancelled',
        title: 'Transaction annulée',
        description: `La transaction pour "${escrow.productTitle}" a été annulée`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function confirmWithCode(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { code } = req.validated.body;
    const escrow = await escrowService.confirmWithCode(id, req.user.id, code);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      await notifyUser(io, escrow.buyerId, {
        type: 'delivery_confirmed',
        title: 'Livraison confirmée',
        description: `La livraison pour "${escrow.productTitle}" a été confirmée. Les fonds ont été libérés.`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}
