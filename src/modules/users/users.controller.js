import * as usersService from './users.service.js';
import { buildPaginationMeta } from '../../utils/pagination.js';

export async function getPublicProfile(req, res, next) {
  try {
    const result = await usersService.getPublicProfile(Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const result = await usersService.updateProfile(req.user.id, req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function uploadAvatar(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Aucun fichier fourni');
      error.status = 400;
      throw error;
    }
    const result = await usersService.uploadAvatar(req.user.id, req.file);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function changePassword(req, res, next) {
  try {
    const result = await usersService.changePassword(req.user.id, req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updatePreferences(req, res, next) {
  try {
    const result = await usersService.updatePreferences(req.user.id, req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updatePrivacy(req, res, next) {
  try {
    const result = await usersService.updatePrivacy(req.user.id, req.validated.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function followUser(req, res, next) {
  try {
    const result = await usersService.followUser(req.user.id, Number(req.params.id));
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function unfollowUser(req, res, next) {
  try {
    const result = await usersService.unfollowUser(req.user.id, Number(req.params.id));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getFollowers(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { users, total } = await usersService.getFollowers(Number(req.params.id), page, perPage);
    res.json({
      data: users,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}

export async function getFollowing(req, res, next) {
  try {
    const { page, perPage } = req.pagination;
    const { users, total } = await usersService.getFollowing(Number(req.params.id), page, perPage);
    res.json({
      data: users,
      meta: buildPaginationMeta(total, page, perPage),
    });
  } catch (err) {
    next(err);
  }
}
