import * as searchService from './search.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function search(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { q, categories, conditions, minPrice, maxPrice, city, sort } = req.validated.query;
    const userId = req.user?.id ?? null;

    const { products, total } = await searchService.search(
      { q, categories, conditions, minPrice, maxPrice, city, sort, page, perPage },
      userId,
    );

    res.json({
      data: products,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}
