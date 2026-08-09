import prisma from '../../config/database.js';

function formatProduct(product, userId = null) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    condition: product.condition,
    status: product.status,
    category: product.category
      ? {
          id: product.category.id,
          name: product.category.name,
          slug: product.category.slug,
          parent: product.category.parent
            ? { id: product.category.parent.id, name: product.category.parent.name, slug: product.category.parent.slug }
            : undefined,
        }
      : undefined,
    brand: product.brand,
    images: product.images
      ? product.images.sort((a, b) => a.sort_order - b.sort_order).map((img) => img.url)
      : [],
    seller: product.user
      ? {
          id: product.user.id,
          name: `${product.user.first_name} ${product.user.last_name}`,
          avatar: product.user.avatar,
          verified: product.user.identity_verified,
          rating: product.user.rating_avg,
          reviewCount: product.user.review_count,
          productCount: product.user.product_count,
          city: product.user.city,
          district: product.user.district,
        }
      : undefined,
    city: product.city,
    neighborhood: product.neighborhood,
    negotiable: product.negotiable,
    deliveryAvailable: product.delivery_available,
    tags: product.tags ? product.tags.map((t) => t.tag) : [],
    views: product.views,
    favorites: product.favorites_count,
    hasActiveNegotiation: product.has_active_negotiation,
    isUrgent: product.is_urgent,
    isPromoted: product.is_promoted,
    isFeatured: product.is_featured,
    quantity: product.quantity,
    inStock: product.quantity > 0,
    hasActiveEscrow: product.has_active_escrow ?? false,
    specifications: product.specifications
      ? product.specifications.map((s) => ({ label: s.label, value: s.value }))
      : [],
    isFavorite: userId
      ? (product.favorites?.some((f) => f.user_id === userId) ?? false)
      : false,
    createdAt: product.created_at,
  };
}

function buildSortOption(sort) {
  switch (sort) {
    case 'oldest':
      return { created_at: 'asc' };
    case 'price_asc':
      return { price: 'asc' };
    case 'price_desc':
      return { price: 'desc' };
    case 'popular':
      return [{ views: 'desc' }, { favorites_count: 'desc' }];
    case 'newest':
    default:
      return { created_at: 'desc' };
  }
}

const productInclude = {
  category: { select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } } },
  images: { select: { url: true, sort_order: true } },
  tags: { select: { tag: true } },
  specifications: { select: { label: true, value: true } },
  user: {
    select: {
      id: true,
      first_name: true,
      last_name: true,
      avatar: true,
      identity_verified: true,
      rating_avg: true,
      review_count: true,
      product_count: true,
      city: true,
      district: true,
    },
  },
};

export async function listProducts(filters, userId = null) {
  const { q, categories, conditions, minPrice, maxPrice, city, sort, page, perPage, sellerId } = filters;
  const where = { status: 'active' };

  if (sellerId) {
    where.user_id = sellerId;
    where.status = { in: ['active', 'sold'] };
  }

  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
    ];
  }

  if (categories) {
    const ids = categories
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    if (ids.length > 0) {
      where.category_id = { in: ids };
    }
  }

  if (conditions) {
    const values = conditions.split(',').map((s) => s.trim());
    const valid = values.filter((v) =>
      ['new', 'like_new', 'good', 'fair', 'poor'].includes(v),
    );
    if (valid.length > 0) {
      where.condition = { in: valid };
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (city) {
    where.city = { equals: city, mode: 'insensitive' };
  }

  const orderBy = buildSortOption(sort);
  const skip = (page - 1) * perPage;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        ...productInclude,
        ...(userId ? { favorites: { where: { user_id: userId }, select: { user_id: true } } } : {}),
      },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const productIds = products.map((p) => p.id);
  const activeEscrows = await prisma.escrowTransaction.findMany({
    where: {
      product_id: { in: productIds },
      status: { notIn: ['cancelled', 'refunded', 'completed'] },
    },
    select: { product_id: true },
    distinct: ['product_id'],
  });
  const escrowedIds = new Set(activeEscrows.map((e) => e.product_id));

  return {
    products: products.map((p) => formatProduct({ ...p, has_active_escrow: escrowedIds.has(p.id) }, userId)),
    total,
  };
}

