import * as adminService from './admin.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function getStats(req, res, next) {
  try {
    const stats = await adminService.getStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getUsers({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateUserStatus(req, res, next) {
  try {
    const result = await adminService.updateUserStatus(
      Number(req.params.id),
      req.body.isActive,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getProducts(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getProducts({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProductStatus(req, res, next) {
  try {
    const result = await adminService.updateProductStatus(
      Number(req.params.id),
      req.body.status,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getKycPending(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getKycPending({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function approveKyc(req, res, next) {
  try {
    const result = await adminService.approveKyc(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function rejectKyc(req, res, next) {
  try {
    const result = await adminService.rejectKyc(
      Number(req.params.id),
      req.user.id,
      req.body.reason,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getEscrowTransactions(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await adminService.getEscrowTransactions({ page, perPage, skip });
    res.json({
      data,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecentActivity(req, res, next) {
  try {
    const activity = await adminService.getRecentActivity();
    res.json(activity);
  } catch (err) {
    next(err);
  }
}
