import prisma from '../../config/database.js';
import { invalidateCache, invalidateCacheByPattern } from '../../utils/cache.js';
import { deleteUserData } from '../../utils/userCleanup.js';
import { grantBadge } from '../../utils/badges.js';

function invalidateCategoriesCache() {
  invalidateCache('cache:categories:tree');
  invalidateCacheByPattern('cache:category:*');
}

const MONTHS_BACK = 11;

function last12Months() {
  const months = [];
  const now = new Date();
  for (let i = MONTHS_BACK; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return months;
}

async function buildMonthlyData() {
  const [products, users, sales, views, volume] = await Promise.all([
    prisma.$queryRaw`
      SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "Product"
      WHERE created_at >= NOW() - INTERVAL '12 months' AND status != 'deleted'
      GROUP BY month`,
    prisma.$queryRaw`
      SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "User"
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month`,
    prisma.$queryRaw`
      SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "EscrowTransaction"
      WHERE created_at >= NOW() - INTERVAL '12 months' AND status = 'completed'
      GROUP BY month`,
    prisma.$queryRaw`
      SELECT to_char(created_at, 'YYYY-MM') AS month, COUNT(*)::int AS count
      FROM "ProductView"
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY month`,
    prisma.$queryRaw`
      SELECT to_char(created_at, 'YYYY-MM') AS month,
             COALESCE(SUM(amount), 0)::int AS volume,
             COALESCE(SUM(fee), 0)::int AS fees
      FROM "EscrowTransaction"
      WHERE created_at >= NOW() - INTERVAL '12 months' AND status = 'completed'
      GROUP BY month`,
  ]);

  const toMap = (rows) => new Map(rows.map((r) => [r.month, r.count ?? r]));

  const productMap = toMap(products);
  const userMap = toMap(users);
  const salesMap = toMap(sales);
  const viewsMap = toMap(views);
  const volumeMap = new Map(volume.map((r) => [r.month, { volume: r.volume, fees: r.fees }]));

  return last12Months().map((month) => ({
    month,
    products: productMap.get(month) ?? 0,
    users: userMap.get(month) ?? 0,
    sales: salesMap.get(month) ?? 0,
    views: viewsMap.get(month) ?? 0,
    volume: volumeMap.get(month)?.volume ?? 0,
    fees: volumeMap.get(month)?.fees ?? 0,
  }));
}

export async function getStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    totalProducts,
    totalSales,
    totalViews,
    activeListings,
    uniqueCities,
    totalCategories,
    recentProducts,
    topSellers,
    escrowStats,
    newUsersThisMonth,
    newProductsThisMonth,
    salesThisMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count({ where: { status: { not: 'deleted' } } }),
    prisma.escrowTransaction.count({ where: { status: 'completed' } }),
    prisma.product.aggregate({ _sum: { views: true } }),
    prisma.product.count({ where: { status: 'active' } }),
    prisma.user.findMany({ select: { city: true }, distinct: ['city'] }),
    prisma.category.count(),
    prisma.product.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        price: true,
        created_at: true,
        user: { select: { id: true, first_name: true, last_name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: 'user' },
      orderBy: { rating_avg: 'desc' },
      take: 10,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        avatar: true,
        rating_avg: true,
        review_count: true,
        product_count: true,
        city: true,
      },
    }),
    prisma.escrowTransaction.aggregate({
      _sum: { amount: true, fee: true },
      _count: true,
    }),
    prisma.user.count({ where: { created_at: { gte: startOfMonth } } }),
    prisma.product.count({
      where: {
        status: { not: 'deleted' },
        created_at: { gte: startOfMonth },
      },
    }),
    prisma.escrowTransaction.count({
      where: {
        status: 'completed',
        created_at: { gte: startOfMonth },
      },
    }),
  ]);

  const monthlyData = await buildMonthlyData();

  const weeklyData = await prisma.$queryRaw`
    SELECT
      to_char(created_at, 'YYYY-MM-DD') AS day,
      COUNT(*)::int AS products
    FROM "Product"
    WHERE created_at >= (NOW() - INTERVAL '7 days')
      AND status != 'deleted'
    GROUP BY day
    ORDER BY day ASC
  `;

  const recentActivity = await prisma.product.findMany({
    orderBy: { created_at: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      price: true,
      status: true,
      created_at: true,
      user: { select: { id: true, first_name: true, last_name: true, avatar: true } },
    },
  });

  return {
    totalUsers,
    totalProducts,
    totalSales,
    totalViews: totalViews._sum.views || 0,
    activeListings,
    cities: uniqueCities.length,
    categories: totalCategories,
    monthlyData,
    weeklyData,
    recentActivity,
    topSellers: topSellers.map((s) => ({
      id: s.id,
      firstName: s.first_name,
      lastName: s.last_name,
      avatar: s.avatar,
      ratingAvg: s.rating_avg,
      reviewCount: s.review_count,
      productCount: s.product_count,
      city: s.city,
    })),
    platformFees: {
      totalFees: escrowStats._sum.fee || 0,
      totalVolume: escrowStats._sum.amount || 0,
      totalTransactions: escrowStats._count,
    },
    newUsersThisMonth,
    newProductsThisMonth,
    salesThisMonth,
  };
}

