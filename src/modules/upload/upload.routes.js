import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth.js';
import * as uploadController from './upload.controller.js';

const ALLOWED_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images (JPEG, PNG, WebP, GIF, AVIF) sont acceptées'));
    }
  },
});

const router = Router();

router.post('/image', auth, upload.single('file'), uploadController.uploadImage);
router.post('/images', auth, upload.array('files', 10), uploadController.uploadImages);
router.delete('/:key', auth, uploadController.deleteFile);

export default router;
