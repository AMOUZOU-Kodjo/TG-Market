import crypto from 'crypto';
import prisma from '../../config/database.js';
import redis from '../../config/redis.js';
import { getPlatformFeePercent, getBuyerFeePercent } from '../../utils/platformFee.js';
import { getSellerPayoutMethod, createAndSendPayout, getPayoutForEscrow, formatPayout } from '../payment/payout.service.js';
import { grantBadge } from '../../utils/badges.js';

async function maybeGrantFirstSale(sellerId, currentEscrowId) {
  try {
    const count = await prisma.escrowTransaction.count({
      where: { seller_id: sellerId, status: 'completed', id: { not: currentEscrowId } },
    });
    if (count === 0) {
      await grantBadge(sellerId, 'first_sale');
    }
  } catch (err) {
    console.error('[badges] Erreur first_sale :', err.message);
  }
}

function formatEscrow(escrow) {
  return {
    id: escrow.id,
    productId: escrow.product_id,
    bundleId: escrow.bundle_id ?? null,
    buyerId: escrow.buyer_id,
    sellerId: escrow.seller_id,
    buyerName: escrow.buyer ? `${escrow.buyer.first_name} ${escrow.buyer.last_name}` : null,
    sellerName: escrow.seller ? `${escrow.seller.first_name} ${escrow.seller.last_name}` : null,
    productTitle: escrow.product?.title ?? null,
    productImage: escrow.product?.images?.[0]?.url ?? null,
    bundleTitle: escrow.bundle?.title ?? null,
    amount: escrow.amount,
    fee: escrow.fee,
    buyerFee: escrow.buyer_fee ?? 0,
    status: escrow.status,
    paymentMethod: escrow.payment_method ?? null,
    confirmationToken: escrow.confirmation_token ?? null,
    payout: escrow.payouts?.[0] ? formatPayout(escrow.payouts[0]) : null,
    createdAt: escrow.created_at,
    confirmedAt: escrow.confirmed_at ?? null,
    releasedAt: escrow.released_at ?? null,
  };
}

export async function createEscrow(buyerId, data) {
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true, user_id: true, title: true, status: true, price: true, quantity: true },
  });

  if (!product || product.status !== 'active') {
    const error = new Error('Produit introuvable ou non disponible');
    error.status = 404;
    throw error;
  }

  if (product.user_id === buyerId) {
    const error = new Error('Vous ne pouvez pas acheter votre propre produit');
    error.status = 400;
    throw error;
  }

  if (product.user_id !== data.sellerId) {
    const error = new Error('Le vendeur ne correspond pas au produit');
    error.status = 400;
    throw error;
  }

  const existing = await prisma.escrowTransaction.findFirst({
    where: {
      product_id: data.productId,
      buyer_id: buyerId,
      status: { notIn: ['cancelled', 'refunded'] },
    },
  });

  if (existing) {
    const error = new Error('Une commande active existe déjà pour ce produit');
    error.status = 409;
    throw error;
  }

  const activeCount = await prisma.escrowTransaction.count({
    where: {
      product_id: data.productId,
      status: { notIn: ['cancelled', 'refunded', 'completed'] },
    },
  });

  if (activeCount >= product.quantity) {
    const error = new Error('Ce produit n\'est plus en stock');
    error.status = 400;
    throw error;
  }

