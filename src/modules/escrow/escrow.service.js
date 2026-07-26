import crypto from 'crypto';
import prisma from '../../config/database.js';

function formatEscrow(escrow) {
  return {
    id: escrow.id,
    productId: escrow.product_id,
    buyerId: escrow.buyer_id,
    sellerId: escrow.seller_id,
    buyerName: escrow.buyer ? `${escrow.buyer.first_name} ${escrow.buyer.last_name}` : null,
    sellerName: escrow.seller ? `${escrow.seller.first_name} ${escrow.seller.last_name}` : null,
    productTitle: escrow.product?.title ?? null,
    productImage: escrow.product?.images?.[0]?.url ?? null,
    amount: escrow.amount,
    fee: escrow.fee,
    status: escrow.status,
    paymentMethod: escrow.payment_method ?? null,
    confirmationToken: escrow.confirmation_token ?? null,
    createdAt: escrow.created_at,
    confirmedAt: escrow.confirmed_at ?? null,
    releasedAt: escrow.released_at ?? null,
  };
}

export async function createEscrow(buyerId, data) {
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
    select: { id: true, user_id: true, title: true, status: true, price: true },
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
    const error = new Error('Une escrow active existe déjà pour ce produit');
    error.status = 409;
    throw error;
  }

  const fee = Math.round(product.price * 0.05);

  const escrow = await prisma.$transaction(async (tx) => {
    const token = crypto.randomUUID();
    const created = await tx.escrowTransaction.create({
      data: {
        product_id: data.productId,
        buyer_id: buyerId,
        seller_id: data.sellerId,
        amount: product.price,
        fee,
        status: 'pending',
        payment_method: data.paymentMethod ?? null,
        confirmation_token: token,
      },
    });

    await tx.walletTransaction.create({
      data: {
        user_id: buyerId,
        type: 'purchase',
        amount: product.price,
        description: `Achat : ${product.title}`,
        counterparty: null,
        status: 'pending',
        reference_type: 'escrow',
        reference_id: created.id,
      },
    });

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
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { confirmation_token: token },
    select: { id: true, buyer_id: true, status: true, amount: true, fee: true },
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

  const sellerPayout = escrow.amount - escrow.fee;

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.update({
      where: { id: escrow.id },
      data: {
        status: 'completed',
        confirmed_at: new Date(),
        released_at: new Date(),
      },
    });

    const buyerTransaction = await tx.walletTransaction.findFirst({
      where: { reference_type: 'escrow', reference_id: escrow.id, user_id: escrow.buyer_id, status: 'pending' },
    });

    if (buyerTransaction) {
      await tx.walletTransaction.update({
        where: { id: buyerTransaction.id },
        data: { status: 'completed' },
      });
    }

    const escrowRecord = await tx.escrowTransaction.findUnique({
      where: { id: escrow.id },
      include: { product: { select: { title: true } } },
    });

    await tx.walletTransaction.create({
      data: {
        user_id: escrowRecord.seller_id,
        type: 'sale',
        amount: sellerPayout,
        description: `Vente : ${escrowRecord.product.title}`,
        status: 'completed',
        reference_type: 'escrow',
        reference_id: escrow.id,
      },
    });
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

  await prisma.escrowTransaction.update({
    where: { id },
    data: { status: 'pending_delivery' },
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

export async function confirmDelivery(id, buyerId) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id },
    select: { id: true, buyer_id: true, seller_id: true, amount: true, fee: true, status: true },
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
      include: { product: { select: { title: true } } },
    });

    await tx.walletTransaction.create({
      data: {
        user_id: escrow.seller_id,
        type: 'sale',
        amount: sellerPayout,
        description: `Vente : ${escrowRecord.product.title}`,
        status: 'completed',
        reference_type: 'escrow',
        reference_id: id,
      },
    });
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
    select: { id: true, buyer_id: true, status: true },
  });

  if (!escrow) {
    const error = new Error('Transaction introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== userId) {
    const error = new Error('Seul l\'acheteur peut annuler la transaction');
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'pending') {
    const error = new Error('Seules les transactions en attente peuvent être annulées');
    error.status = 400;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.update({
      where: { id },
      data: { status: 'cancelled' },
    });

    const pendingTx = await tx.walletTransaction.findFirst({
      where: { reference_type: 'escrow', reference_id: id, user_id: userId, status: 'pending' },
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
