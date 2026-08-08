import prisma from '../../config/database.js';
import crypto from 'crypto';
import { getPlatformFeePercent, getBuyerFeePercent } from '../../utils/platformFee.js';

function formatBundle(bundle) {
  return {
    id: bundle.id,
    sellerId: bundle.seller_id,
    title: bundle.title,
    description: bundle.description,
    totalPrice: bundle.total_price,
    bundlePrice: bundle.bundle_price,
    status: bundle.status,
    createdAt: bundle.created_at,
    updatedAt: bundle.updated_at,
  };
}

function formatBundleWithItems(bundle) {
  return {
    id: bundle.id,
    sellerId: bundle.seller_id,
    title: bundle.title,
    description: bundle.description,
    totalPrice: bundle.total_price,
    bundlePrice: bundle.bundle_price,
    status: bundle.status,
    seller: bundle.seller
      ? {
          id: bundle.seller.id,
          firstName: bundle.seller.first_name,
          lastName: bundle.seller.last_name,
          avatar: bundle.seller.avatar,
        }
      : undefined,
    items: bundle.items.map((item) => ({
      id: item.id,
      productId: item.product_id,
      product: item.product
        ? {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            images: item.product.images
              ? item.product.images.map((img) => img.url)
              : [],
          }
        : undefined,
    })),
    createdAt: bundle.created_at,
    updatedAt: bundle.updated_at,
  };
}

export async function createBundle(sellerId, { title, description, productIds, bundlePrice }) {
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, user_id: sellerId, status: 'active' },
    select: { id: true, price: true },
  });

  if (products.length !== productIds.length) {
    const error = new Error("Certains produits sont introuvables, n'appartiennent pas au vendeur ou sont inactifs");
    error.status = 404;
    throw error;
  }

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);

  const bundle = await prisma.bundle.create({
    data: {
      seller_id: sellerId,
      title,
      description,
      total_price: totalPrice,
      bundle_price: bundlePrice,
    },
  });

  await prisma.bundleItem.createMany({
    data: productIds.map((productId) => ({
      bundle_id: bundle.id,
      product_id: productId,
    })),
  });

  const result = await prisma.bundle.findUnique({
    where: { id: bundle.id },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, price: true, images: { select: { url: true } } } },
        },
      },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  return formatBundleWithItems(result);
}

export async function getMyBundles(sellerId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const [bundles, total] = await Promise.all([
    prisma.bundle.findMany({
      where: { seller_id: sellerId, status: { not: 'deleted' } },
      select: {
        id: true,
        title: true,
        description: true,
        total_price: true,
        bundle_price: true,
        status: true,
        created_at: true,
        _count: { select: { items: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.bundle.count({ where: { seller_id: sellerId, status: { not: 'deleted' } } }),
  ]);

  return {
    bundles: bundles.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      totalPrice: b.total_price,
      bundlePrice: b.bundle_price,
      status: b.status,
      itemCount: b._count.items,
      createdAt: b.created_at,
    })),
    total,
  };
}

export async function getPublicBundles({ page, perPage, q }) {
  const skip = (page - 1) * perPage;

  const where = { status: 'active' };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }

  const [bundles, total] = await Promise.all([
    prisma.bundle.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        total_price: true,
        bundle_price: true,
        status: true,
        seller_id: true,
        created_at: true,
        _count: { select: { items: true } },
        items: {
          include: {
            product: { select: { id: true, title: true, price: true, images: { select: { url: true } } } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.bundle.count({ where: { status: 'active' } }),
  ]);

  return {
    bundles: bundles.map((b) => ({
      id: b.id,
      title: b.title,
      description: b.description,
      totalPrice: b.total_price,
      bundlePrice: b.bundle_price,
      sellerId: b.seller_id,
      status: b.status,
      itemCount: b._count.items,
      items: b.items.map((item) => ({
        id: item.id,
        productId: item.product_id,
        product: item.product
          ? {
              id: item.product.id,
              title: item.product.title,
              price: item.product.price,
              images: item.product.images ? item.product.images.map((img) => img.url) : [],
            }
          : undefined,
      })),
      createdAt: b.created_at,
    })),
    total,
  };
}

export async function getBundleById(bundleId) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, price: true, images: { select: { url: true } } } },
        },
      },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  if (!bundle || bundle.status === 'deleted') {
    const error = new Error("Offre groupée introuvable");
    error.status = 404;
    throw error;
  }

  return formatBundleWithItems(bundle);
}

