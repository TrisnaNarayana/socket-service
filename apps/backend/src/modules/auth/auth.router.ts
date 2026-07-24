import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authenticateJWT } from '../../middlewares/auth.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from '@vms/shared';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authenticateJWT, authController.me);

export const authRouter = router;
