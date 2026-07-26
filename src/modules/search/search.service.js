import prisma from '../../config/database.js';

function formatSearchResult(product) {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    condition: product.condition,
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
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
        }
      : undefined,
    city: product.city,
    neighborhood: product.neighborhood,
    views: product.views,
    favorites: product.favorites_count,
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

function buildILIKEWhere(filters) {
  const { q, categories, conditions, minPrice, maxPrice, city } = filters;

  const where = { status: 'active' };

  if (q && q.trim().length > 0) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
      { vehicle: { brand: { contains: q, mode: 'insensitive' } } },
      { vehicle: { model: { contains: q, mode: 'insensitive' } } },
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
    const valid = values.filter((v) => ['new', 'like_new', 'good', 'fair', 'poor'].includes(v));
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

  return where;
}

export async function search(filters, userId = null) {
  const { q, categories, conditions, minPrice, maxPrice, city, sort, page, perPage } = filters;

  const searchTerm = q?.trim() || null;
  const where = buildILIKEWhere({ ...filters, q: searchTerm });
  const orderBy = buildSortOption(sort);
  const skip = (page - 1) * perPage;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        images: { select: { url: true, sort_order: true } },
        category: { select: { id: true, name: true, slug: true } },
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
            identity_verified: true,
          },
        },
        ...(userId ? { favorites: { where: { user_id: userId }, select: { user_id: true } } } : {}),
      },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => {
      const formatted = formatSearchResult(p);
      if (userId) {
        formatted.isFavorite = p.favorites?.some((f) => f.user_id === userId) ?? false;
      }
      return formatted;
    }),
    total,
  };
}
