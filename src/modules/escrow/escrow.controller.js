import prisma from '../../config/database.js';
import * as escrowService from './escrow.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { sendEmail } from '../../utils/email.js';

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
    const escrow = await escrowService.confirmPayment(id, req.user.id, req.body?.transactionRef);
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

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
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

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
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

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

      try {
        const admins = await prisma.user.findMany({
          where: { role: 'admin' },
          select: { id: true },
        });
        for (const admin of admins) {
          await notifyUser(io, admin.id, {
            type: 'escrow_disputed',
            title: 'Nouveau litige',
            description: `Litige #${escrow.id} sur "${escrow.productTitle}" — à traiter`,
            productId: escrow.productId,
            metadata: { escrowId: escrow.id, reason },
          });
        }
      } catch {}
    }

    try {
      const seller = await prisma.user.findUnique({
        where: { id: escrow.sellerId },
        select: { email: true, first_name: true },
      });
      if (seller?.email) {
        await sendEmail({
          to: seller.email,
          subject: `Litige ouvert — ${escrow.productTitle}`,
          html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#01796F;">Un litige a été ouvert</h2>
            <p>Bonjour ${seller.first_name ?? ''},</p>
            <p>Un litige a été ouvert sur votre transaction <strong>"${escrow.productTitle}"</strong> (#${escrow.id}).</p>
            ${reason ? `<blockquote style="background:#f4f4f4;padding:15px;border-radius:8px;margin:10px 0;color:#555"><strong>Motif :</strong> ${reason}</blockquote>` : ''}
            <p>L'équipe d'administration va examiner le dossier et vous tiendra informé de la décision.</p>
            <p style="color:#999;font-size:12px;">Cordialement,<br/>L'équipe TG-Market</p>
          </div>`,
        });
      }
    } catch {}

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function cancelDispute(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.cancelDispute(id, req.user.id);
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      const recipientId = escrow.buyerId === req.user.id ? escrow.sellerId : escrow.buyerId;
      await notifyUser(io, recipientId, {
        type: 'escrow_dispute_cancelled',
        title: 'Litige refermé',
        description: `Le litige pour "${escrow.productTitle}" a été refermé, la vente reprend son cours`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
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
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

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
    try { req.app.get('io')?.emit('escrow_updated', { escrow }); } catch {}

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
