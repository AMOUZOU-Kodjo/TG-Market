import * as categoriesService from './categories.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function getAllCategories(req, res, next) {
  try {
    const result = await categoriesService.getAllCategories();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const result = await categoriesService.getCategoryBySlug(req.params.slug);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCategoryProducts(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { condition, minPrice, maxPrice, city, sort } = req.validated.query;

    const { products, total } = await categoriesService.getCategoryProducts(req.params.slug, {
      page,
      perPage,
      condition,
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      city,
      sort,
    });

    res.json({
      data: products,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}
