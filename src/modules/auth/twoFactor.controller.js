import * as twoFactorService from './twoFactor.service.js';

export async function generateSecret(req, res, next) {
  try {
    const result = await twoFactorService.generateSecret(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function enableTwoFactor(req, res, next) {
  try {
    const result = await twoFactorService.enableTwoFactor(req.user.id, req.validated.body.token);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function disableTwoFactor(req, res, next) {
  try {
    const result = await twoFactorService.disableTwoFactor(req.user.id, req.validated.body.password, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyTwoFactor(req, res, next) {
  try {
    const result = await twoFactorService.verifyTwoFactor(req.validated.body.tempToken, req.validated.body.token, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getTwoFactorStatus(req, res, next) {
  try {
    const result = await twoFactorService.getTwoFactorStatus(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
