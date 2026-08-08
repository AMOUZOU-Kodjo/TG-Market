import prisma from '../config/database.js';

const DEFAULT_FEE_PERCENT = 5;

export async function getPlatformFeePercent() {
  const row = await prisma.siteSetting.findUnique({
    where: { key: 'platform_fee_percent' },
  });
  const value = Number(row?.value);
  if (!Number.isFinite(value) || value < 0) return DEFAULT_FEE_PERCENT;
  return value;
}