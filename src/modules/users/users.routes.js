import { Router } from 'express';
import multer from 'multer';
import { auth, optionalAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { pagination } from '../../utils/pagination.js';
import * as usersController from './users.controller.js';
import {
  updateProfileSchema,
  changePasswordSchema,
  updatePreferencesSchema,
  updatePrivacySchema,
} from './users.validation.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seules les images sont autorisées'), false);
    }
  },
});

const router = Router();

router.put('/profile', auth, validate(updateProfileSchema), usersController.updateProfile);
router.post('/avatar', auth, upload.single('file'), usersController.uploadAvatar);
router.put('/password', auth, validate(changePasswordSchema), usersController.changePassword);
router.put('/preferences', auth, validate(updatePreferencesSchema), usersController.updatePreferences);
router.put('/privacy', auth, validate(updatePrivacySchema), usersController.updatePrivacy);

router.get('/:id', optionalAuth, usersController.getPublicProfile);
router.post('/:id/follow', auth, usersController.followUser);
router.delete('/:id/follow', auth, usersController.unfollowUser);
router.get('/:id/followers', pagination, usersController.getFollowers);
router.get('/:id/following', pagination, usersController.getFollowing);

export default router;
