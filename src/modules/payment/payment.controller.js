import * as paymentService from './payment.service.js';
import * as escrowService from '../escrow/escrow.service.js';
import { isFlutterwaveConfigured, platformAccounts } from '../../config/payment.js';

export async function initiatePayment(req, res, next) {
  try {
    const { escrowId, method, phone } = req.body;

    if (!escrowId || !method || !phone) {
      return res.status(400).json({ error: 'escrowId, method et phone requis' });
    }

    const escrow = await escrowService.getEscrowById(escrowId, req.user.id);
    const escrowData = escrow.data || escrow;

    if (escrowData.status !== 'pending') {
      return res.status(400).json({ error: 'Cette transaction ne peut pas être payée' });
    }

    const result = await paymentService.initiateMobileMoney({
      amount: escrowData.amount,
      phone,
      network: method,
      redirectUrl: `${req.protocol}://${req.get('host')}/api/payments/callback`,
    });

    if (result.fallback) {
      const account = platformAccounts[method];
      return res.json({
        mode: 'manual',
        message: `Flutterwave non configuré. Envoyez ${escrowData.amount} FCFA au ${account.name} (${account.number}), puis saisissez le numéro de transaction.`,
        platformAccount: account,
        escrowId: escrowData.id,
        amount: escrowData.amount,
      });
    }

    await escrowService.updatePaymentRef(escrowData.id, {
      paymentRef: result.transactionRef,
      paymentMethod: method,
    });

    res.json({
      mode: 'auto',
      transactionRef: result.transactionRef,
      flutterwaveId: result.flutterwaveId,
      status: result.status,
      processorResponse: result.processorResponse,
    });
  } catch (err) {
    next(err);
  }
}

export async function handleWebhook(req, res, next) {
  try {
    const result = await paymentService.handleWebhook(req.body);

    if (!result.handled) {
      return res.status(200).json({ received: true });
    }

    if (result.status === 'successful') {
      const escrow = await escrowService.getEscrowByPaymentRef(result.txRef);
      if (escrow && escrow.status === 'pending') {
        await escrowService.autoVerifyPayment(escrow.id);
      }
    }

    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
}

export async function getConfig(req, res) {
  res.json({
    flutterwaveConfigured: isFlutterwaveConfigured(),
    platformAccounts,
  });
}
