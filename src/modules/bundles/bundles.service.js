import prisma from '../../config/database.js';

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

export async function getPublicBundles({ page, perPage }) {
  const skip = (page - 1) * perPage;

  const [bundles, total] = await Promise.all([
    prisma.bundle.findMany({
      where: { status: 'active' },
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