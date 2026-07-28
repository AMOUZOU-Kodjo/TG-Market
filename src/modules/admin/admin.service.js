import prisma from '../../config/database.js';

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

  const monthlyData = await prisma.$queryRaw`
    SELECT
      to_char(created_at, 'YYYY-MM') AS month,
      COUNT(*)::int AS products
    FROM "Product"
    WHERE created_at >= (NOW() - INTERVAL '12 months')
      AND status != 'deleted'
    GROUP BY month
    ORDER BY month ASC
  `;

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

export async function getUsers({ page, perPage, skip }) {
  const where = {};

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
        role: true,
        identity_verified: true,
        is_active: true,
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
      role: u.role,
      identityVerified: u.identity_verified,
      isActive: u.is_active,
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
      condition: p.condition,
      status: p.status,
      city: p.city,
      views: p.views,
      favoritesCount: p.favorites_count,
      user: {
        id: p.user.id,
        firstName: p.user.first_name,
        lastName: p.user.last_name,
        avatar: p.user.avatar,
      },
      category: p.category,
      createdAt: p.created_at,
    })),
    total,
  };
}

export async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
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
        data: { sort_order: sortOrder, parent_id: parentId ?? null },
      })
    )
  );

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
  return { message: 'Catégorie supprimée' };
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

  await prisma.product.update({
    where: { id: productId },
    data: { status },
  });

  return { message: 'Statut du produit mis à jour avec succès' };
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
      status: t.status,
      paymentMethod: t.payment_method,
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
