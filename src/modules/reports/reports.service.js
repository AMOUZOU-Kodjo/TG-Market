import prisma from '../../config/database.js';

export async function createReport(data) {
  return prisma.report.create({
    data: {
      product_id: data.productId,
      reporter_id: data.reporterId,
      reason: data.reason,
      description: data.description,
    },
    include: {
      product: { select: { id: true, title: true } },
    },
  });
}

export async function getAdminReports({ page, perPage, skip }) {
  const where = {};
  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        product: { select: { id: true, title: true, status: true, price: true } },
        reporter: { select: { id: true, first_name: true, last_name: true } },
        resolver: { select: { id: true, first_name: true, last_name: true } },
      },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.report.count({ where }),
  ]);

  return {
    data: reports.map((r) => ({
      id: r.id,
      productId: r.product_id,
      productTitle: r.product.title,
      productStatus: r.product.status,
      productPrice: r.product.price,
      reporterId: r.reporter_id,
      reporterName: `${r.reporter.first_name} ${r.reporter.last_name}`,
      reason: r.reason,
      description: r.description,
      status: r.status,
      createdAt: r.created_at,
      resolvedAt: r.resolved_at,
      resolverName: r.resolver ? `${r.resolver.first_name} ${r.resolver.last_name}` : null,
    })),
    total,
  };
}

export async function resolveReport(id, resolverId) {
  return prisma.report.update({
    where: { id },
    data: { status: 'resolved', resolved_at: new Date(), resolved_by: resolverId },
  });
}

export async function dismissReport(id, resolverId) {
  return prisma.report.update({
    where: { id },
    data: { status: 'dismissed', resolved_at: new Date(), resolved_by: resolverId },
  });
}
