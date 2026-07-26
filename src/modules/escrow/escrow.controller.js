import * as escrowService from './escrow.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function createEscrow(req, res, next) {
  try {
    const escrow = await escrowService.createEscrow(req.user.id, req.validated.body);
    res.status(201).json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function listEscrow(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { escrows, total } = await escrowService.listEscrow(req.user.id, req.pagination);
    res.json({
      data: escrows,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getEscrowById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.getEscrowById(id, req.user.id);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function confirmDelivery(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.confirmDelivery(id, req.user.id);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function disputeEscrow(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { reason } = req.validated.body;
    const escrow = await escrowService.disputeEscrow(id, req.user.id, reason);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}

export async function cancelEscrow(req, res, next) {
  try {
    const id = Number(req.params.id);
    const escrow = await escrowService.cancelEscrow(id, req.user.id);
    res.json(escrow);
  } catch (err) {
    next(err);
  }
}
