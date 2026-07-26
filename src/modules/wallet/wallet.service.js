import prisma from '../../config/database.js';

export async function getBalance(userId) {
  const transactions = await prisma.walletTransaction.findMany({
    where: { user_id: userId },
    select: { type: true, amount: true, status: true },
  });

  let available = 0;
  let pending = 0;
  let totalEarned = 0;

  for (const tx of transactions) {
    if (tx.status === 'pending') {
      pending += tx.amount;
      continue;
    }

    if (tx.status === 'completed') {
      switch (tx.type) {
        case 'sale':
        case 'deposit':
        case 'refund':
          available += tx.amount;
          if (tx.type === 'sale') totalEarned += tx.amount;
          break;
        case 'purchase':
        case 'withdrawal':
          available -= tx.amount;
          break;
      }
    }
  }

  return { available, pending, totalEarned };
}

function formatTransaction(tx) {
  return {
    id: tx.id,
    type: tx.type,
    description: tx.description,
    amount: tx.amount,
    status: tx.status,
    counterparty: tx.counterparty ?? null,
    date: tx.created_at,
  };
}

export async function getTransactions(userId, { page, perPage, skip }) {
  const [transactions, total] = await Promise.all([
    prisma.walletTransaction.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      skip,
      take: perPage,
    }),
    prisma.walletTransaction.count({ where: { user_id: userId } }),
  ]);

  return {
    transactions: transactions.map(formatTransaction),
    total,
  };
}

export async function withdraw(userId, data) {
  const { available } = await getBalance(userId);

  if (available < data.amount) {
    const error = new Error('Solde insuffisant');
    error.status = 400;
    throw error;
  }

  const paymentMethod = await prisma.paymentMethod.findFirst({
    where: { id: data.paymentMethodId, user_id: userId, is_active: true },
  });

  if (!paymentMethod) {
    const error = new Error('Moyen de paiement introuvable');
    error.status = 404;
    throw error;
  }

  const transaction = await prisma.walletTransaction.create({
    data: {
      user_id: userId,
      type: 'withdrawal',
      amount: data.amount,
      description: `Retrait vers ${paymentMethod.provider}`,
      status: 'pending',
      reference_type: 'payment_method',
      reference_id: paymentMethod.id,
    },
  });

  return formatTransaction(transaction);
}

export async function getPaymentMethods(userId) {
  const methods = await prisma.paymentMethod.findMany({
    where: { user_id: userId, is_active: true },
    orderBy: [{ is_default: 'desc' }, { created_at: 'desc' }],
  });

  return methods.map((m) => ({
    id: m.id,
    provider: m.provider,
    providerUserId: m.provider_user_id ?? null,
    label: m.label ?? null,
    isDefault: m.is_default,
    createdAt: m.created_at,
  }));
}

export async function addPaymentMethod(userId, data) {
  if (data.isDefault) {
    await prisma.paymentMethod.updateMany({
      where: { user_id: userId, is_active: true },
      data: { is_default: false },
    });
  }

  const method = await prisma.paymentMethod.create({
    data: {
      user_id: userId,
      provider: data.provider,
      provider_user_id: data.providerUserId ?? null,
      label: data.label ?? null,
      is_default: data.isDefault ?? false,
    },
  });

  return {
    id: method.id,
    provider: method.provider,
    providerUserId: method.provider_user_id ?? null,
    label: method.label ?? null,
    isDefault: method.is_default,
    createdAt: method.created_at,
  };
}

export async function deletePaymentMethod(id, userId) {
  const method = await prisma.paymentMethod.findFirst({
    where: { id, user_id: userId, is_active: true },
  });

  if (!method) {
    const error = new Error('Moyen de paiement introuvable');
    error.status = 404;
    throw error;
  }

  await prisma.paymentMethod.update({
    where: { id },
    data: { is_active: false },
  });

  return { message: 'Moyen de paiement supprimé avec succès' };
}