export async function getProductById(productId, userId = null) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      ...productInclude,
      favorites: userId ? { where: { user_id: userId }, select: { user_id: true } } : undefined,
    },
  });

  if (!product || product.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  const activeEscrow = await prisma.escrowTransaction.findFirst({
    where: {
      product_id: productId,
      status: { notIn: ['cancelled', 'refunded', 'completed'] },
    },
    select: { id: true },
  });

  return formatProduct({ ...product, has_active_escrow: !!activeEscrow }, userId);
}

export async function createProduct(userId, data) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        user_id: userId,
        category_id: data.categoryId,
        title: data.title,
        description: data.description,
        price: data.price,
        original_price: data.originalPrice ?? null,
        condition: data.condition,
        brand: data.brand ?? null,
        city: data.city,
        neighborhood: data.neighborhood ?? null,
        negotiable: data.negotiable ?? false,
        delivery_available: data.deliveryAvailable ?? false,
        delivery_price: data.deliveryPrice ?? null,
        quantity: data.quantity ?? 1,
      },
    });

    if (data.images && data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((url, i) => ({
          product_id: created.id,
          url,
          sort_order: i,
        })),
      });
    }

    if (data.tags && data.tags.length > 0) {
      await tx.productTag.createMany({
        data: data.tags.map((tag) => ({
          product_id: created.id,
          tag: tag.toLowerCase().trim(),
        })),
      });
    }

    if (data.specifications && data.specifications.length > 0) {
      await tx.productSpec.createMany({
        data: data.specifications.map((spec) => ({
          product_id: created.id,
          label: spec.label,
          value: spec.value,
        })),
      });
    }

    await tx.user.update({
      where: { id: userId },
      data: { product_count: { increment: 1 } },
    });

    await tx.category.update({
      where: { id: data.categoryId },
      data: { product_count: { increment: 1 } },
    });

    return created;
  });

  return getProductById(product.id, userId);
}

export async function updateProduct(productId, userId, data) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true, status: true, category_id: true },
  });

  if (!existing || existing.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Non autorisé à modifier ce produit');
    error.status = 403;
    throw error;
  }

  if (data.categoryId && data.categoryId !== existing.category_id) {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
      select: { id: true },
    });
    if (!category) {
      const error = new Error('Catégorie introuvable');
      error.status = 404;
      throw error;
    }
  }

  await prisma.$transaction(async (tx) => {
    const updateData = {};

    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.originalPrice !== undefined) updateData.original_price = data.originalPrice;
    if (data.condition !== undefined) updateData.condition = data.condition;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.neighborhood !== undefined) updateData.neighborhood = data.neighborhood;
    if (data.negotiable !== undefined) updateData.negotiable = data.negotiable;
    if (data.deliveryAvailable !== undefined) updateData.delivery_available = data.deliveryAvailable;
    if (data.deliveryPrice !== undefined) updateData.delivery_price = data.deliveryPrice;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;

    if (Object.keys(updateData).length > 0) {
      await tx.product.update({ where: { id: productId }, data: updateData });
    }

    if (data.images) {
      await tx.productImage.deleteMany({ where: { product_id: productId } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url, i) => ({
            product_id: productId,
            url,
            sort_order: i,
          })),
        });
      }
    }

    if (data.tags) {
      await tx.productTag.deleteMany({ where: { product_id: productId } });
      if (data.tags.length > 0) {
        await tx.productTag.createMany({
          data: data.tags.map((tag) => ({
            product_id: productId,
            tag: tag.toLowerCase().trim(),
          })),
        });
      }
    }

    if (data.specifications) {
      await tx.productSpec.deleteMany({ where: { product_id: productId } });
      if (data.specifications.length > 0) {
        await tx.productSpec.createMany({
          data: data.specifications.map((spec) => ({
            product_id: productId,
            label: spec.label,
            value: spec.value,
          })),
        });
      }
    }

    if (data.categoryId && data.categoryId !== existing.category_id) {
      await tx.category.update({
        where: { id: existing.category_id },
        data: { product_count: { decrement: 1 } },
      });
      await tx.category.update({
        where: { id: data.categoryId },
        data: { product_count: { increment: 1 } },
      });
    }
  });

  return getProductById(productId, userId);
}

