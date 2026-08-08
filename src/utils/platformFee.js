import prisma from '../config/database.js';

const DEFAULT_FEE_PERCENT = 5;
const DEFAULT_BUYER_FEE_PERCENT = 0;

async function getFeePercent(key, fallback) {
  const row = await prisma.siteSetting.findUnique({
    where: { key },
  });
  const value = Number(row?.value);
  if (!Number.isFinite(value) || value < 0) return fallback;
  return value;
}

export async function getPlatformFeePercent() {
  return getFeePercent('platform_fee_percent', DEFAULT_FEE_PERCENT);
}

export async function getBuyerFeePercent() {
  return getFeePercent('platform_buyer_fee_percent', DEFAULT_BUYER_FEE_PERCENT);
}