export async function getUsers({ page, perPage, skip, role, isActive }) {
  const where = {};
  if (role) where.role = role;
  if (isActive !== undefined) where.is_active = isActive === 'true';

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        city: true,
        avatar: true,
        role: true,
        identity_verified: true,
        is_active: true,
        is_professional: true,
        is_trusted: true,
        product_count: true,
        rating_avg: true,
        review_count: true,
        created_at: true,
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users.map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      city: u.city,
      avatar: u.avatar,
      role: u.role,
      identityVerified: u.identity_verified,
      isActive: u.is_active,
      isProfessional: u.is_professional,
      isTrusted: u.is_trusted,
      productCount: u.product_count,
      ratingAvg: u.rating_avg,
      reviewCount: u.review_count,
      createdAt: u.created_at,
    })),
    total,
  };
}

export async function updateUserStatus(userId, isActive) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, is_active: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { is_active: isActive },
  });

  return { message: `Utilisateur ${isActive ? 'activé' : 'désactivé'} avec succès` };
}

export async function updateUserRole(userId, role) {
  const validRoles = ['user', 'admin'];
  if (!validRoles.includes(role)) {
    const error = new Error('Rôle invalide. Valeurs acceptées : user, admin');
    error.status = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  return { message: `Rôle mis à jour vers "${role}" avec succès` };
}

export async function updateUserProfessional(userId, enabled) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, is_professional: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { is_professional: enabled },
  });

  if (enabled) {
    await grantBadge(userId, 'professional_seller');
  }

  return { message: `Vendeur professionnel ${enabled ? 'activé' : 'désactivé'} avec succès` };
}

export async function updateUserTrusted(userId, enabled) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, is_trusted: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { is_trusted: enabled },
  });

  if (enabled) {
    await grantBadge(userId, 'trusted_seller');
  }

  return { message: `Vendeur de confiance ${enabled ? 'activé' : 'désactivé'} avec succès` };
}

export async function deleteUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (!user) {
    const error = new Error('Utilisateur introuvable');
    error.status = 404;
    throw error;
  }

  if (user.role === 'admin') {
    const error = new Error('Impossible de supprimer un administrateur');
    error.status = 403;
    throw error;
  }

  await deleteUserData(userId);
  return { message: 'Utilisateur supprimé avec succès' };
}

export async function deleteProduct(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.escrowTransaction.deleteMany({ where: { product_id: productId } });
  await prisma.product.delete({ where: { id: productId } });
  return { message: 'Produit supprimé avec succès' };
}

export async function getProducts({ page, perPage, skip }) {
  const where = { status: { not: 'deleted' } };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            avatar: true,
          },
        },
        category: { select: { id: true, name: true } },
        images: { select: { url: true }, orderBy: { sort_order: 'asc' }, take: 1 },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      originalPrice: p.original_price,
      condition: p.condition,
      status: p.status,
      city: p.city,
      neighborhood: p.neighborhood,
      isUrgent: p.is_urgent,
      isPromoted: p.is_promoted,
      isFeatured: p.is_featured,
      views: p.views,
      favoritesCount: p.favorites_count,
      user: {
        id: p.user.id,
        firstName: p.user.first_name,
        lastName: p.user.last_name,
        avatar: p.user.avatar,
      },
      category: p.category,
      images: p.images.map((i) => i.url),
      createdAt: p.created_at,
    })),
    total,
  };
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true, specTemplates: true } },
    },
    orderBy: { sort_order: 'asc' },
  });