export async function updateBundle(bundleId, sellerId, { title, description, bundlePrice }) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    select: { seller_id: true },
  });

  if (!bundle) {
    const error = new Error("Offre groupée introuvable");
    error.status = 404;
    throw error;
  }

  if (bundle.seller_id !== sellerId) {
    const error = new Error("Non autorisé");
    error.status = 403;
    throw error;
  }

  const updated = await prisma.bundle.update({
    where: { id: bundleId },
    data: { title, description, bundle_price: bundlePrice },
  });

  return formatBundle(updated);
}

export async function deleteBundle(bundleId, sellerId) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    select: { seller_id: true },
  });

  if (!bundle) {
    const error = new Error("Offre groupée introuvable");
    error.status = 404;
    throw error;
  }

  if (bundle.seller_id !== sellerId) {
    const error = new Error("Non autorisé");
    error.status = 403;
    throw error;
  }

  await prisma.bundle.update({
    where: { id: bundleId },
    data: { status: 'deleted' },
  });

  return { success: true };
}

export async function addProductToBundle(bundleId, sellerId, productId) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    select: { seller_id: true, status: true },
  });

  if (!bundle) {
    const error = new Error("Offre groupée introuvable");
    error.status = 404;
    throw error;
  }

  if (bundle.seller_id !== sellerId) {
    const error = new Error("Non autorisé");
    error.status = 403;
    throw error;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { user_id: true, status: true, price: true },
  });

  if (!product || product.status !== 'active') {
    const error = new Error("Produit introuvable ou inactif");
    error.status = 404;
    throw error;
  }

  if (product.user_id !== sellerId) {
    const error = new Error("Le produit n'appartient pas à ce vendeur");
    error.status = 403;
    throw error;
  }

  try {
    await prisma.bundleItem.create({
      data: { bundle_id: bundleId, product_id: productId },
    });
  } catch (err) {
    if (err.code === 'P2002') {
      const error = new Error('Ce produit est déjà dans le lot');
      error.status = 400;
      throw error;
    }
    throw err;
  }

  const updatedBundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, price: true, images: { select: { url: true } } } },
        },
      },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  const totalPrice = updatedBundle.items.reduce((sum, item) => {
    const price = item.product && item.product.price ? item.product.price : 0;
    return sum + price;
  }, 0);

  await prisma.bundle.update({
    where: { id: bundleId },
    data: { total_price: totalPrice },
  });

  return getBundleById(bundleId);
}

// ─── Bundle Proposals ────────────────────────────────────

function formatProposal(proposal) {
  return {
    id: proposal.id,
    bundleId: proposal.bundle_id,
    buyerId: proposal.buyer_id,
    sellerId: proposal.seller_id,
    proposedPrice: proposal.proposed_price,
    message: proposal.message,
    status: proposal.status,
    buyer: proposal.buyer ? { id: proposal.buyer.id, firstName: proposal.buyer.first_name, lastName: proposal.buyer.last_name, avatar: proposal.buyer.avatar } : undefined,
    seller: proposal.seller ? { id: proposal.seller.id, firstName: proposal.seller.first_name, lastName: proposal.seller.last_name, avatar: proposal.seller.avatar } : undefined,
    bundle: proposal.bundle ? { id: proposal.bundle.id, title: proposal.bundle.title, bundlePrice: proposal.bundle.bundle_price } : undefined,
    createdAt: proposal.created_at,
    updatedAt: proposal.updated_at,
  };
}

