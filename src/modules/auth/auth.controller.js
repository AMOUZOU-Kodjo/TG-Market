import * as authService from './auth.service.js';
import * as googleAuthService from './auth.google.service.js';

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.validated.body, req);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.validated.body, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function googleLogin(req, res, next) {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ error: 'Code d\'autorisation requis' });
    }
    const result = await googleAuthService.googleLogin(code, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    const result = await authService.logout(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function refresh(req, res, next) {
  try {
    const result = await authService.refresh(req.validated.body.refreshToken, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const result = await authService.getMe(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const result = await authService.updateProfile(req.user.id, req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const result = await authService.changePassword(req.user.id, req.validated.body, req);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await authService.forgotPassword(req.validated.body.email);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await authService.resetPassword(req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getSessions(req, res, next) {
  try {
    const result = await authService.getSessions(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function revokeOtherSessions(req, res, next) {
  try {
    const result = await authService.revokeOtherSessions(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getLoginHistory(req, res, next) {
  try {
    const result = await authService.getLoginHistory(req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req, res, next) {
  try {
    const result = await authService.deleteAccount(req.user.id);
    try { req.app.get('io')?.emit('user_deleted', { userId: req.user.id }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}
