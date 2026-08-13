import prisma from '../../config/database.js';
import { flutterwave, directApis, fedapay, isFlutterwaveConfigured, isDirectApiConfigured, isFedaPayConfigured } from '../../config/payment.js';

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3';

const FEDAPAY_API = () =>
  fedapay.environment === 'live' ? 'https://api.fedapay.com/v1' : 'https://sandbox-api.fedapay.com/v1';

const FEDAPAY_NETWORK_MAP = {
  flooz: 'moov_tg',
  tmoney: 'togocel',
};

export async function getActivePaymentProvider() {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: 'payment_provider' } });
    return row?.value || '';
  } catch {
    return '';
  }
}

function getHeaders() {
  return {
    Authorization: `Bearer ${flutterwave.secretKey}`,
    'Content-Type': 'application/json',
  };
}

const NETWORK_MAP = {
  flooz: 'TOGO_FLOOZ',
  tmoney: 'TOGO_TMONEY',
};

function generateTxRef() {
  return `TG-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

async function initiateDirectFlooz({ amount, phone, txRef }) {
  const cfg = directApis.flooz;
  const res = await fetch(`${cfg.url}/payment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${cfg.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant_id: cfg.merchantId,
      amount,
      phone,
      reference: txRef,
      description: 'Paiement TG-Market',
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erreur Flooz direct');
  }

  return {
    transactionRef: txRef,
    providerId: data.transaction_id || data.id,
    status: data.status || 'pending',
    processorResponse: data.message || 'OK',
    fallback: false,
  };
}