return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
    sortOrder: c.sort_order,
    productCount: c._count.products,
    specTemplateCount: c._count.specTemplates,
    parentId: c.parent_id,
  }));
}

export async function createCategory(data) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) {
    const error = new Error('Ce slug existe déjà');
    error.status = 409;
    throw error;
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      icon: data.icon ?? 'Package',
      color: data.color ?? '#01796F',
      sort_order: data.sortOrder ?? 0,
      parent_id: data.parentId ?? null,
    },
    include: { _count: { select: { products: true } } },
  });

  invalidateCategoriesCache();

  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    icon: category.icon,
    color: category.color,
    sortOrder: category.sort_order,
    productCount: category._count.products,
    parentId: category.parent_id,
  };
}

export async function updateCategory(id, data) {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  if (data.name && data.name !== category.name) {
    const existingName = await prisma.category.findUnique({ where: { name: data.name } });
    if (existingName) {
      const error = new Error('Ce nom existe déjà');
      error.status = 409;
      throw error;
    }
  }

  if (data.slug && data.slug !== category.slug) {
    const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
    if (existing) {
      const error = new Error('Ce slug existe déjà');
      error.status = 409;
      throw error;
    }
  }

  if (data.parentId !== undefined) {
    if (data.parentId === id) {
      const error = new Error('Une catégorie ne peut pas être son propre parent');
      error.status = 400;
      throw error;
    }
    if (data.parentId !== null) {
      const parent = await prisma.category.findUnique({ where: { id: data.parentId } });
      if (!parent) {
        const error = new Error('Catégorie parente introuvable');
        error.status = 404;
        throw error;
      }
    }
  }

  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: data.name ?? category.name,
      slug: data.slug ?? category.slug,
      icon: data.icon ?? category.icon,
      color: data.color ?? category.color,
      sort_order: data.sortOrder ?? category.sort_order,
      parent_id: data.parentId ?? category.parent_id,
    },
    include: { _count: { select: { products: true } } },
  });

  invalidateCategoriesCache();

  return {
    id: updated.id,
    name: updated.name,
    slug: updated.slug,
    icon: updated.icon,
    color: updated.color,
    sortOrder: updated.sort_order,
    productCount: updated._count.products,
    parentId: updated.parent_id,
  };
}

export async function reorderCategories(updates) {
  await prisma.$transaction(
    updates.map(({ id, sortOrder, parentId }) =>
      prisma.category.update({
        where: { id },
        data: {
          sort_order: sortOrder,
          ...(parentId !== undefined ? { parent_id: parentId } : {}),
        },
      })
    )
  );

  invalidateCategoriesCache();

  return { message: 'Ordre mis à jour' };
}

export async function deleteCategory(id) {
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true, children: true } } },
  });

  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  if (category._count.products > 0) {
    const error = new Error(`Impossible de supprimer : ${category._count.products} annonce(s) liée(s)`);
    error.status = 409;
    throw error;
  }

  if (category._count.children > 0) {
    const error = new Error('Impossible de supprimer : cette catégorie a des sous-catégories');
    error.status = 409;
    throw error;
  }

  await prisma.category.delete({ where: { id } });
  invalidateCategoriesCache();
  return { message: 'Catégorie supprimée' };
}

export async function getCategorySpecTemplates(categoryId) {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  const templates = await prisma.categorySpecTemplate.findMany({
    where: { category_id: categoryId },
    orderBy: { sort_order: 'asc' },
  });

  return templates.map((t) => ({
    id: t.id,
    categoryId: t.category_id,
    label: t.label,
    inputType: t.input_type,
    options: t.options,
    required: t.required,
    sortOrder: t.sort_order,
  }));
}

