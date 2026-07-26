import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { otpLimiter } from '../../middleware/rateLimiter.js';
import * as kycController from './kyc.controller.js';
import { submitKycSchema, verifyOtpSchema, sendOtpSchema } from './kyc.validation.js';

const router = Router();

router.get('/status', auth, kycController.getStatus);
router.post('/submit', auth, validate(submitKycSchema), kycController.submitKyc);
router.post('/phone/send-otp', auth, otpLimiter, validate(sendOtpSchema), kycController.sendOtp);
router.post('/phone/verify-otp', auth, validate(verifyOtpSchema), kycController.verifyOtp);
router.get('/badges', auth, kycController.getBadges);

export default router;