const feePercent = await getPlatformFeePercent();
  const fee = Math.round(product.price * (feePercent / 100));
  const buyerFeePercent = await getBuyerFeePercent();
  const buyerFee = Math.round(product.price * (buyerFeePercent / 100));

  const escrow = await prisma.$transaction(async (tx) => {
    const token = crypto.randomUUID();
    const created = await tx.escrowTransaction.create({
      data: {
        product_id: data.productId,
        buyer_id: buyerId,
        seller_id: data.sellerId,
        amount: product.price,
        fee,
        buyer_fee: buyerFee,
        status: 'pending',
        payment_method: data.paymentMethod ?? null,
        confirmation_token: token,
      },
    });

    await tx.walletTransaction.create({
      data: {
        user_id: buyerId,
        type: 'purchase',
        amount: product.price + buyerFee,
        description: `Achat : ${product.title}`,
        counterparty: null,
        status: 'pending',
        reference_type: 'escrow',
        reference_id: created.id,
      },
    });

    if (product.quantity <= 1) {
      await tx.product.update({
        where: { id: data.productId },
        data: { status: 'reserved' },
      });
    }

    return created;
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id: escrow.id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}

export async function listEscrow(userId, { page, perPage, skip }) {
  const where = {
    OR: [{ buyer_id: userId }, { seller_id: userId }],
  };

  const [escrows, total] = await Promise.all([
    prisma.escrowTransaction.findMany({
      where,
      include: {
        buyer: { select: { first_name: true, last_name: true } },
        seller: { select: { first_name: true, last_name: true } },
        product: {
          select: {
            title: true,
            images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
          },
        },
        payouts: true,
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.escrowTransaction.count({ where }),
  ]);

  return {
    escrows: escrows.map(formatEscrow),
    total,
  };
}

export async function getEscrowById(id, userId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== userId && escrow.seller_id !== userId) {
    const error = new Error('Non autorisé à accéder à cette transaction');
    error.status = 403;
    throw error;
  }

  return formatEscrow(escrow);
}

export async function confirmPayment(id, buyerId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, buyer_id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== buyerId) {
    const error = new Error('Seul l\'acheteur peut confirmer le paiement');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'pending') {
    const error = new Error('Le paiement de cette commande a déjà été traité');
    error.status = 400;
    throw error;
  }

  await prisma.escrowTransaction.update({
    where: { id },
    data: { status: 'awaiting_verification' },
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}

export async function verifyPayment(id) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.status !== 'awaiting_verification') {
    const error = new Error('Cette transaction n\'est pas en attente de vérification');
    error.status = 400;
    throw error;
  }

  await prisma.escrowTransaction.update({
    where: { id },
    data: { status: 'paid' },
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}

export async function scanConfirm(token, userId) {
  const escrow = await prisma.escrowTransaction.findFirst({
    where: { confirmation_token: token },
    select: { id: true, buyer_id: true, status: true, amount: true, fee: true, product_id: true, confirmation_code: true },
  });

  if (!escrow) {
    const error = new Error('Code QR invalide');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== userId) {
    const error = new Error('Seul l\'acheteur peut confirmer la livraison par QR code');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'pending_delivery') {
    const error = new Error('Cette commande ne peut pas être confirmée par QR code');
    error.status = 400;
    throw error;
  }

const full = await prisma.escrowTransaction.findUnique({
    where: { id: escrow.id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return { ...formatEscrow(full), confirmationCode: escrow.confirmation_code };
}

export async function markAsShipped(id, sellerId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, seller_id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.seller_id !== sellerId) {
    const error = new Error('Seul le vendeur peut marquer la commande comme envoyée');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'paid') {
    const error = new Error('Le paiement doit être confirmé avant de marquer comme envoyé');
    error.status = 400;
    throw error;
  }

const code = String(Math.floor(1000 + Math.random() * 9000));

  await prisma.escrowTransaction.update({
    where: { id },
    data: { status: 'pending_delivery', confirmation_code: code },
  });

  await redis.del(`escrow:code-fails:${id}`);
  await redis.set(`escrow:code-expiry:${id}`, '1', 'EX', 86400 * 7);

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}

export async function confirmWithCode(id, sellerId, code) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, seller_id: true, confirmation_code: true, amount: true, fee: true, status: true, product_id: true, buyer_id: true, bundle_id: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.seller_id !== sellerId) {
    const error = new Error('Seul le vendeur peut confirmer le code de livraison');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'pending_delivery') {
    const error = new Error('Cette commande n\'est pas en attente de confirmation');
    error.status = 400;
    throw error;
  }

  const codeExpired = await redis.get(`escrow:code-expiry:${id}`);
  if (!codeExpired) {
    if (!escrow.confirmation_code) {
      const error = new Error('Le code de confirmation a expiré');
      error.status = 400;
      throw error;
    }
    await redis.set(`escrow:code-expiry:${id}`, '1', 'EX', 86400 * 7);
  }

  if (escrow.confirmation_code !== code) {
    const fails = await redis.incr(`escrow:code-fails:${id}`);
    await redis.expire(`escrow:code-fails:${id}`, 3600);

    if (fails >= 5) {
      await prisma.escrowTransaction.update({
        where: { id },
        data: { confirmation_code: null },
      });
      await redis.del(`escrow:code-expiry:${id}`, `escrow:code-fails:${id}`);
      const error = new Error('Code invalidé après plusieurs tentatives, contactez l\'acheteur');
      error.status = 400;
      throw error;
    }

    const error = new Error('Code de confirmation invalide');
    error.status = 400;
    throw error;
  }

  await redis.del(`escrow:code-expiry:${id}`, `escrow:code-fails:${id}`);

  const sellerPayout = escrow.amount - escrow.fee;

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.update({
      where: { id },
      data: {
        status: 'completed',
        confirmed_at: new Date(),
        released_at: new Date(),
      },
    });

    if (escrow.bundle_id) {
      const bundleItems = await tx.bundleItem.findMany({
        where: { bundle_id: escrow.bundle_id },
        select: { product_id: true },
      });
      await tx.product.updateMany({
        where: { id: { in: bundleItems.map((i) => i.product_id) } },
        data: { status: 'sold' },
      });
    } else {
      await tx.product.update({
        where: { id: escrow.product_id },
        data: { quantity: { decrement: 1 } },
      });

      const updatedProduct = await tx.product.findUnique({
        where: { id: escrow.product_id },
        select: { quantity: true },
      });

      if (updatedProduct.quantity === 0) {
        await tx.product.update({
          where: { id: escrow.product_id },
          data: { status: 'sold' },
        });
      }
    }

    const buyerTransaction = await tx.walletTransaction.findFirst({
      where: { reference_type: 'escrow', reference_id: id, user_id: escrow.buyer_id, status: 'pending' },
    });

    if (buyerTransaction) {
      await tx.walletTransaction.update({
        where: { id: buyerTransaction.id },
        data: { status: 'completed' },
      });
    }

    const escrowRecord = await tx.escrowTransaction.findUnique({
      where: { id },
      include: {
        product: { select: { title: true } },
        bundle: { select: { title: true } },
      },
    });

    const itemLabel = escrowRecord.bundle?.title || escrowRecord.product?.title || 'Produit';

    await tx.walletTransaction.create({
      data: {
        user_id: escrow.seller_id,
        type: 'sale',
        amount: sellerPayout,
        description: escrowRecord.bundle ? `Vente du lot : ${itemLabel}` : `Vente : ${itemLabel}`,
        status: 'completed',
        reference_type: 'escrow',
        reference_id: id,
      },
    });

    const admin = await tx.user.findFirst({
      where: { role: 'admin' },
      select: { id: true },
    });

    if (admin) {
      await tx.walletTransaction.create({
        data: {
          user_id: admin.id,
          type: 'commission',
          amount: escrow.fee + (escrow.buyer_fee ?? 0),
          description: escrowRecord.bundle ? `Commission - Lot : ${itemLabel}` : `Commission - ${itemLabel}`,
          status: 'completed',
          reference_type: 'escrow',
          reference_id: id,
        },
      });
    }
  });

  await finalizeSellerPayout(id, escrow.seller_id, sellerPayout);

  await maybeGrantFirstSale(escrow.seller_id, id);

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
      bundle: { select: { id: true, title: true } },
      payouts: true,
    },
  });

  return formatEscrow(full);
}

