import prisma from '../../config/database.js';
import { flutterwave, fedapay, isFlutterwaveConfigured, isFedaPayConfigured } from '../../config/payment.js';
import { getActivePaymentProvider } from './payment.service.js';

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3';

const FEDAPAY_API = () =>
  fedapay.environment === 'live' ? 'https://api.fedapay.com/v1' : 'https://sandbox-api.fedapay.com/v1';

const FEDAPAY_NETWORK_MAP = {
  flooz: 'moov_tg',
  tmoney: 'togocel',
};

const BANK_MAP = {
  flooz: 'FLO',
  tmoney: 'MT_MOMO',
  mobile_money: 'MM_FRN',
};

function getHeaders() {
  return {
    Authorization: `Bearer ${flutterwave.secretKey}`,
    'Content-Type': 'application/json',
  };
}

function generateTransferRef() {
  return `TG-TRF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

export function formatPayout(payout) {
  return {
    id: payout.id,
    escrowId: payout.escrow_id,
    sellerId: payout.seller_id,
    amount: payout.amount,
    fee: payout.fee,
    provider: payout.provider ?? null,
    account: payout.account ?? null,
    status: payout.status,
    reference: payout.reference ?? null,
    errorMessage: payout.error_message ?? null,
    confirmedAt: payout.confirmed_at ?? null,
    createdAt: payout.created_at,
  };
}

export async function getSellerPayoutMethod(sellerId) {
  return prisma.paymentMethod.findFirst({
    where: { user_id: sellerId, is_active: true },
    orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
  });
}

async function sendFedaPayPayout({ amount, phone, mode }) {
  const headers = {
    Authorization: `Bearer ${fedapay.secretKey}`,
    'Content-Type': 'application/json',
  };

  const createdRes = await fetch(`${FEDAPAY_API()}/payouts`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      amount,
      currency: { iso: 'XOF' },
      mode,
      customer: {
        firstname: 'Vendeur',
        lastname: 'TG-Market',
        email: 'seller@tgmarket.tg',
        phone_number: { number: phone, country: 'tg' },
      },
    }),
  });
  const created = await createdRes.json().catch(() => ({}));
  if (!createdRes.ok) {
    throw new Error(created.message || `Erreur FedaPay payout (${createdRes.status})`);
  }
  const payout = created.payout ?? created.data ?? created;
  const payoutId = payout.id;
  if (!payoutId) {
    throw new Error('FedaPay : dépôt non créé');
  }

  const sentRes = await fetch(`${FEDAPAY_API()}/payouts/start`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ payouts: [{ id: payoutId }] }),
  });
  const sent = await sentRes.json().catch(() => ({}));
  if (!sentRes.ok) {
    throw new Error(sent.message || `Erreur FedaPay envoi dépôt (${sentRes.status})`);
  }

  return String(payoutId);
}

export async function trySendPayout(payout) {
  if (!isFlutterwaveConfigured() && !isFedaPayConfigured()) {
    return { mode: 'manual' };
  }

  const provider = String(payout.provider || '').toLowerCase();

  if (isFedaPayConfigured() && (await getActivePaymentProvider()) === 'fedapay') {
    const mode = FEDAPAY_NETWORK_MAP[provider];
    if (payout.account && mode) {
      try {
        const reference = await sendFedaPayPayout({ amount: payout.amount, phone: payout.account, mode });
        return { mode: 'auto', status: 'sent', reference };
      } catch (err) {
        return {
          mode: 'auto',
          status: 'failed',
          errorMessage: err.message || 'Erreur réseau lors du transfert FedaPay',
        };
      }
    }
  }

  const bank = BANK_MAP[provider] || BANK_MAP.mobile_money;
  if (!payout.account || !bank) {
    return { mode: 'manual' };
  }

  try {
    const reference = generateTransferRef();
    const res = await fetch(`${FLUTTERWAVE_API}/transfers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        account_bank: bank,
        account_number: payout.account,
        amount: payout.amount,
        currency: 'XOF',
        narration: 'Paiement de vente TG-Market',
        reference,
      }),
    });

    const data = await res.json();
    if (res.ok && data.data?.id) {
      return { mode: 'auto', status: 'sent', reference: String(data.data.id) };
    }
    return {
      mode: 'auto',
      status: 'failed',
      errorMessage: data.message || 'Erreur de transfert Flutterwave',
    };
  } catch (err) {
    return {
      mode: 'auto',
      status: 'failed',
      errorMessage: err.message || 'Erreur réseau lors du transfert',
    };
  }
}

export async function createAndSendPayout({ escrowId, sellerId, amount, fee, provider, account }) {
  const payout = await prisma.payout.create({
    data: {
      escrow_id: escrowId,
      seller_id: sellerId,
      amount,
      fee,
      provider: provider ?? null,
      account: account ?? null,
      status: 'pending',
    },
  });

  if ((isFlutterwaveConfigured() || isFedaPayConfigured()) && payout.provider && payout.account) {
    const result = await trySendPayout(payout);
    if (result.mode === 'auto' && result.status === 'sent') {
      const updated = await prisma.payout.update({
        where: { id: payout.id },
        data: {
          status: 'sent',
          reference: result.reference,
          confirmed_at: new Date(),
        },
      });
      return formatPayout(updated);
    }
    if (result.mode === 'auto' && result.status === 'failed') {
      const updated = await prisma.payout.update({
        where: { id: payout.id },
        data: { status: 'failed', error_message: result.errorMessage },
      });
      return formatPayout(updated);
    }
  }

  return formatPayout(payout);
}

export async function getPayoutForEscrow(escrowId) {
  const payout = await prisma.payout.findUnique({
    where: { escrow_id: escrowId },
  });
  return payout ? formatPayout(payout) : null;
}