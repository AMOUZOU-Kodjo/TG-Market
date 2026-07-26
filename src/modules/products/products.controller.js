import * as productsService from './products.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function listProducts(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { q, categories, conditions, minPrice, maxPrice, city, sort } = req.validated.query;
    const userId = req.user?.id ?? null;

    const { products, total } = await productsService.listProducts(
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

export async function getProductById(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const product = await productsService.getProductById(Number(req.params.id), userId);
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const product = await productsService.createProduct(req.user.id, req.validated.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await productsService.updateProduct(
      Number(req.params.id),
      req.user.id,
      req.validated.body,
    );
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const result = await productsService.deleteProduct(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyProducts(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { products, total } = await productsService.getMyProducts(req.user.id, page, perPage);
    res.json({
      data: products,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getSimilarProducts(req, res, next) {
  try {
    const products = await productsService.getSimilarProducts(Number(req.params.id));
    res.json({ data: products });
  } catch (err) {
    next(err);
  }
}

export async function incrementViews(req, res, next) {
  try {
    const ip = req.ip || req.headers['x-forwarded-for'] || null;
    const userAgent = req.headers['user-agent'] || null;
    const userId = req.user?.id ?? null;
    const result = await productsService.incrementViews(
      Number(req.params.id),
      ip,
      userAgent,
      userId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProductStatus(req, res, next) {
  try {
    const result = await productsService.updateProductStatus(
      Number(req.params.id),
      req.user.id,
      req.validated.body.status,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
