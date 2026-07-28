import prisma from '../../config/database.js';

export async function getAllCategories() {
  const categories = await prisma.category.findMany({
    where: { is_active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
      description: true,
      image: true,
      parent_id: true,
      product_count: true,
    },
    orderBy: { sort_order: 'asc' },
  });

  const flat = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
    description: c.description,
    image: c.image,
    parentId: c.parent_id ?? null,
    productCount: c.product_count,
  }));

  const map = new Map(flat.map((c) => [c.id, { ...c, children: [] }]));
  const roots = [];

  for (const cat of map.values()) {
    if (cat.parentId && map.has(cat.parentId)) {
      map.get(cat.parentId).children.push(cat);
    } else if (!cat.parentId) {
      roots.push(cat);
    } else {
      roots.push(cat);
    }
  }

  return roots;
}

export async function getCategoryBySlug(slug) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      icon: true,
      color: true,
      description: true,
      image: true,
      parent_id: true,
      product_count: true,
      is_active: true,
      parent: {
        select: { id: true, name: true, slug: true },
      },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          icon: true,
          color: true,
          product_count: true,
        },
        orderBy: { sort_order: 'asc' },
      },
    },
  });

  if (!category || !category.is_active) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    color: category.color,
    description: category.description,
    image: category.image,
    parentId: category.parent_id ?? null,
    parent: category.parent ?? null,
    children: (category.children ?? []).map((ch) => ({
      id: ch.id,
      name: ch.name,
      slug: ch.slug,
      icon: ch.icon,
      color: ch.color,
      productCount: ch.product_count,
    })),
    productCount: category.product_count,
  };
}

const sortOptions = {
  newest: { created_at: 'desc' },
  oldest: { created_at: 'asc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
  popular: { views: 'desc' },
};

export async function getCategoryProducts(slug, { page, perPage, condition, minPrice, maxPrice, city, sort }) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, parent_id: true, is_active: true },
  });

  if (!category || !category.is_active) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  // If it's a mega-category (no parent), include products from all children
  const categoryIds = [category.id];
  if (category.parent_id === null) {
    const children = await prisma.category.findMany({
      where: { parent_id: category.id, is_active: true },
      select: { id: true },
    });
    children.forEach((ch) => categoryIds.push(ch.id));
  }

  const where = {
    category_id: { in: categoryIds },
    status: 'active',
  };

  if (condition) {
    where.condition = condition;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) where.price.gte = minPrice;
    if (maxPrice !== undefined) where.price.lte = maxPrice;
  }

  if (city) {
    where.city = city;
  }

  const orderBy = sortOptions[sort] || sortOptions.newest;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: {
        id: true,
        title: true,
        price: true,
        original_price: true,
        condition: true,
        city: true,
        neighborhood: true,
        negotiable: true,
        views: true,
        favorites_count: true,
        is_urgent: true,
        is_promoted: true,
        created_at: true,
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
            identity_verified: true,
          },
        },
        images: {
          select: { url: true },
          take: 1,
          orderBy: { sort_order: 'asc' },
        },
      },
      orderBy,
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const formatted = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    originalPrice: p.original_price,
    condition: p.condition,
    city: p.city,
    neighborhood: p.neighborhood,
    negotiable: p.negotiable,
    views: p.views,
    favoritesCount: p.favorites_count,
    isUrgent: p.is_urgent,
    isPromoted: p.is_promoted,
    createdAt: p.created_at,
    image: p.images[0]?.url || null,
    seller: {
      id: p.user.id,
      name: `${p.user.first_name} ${p.user.last_name}`,
      avatar: p.user.avatar,
      verified: p.user.identity_verified,
    },
  }));

  return { products: formatted, total };
}
