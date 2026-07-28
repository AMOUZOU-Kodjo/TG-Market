import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.js';
import * as authController from './auth.controller.js';
import * as twoFactorController from './twoFactor.controller.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  refreshTokenSchema,
  enableTwoFactorSchema,
  disableTwoFactorSchema,
  verifyTwoFactorSchema,
} from './auth.validation.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/logout', auth, authLimiter, authController.logout);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.get('/me', auth, authController.getMe);
router.put('/profile', auth, validate(updateProfileSchema), authController.updateProfile);
router.put('/change-password', auth, validate(changePasswordSchema), authLimiter, authController.changePassword);
router.post('/forgot-password', otpLimiter, validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), authController.resetPassword);
router.get('/sessions', auth, authController.getSessions);
router.delete('/sessions/others', auth, authController.revokeOtherSessions);
router.get('/login-history', auth, authController.getLoginHistory);

// 2FA
router.get('/2fa/status', auth, twoFactorController.getTwoFactorStatus);
router.post('/2fa/generate', auth, twoFactorController.generateSecret);
router.post('/2fa/enable', auth, validate(enableTwoFactorSchema), twoFactorController.enableTwoFactor);
router.post('/2fa/disable', auth, validate(disableTwoFactorSchema), twoFactorController.disableTwoFactor);
router.post('/2fa/verify', authLimiter, validate(verifyTwoFactorSchema), twoFactorController.verifyTwoFactor);

export default router;
