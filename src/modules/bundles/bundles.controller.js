import * as bundlesService from './bundles.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function createBundle(req, res, next) {
  try {
    const { title, description, productIds, bundlePrice } = req.body;
    const sellerId = req.user.id;
    const bundle = await bundlesService.createBundle(sellerId, { title, description, productIds, bundlePrice });
    res.status(201).json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function getMyBundles(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const result = await bundlesService.getMyBundles(req.user.id, { page, perPage });
    res.json({
      data: result.bundles,
      meta: buildPaginationMeta(result.total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getPublicBundles(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const result = await bundlesService.getPublicBundles({ page, perPage });
    res.json({
      data: result.bundles,
      meta: buildPaginationMeta(result.total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getBundleById(req, res, next) {
  try {
    const bundle = await bundlesService.getBundleById(Number(req.params.id));
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function updateBundle(req, res, next) {
  try {
    const { title, description, bundlePrice } = req.body;
    const bundle = await bundlesService.updateBundle(
      Number(req.params.id),
      req.user.id,
      { title, description, bundlePrice },
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function deleteBundle(req, res, next) {
  try {
    const result = await bundlesService.deleteBundle(Number(req.params.id), req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addProductToBundle(req, res, next) {
  try {
    const { productId } = req.body;
    const bundle = await bundlesService.addProductToBundle(
      Number(req.params.id),
      req.user.id,
      Number(productId),
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}

export async function removeProductFromBundle(req, res, next) {
  try {
    const productId = req.params.productId || req.body.productId;
    const bundle = await bundlesService.removeProductFromBundle(
      Number(req.params.id),
      req.user.id,
      Number(productId),
    );
    res.json(bundle);
  } catch (err) {
    next(err);
  }
}