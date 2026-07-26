import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as favoritesController from './favorites.controller.js';

const router = Router();

router.get('/check/:productId', auth, favoritesController.checkFavorite);
router.get('/', auth, pagination, favoritesController.getMyFavorites);
router.post('/:productId', auth, favoritesController.toggleFavorite);
router.delete('/:productId', auth, favoritesController.removeFavorite);

export default router;