export async function confirmDelivery(id, buyerId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, buyer_id: true, seller_id: true, amount: true, fee: true, status: true, product_id: true, bundle_id: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== buyerId) {
    const error = new Error('Seul l\'acheteur peut confirmer la réception');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'pending_delivery') {
    const error = new Error('Cette transaction ne peut pas être confirmée');
    error.status = 400;
    throw error;
  }

  const sellerPayout = escrow.amount - escrow.fee;

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.update({
      where: { id },
      data: {
        status: 'completed',
        confirmed_at: new Date(),
        released_at: new Date(),
      },
    });

    if (escrow.bundle_id) {
      const bundleItems = await tx.bundleItem.findMany({
        where: { bundle_id: escrow.bundle_id },
        select: { product_id: true },
      });
      await tx.product.updateMany({
        where: { id: { in: bundleItems.map((i) => i.product_id) } },
        data: { status: 'sold' },
      });
    } else {
      await tx.product.update({
        where: { id: escrow.product_id },
        data: { quantity: { decrement: 1 } },
      });

      const updatedProduct = await tx.product.findUnique({
        where: { id: escrow.product_id },
        select: { quantity: true },
      });

      if (updatedProduct.quantity === 0) {
        await tx.product.update({
          where: { id: escrow.product_id },
          data: { status: 'sold' },
        });
      }
    }

    const buyerTransaction = await tx.walletTransaction.findFirst({
      where: { reference_type: 'escrow', reference_id: id, user_id: buyerId, status: 'pending' },
    });

    if (buyerTransaction) {
      await tx.walletTransaction.update({
        where: { id: buyerTransaction.id },
        data: { status: 'completed' },
      });
    }

    const escrowRecord = await tx.escrowTransaction.findUnique({
      where: { id },
      include: {
        product: { select: { title: true } },
        bundle: { select: { title: true } },
      },
    });

    const itemLabel = escrowRecord.bundle?.title || escrowRecord.product?.title || 'Produit';

    await tx.walletTransaction.create({
      data: {
        user_id: escrow.seller_id,
        type: 'sale',
        amount: sellerPayout,
        description: escrowRecord.bundle ? `Vente du lot : ${itemLabel}` : `Vente : ${itemLabel}`,
        status: 'completed',
        reference_type: 'escrow',
        reference_id: id,
      },
    });

    const admin = await tx.user.findFirst({
      where: { role: 'admin' },
      select: { id: true },
    });

    if (admin) {
      await tx.walletTransaction.create({
        data: {
          user_id: admin.id,
          type: 'commission',
          amount: escrow.fee + (escrow.buyer_fee ?? 0),
          description: escrowRecord.bundle ? `Commission - Lot : ${itemLabel}` : `Commission - ${itemLabel}`,
          status: 'completed',
          reference_type: 'escrow',
          reference_id: id,
        },
      });
    }
  });

  await finalizeSellerPayout(id, escrow.seller_id, sellerPayout);

  await maybeGrantFirstSale(escrow.seller_id, id);

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
      bundle: { select: { id: true, title: true } },
      payouts: true,
    },
  });

  return formatEscrow(full);
}

