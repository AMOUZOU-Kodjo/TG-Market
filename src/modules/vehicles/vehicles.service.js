import prisma from '../../config/database.js';

function formatVehicle(vehicle, userId = null) {
  const product = vehicle.product;
  return {
    id: vehicle.id,
    type: vehicle.type,
    title: product.title,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    mileage: vehicle.mileage,
    fuel: vehicle.fuel,
    transmission: vehicle.transmission,
    engineSize: vehicle.engine_size,
    horsepower: vehicle.horsepower,
    color: vehicle.color,
    owners: vehicle.owners,
    documentsAvailable: {
      carteGrise: vehicle.doc_carte_grise,
      insurance: vehicle.doc_insurance,
      technicalInspection: vehicle.doc_inspection,
    },
    description: product.description,
    condition: product.condition,
    price: product.price,
    originalPrice: product.original_price,
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
      return { product: { created_at: 'asc' } };
    case 'price_asc':
      return { product: { price: 'asc' } };
    case 'price_desc':
      return { product: { price: 'desc' } };
    case 'popular':
      return [{ product: { views: 'desc' } }, { product: { favorites_count: 'desc' } }];
    case 'newest':
    default:
      return { product: { created_at: 'desc' } };
  }
}

const vehicleInclude = {
  product: {
    include: {
      images: { select: { url: true, sort_order: true } },
      tags: { select: { tag: true } },
      specifications: { select: { label: true, value: true } },
      category: { select: { id: true, name: true, slug: true } },
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
    },
  },
};

export async function listVehicles(filters, userId = null) {
  const { q, type, brands, models, minYear, maxYear, minMileage, maxMileage, fuel, transmission, conditions, minPrice, maxPrice, city, sort, page, perPage } = filters;

  const where = { product: { status: 'active' } };

  if (q) {
    where.product.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { tags: { some: { tag: { contains: q, mode: 'insensitive' } } } },
      { vehicle: { brand: { contains: q, mode: 'insensitive' } } },
      { vehicle: { model: { contains: q, mode: 'insensitive' } } },
    ];
  }

  if (type) {
    where.type = type;
  }

  if (brands) {
    const values = brands.split(',').map((s) => s.trim());
    if (values.length > 0) {
      where.brand = { in: values };
    }
  }

  if (models) {
    const values = models.split(',').map((s) => s.trim());
    if (values.length > 0) {
      where.model = { in: values };
    }
  }

  if (minYear !== undefined || maxYear !== undefined) {
    where.year = {};
    if (minYear !== undefined) where.year.gte = minYear;
    if (maxYear !== undefined) where.year.lte = maxYear;
  }

  if (minMileage !== undefined || maxMileage !== undefined) {
    where.mileage = {};
    if (minMileage !== undefined) where.mileage.gte = minMileage;
    if (maxMileage !== undefined) where.mileage.lte = maxMileage;
  }

  if (fuel) {
    where.fuel = { equals: fuel, mode: 'insensitive' };
  }

  if (transmission) {
    where.transmission = { equals: transmission, mode: 'insensitive' };
  }

  if (conditions) {
    const values = conditions.split(',').map((s) => s.trim());
    const valid = values.filter((v) => ['new', 'like_new', 'good', 'fair', 'poor'].includes(v));
    if (valid.length > 0) {
      where.product.condition = { in: valid };
    }
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.product.price = {};
    if (minPrice !== undefined) where.product.price.gte = minPrice;
    if (maxPrice !== undefined) where.product.price.lte = maxPrice;
  }

  if (city) {
    where.product.city = { equals: city, mode: 'insensitive' };
  }

  const orderBy = buildSortOption(sort);
  const skip = (page - 1) * perPage;

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      include: {
        ...vehicleInclude,
        ...(userId
          ? { product: { include: { favorites: { where: { user_id: userId }, select: { user_id: true } } } } }
          : {}),
      },
      orderBy,
      skip,
      take: perPage,
    }),
    prisma.vehicle.count({ where }),
  ]);

  return {
    vehicles: vehicles.map((v) => formatVehicle(v, userId)),
    total,
  };
}

