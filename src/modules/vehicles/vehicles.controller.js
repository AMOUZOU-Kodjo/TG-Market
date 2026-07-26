import * as vehiclesService from './vehicles.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function listVehicles(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { q, type, brands, models, minYear, maxYear, minMileage, maxMileage, fuel, transmission, conditions, minPrice, maxPrice, city, sort } = req.validated.query;
    const userId = req.user?.id ?? null;

    const { vehicles, total } = await vehiclesService.listVehicles(
      { q, type, brands, models, minYear, maxYear, minMileage, maxMileage, fuel, transmission, conditions, minPrice, maxPrice, city, sort, page, perPage },
      userId,
    );

    res.json({
      data: vehicles,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getVehicleById(req, res, next) {
  try {
    const userId = req.user?.id ?? null;
    const vehicle = await vehiclesService.getVehicleById(Number(req.params.id), userId);
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const vehicle = await vehiclesService.createVehicle(req.user.id, req.validated.body);
    res.status(201).json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const vehicle = await vehiclesService.updateVehicle(
      Number(req.params.id),
      req.validated.body,
      req.user.id,
    );
    res.json(vehicle);
  } catch (err) {
    next(err);
  }
}

export async function getBrands(_req, res, next) {
  try {
    const brands = await vehiclesService.getBrands();
    res.json({ data: brands });
  } catch (err) {
    next(err);
  }
}

export async function getModelsByBrand(req, res, next) {
  try {
    const models = await vehiclesService.getModelsByBrand(req.query.brand);
    res.json({ data: models });
  } catch (err) {
    next(err);
  }
}
