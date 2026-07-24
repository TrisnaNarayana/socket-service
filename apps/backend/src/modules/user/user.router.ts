import { Router } from 'express';
import { UserController } from './user.controller.js';
import { authenticateJWT, requireRole } from '../../middlewares/auth.middleware.js';

const router = Router();
const userController = new UserController();

router.use(authenticateJWT);

router.get('/', requireRole('ADMIN'), userController.getAll);
router.get('/:id', userController.getById);

export const userRouter = router;
