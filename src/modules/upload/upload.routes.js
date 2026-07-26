import { Router } from 'express';
import multer from 'multer';
import { auth } from '../../middleware/auth.js';
import * as uploadController from './upload.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const router = Router();

router.post('/image', auth, upload.single('file'), uploadController.uploadImage);
router.post('/images', auth, upload.array('files', 10), uploadController.uploadImages);
router.delete('/:key', auth, uploadController.deleteFile);

export default router;