export async function createSpecTemplate(categoryId, data) {
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  const last = await prisma.categorySpecTemplate.findFirst({
    where: { category_id: categoryId },
    orderBy: { sort_order: 'desc' },
    select: { sort_order: true },
  });

  const template = await prisma.categorySpecTemplate.create({
    data: {
      category_id: categoryId,
      label: data.label,
      input_type: data.inputType ?? 'text',
      options: data.inputType === 'select' ? (data.options ?? []) : [],
      required: data.required ?? false,
      sort_order: data.sortOrder ?? (last ? last.sort_order + 1 : 0),
    },
  });

  return {
    id: template.id,
    categoryId: template.category_id,
    label: template.label,
    inputType: template.input_type,
    options: template.options,
    required: template.required,
    sortOrder: template.sort_order,
  };
}

export async function updateSpecTemplate(templateId, data) {
  const template = await prisma.categorySpecTemplate.findUnique({ where: { id: templateId } });
  if (!template) {
    const error = new Error('Champ personnalisé introuvable');
    error.status = 404;
    throw error;
  }

  const updated = await prisma.categorySpecTemplate.update({
    where: { id: templateId },
    data: {
      ...(data.label !== undefined ? { label: data.label } : {}),
      ...(data.inputType !== undefined ? { input_type: data.inputType } : {}),
      ...(data.inputType === 'select' && data.options !== undefined
        ? { options: data.options }
        : data.inputType === 'select'
          ? {}
          : data.inputType !== undefined
            ? { options: [] }
            : {}),
      ...(data.required !== undefined ? { required: data.required } : {}),
      ...(data.sortOrder !== undefined ? { sort_order: data.sortOrder } : {}),
    },
  });

  return {
    id: updated.id,
    categoryId: updated.category_id,
    label: updated.label,
    inputType: updated.input_type,
    options: updated.options,
    required: updated.required,
    sortOrder: updated.sort_order,
  };
}

export async function deleteSpecTemplate(templateId) {
  const template = await prisma.categorySpecTemplate.findUnique({ where: { id: templateId } });
  if (!template) {
    const error = new Error('Champ personnalisé introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.categorySpecTemplate.delete({ where: { id: templateId } });
  return { message: 'Champ personnalisé supprimé' };
}

export async function updateProductStatus(productId, status) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, status: true },
  });

  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  if (product.status === 'sold' && status === 'active') {
    const error = new Error('Un produit vendu ne peut pas être remis en vente');
    error.status = 400;
    throw error;
  }

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  return { message: 'Statut du produit mis à jour avec succès' };
}

export async function getProductDetail(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      user: { select: { id: true, first_name: true, last_name: true, avatar: true, phone: true } },
      category: { select: { id: true, name: true, slug: true } },
      images: { select: { url: true, sort_order: true }, orderBy: { sort_order: 'asc' } },
      tags: { select: { tag: true } },
      specifications: { select: { label: true, value: true } },
      vehicle: true,
    },
  });

  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    originalPrice: product.original_price,
    condition: product.condition,
    brand: product.brand,
    city: product.city,
    neighborhood: product.neighborhood,
    negotiable: product.negotiable,
    deliveryAvailable: product.delivery_available,
    deliveryPrice: product.delivery_price,
    status: product.status,
    isUrgent: product.is_urgent,
    isPromoted: product.is_promoted,
    isFeatured: product.is_featured,
    views: product.views,
    favoritesCount: product.favorites_count,
    createdAt: product.created_at,
    user: {
      id: product.user.id,
      firstName: product.user.first_name,
      lastName: product.user.last_name,
      avatar: product.user.avatar,
      phone: product.user.phone,
    },
    category: product.category,
    images: product.images.map((i) => i.url),
    tags: product.tags.map((t) => t.tag),
    specifications: product.specifications,
    vehicle: product.vehicle,
  };
}

