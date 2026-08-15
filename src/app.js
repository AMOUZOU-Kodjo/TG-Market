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
import { getOrSetCache } from './utils/cache.js';

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
import reportsRoutes from './modules/reports/reports.routes.js';
import paymentRoutes from './modules/payment/payment.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import pushRoutes from './modules/push/push.routes.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// ─── HTTPS redirect (production) ─────────────────────
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.hostname}${req.originalUrl}`);
  }
  next();
});

// ─── Global Middleware ───────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsConfig));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
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
    const stats = await getOrSetCache('cache:stats:public', 300, async () => {
      const [totalUsers, totalListings, totalSales, verifiedUsers, cities] = await Promise.all([
        prisma.user.count({ where: { is_active: true } }),
        prisma.product.count({ where: { status: 'active' } }),
        prisma.escrowTransaction.count({ where: { status: 'completed' } }),
        prisma.user.count({ where: { email_verified_at: { not: null } } }),
        prisma.product.findMany({
          where: { city: { not: '' } },
          select: { city: true },
          distinct: ['city'],
        }).then(rows => rows.length),
      ]);
      return { totalUsers, totalListings, totalSales, verifiedUsers, cities, moderationTime: 24 };
    });
    res.json(stats);
  } catch {
    res.json({ totalUsers: 5000, totalListings: 1000, totalSales: 500, verifiedUsers: 2000, cities: 30, moderationTime: 24 });
  }
});

app.get('/api/public/reviews', async (_req, res) => {
  try {
    const data = await getOrSetCache('cache:reviews:public', 300, async () => {
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
      return reviews.map(r => ({
        id: r.id,
        name: `${r.reviewer.first_name} ${r.reviewer.last_name.charAt(0)}.`,
        city: r.reviewer.city,
        text: r.comment,
        rating: r.rating,
      }));
    });
    res.json(data);
  } catch {
    res.json([]);
  }
});

app.get('/api/settings/public', async (_req, res) => {
  try {
    const data = await getOrSetCache('cache:settings:public', 600, async () => {
      const rows = await prisma.siteSetting.findMany({
        where: { key: { in: ['site_name', 'site_logo', 'site_version', 'site_description', 'maintenance_mode', 'support_email', 'maintenance_message', 'maintenance_estimated_return', 'maintenance_improvements', 'social_facebook', 'social_twitter', 'social_instagram', 'social_linkedin', 'team_members', 'platform_fee_percent', 'platform_buyer_fee_percent'] } },
      });
      const map = {};
      for (const row of rows) map[row.key] = row.value;
      return {
        siteName: map.site_name ?? 'TG-Market',
        siteLogo: map.site_logo ?? '',
        siteVersion: map.site_version ?? '1.0.0',
        siteDescription: map.site_description ?? 'La plateforme togolaise de vente et d\'achat d\'articles d\'occasion',
        maintenanceMode: map.maintenance_mode === 'true',
        supportEmail: map.support_email ?? 'support@akmarket.tg',
        maintenanceMessage: map.maintenance_message ?? 'est actuellement en maintenance pour améliorer vos services. Nous serons de retour très bientôt !',
        maintenanceEstimatedReturn: map.maintenance_estimated_return ?? '24 juillet 2026 à 18h00 (GMT+0)',
        maintenanceImprovements: JSON.parse(map.maintenance_improvements ?? '["Système de paiement sécurisé via Mobile Money","Performance et vitesse de chargement","Nouvelles fonctionnalités de messagerie"]'),
        socialFacebook: map.social_facebook ?? 'https://facebook.com/tgmarket',
        socialTwitter: map.social_twitter ?? 'https://twitter.com/tgmarket',
        socialInstagram: map.social_instagram ?? 'https://instagram.com/tgmarket',
        socialLinkedin: map.social_linkedin ?? 'https://linkedin.com/company/tgmarket',
        teamMembers: JSON.parse(map.team_members ?? '[{"name":"Amouzou Kodjo","role":"Co-fondateur & Développeur Frontend","initials":"AK","photo":"","bio":"Architecte de l\'interface TG-Market.","linkedin":"#","facebook":"#","twitter":"#","instagram":"#"}]'),
        platformFeePercent: Number(map.platform_fee_percent ?? 5),
        platformBuyerFeePercent: Number(map.platform_buyer_fee_percent ?? 0),
      };
    });
    res.json(data);
  } catch {
    res.json({ siteName: 'TG-Market', siteVersion: '1.0.0', siteDescription: '', maintenanceMode: false, supportEmail: 'support@akmarket.tg' });
  }
});

app.post('/api/maintenance/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email valide requis' });
    }
    const existing = await prisma.siteSetting.findUnique({ where: { key: 'maintenance_subscribers' } });
    const subscribers = existing ? JSON.parse(existing.value) : [];
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      await prisma.siteSetting.upsert({
        where: { key: 'maintenance_subscribers' },
        update: { value: JSON.stringify(subscribers) },
        create: { key: 'maintenance_subscribers', value: JSON.stringify(subscribers) },
      });
    }
    res.json({ success: true, message: 'Inscription réussie' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'inscription' });
  }
});

// ─── Contact form ────────────────────────────────────
import { sendEmail } from './utils/email.js';

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nom, email et message sont requis' });
  }

  await prisma.contactMessage.create({
    data: { name, email, subject, message },
  });

  sendEmail({
    to: 'phipsipy@gmail.com',
    subject: `[Contact] ${subject || 'Nouveau message'} de ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #01796F;">Nouveau message de contact</h2>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;">
          <tr><td style="padding:8px;font-weight:bold;color:#333;">Nom</td><td style="padding:8px;">${name}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#333;">Email</td><td style="padding:8px;">${email}</td></tr>
          ${subject ? `<tr><td style="padding:8px;font-weight:bold;color:#333;">Sujet</td><td style="padding:8px;">${subject}</td></tr>` : ''}
        </table>
        <div style="background:#f4f4f4;padding:20px;border-radius:8px;">
          <p style="font-weight:bold;color:#333;">Message :</p>
          <p style="color:#555;line-height:1.6;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      </div>
    `,
  }).catch(() => {});

  res.json({ success: true, message: 'Message envoyé avec succès' });
});

// ─── API Routes / routes api ──────────────────────────────────────
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
app.use('/api/reports', reportsRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/push', pushRoutes);

// ─── 404 ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ─── Error handler ───────────────────────────────────
app.use(errorHandler);

export default app;
