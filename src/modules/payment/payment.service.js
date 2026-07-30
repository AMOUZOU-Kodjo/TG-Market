import { flutterwave, directApis, isFlutterwaveConfigured, isDirectApiConfigured } from '../../config/payment.js';

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3';

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

export async function initiateMobileMoney({ amount, phone, network, redirectUrl }) {
  const txRef = generateTxRef();

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