export async function updateProductAdmin(productId, data) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, category_id: true },
  });

  if (!product) {
    const error = new Error('Produit introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.$transaction(async (tx) => {
    const updateData = {};
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
    if (data.status !== undefined) updateData.status = data.status;
    if (data.isUrgent !== undefined) updateData.is_urgent = data.isUrgent;
    if (data.isPromoted !== undefined) updateData.is_promoted = data.isPromoted;
    if (data.isFeatured !== undefined) updateData.is_featured = data.isFeatured;
    if (data.categoryId !== undefined) updateData.category_id = data.categoryId;

    if (Object.keys(updateData).length > 0) {
      await tx.product.update({ where: { id: productId }, data: updateData });
    }

    if (data.images) {
      await tx.productImage.deleteMany({ where: { product_id: productId } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url, i) => ({ product_id: productId, url, sort_order: i })),
        });
      }
    }

    if (data.tags) {
      await tx.productTag.deleteMany({ where: { product_id: productId } });
      if (data.tags.length > 0) {
        await tx.productTag.createMany({
          data: data.tags.map((tag) => ({ product_id: productId, tag: tag.toLowerCase().trim() })),
        });
      }
    }

    if (data.specifications) {
      await tx.productSpec.deleteMany({ where: { product_id: productId } });
      if (data.specifications.length > 0) {
        await tx.productSpec.createMany({
          data: data.specifications.map((s) => ({ product_id: productId, label: s.label, value: s.value })),
        });
      }
    }

    if (data.categoryId && data.categoryId !== product.category_id) {
      await tx.category.update({ where: { id: product.category_id }, data: { product_count: { decrement: 1 } } });
      await tx.category.update({ where: { id: data.categoryId }, data: { product_count: { increment: 1 } } });
    }
  });

  return getProductDetail(productId);
}

export async function getKycPending({ page, perPage, skip }) {
  const where = { status: 'pending' };

  const [verifications, total] = await Promise.all([
    prisma.kycVerification.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: { submitted_at: 'asc' },
      skip,
      take: perPage,
    }),
    prisma.kycVerification.count({ where }),
  ]);

  return {
    data: verifications.map((k) => ({
      id: k.id,
      documentType: k.document_type,
      documentFrontUrl: k.document_front_url,
      documentBackUrl: k.document_back_url,
      selfieUrl: k.selfie_url,
      status: k.status,
      submittedAt: k.submitted_at,
      user: {
        id: k.user.id,
        firstName: k.user.first_name,
        lastName: k.user.last_name,
        email: k.user.email,
        phone: k.user.phone,
        avatar: k.user.avatar,
      },
    })),
    total,
  };
}

export async function approveKyc(id, adminId) {
  const kyc = await prisma.kycVerification.findUnique({
    where: { id },
    select: { id: true, user_id: true, status: true },
  });

  if (!kyc) {
    const error = new Error('Vérification KYC introuvable');
    error.status = 404;
    throw error;
  }

  if (kyc.status !== 'pending') {
    const error = new Error('Cette vérification KYC a déjà été traitée');
    error.status = 400;
    throw error;
  }

  await prisma.$transaction([
    prisma.kycVerification.update({
      where: { id },
      data: {
        status: 'approved',
        reviewed_by: adminId,
        reviewed_at: new Date(),
      },
    }),
    prisma.user.update({
      where: { id: kyc.user_id },
      data: { identity_verified: true },
    }),
  ]);

  await grantBadge(kyc.user_id, 'identity_verified');

  return { message: 'Vérification KYC approuvée avec succès' };
}

export async function rejectKyc(id, adminId, reason) {
  const kyc = await prisma.kycVerification.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!kyc) {
    const error = new Error('Vérification KYC introuvable');
    error.status = 404;
    throw error;
  }

  if (kyc.status !== 'pending') {
    const error = new Error('Cette vérification KYC a déjà été traitée');
    error.status = 400;
    throw error;
  }

  await prisma.kycVerification.update({
    where: { id },
    data: {
      status: 'rejected',
      rejection_reason: reason,
      reviewed_by: adminId,
      reviewed_at: new Date(),
    },
  });

  return { message: 'Vérification KYC rejetée' };
}