async function initiateDirectTMoney({ amount, phone, txRef }) {
  const cfg = directApis.tmoney;
  const res = await fetch(`${cfg.url}/v1/transaction/collect`, {
    method: 'POST',
    headers: {
      'apiKey': cfg.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      phone,
      reference: txRef,
      description: 'Paiement TG-Market',
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Erreur TMoney direct');
  }

  return {
    transactionRef: txRef,
    providerId: data.transactionId || data.id,
    status: data.status || 'pending',
    processorResponse: data.message || 'OK',
    fallback: false,
  };
}

const DIRECT_INITIATORS = {
  flooz: initiateDirectFlooz,
  tmoney: initiateDirectTMoney,
};

function fedapayHeaders() {
  return {
    Authorization: `Bearer ${fedapay.secretKey}`,
    'Content-Type': 'application/json',
  };
}

async function fedapayRequest(path, options = {}) {
  const res = await fetch(`${FEDAPAY_API()}${path}`, {
    ...options,
    headers: { ...fedapayHeaders(), ...(options.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Erreur FedaPay (${res.status})`);
  }
  return data;
}

async function initiateFedaPay({ amount, phone, network, txRef }) {
  const mode = FEDAPAY_NETWORK_MAP[network];
  if (!mode) {
    throw new Error('Opérateur non supporté par FedaPay');
  }

  const created = await fedapayRequest('/transactions', {
    method: 'POST',
    body: JSON.stringify({
      description: `Paiement TG-Market ${txRef}`,
      amount,
      currency: { iso: 'XOF' },
      callback_url: process.env.FRONTEND_URL || 'https://ak-market.pages.dev',
      customer: {
        firstname: 'Client',
        lastname: 'TG-Market',
        email: 'client@tgmarket.tg',
        phone_number: { number: phone, country: 'tg' },
      },
    }),
  });

  const tx = created.transaction ?? created.data ?? created;
  const txId = tx.id;
  if (!txId) {
    throw new Error('FedaPay : transaction non créée');
  }

  const tokenRes = await fedapayRequest(`/transactions/${txId}/token`, { method: 'POST', body: JSON.stringify({}) });
  const tokenObj = tokenRes.token ?? tokenRes.data ?? tokenRes;
  const token = typeof tokenObj === 'string' ? tokenObj : tokenObj?.token;
  if (!token) {
    throw new Error('FedaPay : token introuvable');
  }

  await fedapayRequest(`/${mode}`, {
    method: 'POST',
    body: JSON.stringify({ token }),
  });

  return {
    transactionRef: String(txId),
    fedapayId: txId,
    status: 'pending',
    processorResponse: `Demande USSD ${mode} envoyée`,
    fallback: false,
  };
}

async function verifyFedaPayTransaction(txId) {
  const data = await fedapayRequest(`/transactions/${txId}`, { method: 'GET' });
  const tx = data.transaction ?? data.data ?? data;
  return {
    status: tx.status,
    amount: tx.amount,
    currency: tx.currency?.iso,
    processorResponse: tx.payment_method || null,
  };
}

export async function initiateMobileMoney({ amount, phone, network, redirectUrl }) {
  const txRef = generateTxRef();

  // 0) FedaPay — activé depuis l'admin (payment_provider = fedapay)
  if (isFedaPayConfigured() && (await getActivePaymentProvider()) === 'fedapay') {
    try {
      return await initiateFedaPay({ amount, phone, network, txRef });
    } catch {
      // FedaPay indisponible — on retombe sur la chaîne actuelle
    }
  }

  // 1) Try direct operator API first
  if (isDirectApiConfigured(network)) {
    try {
      const initiator = DIRECT_INITIATORS[network];
      if (initiator) {
        return await initiator({ amount, phone, txRef });
      }
    } catch {
      // direct API failed — fall through
    }
  }

  // 2) Fall back to Flutterwave
  if (isFlutterwaveConfigured()) {
    const provider = NETWORK_MAP[network];
    if (!provider) {
      throw new Error('Opérateur non supporté');
    }

    const payload = {
      tx_ref: txRef,
      amount,
      currency: 'XOF',
      network: provider,
      phone_number: phone,
      email: 'client@tgmarket.tg',
      fullname: 'Client TG-Market',
      redirect_url: redirectUrl || '',
      is_permanent: false,
    };

    const res = await fetch(`${FLUTTERWAVE_API}/charges?type=mobile_money_franco`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.status !== 'success') {
      throw new Error(data.message || 'Erreur lors de l\'initiation du paiement');
    }

    return {
      transactionRef: txRef,
      flutterwaveId: data.data?.id,
      status: data.data?.status,
      processorResponse: data.data?.processor_response,
      fallback: false,
    };
  }

  // 3) No API configured — return fallback for manual payment
  return { fallback: true };
}

export async function verifyTransaction(transactionId) {
  const res = await fetch(`${FLUTTERWAVE_API}/transactions/${transactionId}/verify`, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (data.status !== 'success') {
    throw new Error(data.message || 'Erreur de vérification');
  }

  return {
    status: data.data.status,
    amount: data.data.amount,
    currency: data.data.currency,
    flutterwaveRef: data.data.flw_ref,
    txRef: data.data.tx_ref,
    chargedAmount: data.data.charged_amount,
    processorResponse: data.data.processor_response,
  };
}

export async function handleWebhook(payload) {
  // FedaPay events: { name: 'transaction.approved', data: {...} }
  if (payload && typeof payload.name === 'string' && payload.name.startsWith('transaction.') && payload.data) {
    const txId = payload.data.id ?? payload.data.transaction?.id;
    if (!txId) {
      return { handled: false };
    }
    const verified = await verifyFedaPayTransaction(txId);
    if (!['approved', 'transferred'].includes(verified.status)) {
      return { handled: false };
    }
    return {
      handled: true,
      status: 'successful',
      txRef: String(txId),
    };
  }

  const { event, data } = payload;

  if (event !== 'charge.completed' && event !== 'transfer.completed') {
    return { handled: false };
  }

  const verified = await verifyTransaction(data.id);

  return {
    handled: true,
    status: verified.status,
    txRef: verified.txRef,
    flutterwaveId: data.id,
  };
}
