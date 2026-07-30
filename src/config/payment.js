export const flutterwave = {
  publicKey: process.env.FLUTTERWAVE_PUBLIC_KEY || '',
  secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
  encryptionKey: process.env.FLUTTERWAVE_ENCRYPTION_KEY || '',
  webhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET || '',
};

export const directApis = {
  flooz: {
    url: process.env.FLOOZ_API_URL || '',
    apiKey: process.env.FLOOZ_API_KEY || '',
    merchantId: process.env.FLOOZ_MERCHANT_ID || '',
  },
  tmoney: {
    url: process.env.TMONEY_API_URL || '',
    apiKey: process.env.TMONEY_API_KEY || '',
  },
};

export const platformAccounts = {
  flooz: {
    number: process.env.FLOOZ_ACCOUNT_NUMBER || '+228 90 00 00 01',
    name: 'TG-Market Flooz',
  },
  tmoney: {
    number: process.env.TMONEY_ACCOUNT_NUMBER || '+228 90 00 00 02',
    name: 'TG-Market T-Money',
  },
};

export function isFlutterwaveConfigured() {
  return !!(flutterwave.publicKey && flutterwave.secretKey);
}

export function isDirectApiConfigured(network) {
  const cfg = directApis[network];
  return !!(cfg?.url && cfg?.apiKey);
}