export async function getVehicleById(id, userId = null) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      ...vehicleInclude,
      ...(userId
        ? { product: { include: { favorites: { where: { user_id: userId }, select: { user_id: true } } } } }
        : {}),
    },
  });

  if (!vehicle || vehicle.product.status === 'deleted') {
    const error = new Error('Véhicule introuvable');
    error.status = 404;
    throw error;
  }

  return formatVehicle(vehicle, userId);
}

export async function createVehicle(userId, data) {
  const category = await prisma.category.findUnique({
    where: { id: data.categoryId },
    select: { id: true },
  });

  if (!category) {
    const error = new Error('Catégorie introuvable');
    error.status = 404;
    throw error;
  }

  const vehicle = await prisma.$transaction(async (tx) => {
    const product = await tx.product.create({
      data: {
        user_id: userId,
        category_id: data.categoryId,
        title: data.title,
        description: data.description,
        price: data.price,
        original_price: data.originalPrice ?? null,
        condition: data.condition,
        brand: data.brand,
        city: data.city,
        neighborhood: data.neighborhood ?? null,
        negotiable: data.negotiable ?? false,
        delivery_available: data.deliveryAvailable ?? false,
        delivery_price: data.deliveryPrice ?? null,
      },
    });

    if (data.images && data.images.length > 0) {
      await tx.productImage.createMany({
        data: data.images.map((url, i) => ({
          product_id: product.id,
          url,
          sort_order: i,
        })),
      });
    }

    if (data.tags && data.tags.length > 0) {
      await tx.productTag.createMany({
        data: data.tags.map((tag) => ({
          product_id: product.id,
          tag: tag.toLowerCase().trim(),
        })),
      });
    }

    if (data.specifications && data.specifications.length > 0) {
      await tx.productSpec.createMany({
        data: data.specifications.map((spec) => ({
          product_id: product.id,
          label: spec.label,
          value: spec.value,
        })),
      });
    }

    const vehicle = await tx.vehicle.create({
      data: {
        product_id: product.id,
        type: data.type,
        brand: data.brand,
        model: data.model,
        year: data.year,
        mileage: data.mileage,
        fuel: data.fuel,
        transmission: data.transmission,
        engine_size: data.engineSize ?? null,
        horsepower: data.horsepower ?? null,
        color: data.color ?? null,
        owners: data.owners ?? null,
        doc_carte_grise: data.documentsAvailable?.carteGrise ?? false,
        doc_insurance: data.documentsAvailable?.insurance ?? false,
        doc_inspection: data.documentsAvailable?.technicalInspection ?? false,
      },
    });

    await tx.user.update({
      where: { id: userId },
      data: { product_count: { increment: 1 } },
    });

    await tx.category.update({
      where: { id: data.categoryId },
      data: { product_count: { increment: 1 } },
    });

    return vehicle;
  });

  return getVehicleById(vehicle.id, userId);
}