export async function createBundleProposal(bundleId, buyerId, { proposedPrice, message }) {
  const bundle = await prisma.bundle.findUnique({ where: { id: bundleId }, select: { seller_id: true, status: true } });
  if (!bundle || bundle.status === 'deleted') {
    const error = new Error("Lot introuvable");
    error.status = 404;
    throw error;
  }
  if (bundle.seller_id === buyerId) {
    const error = new Error("Vous ne pouvez pas faire une proposition sur votre propre lot");
    error.status = 400;
    throw error;
  }

  const proposal = await prisma.bundleProposal.create({
    data: { bundle_id: bundleId, buyer_id: buyerId, seller_id: bundle.seller_id, proposed_price: proposedPrice, message },
    include: { buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } }, seller: { select: { id: true, first_name: true, last_name: true, avatar: true } }, bundle: { select: { id: true, title: true, bundle_price: true } } },
  });

  return formatProposal(proposal);
}

export async function getBundleProposals(bundleId, userId) {
  const bundle = await prisma.bundle.findUnique({ where: { id: bundleId }, select: { seller_id: true } });
  if (!bundle) {
    const error = new Error("Lot introuvable");
    error.status = 404;
    throw error;
  }

  const where = bundle.seller_id === userId
    ? { bundle_id: bundleId }
    : { bundle_id: bundleId, buyer_id: userId };

  const proposals = await prisma.bundleProposal.findMany({
    where,
    include: {
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      bundle: { select: { id: true, title: true, bundle_price: true } },
    },
    orderBy: { created_at: 'desc' },
  });

  return proposals.map(formatProposal);
}