export async function getEscrowTransactions({ page, perPage, skip }) {
  const [transactions, total] = await Promise.all([
    prisma.escrowTransaction.findMany({
      include: {
        product: { select: { id: true, title: true } },
        buyer: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.escrowTransaction.count(),
  ]);

  return {
    data: transactions.map((t) => ({
      id: t.id,
      amount: t.amount,
      fee: t.fee,
      buyerFee: t.buyer_fee,
      status: t.status,
      paymentMethod: t.payment_method,
      paymentRef: t.payment_ref,
      disputeReason: t.dispute_reason,
      confirmedAt: t.confirmed_at,
      releasedAt: t.released_at,
      createdAt: t.created_at,
      product: t.product,
      buyer: {
        id: t.buyer.id,
        firstName: t.buyer.first_name,
        lastName: t.buyer.last_name,
        avatar: t.buyer.avatar,
      },
      seller: {
        id: t.seller.id,
        firstName: t.seller.first_name,
        lastName: t.seller.last_name,
        avatar: t.seller.avatar,
      },
    })),
    total,
  };
}

export async function getRecentActivity() {
  const [recentProducts, recentUsers, recentEscrows] = await Promise.all([
    prisma.product.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        created_at: true,
        user: { select: { id: true, first_name: true, last_name: true, avatar: true } },
      },
    }),
    prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        avatar: true,
        city: true,
        created_at: true,
      },
    }),
    prisma.escrowTransaction.findMany({
      orderBy: { created_at: 'desc' },
      take: 10,
      include: {
        product: { select: { id: true, title: true } },
        buyer: { select: { id: true, first_name: true, last_name: true } },
        seller: { select: { id: true, first_name: true, last_name: true } },
      },
    }),
  ]);

  return {
    recentProducts: recentProducts.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      status: p.status,
      createdAt: p.created_at,
      user: {
        id: p.user.id,
        firstName: p.user.first_name,
        lastName: p.user.last_name,
        avatar: p.user.avatar,
      },
    })),
    recentUsers: recentUsers.map((u) => ({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      avatar: u.avatar,
      city: u.city,
      createdAt: u.created_at,
    })),
    recentEscrows: recentEscrows.map((e) => ({
      id: e.id,
      amount: e.amount,
      fee: e.fee,
      status: e.status,
      createdAt: e.created_at,
      product: e.product,
      buyer: {
        id: e.buyer.id,
        firstName: e.buyer.first_name,
        lastName: e.buyer.last_name,
      },
      seller: {
        id: e.seller.id,
        firstName: e.seller.first_name,
        lastName: e.seller.last_name,
      },
    })),
  };
}

const DEFAULT_SETTINGS = {
  site_name: 'TG-Market',
  site_logo: '',
  site_version: '1.0.0',
  site_description: 'La plateforme togolaise de vente et d\'achat d\'articles d\'occasion',
  support_email: 'support@akmarket.tg',
  platform_fee_percent: '5',
  platform_buyer_fee_percent: '0',
  payment_provider: '',
  maintenance_mode: 'false',
  maintenance_message: 'est actuellement en maintenance pour améliorer vos services. Nous serons de retour très bientôt !',
  maintenance_estimated_return: '24 juillet 2026 à 18h00 (GMT+0)',
  maintenance_improvements: JSON.stringify([
    'Système de paiement sécurisé via Mobile Money',
    'Performance et vitesse de chargement',
    'Nouvelles fonctionnalités de messagerie',
  ]),
  social_facebook: 'https://facebook.com/tgmarket',
  social_twitter: 'https://twitter.com/tgmarket',
  social_instagram: 'https://instagram.com/tgmarket',
  social_linkedin: 'https://linkedin.com/company/tgmarket',
  social_github: 'https://github.com/AMOUZOU-Kodjo/TG-Market',
  team_members: JSON.stringify([
    {
      name: 'Amouzou Kodjo',
      role: 'Co-fondateur & Développeur Frontend',
      initials: 'AK',
      photo: '',
      bio: "Architecte de l'interface TG-Market. Passionné par les interfaces fluides et l'expérience utilisateur mobile.",
      linkedin: '#',
      facebook: '#',
      twitter: '#',
      instagram: '#',
      github: '#',
    },
    {
      name: 'Awougno Kofi Yosua',
      role: 'Co-fondateur & Développeur Backend',
      initials: 'AY',
      photo: '',
      bio: 'Cerveau technique derrière l\'API, la sécurité et l\'infrastructure. Garant de la fiabilité du système.',
      linkedin: '#',
      facebook: '#',
      twitter: '#',
      instagram: '#',
      github: '#',
    },
  ]),
};

export async function getSettings() {
  const rows = await prisma.siteSetting.findMany();
  const map = {};
  for (const row of rows) map[row.key] = row.value;
  const result = {};
  for (const [key, fallback] of Object.entries(DEFAULT_SETTINGS)) {
    result[key] = map[key] ?? fallback;
  }
  return result;
}

export async function updateSettings(data) {
  const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
  await prisma.$transaction(
    entries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );
  invalidateCache('cache:settings:public');
  return getSettings();
}

