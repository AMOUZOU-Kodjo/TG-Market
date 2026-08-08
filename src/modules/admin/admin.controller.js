import prisma from '../../config/database.js';
import * as adminService from './admin.service.js';
import * as escrowService from '../escrow/escrow.service.js';
import * as reportsService from '../reports/reports.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';
import { sendEmail } from '../../utils/email.js';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { role, isActive } = req.query;
    const { data, total } = await adminService.getUsers({ page, perPage, skip, role, isActive });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const result = await adminService.updateUserStatus(
      Number(req.params.id),
      req.body.isActive,
    );
    try { req.app.get('io')?.emit('user_updated', { userId: Number(req.params.id) }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const result = await adminService.updateUserRole(
      Number(req.params.id),
      req.body.role,
    );
    try { req.app.get('io')?.emit('user_updated', { userId: Number(req.params.id) }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const result = await adminService.deleteUser(Number(req.params.id));
    try { req.app.get('io')?.emit('user_deleted', { userId: Number(req.params.id) }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await adminService.deleteProduct(Number(req.params.id));
    try { req.app.get('io')?.emit('product_deleted', { productId: Number(req.params.id) }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getProducts({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getProductDetail(req, res, next) {
  try {
    const product = await adminService.getProductDetail(Number(req.params.id));
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProductAdmin(req, res, next) {
  try {
    const product = await adminService.updateProductAdmin(Number(req.params.id), req.body);
    try { req.app.get('io')?.emit('product_updated', { product }); } catch {}
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await adminService.getCategories();
    res.json({ data: categories });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const category = await adminService.createCategory(req.validated.body);
    try { req.app.get('io')?.emit('categories_updated', {}); } catch {}
    res.status(201).json({ data: category });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await adminService.updateCategory(Number(req.params.id), req.validated.body);
    try { req.app.get('io')?.emit('categories_updated', {}); } catch {}
    res.json({ data: category });
  } catch (err) {
    next(err);
  }
}

export async function reorderCategories(req, res, next) {
  try {
    const result = await adminService.reorderCategories(req.validated.body.updates);
    try { req.app.get('io')?.emit('categories_updated', {}); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const result = await adminService.deleteCategory(Number(req.params.id));
    try { req.app.get('io')?.emit('categories_updated', {}); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProductStatus(req, res, next) {
  try {
    const result = await adminService.updateProductStatus(
      Number(req.params.id),
      req.body.status,
    );
    try { req.app.get('io')?.emit('product_updated', { product: { id: Number(req.params.id), status: req.body.status } }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getKycPending(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getKycPending({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function approveKyc(req, res, next) {
  try {
    const result = await adminService.approveKyc(Number(req.params.id), req.user.id);
    try { req.app.get('io')?.emit('kyc_updated', { kycId: Number(req.params.id), status: 'approved' }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function rejectKyc(req, res, next) {
  try {
    const result = await adminService.rejectKyc(
      Number(req.params.id),
      req.user.id,
      req.body.reason,
    );
    try { req.app.get('io')?.emit('kyc_updated', { kycId: Number(req.params.id), status: 'rejected' }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getEscrowTransactions(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getEscrowTransactions({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(req, res, next) {
  try {
    const activity = await adminService.getRecentActivity();
    res.json(activity);
  } catch (err) {
    next(err);
  }
}

export async function runSeed(req, res, next) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const seedPath = path.resolve(__dirname, '../../prisma/seed.js');
    execSync(`node ${seedPath}`, { stdio: 'pipe' });
    res.json({ success: true, message: 'Seed exécuté avec succès' });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await adminService.getSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const settings = await adminService.updateSettings(req.body);
    const io = req.app.get('io');
    if (io) io.emit('settings_changed', settings);
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function getPublicSettings(_req, res, next) {
  try {
    const settings = await adminService.getPublicSettings();
    res.json(settings);
  } catch (err) {
    next(err);
  }
}

export async function getContactMessages(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const where = {};
    if (req.query.read === 'false') where.read = false;
    if (req.query.read === 'true') where.read = true;
    const [data, total] = await Promise.all([
      prisma.contactMessage.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { created_at: 'desc' },
      }),
      prisma.contactMessage.count({ where }),
    ]);
    res.json({ data, meta: buildPaginationMeta(total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function getContactMessage(req, res, next) {
  try {
    const message = await prisma.contactMessage.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!message) return res.status(404).json({ error: 'Message introuvable' });
    res.json(message);
  } catch (err) {
    next(err);
  }
}

export async function markContactMessageRead(req, res, next) {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json(message);
  } catch (err) {
    next(err);
  }
}

export async function replyContactMessage(req, res, next) {
  try {
    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return res.status(400).json({ error: 'Le message de réponse est requis' });
    }
    const message = await prisma.contactMessage.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!message) return res.status(404).json({ error: 'Message introuvable' });
    const result = await sendEmail({
      to: message.email,
      subject: `Re: ${message.subject || 'Votre message'}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#01796F;">TG-Market — Réponse à votre message</h2>
        <p><strong>Votre message :</strong></p>
        <blockquote style="background:#f4f4f4;padding:15px;border-radius:8px;margin:10px 0;color:#555">${message.message}</blockquote>
        <p><strong>Notre réponse :</strong></p>
        <div style="background:#f0faf8;padding:15px;border-radius:8px;margin:10px 0;color:#333">${reply}</div>
        <p style="color:#999;font-size:12px;">Cordialement,<br/>L'équipe TG-Market</p>
      </div>`,
    });
    if (!result.success) {
      return res.status(502).json({ error: "L'email n'a pas pu être envoyé", detail: result.error });
    }
    await prisma.contactMessage.update({
      where: { id: Number(req.params.id) },
      data: { read: true },
    });
    res.json({ success: true, message: 'Réponse envoyée' });
  } catch (err) {
    next(err);
  }
}

export async function creditWallet(req, res, next) {
  try {
    const { userId, amount, description } = req.body;
    if (!userId || !amount || amount < 100) {
      return res.status(400).json({ error: 'Montant minimum 100 FCFA' });
    }
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' });

    const tx = await prisma.walletTransaction.create({
      data: {
        user_id: userId,
        type: 'deposit',
        amount,
        description: description || 'Crédit manuel (admin)',
        status: 'completed',
      },
    });

    try { req.app.get('io')?.emit('wallet_updated', { userId }); } catch {}
    res.json({ message: 'Wallet crédité', transaction: tx });
  } catch (err) {
    next(err);
  }
}

export async function verifyPaymentAdmin(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.verifyPayment(id);

    const io = req.app.get('io');
    if (io) {
      const { notifyUser } = await import('../notifications/notifications.service.js');
      await notifyUser(io, escrow.buyerId, {
        type: 'payment_verified',
        title: 'Paiement vérifié',
        description: `Votre paiement pour "${escrow.productTitle}" a été vérifié par l'administrateur`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
      await notifyUser(io, escrow.sellerId, {
        type: 'payment_verified',
        title: 'Paiement vérifié',
        description: `Le paiement pour "${escrow.productTitle}" a été vérifié`,
        productId: escrow.productId,
        metadata: { escrowId: escrow.id },
      });
    }

    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function getAdminReports(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await reportsService.getAdminReports({ page, perPage, skip });
    res.json({ data, meta: buildPaginationMeta(total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function resolveReport(req, res, next) {
  try {
    await reportsService.resolveReport(Number(req.params.id), req.user.id);
    try { req.app.get('io')?.emit('report_updated', { reportId: Number(req.params.id), status: 'resolved' }); } catch {}
    res.json({ message: 'Signalement résolu' });
  } catch (err) {
    next(err);
  }
}

export async function dismissReport(req, res, next) {
  try {
    await reportsService.dismissReport(Number(req.params.id), req.user.id);
    try { req.app.get('io')?.emit('report_updated', { reportId: Number(req.params.id), status: 'dismissed' }); } catch {}
    res.json({ message: 'Signalement rejeté' });
  } catch (err) {
    next(err);
  }
}

export async function getPayouts(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getPayouts({ page, perPage, skip });
    res.json({ data, meta: buildPaginationMeta(total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function markPayoutPaid(req, res, next) {
  try {
    const result = await adminService.markPayoutPaid(Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function retryPayout(req, res, next) {
  try {
    const result = await adminService.retryPayout(Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
}
