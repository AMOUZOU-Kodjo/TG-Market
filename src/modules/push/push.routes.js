import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { subscribePush, unsubscribePush, pushEnabled } from './push.service.js';

const router = Router();

router.get('/config', async (_req, res) => {
  res.json({ enabled: pushEnabled, publicKey: process.env.VAPID_PUBLIC_KEY ?? null });
});

router.post('/subscribe', auth, async (req, res, next) => {
  try {
    const subscription = await subscribePush(req.user.id, req.body, req.headers['user-agent'] ?? null);
    res.status(201).json({ success: true, id: subscription.id });
  } catch (err) {
    next(err);
  }
});

router.delete('/subscribe', auth, async (req, res, next) => {
  try {
    const { endpoint } = req.body ?? {};
    const count = await unsubscribePush(req.user.id, endpoint);
    res.json({ success: true, removed: count });
  } catch (err) {
    next(err);
  }
});

export default router;