export async function getPublicSettings() {
  const rows = await prisma.siteSetting.findMany({
    where: { key: { in: ['site_name', 'site_logo', 'site_version', 'site_description', 'maintenance_mode', 'maintenance_message', 'maintenance_estimated_return', 'maintenance_improvements', 'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin', 'team_members', 'platform_fee_percent', 'platform_buyer_fee_percent'] } },
  });
  const map = {};
  for (const row of rows) map[row.key] = row.value;
  return {
    siteName: map.site_name ?? DEFAULT_SETTINGS.site_name,
    siteLogo: map.site_logo ?? DEFAULT_SETTINGS.site_logo,
    siteVersion: map.site_version ?? DEFAULT_SETTINGS.site_version,
    siteDescription: map.site_description ?? DEFAULT_SETTINGS.site_description,
    maintenanceMode: map.maintenance_mode === 'true',
    maintenanceMessage: map.maintenance_message ?? DEFAULT_SETTINGS.maintenance_message,
    maintenanceEstimatedReturn: map.maintenance_estimated_return ?? DEFAULT_SETTINGS.maintenance_estimated_return,
    maintenanceImprovements: JSON.parse(map.maintenance_improvements ?? DEFAULT_SETTINGS.maintenance_improvements),
    socialFacebook: map.social_facebook ?? DEFAULT_SETTINGS.social_facebook,
    socialTwitter: map.social_twitter ?? DEFAULT_SETTINGS.social_twitter,
    socialInstagram: map.social_instagram ?? DEFAULT_SETTINGS.social_instagram,
    socialLinkedin: map.social_linkedin ?? DEFAULT_SETTINGS.social_linkedin,
    teamMembers: JSON.parse(map.team_members ?? DEFAULT_SETTINGS.team_members),
    platformFeePercent: Number(map.platform_fee_percent ?? DEFAULT_SETTINGS.platform_fee_percent),
    platformBuyerFeePercent: Number(map.platform_buyer_fee_percent ?? DEFAULT_SETTINGS.platform_buyer_fee_percent),
  };
}

export async function getPayouts({ page, perPage, skip }) {
  const [rows, total] = await Promise.all([
    prisma.payout.findMany({
      include: {
        seller: { select: { id: true, first_name: true, last_name: true, avatar: true } },
        escrow: {
          select: {
            id: true,
            amount: true,
            status: true,
            product: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.payout.count(),
  ]);

  return {
    data: rows.map((p) => ({
      id: p.id,
      escrowId: p.escrow_id,
      sellerId: p.seller_id,
      amount: p.amount,
      fee: p.fee,
      provider: p.provider,
      account: p.account,
      status: p.status,
      reference: p.reference,
      errorMessage: p.error_message,
      confirmedAt: p.confirmed_at,
      createdAt: p.created_at,
      productTitle: p.escrow?.product?.title ?? null,
      escrowAmount: p.escrow?.amount ?? null,
      escrowStatus: p.escrow?.status ?? null,
      seller: p.seller
        ? { id: p.seller.id, firstName: p.seller.first_name, lastName: p.seller.last_name, avatar: p.seller.avatar }
        : null,
    })),
    total,
  };
}

export async function markPayoutPaid(id) {
  const payout = await prisma.payout.findUnique({ where: { id } });
  if (!payout) {
    const error = new Error('Paiement introuvable');
    error.status = 404;
    throw error;
  }
  const updated = await prisma.payout.update({
    where: { id },
    data: { status: 'paid', confirmed_at: new Date(), error_message: null },
  });
  return updated;
}

export async function retryPayout(id) {
  const { createAndSendPayout } = await import('../payment/payout.service.js');
  const payout = await prisma.payout.findUnique({ where: { id } });
  if (!payout) {
    const error = new Error('Paiement introuvable');
    error.status = 404;
    throw error;
  }
  const escrow = await prisma.escrowTransaction.findUnique({
    where: { id: payout.escrow_id },
    select: { seller_id: true },
  });

  const updated = await createAndSendPayout({
    escrowId: payout.escrow_id,
    sellerId: payout.seller_id,
    amount: payout.amount,
    fee: payout.fee,
    provider: payout.provider,
    account: payout.account,
  });

  return updated;
}
