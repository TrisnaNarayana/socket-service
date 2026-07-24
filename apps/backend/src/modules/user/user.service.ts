import { UserRepository } from './user.repository.js';
import { UserDTO } from '@vms/shared';
import { AppError } from '../../middlewares/error.middleware.js';

export class UserService {
  constructor(private userRepo: UserRepository = new UserRepository()) {}

  async getAllUsers(): Promise<UserDTO[]> {
    const users = await this.userRepo.findAllUsers();
    return users.map((user) => this.mapToUserDTO(user));
  }

  async getUserById(id: string): Promise<UserDTO> {
    const user = await this.userRepo.findUserById(id);
    if (!user) {
      throw new AppError(404, 'Pengguna tidak ditemukan');
    }
    return this.mapToUserDTO(user);
  }

  private mapToUserDTO(user: any): UserDTO {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
