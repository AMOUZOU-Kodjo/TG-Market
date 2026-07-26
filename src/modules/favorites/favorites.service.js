import prisma from '../../config/database.js';

export async function toggleFavorite(userId, productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product || product.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  const existing = await prisma.favorite.findUnique({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
    select: { id: true },
  });

  if (existing) {
    const [, updatedProduct] = await prisma.$transaction([
      prisma.favorite.delete({ where: { id: existing.id } }),
      prisma.product.update({
        where: { id: productId },
        data: { favorites_count: { decrement: 1 } },
      }),
    ]);

    return { isFavorite: false, favoritesCount: updatedProduct.favorites_count };
  }

  const [, updatedProduct] = await prisma.$transaction([
    prisma.favorite.create({
      data: { user_id: userId, product_id: productId },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { favorites_count: { increment: 1 } },
    }),
  ]);

  return { isFavorite: true, favoritesCount: updatedProduct.favorites_count };
}

export async function removeFavorite(userId, productId) {
  const existing = await prisma.favorite.findUnique({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
    select: { id: true },
  });

  if (!existing) {
    const error = new Error('Favori introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.$transaction([
    prisma.favorite.delete({ where: { id: existing.id } }),
    prisma.product.update({
      where: { id: productId },
      data: { favorites_count: { decrement: 1 } },
    }),
  ]);

  return { message: 'Favori supprimé avec succès' };
}

export async function getMyFavorites(userId, { page, perPage }) {
  const skip = (page - 1) * perPage;

  const where = { user_id: userId };

  const [favorites, total] = await Promise.all([
    prisma.favorite.findMany({
      where,
      include: {
        product: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                avatar: true,
                identity_verified: true,
                city: true,
              },
            },
            images: { select: { url: true, sort_order: true } },
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.favorite.count({ where }),
  ]);

  return {
    favorites: favorites.map((f) => ({
      id: f.id,
      createdAt: f.created_at,
      product: {
        id: f.product.id,
        title: f.product.title,
        price: f.product.price,
        condition: f.product.condition,
        city: f.product.city,
        favoritesCount: f.product.favorites_count,
        images: f.product.images
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((img) => img.url),
        category: f.product.category,
        seller: {
          id: f.product.user.id,
          name: `${f.product.user.first_name} ${f.product.user.last_name}`,
          avatar: f.product.user.avatar,
          verified: f.product.user.identity_verified,
          city: f.product.user.city,
        },
      },
    })),
    total,
  };
}

export async function checkFavorite(userId, productId) {
  const existing = await prisma.favorite.findUnique({
    where: { user_id_product_id: { user_id: userId, product_id: productId } },
    select: { id: true },
  });

  return { isFavorite: !!existing };
}
