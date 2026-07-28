import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import path from 'path';

import corsConfig from './config/cors.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import categoriesRoutes from './modules/categories/categories.routes.js';
import productsRoutes from './modules/products/products.routes.js';
import vehiclesRoutes from './modules/vehicles/vehicles.routes.js';
import searchRoutes from './modules/search/search.routes.js';
import conversationsRoutes from './modules/conversations/conversations.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import walletRoutes from './modules/wallet/wallet.routes.js';
import escrowRoutes from './modules/escrow/escrow.routes.js';
import reviewsRoutes from './modules/reviews/reviews.routes.js';
import favoritesRoutes from './modules/favorites/favorites.routes.js';
import kycRoutes from './modules/kyc/kyc.routes.js';
import uploadRoutes from './modules/upload/upload.routes.js';
import offersRoutes from './modules/offers/offers.routes.js';
import bundlesRoutes from './modules/bundles/bundles.routes.js';
import faqRoutes from './modules/faq/faq.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── Global Middleware ───────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// ─── Static uploads ──────────────────────────────────
app.use('/uploads', express.static(UPLOADS_DIR));
// ─── Health check ────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Public stats (homepage) ─────────────────────────
import prisma from './config/database.js';

app.get('/api/stats/public', async (_req, res) => {
  try {
    const [totalUsers, totalListings, totalSales, verifiedUsers, cities] = await Promise.all([
      prisma.user.count({ where: { is_active: true } }),
      prisma.product.count({ where: { status: 'active' } }),
      prisma.escrowTransaction.count({ where: { status: 'released' } }),
      prisma.user.count({ where: { email_verified_at: { not: null } } }),
      prisma.product.findMany({
        where: { city: { not: null } },
        select: { city: true },
        distinct: ['city'],
      }).then(rows => rows.length),
    ]);
    res.json({ totalUsers, totalListings, totalSales, verifiedUsers, cities, moderationTime: 24 });
  } catch {
    res.json({ totalUsers: 5000, totalListings: 1000, totalSales: 500, verifiedUsers: 2000, cities: 30, moderationTime: 24 });
  }
});

app.get('/api/public/reviews', async (_req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { rating: { gte: 4 } },
      orderBy: { created_at: 'desc' },
      take: 6,
      select: {
        id: true,
        rating: true,
        comment: true,
        reviewer: { select: { first_name: true, last_name: true, city: true } },
      },
    });
    res.json(reviews.map(r => ({
      id: r.id,
      name: `${r.reviewer.first_name} ${r.reviewer.last_name.charAt(0)}.`,
      city: r.reviewer.city,
      text: r.comment,
      rating: r.rating,
    })));
  } catch {
    res.json([]);
  }
});

app.get('/api/settings/public', async (_req, res) => {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ['site_name', 'site_version', 'site_description', 'maintenance_mode', 'support_email'] } },
    });
    const map = {};
    for (const row of rows) map[row.key] = row.value;
    res.json({
      siteName: map.site_name ?? 'TG-Market',
      siteVersion: map.site_version ?? '1.0.0',
      siteDescription: map.site_description ?? 'La plateforme togolaise de vente et d\'achat d\'articles d\'occasion',
      maintenanceMode: map.maintenance_mode === 'true',
      supportEmail: map.support_email ?? 'support@akmarket.tg',
    });
  } catch {
    res.json({ siteName: 'TG-Market', siteVersion: '1.0.0', siteDescription: '', maintenanceMode: false, supportEmail: 'support@akmarket.tg' });
  }
});

// ─── API Routes ──────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/vehicles', vehiclesRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/bundles', bundlesRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/admin', adminRoutes);

// ─── 404 ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ─── Error handler ───────────────────────────────────
app.use(errorHandler);

export default app;
