import prisma from '../../config/database.js';
import { getPlatformFeePercent, getBuyerFeePercent } from '../../utils/platformFee.js';

async function formatOffer(offer) {
  let escrowId = null;
  if (offer.status === 'accepted') {
    const escrow = await prisma.escrowTransaction.findFirst({
      where: {
        product_id: offer.product_id,
        buyer_id: offer.buyer_id,
        seller_id: offer.seller_id,
      },
      select: { id: true },
      orderBy: { created_at: 'desc' },
    });
    escrowId = escrow?.id ?? null;
  }

  return {
    id: offer.id,
    escrowId,
    productId: offer.product_id,
    buyerId: offer.buyer_id,
    sellerId: offer.seller_id,
    amount: offer.amount,
    status: offer.status,
    message: offer.message,
    counteredAmount: offer.countered_amount,
    createdAt: offer.created_at,
    updatedAt: offer.updated_at,
    product: offer.product
      ? {
          id: offer.product.id,
          title: offer.product.title,
          price: offer.product.price,
          status: offer.product.status,
          thumbnail: offer.product.images?.[0]?.url ?? null,
        }
      : null,
    buyer: offer.buyer
      ? {
          id: offer.buyer.id,
          name: `${offer.buyer.first_name} ${offer.buyer.last_name}`,
          avatar: offer.buyer.avatar,
        }
      : null,
    seller: offer.seller
      ? {
          id: offer.seller.id,
          name: `${offer.seller.first_name} ${offer.seller.last_name}`,
          avatar: offer.seller.avatar,
        }
      : null,
  };
}

export async function createOffer(productId, buyerId, amount, message) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true, status: true },
  });

  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (product.status !== 'active') {
    const error = new Error('Ce produit n\'est plus disponible');
    error.status = 400;
    throw error;
  }

  if (product.user_id === buyerId) {
    const error = new Error('Vous ne pouvez pas faire une offre sur votre propre produit');
    error.status = 400;
    throw error;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { has_active_negotiation: true },
  });

  const offer = await prisma.offer.create({
    data: {
      product_id: productId,
      buyer_id: buyerId,
      seller_id: product.user_id,
      amount,
      message,
    },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            select: { url: true },
            orderBy: { sort_order: 'asc' },
            take: 1,
          },
        },
      },
      buyer: {
        select: { id: true, first_name: true, last_name: true, avatar: true },
      },
      seller: {
        select: { id: true, first_name: true, last_name: true, avatar: true },
      },
    },
  });

  return await formatOffer(offer);
}

export async function getMyOffers(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const where = {
    OR: [{ buyer_id: userId }, { seller_id: userId }],
  };

  const [offers, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            title: true,
            price: true,
            status: true,
            images: {
              select: { url: true },
              orderBy: { sort_order: 'asc' },
              take: 1,
            },
          },
        },
        buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.offer.count({ where }),
  ]);

  return {
    offers: await Promise.all(offers.map((o) => formatOffer(o))),
    total,
  };
}

export async function getOfferById(offerId, userId) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            select: { url: true },
            orderBy: { sort_order: 'asc' },
            take: 1,
          },
        },
      },
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  if (!offer) {
    const error = new Error('Offre introuvable');
    error.status = 404;
    throw error;
  }

  if (offer.buyer_id !== userId && offer.seller_id !== userId) {
    const error = new Error('Non autorisÃ©');
    error.status = 403;
    throw error;
  }

  return await formatOffer(offer);
}

export async function acceptOffer(offerId, sellerId) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, product_id: true, buyer_id: true, seller_id: true, amount: true, status: true },
  });

  if (!offer) {
    const error = new Error('Offre introuvable');
    error.status = 404;
    throw error;
  }

  if (offer.seller_id !== sellerId) {
    const error = new Error('Seul le vendeur peut accepter cette offre');
    error.status = 403;
    throw error;
  }

  if (offer.status !== 'pending') {
    const error = new Error('Cette offre a dÃ©jÃ  Ã©tÃ© traitÃ©e');
    error.status = 400;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: offer.product_id },
    select: { id: true, title: true, status: true, user_id: true },
  });

  if (!product || product.status !== 'active') {
    const error = new Error('Ce produit n\'est plus disponible');
    error.status = 400;
    throw error;
  }

  const feePercent = await getPlatformFeePercent();
  const fee = Math.round(offer.amount * (feePercent / 100));
  const buyerFeePercent = await getBuyerFeePercent();
  const buyerFee = Math.round(offer.amount * (buyerFeePercent / 100));

  await prisma.$transaction(async (tx) => {
    await tx.offer.update({
      where: { id: offerId },
      data: { status: 'accepted' },
    });

    await tx.escrowTransaction.create({
      data: {
        product_id: offer.product_id,
        buyer_id: offer.buyer_id,
        seller_id: offer.seller_id,
        amount: offer.amount,
        fee,
        buyer_fee: buyerFee,
        status: 'pending',
      },
    });

    await tx.product.update({
      where: { id: offer.product_id },
      data: { status: 'reserved', has_active_negotiation: false },
    });
  });

  const updated = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            select: { url: true },
            orderBy: { sort_order: 'asc' },
            take: 1,
          },
        },
      },
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  return await formatOffer(updated);
}

export async function rejectOffer(offerId, sellerId) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, seller_id: true, status: true },
  });

  if (!offer) {
    const error = new Error('Offre introuvable');
    error.status = 404;
    throw error;
  }

  if (offer.seller_id !== sellerId) {
    const error = new Error('Seul le vendeur peut rejeter cette offre');
    error.status = 403;
    throw error;
  }

  if (offer.status !== 'pending') {
    const error = new Error('Cette offre a dÃ©jÃ  Ã©tÃ© traitÃ©e');
    error.status = 400;
    throw error;
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: { status: 'rejected' },
  });

  const updated = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            select: { url: true },
            orderBy: { sort_order: 'asc' },
            take: 1,
          },
        },
      },
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  return await formatOffer(updated);
}

export async function cancelOffer(offerId, userId) {
  const offer = await prisma.offer.findUnique({
    where: { id: offerId },
    select: { id: true, buyer_id: true, status: true },
  });

  if (!offer) {
    const error = new Error('Offre introuvable');
    error.status = 404;
    throw error;
  }

  if (offer.buyer_id !== userId) {
    const error = new Error('Seul l\'acheteur peut annuler cette offre');
    error.status = 403;
    throw error;
  }

  if (offer.status !== 'pending') {
    const error = new Error('Seules les offres en attente peuvent Ãªtre annulÃ©es');
    error.status = 400;
    throw error;
  }

  await prisma.offer.update({
    where: { id: offerId },
    data: { status: 'cancelled' },
  });

  const updated = await prisma.offer.findUnique({
    where: { id: offerId },
    include: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          images: {
            select: { url: true },
            orderBy: { sort_order: 'asc' },
            take: 1,
          },
        },
      },
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  return await formatOffer(updated);
}
