import * as kycService from './kyc.service.js';

export async function getStatus(req, res, next) {
  try {
    const status = await kycService.getStatus(req.user.id);
    res.json(status);
  } catch (err) {
    next(err);
  }
}

export async function submitKyc(req, res, next) {
  try {
    const result = await kycService.submitKyc(req.user.id, req.validated.body);
    try { req.app.get('io')?.emit('kyc_submitted', { userId: req.user.id, kyc: result }); } catch {}
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function sendOtp(req, res, next) {
  try {
    const result = await kycService.sendOtp(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const result = await kycService.verifyOtp(req.user.id, req.validated.body.otp);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function sendEmailOtp(req, res, next) {
  try {
    const result = await kycService.sendEmailOtp(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyEmailOtp(req, res, next) {
  try {
    const result = await kycService.verifyEmailOtp(req.user.id, req.validated.body.otp);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getBadges(req, res, next) {
  try {
    const badges = await kycService.getBadges(req.user.id);
    res.json({ data: badges });
  } catch (err) {
    next(err);
  }
}
