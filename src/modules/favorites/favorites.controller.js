import * as favoritesService from './favorites.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function toggleFavorite(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const result = await favoritesService.toggleFavorite(req.user.id, productId);
    try { req.app.get('io')?.emit('favorite_toggled', { productId, isFavorite: result.isFavorite }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const result = await favoritesService.removeFavorite(req.user.id, productId);
    try { req.app.get('io')?.emit('favorite_removed', { productId }); } catch {}
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getMyFavorites(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { favorites, total } = await favoritesService.getMyFavorites(req.user.id, { page, perPage });
    res.json({
      data: favorites,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function checkFavorite(req, res, next) {
  try {
    const productId = Number(req.params.productId);
    const result = await favoritesService.checkFavorite(req.user.id, productId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
