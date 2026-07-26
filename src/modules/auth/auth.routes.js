import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { authLimiter, otpLimiter } from '../../middleware/rateLimiter.js';
import * as authController from './auth.controller.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  refreshTokenSchema,
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

export default router;