export async function deleteProduct(productId, userId) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true, status: true, category_id: true },
  });

  if (!existing || existing.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Non autorisé à supprimer ce produit');
    error.status = 403;
    throw error;
  }

  const activeEscrows = await prisma.escrowTransaction.findMany({
    where: {
      product_id: productId,
      status: { notIn: ['completed', 'cancelled', 'refunded'] },
    },
    select: { id: true, status: true },
  });

  if (activeEscrows.length > 0) {
    const error = new Error('Impossible de supprimer : des transactions actives sont liées à ce produit');
    error.status = 409;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    await tx.escrowTransaction.deleteMany({
      where: { product_id: productId },
    });

    await tx.product.delete({ where: { id: productId } });

    await tx.user.update({
      where: { id: userId },
      data: { product_count: { decrement: 1 } },
    });

    await tx.category.update({
      where: { id: existing.category_id },
      data: { product_count: { decrement: 1 } },
    });
  });

  return { message: 'Produit supprimé avec succès' };
}

export async function getMyProducts(userId, page, perPage) {
  const skip = (page - 1) * perPage;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: { user_id: userId, status: { not: 'deleted' } },
      include: productInclude,
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.product.count({
      where: { user_id: userId, status: { not: 'deleted' } },
    }),
  ]);

  return {
    products: products.map((p) => formatProduct(p)),
    total,
  };
}

export async function getSimilarProducts(productId, limit = 10) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, category_id: true, status: true },
  });

  if (!product || product.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  const products = await prisma.product.findMany({
    where: {
      category_id: product.category_id,
      id: { not: productId },
      status: 'active',
    },
    include: productInclude,
    orderBy: [{ views: 'desc' }, { favorites_count: 'desc' }],
    take: limit,
  });

  return products.map((p) => formatProduct(p));
}

export async function incrementViews(productId, ip, userAgent, userId = null) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product || product.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingView = await prisma.productView.findFirst({
    where: {
      product_id: productId,
      created_at: { gte: today },
      ...(userId
        ? { user_id: userId }
        : { user_id: null, ip_address: ip }),
    },
    select: { id: true },
  });

  if (existingView) {
    return { viewed: false };
  }

  await prisma.$transaction([
    prisma.productView.create({
      data: {
        product_id: productId,
        user_id: userId,
        ip_address: ip ?? null,
        user_agent: userAgent ?? null,
      },
    }),
    prisma.product.update({
      where: { id: productId },
      data: { views: { increment: 1 } },
    }),
  ]);

  return { viewed: true };
}

export async function updateProductStatus(productId, userId, status) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true, status: true },
  });

  if (!existing || existing.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Non autorisé à modifier ce produit');
    error.status = 403;
    throw error;
  }

  if (existing.status === status) {
    const error = new Error(`Le produit est déjà en statut "${status}"`);
    error.status = 400;
    throw error;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  return { message: 'Statut mis à jour avec succès' };
}

export async function endNegotiation(productId, userId) {
  const existing = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, user_id: true, status: true, has_active_negotiation: true },
  });

  if (!existing || existing.status === 'deleted') {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (existing.user_id !== userId) {
    const error = new Error('Seul le vendeur peut arrêter la négociation');
    error.status = 403;
    throw error;
  }

  if (!existing.has_active_negotiation) {
    const error = new Error('Aucune négociation en cours sur ce produit');
    error.status = 400;
    throw error;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { has_active_negotiation: false },
  });

  return { message: 'Négociation arrêtée avec succès' };
}
