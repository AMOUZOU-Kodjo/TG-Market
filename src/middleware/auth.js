import jwt from 'jsonwebtoken';
import jwtConfig from '../config/jwt.js';
import prisma from '../config/database.js';

export async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, is_active: true, first_name: true, last_name: true, email: true },
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Utilisateur introuvable ou désactivé' });
    }

    req.user = { id: user.id, role: user.role, firstName: user.first_name, lastName: user.last_name, email: user.email };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expiré', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export function admin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next();
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, jwtConfig.secret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, role: true, is_active: true },
    });

    if (user && user.is_active) {
      req.user = { id: user.id, role: user.role };
    }
    next();
  } catch {
    next();
  }
}
