import { Router } from 'express';
import { register, login, me } from './auth.controller.js';
import { registerValidators, loginValidators } from '../../middlewares/auth-validators.js';
import { validateJWT } from '../../middlewares/validate-jwt.js';
import { loginLimiter } from '../../middlewares/request-limit.js';

const router = Router();

router.post('/register', registerValidators, register);
router.post('/login', loginLimiter, loginValidators, login);
router.get('/me', validateJWT, me);

export default router;