import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { pagination } from '../../utils/pagination.js';
import * as reportsController from './reports.controller.js';

const router = Router();

router.post('/', auth, reportsController.createReport);

export default router;
