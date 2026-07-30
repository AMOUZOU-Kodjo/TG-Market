import * as reportsService from './reports.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function createReport(req, res, next) {
  try {
    const report = await reportsService.createReport({
      productId: req.body.productId,
      reporterId: req.user.id,
      reason: req.body.reason,
      description: req.body.description,
    });
    res.status(201).json(report);
  } catch (err) {
    next(err);
  }
}

export async function getAdminReports(req, res, next) {
  try {
    const { page, perPage, skip } = req.pagination;
    const { data, total } = await reportsService.getAdminReports({ page, perPage, skip });
    res.json({ data, meta: buildPaginationMeta(total, page, perPage) });
  } catch (err) {
    next(err);
  }
}

export async function resolveReport(req, res, next) {
  try {
    await reportsService.resolveReport(Number(req.params.id), req.user.id);
    res.json({ message: 'Signalement résolu' });
  } catch (err) {
    next(err);
  }
}

export async function dismissReport(req, res, next) {
  try {
    await reportsService.dismissReport(Number(req.params.id), req.user.id);
    res.json({ message: 'Signalement rejeté' });
  } catch (err) {
    next(err);
  }
}