export async function getMyBundleProposals(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const [proposals, total] = await Promise.all([
    prisma.bundleProposal.findMany({
      where: { buyer_id: userId },
      include: {
        buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        bundle: { select: { id: true, title: true, bundle_price: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.bundleProposal.count({ where: { buyer_id: userId } }),
  ]);

  return { data: proposals.map(formatProposal), total };
}

export async function getReceivedBundleProposals(sellerId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const [proposals, total] = await Promise.all([
    prisma.bundleProposal.findMany({
      where: { seller_id: sellerId, status: { not: 'cancelled' } },
      include: {
        buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        bundle: { select: { id: true, title: true, bundle_price: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.bundleProposal.count({ where: { seller_id: sellerId, status: { not: 'cancelled' } } }),
  ]);

  return { data: proposals.map(formatProposal), total };
}

export async function acceptBundleProposal(proposalId, sellerId) {
  const proposal = await prisma.bundleProposal.findUnique({ where: { id: proposalId }, select: { seller_id: true, status: true } });
  if (!proposal || proposal.seller_id !== sellerId) {
    const error = new Error("Proposition introuvable ou non autorisée");
    error.status = 404;
    throw error;
  }
  if (proposal.status !== 'pending') {
    const error = new Error("Cette proposition n'est plus en attente");
    error.status = 400;
    throw error;
  }

  const updated = await prisma.bundleProposal.update({
    where: { id: proposalId },
    data: { status: 'accepted' },
    include: {
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      bundle: { select: { id: true, title: true, bundle_price: true } },
    },
  });

  return formatProposal(updated);
}

export async function rejectBundleProposal(proposalId, sellerId) {
  const proposal = await prisma.bundleProposal.findUnique({ where: { id: proposalId }, select: { seller_id: true, status: true } });
  if (!proposal || proposal.seller_id !== sellerId) {
    const error = new Error("Proposition introuvable ou non autorisée");
    error.status = 404;
    throw error;
  }
  if (proposal.status !== 'pending') {
    const error = new Error("Cette proposition n'est plus en attente");
    error.status = 400;
    throw error;
  }

  const updated = await prisma.bundleProposal.update({
    where: { id: proposalId },
    data: { status: 'rejected' },
    include: {
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      bundle: { select: { id: true, title: true, bundle_price: true } },
    },
  });

  return formatProposal(updated);
}

export async function cancelBundleProposal(proposalId, userId) {
  const proposal = await prisma.bundleProposal.findUnique({ where: { id: proposalId }, select: { buyer_id: true, seller_id: true, status: true } });
  if (!proposal || (proposal.buyer_id !== userId && proposal.seller_id !== userId)) {
    const error = new Error("Proposition introuvable ou non autorisée");
    error.status = 404;
    throw error;
  }
  if (proposal.status !== 'pending') {
    const error = new Error("Cette proposition n'est plus en attente");
    error.status = 400;
    throw error;
  }

  const updated = await prisma.bundleProposal.update({
    where: { id: proposalId },
    data: { status: 'cancelled' },
    include: {
      buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      bundle: { select: { id: true, title: true, bundle_price: true } },
    },
  });

  return formatProposal(updated);
}

export async function purchaseBundle(bundleId, buyerId) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, user_id: true, status: true } },
        },
      },
      seller: { select: { id: true, first_name: true, last_name: true } },
    },
  });

  if (!bundle || bundle.status === 'deleted') {
    const error = new Error('Lot introuvable');
    error.status = 404;
    throw error;
  }

  if (bundle.seller_id === buyerId) {
    const error = new Error('Vous ne pouvez pas acheter votre propre lot');
    error.status = 400;
    throw error;
  }

  const activeProducts = bundle.items.filter((item) => item.product && item.product.status === 'active');
  if (activeProducts.length === 0) {
    const error = new Error('Tous les produits de ce lot ne sont plus disponibles');
    error.status = 400;
    throw error;
  }

  const existing = await prisma.escrowTransaction.findFirst({
    where: {
      bundle_id: bundleId,
      buyer_id: buyerId,
      status: { notIn: ['cancelled', 'refunded', 'completed'] },
    },
  });

  if (existing) {
    const error = new Error('Une commande active existe déjà pour ce lot');
    error.status = 409;
    throw error;
  }

  const firstProduct = activeProducts[0].product;
  const feePercent = await getPlatformFeePercent();
  const fee = Math.round(bundle.bundle_price * (feePercent / 100));
  const buyerFeePercent = await getBuyerFeePercent();
  const buyerFee = Math.round(bundle.bundle_price * (buyerFeePercent / 100));

  const escrow = await prisma.$transaction(async (tx) => {
    const token = crypto.randomUUID();
    const created = await tx.escrowTransaction.create({
      data: {
        product_id: firstProduct.id,
        bundle_id: bundleId,
        buyer_id: buyerId,
        seller_id: bundle.seller_id,
        amount: bundle.bundle_price,
        fee,
        buyer_fee: buyerFee,
        status: 'pending',
        confirmation_token: token,
      },
    });

    await tx.walletTransaction.create({
      data: {
        user_id: buyerId,
        type: 'purchase',
        amount: bundle.bundle_price,
        description: `Achat du lot : ${bundle.title}`,
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
      bundle: { select: { id: true, title: true } },
    },
  });

  return {
    id: full.id,
    productId: full.product_id,
    bundleId: full.bundle_id,
    buyerId: full.buyer_id,
    sellerId: full.seller_id,
    amount: full.amount,
    fee: full.fee,
    status: full.status,
    confirmationToken: full.confirmation_token,
    createdAt: full.created_at,
    productTitle: full.product?.title ?? null,
    productImage: full.product?.images?.[0]?.url ?? null,
    bundleTitle: full.bundle?.title ?? null,
  };
}

export async function removeProductFromBundle(bundleId, sellerId, productId) {
  const bundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    select: { seller_id: true },
  });

  if (!bundle) {
    const error = new Error("Offre groupée introuvable");
    error.status = 404;
    throw error;
  }

  if (bundle.seller_id !== sellerId) {
    const error = new Error("Non autorisé");
    error.status = 403;
    throw error;
  }

  const item = await prisma.bundleItem.findFirst({
    where: { bundle_id: bundleId, product_id: productId },
    select: { id: true },
  });

  if (!item) {
    const error = new Error("Produit non trouvé dans ce lot");
    error.status = 404;
    throw error;
  }

  await prisma.bundleItem.delete({
    where: { id: item.id },
  });

  const updatedBundle = await prisma.bundle.findUnique({
    where: { id: bundleId },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, price: true, images: { select: { url: true } } } },
        },
      },
      seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  const totalPrice = updatedBundle.items.reduce((sum, item) => {
    const price = item.product && item.product.price ? item.product.price : 0;
    return sum + price;
  }, 0);

  await prisma.bundle.update({
    where: { id: bundleId },
    data: { total_price: totalPrice },
  });

  return getBundleById(bundleId);
}