import * as uploadService from './upload.service.js';

export async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      const error = new Error('Aucun fichier fourni');
      error.status = 400;
      throw error;
    }

    const result = await uploadService.uploadImage(req.file, req.user.id);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function uploadImages(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      const error = new Error('Aucun fichier fourni');
      error.status = 400;
      throw error;
    }

    const results = await uploadService.uploadImages(req.files, req.user.id);
    res.status(201).json({ data: results });
  } catch (err) {
    next(err);
  }
}

export async function deleteFile(req, res, next) {
  try {
    const key = decodeURIComponent(req.params.key);
    const result = await uploadService.deleteFile(key);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