export async function updateVehicle(id, data, userId) {
  const existing = await prisma.vehicle.findUnique({
    where: { id },
    select: {
      id: true,
      product_id: true,
      product: { select: { id: true, user_id: true, status: true, category_id: true } },
    },
  });

  if (!existing || existing.product.status === 'deleted') {
    const error = new Error('Véhicule introuvable');
    error.status = 404;
    throw error;
  }

  if (existing.product.user_id !== userId) {
    const error = new Error('Non autorisé à modifier ce véhicule');
    error.status = 403;
    throw error;
  }

  if (data.categoryId && data.categoryId !== existing.product.category_id) {
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
    const productUpdate = {};
    if (data.categoryId !== undefined) productUpdate.category_id = data.categoryId;
    if (data.title !== undefined) productUpdate.title = data.title;
    if (data.description !== undefined) productUpdate.description = data.description;
    if (data.price !== undefined) productUpdate.price = data.price;
    if (data.originalPrice !== undefined) productUpdate.original_price = data.originalPrice;
    if (data.condition !== undefined) productUpdate.condition = data.condition;
    if (data.brand !== undefined) productUpdate.brand = data.brand;
    if (data.city !== undefined) productUpdate.city = data.city;
    if (data.neighborhood !== undefined) productUpdate.neighborhood = data.neighborhood;
    if (data.negotiable !== undefined) productUpdate.negotiable = data.negotiable;
    if (data.deliveryAvailable !== undefined) productUpdate.delivery_available = data.deliveryAvailable;
    if (data.deliveryPrice !== undefined) productUpdate.delivery_price = data.deliveryPrice;

    if (Object.keys(productUpdate).length > 0) {
      await tx.product.update({ where: { id: existing.product_id }, data: productUpdate });
    }

    if (data.images) {
      await tx.productImage.deleteMany({ where: { product_id: existing.product_id } });
      if (data.images.length > 0) {
        await tx.productImage.createMany({
          data: data.images.map((url, i) => ({
            product_id: existing.product_id,
            url,
            sort_order: i,
          })),
        });
      }
    }

    if (data.tags) {
      await tx.productTag.deleteMany({ where: { product_id: existing.product_id } });
      if (data.tags.length > 0) {
        await tx.productTag.createMany({
          data: data.tags.map((tag) => ({
            product_id: existing.product_id,
            tag: tag.toLowerCase().trim(),
          })),
        });
      }
    }

    if (data.specifications) {
      await tx.productSpec.deleteMany({ where: { product_id: existing.product_id } });
      if (data.specifications.length > 0) {
        await tx.productSpec.createMany({
          data: data.specifications.map((spec) => ({
            product_id: existing.product_id,
            label: spec.label,
            value: spec.value,
          })),
        });
      }
    }

    const vehicleUpdate = {};
    if (data.type !== undefined) vehicleUpdate.type = data.type;
    if (data.brand !== undefined) vehicleUpdate.brand = data.brand;
    if (data.model !== undefined) vehicleUpdate.model = data.model;
    if (data.year !== undefined) vehicleUpdate.year = data.year;
    if (data.mileage !== undefined) vehicleUpdate.mileage = data.mileage;
    if (data.fuel !== undefined) vehicleUpdate.fuel = data.fuel;
    if (data.transmission !== undefined) vehicleUpdate.transmission = data.transmission;
    if (data.engineSize !== undefined) vehicleUpdate.engine_size = data.engineSize;
    if (data.horsepower !== undefined) vehicleUpdate.horsepower = data.horsepower;
    if (data.color !== undefined) vehicleUpdate.color = data.color;
    if (data.owners !== undefined) vehicleUpdate.owners = data.owners;
    if (data.documentsAvailable !== undefined) {
      vehicleUpdate.doc_carte_grise = data.documentsAvailable.carteGrise ?? false;
      vehicleUpdate.doc_insurance = data.documentsAvailable.insurance ?? false;
      vehicleUpdate.doc_inspection = data.documentsAvailable.technicalInspection ?? false;
    }

    if (Object.keys(vehicleUpdate).length > 0) {
      await tx.vehicle.update({ where: { id }, data: vehicleUpdate });
    }

    if (data.categoryId && data.categoryId !== existing.product.category_id) {
      await tx.category.update({
        where: { id: existing.product.category_id },
        data: { product_count: { decrement: 1 } },
      });
      await tx.category.update({
        where: { id: data.categoryId },
        data: { product_count: { increment: 1 } },
      });
    }
  });

  return getVehicleById(id, userId);
}

export async function getBrands() {
  const results = await prisma.vehicle.findMany({
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });

  return results.map((r) => r.brand);
}

export async function getModelsByBrand(brand) {
  const results = await prisma.vehicle.findMany({
    where: { brand },
    select: { model: true },
    distinct: ['model'],
    orderBy: { model: 'asc' },
  });

  return results.map((r) => r.model);
}