export async function disputeEscrow(id, userId, reason) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, buyer_id: true, seller_id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== userId && escrow.seller_id !== userId) {
    const error = new Error('Non autorisé à signaler cette transaction');
    error.status = 403;
    throw error;
  }

  if (escrow.status === 'completed' || escrow.status === 'cancelled' || escrow.status === 'refunded') {
    const error = new Error('Cette transaction ne peut plus être signalée');
    error.status = 400;
    throw error;
  }

  await prisma.escrowTransaction.update({
    where: { id },
    data: {
      status: 'disputed',
      disputed_at: new Date(),
      dispute_reason: reason,
    },
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}

export async function cancelEscrow(id, userId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, buyer_id: true, seller_id: true, status: true, product_id: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  const isBuyer = escrow.buyer_id === userId;
  const isSeller = escrow.seller_id === userId;

  if (!isBuyer && !isSeller) {
    const error = new Error('Vous n\'êtes pas autorisé à annuler cette transaction');
    error.status = 403;
    throw error;
  }

  if (['completed', 'cancelled', 'refunded', 'disputed'].includes(escrow.status)) {
    const error = new Error('Cette transaction ne peut plus être annulée');
    error.status = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    if (escrow.product_id) {
      const product = await tx.product.findUnique({
        where: { id: escrow.product_id },
        select: { status: true },
      });

      if (product?.status === 'reserved') {
        await tx.product.update({
          where: { id: escrow.product_id },
          data: { status: 'active' },
        });
      }
    }

    const pendingTx = await tx.walletTransaction.findFirst({
      where: { reference_type: 'escrow', reference_id: id, status: 'pending' },
    });

    if (pendingTx) {
      await tx.walletTransaction.update({
        where: { id: pendingTx.id },
        data: { status: 'failed' },
      });
    }
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { first_name: true, last_name: true } },
      seller: { select: { first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

return formatEscrow(full);
}

async function finalizeSellerPayout(escrowId, sellerId, netAmount) {
  try {
    const existing = await prisma.payout.findFirst({
      where: { escrow_id: escrowId },
    });

    if (existing) return getPayoutForEscrow(escrowId);

    const method = await getSellerPayoutMethod(sellerId);
    const escrow = await prisma.escrowTransaction.findUnique({
      where: { id: escrowId },
      select: { fee: true },
    });

    const payout = await createAndSendPayout({
      escrowId,
      sellerId,
      amount: netAmount,
      fee: escrow?.fee ?? 0,
      provider: method?.provider ?? null,
      account: method?.provider_user_id ?? null,
    });

    return payout;
  } catch {
    return null;
  }
}

export async function getEscrowByPaymentRef(txRef) {
  return prisma.escrowTransaction.findFirst({
    where: { payment_ref: txRef },
    select: { id: true, status: true, amount: true },
  });
}

export async function updatePaymentRef(id, { paymentRef, paymentMethod }) {
  return prisma.escrowTransaction.update({
    where: { id },
    data: { payment_ref: paymentRef, payment_method: paymentMethod },
  });
}

export async function autoVerifyPayment(id) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.status !== 'pending') {
    return;
  }

  await prisma.escrowTransaction.update({
    where: { id },
    data: { status: 'paid' },
  });

  const full = await prisma.escrowTransaction.findUnique({
    where: { id },
    include: {
      buyer: { select: { id: true, first_name: true, last_name: true } },
      seller: { select: { id: true, first_name: true, last_name: true } },
      product: {
        select: {
          title: true,
          images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
        },
      },
    },
  });

  return formatEscrow(full);
}
