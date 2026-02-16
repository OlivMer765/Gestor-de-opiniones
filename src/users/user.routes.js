import { Router } from 'express';
import { getProfile, updateProfile } from './user.controller.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { updateProfileValidators } from '../../middlewares/user-validators.js';

const router = Router();

router.get('/profile', validateJWT, getProfile);
router.put('/profile', validateJWT, updateProfileValidators, updateProfile);

export default router;