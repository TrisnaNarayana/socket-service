import { Response, NextFunction } from 'express';
import { UserService } from './user.service.js';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware.js';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  getAll = async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}
