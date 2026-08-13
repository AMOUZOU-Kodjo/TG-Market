import prisma from '../../config/database.js';

function formatReview(review) {
  return {
    id: review.id,
    sellerId: review.seller_id,
    reviewer: {
      id: review.reviewer.id,
      name: `${review.reviewer.first_name} ${review.reviewer.last_name}`,
      avatar: review.reviewer.avatar,
    },
    rating: review.rating,
    comment: review.comment,
    productTitle: review.product?.title ?? null,
    createdAt: review.created_at,
  };
}

export async function getReviewsBySeller(sellerId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const where = { seller_id: sellerId };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        reviewer: {
          select: { id: true, first_name: true, last_name: true, avatar: true },
        },
        product: {
          select: { title: true },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews: await withVoteCounts(reviews),
    total,
  };
}

export async function getMyReviews(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const where = { reviewer_id: userId };

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        reviewer: {
          select: { id: true, first_name: true, last_name: true, avatar: true },
        },
        product: {
          select: { title: true },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews: await withVoteCounts(reviews),
    total,
  };
}

export async function createReview(userId, data) {
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id: data.escrowId },
    select: { id: true, buyer_id: true, seller_id: true, status: true, product_id: true },
  });

  if (!escrow) {
    const error = new Error('Transaction escrow introuvable');
    error.status = 404;
    throw error;
  }

  if (escrow.buyer_id !== userId) {
    const error = new Error("Vous ne pouvez laisser un avis que pour vos propres achats");
    error.status = 403;
    throw error;
  }

  if (escrow.status !== 'completed') {
    const error = new Error("La transaction doit être terminée pour laisser un avis");
    error.status = 400;
    throw error;
  }

  const existing = await prisma.review.findUnique({
    where: { reviewer_id_escrow_id: { reviewer_id: userId, escrow_id: data.escrowId } },
    select: { id: true },
  });

  if (existing) {
    const error = new Error('Vous avez déjà laissé un avis pour cette transaction');
    error.status = 409;
    throw error;
  }

  const review = await prisma.$transaction(async (tx) => {
    const created = await tx.review.create({
      data: {
        reviewer_id: userId,
        seller_id: escrow.seller_id,
        product_id: escrow.product_id ?? null,
        escrow_id: data.escrowId,
        rating: data.rating,
        comment: data.comment,
      },
      include: {
        reviewer: {
          select: { id: true, first_name: true, last_name: true, avatar: true },
        },
        product: {
          select: { title: true },
        },
      },
    });

    const stats = await tx.review.aggregate({
      where: { seller_id: escrow.seller_id },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await tx.user.update({
      where: { id: escrow.seller_id },
      data: {
        rating_avg: stats._avg.rating ?? 0,
        review_count: stats._count.rating,
      },
    });

    return created;
  });

  return formatReview(review);
}

async function withVoteCounts(reviews) {
  if (!reviews.length) return [];
  const ids = reviews.map((r) => r.id);
  const votes = await prisma.reviewVote.groupBy({
    by: ['review_id', 'vote'],
    where: { review_id: { in: ids } },
    _count: true,
  });
  const counts = {};
  for (const v of votes) {
    counts[v.review_id] ??= { helpfulCount: 0, unhelpfulCount: 0 };
    if (v.vote) counts[v.review_id].helpfulCount = v._count;
    else counts[v.review_id].unhelpfulCount = v._count;
  }
  return reviews.map((r) => ({ ...formatReview(r), ...(counts[r.id] ?? { helpfulCount: 0, unhelpfulCount: 0 }) }));
}

export async function toggleReviewVote(userId, reviewId, vote) {
  const review = await prisma.review.findUnique({ where: { id: reviewId }, select: { id: true } });
  if (!review) {
    const error = new Error('Avis introuvable');
    error.status = 404;
    throw error;
  }

  const existing = await prisma.reviewVote.findUnique({
    where: { review_id_user_id: { review_id: reviewId, user_id: userId } },
  });

  if (existing) {
    if (existing.vote === vote) {
      await prisma.reviewVote.delete({ where: { id: existing.id } });
    } else {
      await prisma.reviewVote.update({ where: { id: existing.id }, data: { vote } });
    }
  } else {
    await prisma.reviewVote.create({ data: { review_id: reviewId, user_id: userId, vote } });
  }

  const counts = await prisma.reviewVote.groupBy({
    by: ['vote'],
    where: { review_id: reviewId },
    _count: true,
  });

  return {
    reviewId,
    state: existing && existing.vote === vote ? null : vote,
    helpfulCount: counts.find((c) => c.vote === true)?._count ?? 0,
    unhelpfulCount: counts.find((c) => c.vote === false)?._count ?? 0,
  };
}
