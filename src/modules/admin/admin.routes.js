import { Router } from 'express';
import { z } from 'zod';
import { auth, admin as adminMiddleware } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import { validate } from '../../middleware/validate.js';
import * as adminController from './admin.controller.js';

const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
    slug: z.string().min(1).max(100),
    icon: z.string().max(50).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    sortOrder: z.number().int().min(0).optional(),
    parentId: z.number().int().positive().nullable().optional(),
  }),
});

const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    slug: z.string().min(1).max(100).optional(),
    icon: z.string().max(50).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    sortOrder: z.number().int().min(0).optional(),
    parentId: z.number().int().positive().nullable().optional(),
  }),
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const reorderCategoriesSchema = z.object({
  body: z.object({
    updates: z.array(
      z.object({
        id: z.number().int().positive(),
        sortOrder: z.number().int().min(0),
        parentId: z.number().int().positive().nullable().optional(),
      })
    ),
  }),
});

const deleteCategorySchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
});

const createSpecTemplateSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    label: z.string().min(1).max(100),
    inputType: z.enum(['text', 'number', 'select']).default('text'),
    options: z.array(z.string()).max(50).optional(),
    required: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

const updateSpecTemplateSchema = z.object({
  params: z.object({
    templateId: z.string().regex(/^\d+$/),
  }),
  body: z.object({
    label: z.string().min(1).max(100).optional(),
    inputType: z.enum(['text', 'number', 'select']).optional(),
    options: z.array(z.string()).max(50).optional(),
    required: z.boolean().optional(),
    sortOrder: z.number().int().min(0).optional(),
  }),
});

const deleteSpecTemplateSchema = z.object({
  params: z.object({
    templateId: z.string().regex(/^\d+$/),
  }),
});

const router = Router();

router.use(auth, adminMiddleware);

router.get('/stats', adminController.getStats);
router.get('/users', pagination, adminController.getUsers);
router.put('/users/:id/status', adminController.updateUserStatus);
router.put('/users/:id/role', adminController.updateUserRole);
router.put('/users/:id/professional', adminController.updateUserProfessional);
router.put('/users/:id/trusted', adminController.updateUserTrusted);
router.delete('/users/:id', adminController.deleteUser);
router.get('/products', pagination, adminController.getProducts);
router.get('/products/:id', adminController.getProductDetail);
router.put('/products/:id', adminController.updateProductAdmin);
router.put('/products/:id/status', adminController.updateProductStatus);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);
router.get('/categories', adminController.getCategories);
router.post('/categories', validate(createCategorySchema), adminController.createCategory);
router.put('/categories/reorder', validate(reorderCategoriesSchema), adminController.reorderCategories);
router.put('/categories/:id', validate(updateCategorySchema), adminController.updateCategory);
router.delete('/categories/:id', validate(deleteCategorySchema), adminController.deleteCategory);
router.get('/categories/:id/spec-templates', adminController.getCategorySpecTemplates);
router.post('/categories/:id/spec-templates', validate(createSpecTemplateSchema), adminController.createSpecTemplate);
router.put('/categories/spec-templates/:templateId', validate(updateSpecTemplateSchema), adminController.updateSpecTemplate);
router.delete('/categories/spec-templates/:templateId', validate(deleteSpecTemplateSchema), adminController.deleteSpecTemplate);
router.get('/kyc/pending', pagination, adminController.getKycPending);
router.put('/kyc/:id/approve', adminController.approveKyc);
router.put('/kyc/:id/reject', adminController.rejectKyc);
router.get('/escrow', pagination, adminController.getEscrowTransactions);
router.get('/activity', adminController.getRecentActivity);
router.post('/seed', adminController.runSeed);
router.get('/contact-messages', pagination, adminController.getContactMessages);
router.get('/contact-messages/:id', adminController.getContactMessage);
router.put('/contact-messages/:id/read', adminController.markContactMessageRead);
router.post('/contact-messages/:id/reply', adminController.replyContactMessage);
router.post('/wallet/credit', adminController.creditWallet);
router.put('/escrow/:id/verify', adminController.verifyPaymentAdmin);
router.put('/escrow/:id/resolve', adminController.resolveEscrowDispute);
router.get('/reports', pagination, adminController.getAdminReports);
router.put('/reports/:id/resolve', adminController.resolveReport);
router.put('/reports/:id/dismiss', adminController.dismissReport);
router.get('/payouts', pagination, adminController.getPayouts);
router.put('/payouts/:id/mark-paid', adminController.markPayoutPaid);
router.put('/payouts/:id/retry', adminController.retryPayout);

export default router;
