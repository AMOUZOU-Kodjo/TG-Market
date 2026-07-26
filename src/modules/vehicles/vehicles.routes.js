import { Router } from 'express';
import { auth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as vehiclesController from './vehicles.controller.js';
import {
  listVehiclesSchema,
  getVehicleSchema,
  createVehicleSchema,
  updateVehicleSchema,
} from './vehicles.validation.js';

const router = Router();

router.get('/brands', vehiclesController.getBrands);
router.get('/models', vehiclesController.getModelsByBrand);

router.get('/', pagination, validate(listVehiclesSchema), vehiclesController.listVehicles);
router.get('/:id', validate(getVehicleSchema), vehiclesController.getVehicleById);
router.post('/', auth, validate(createVehicleSchema), vehiclesController.createVehicle);
router.put('/:id', auth, validate(updateVehicleSchema), vehiclesController.updateVehicle);

export default router;
