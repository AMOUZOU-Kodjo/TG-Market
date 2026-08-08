import * as walletService from './wallet.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function getBalance(req, res, next) {
  try {
    const balance = await walletService.getBalance(req.user.id);
    res.json(balance);
  } catch (err) {
    next(err);
  }
}

export async function getTransactions(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { transactions, total } = await walletService.getTransactions(req.user.id, req.pagination);
    res.json({
      data: transactions,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function withdraw(req, res, next) {
  try {
    const transaction = await walletService.withdraw(req.user.id, req.validated.body);
    try { req.app.get('io')?.emit('wallet_updated', { userId: req.user.id }); } catch {}
    res.status(201).json(transaction);
  } catch (err) {
    next(err);
  }
}

export async function getPaymentMethods(req, res, next) {
  try {
    const methods = await walletService.getPaymentMethods(req.user.id);
    res.json({ data: methods });
  } catch (err) {
    next(err);
  }
}

export async function addPaymentMethod(req, res, next) {
  try {
    const method = await walletService.addPaymentMethod(req.user.id, req.validated.body);
    try { req.app.get('io')?.emit('payment_methods_updated', { userId: req.user.id }); } catch {}
    res.status(201).json(method);
  } catch (err) {
    next(err);
  }
}

export async function deletePaymentMethod(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await walletService.deletePaymentMethod(id, req.user.id);
    try { req.app.get('io')?.emit('payment_methods_updated', { userId: req.user.id }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function setDefaultPaymentMethod(req, res, next) {
  try {
    const id = Number(req.params.id);
    const result = await walletService.setDefaultPaymentMethod(id, req.user.id);
    try { req.app.get('io')?.emit('payment_methods_updated', { userId: req.user.id }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}
