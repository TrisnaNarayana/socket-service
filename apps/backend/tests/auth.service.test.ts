import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthService } from '../src/modules/auth/auth.service.js';
import { AuthRepository } from '../src/modules/auth/auth.repository.js';
import { AppError } from '../src/middlewares/error.middleware.js';
import bcrypt from 'bcryptjs';

vi.mock('../src/modules/auth/auth.repository.js');
vi.mock('bcryptjs');

describe('AuthService Unit Tests', () => {
  let authService: AuthService;
  let mockAuthRepo: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAuthRepo = {
      findUserByEmail: vi.fn(),
      createUser: vi.fn(),
      findUserById: vi.fn(),
      createRefreshToken: vi.fn(),
      findRefreshToken: vi.fn(),
      deleteRefreshToken: vi.fn(),
    };
    authService = new AuthService(mockAuthRepo);
  });

  describe('register', () => {
    it('harus berhasil meregistrasi pengguna baru', async () => {
      mockAuthRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as any).mockResolvedValue('hashedPassword123');

      const mockCreatedUser = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        password: 'hashedPassword123',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthRepo.createUser.mockResolvedValue(mockCreatedUser);
      mockAuthRepo.createRefreshToken.mockResolvedValue({});

      const result = await authService.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: 'USER',
      });

      expect(mockAuthRepo.findUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result.user.email).toEqual('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('harus melempar AppError jika email sudah terdaftar', async () => {
      mockAuthRepo.findUserByEmail.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
          name: 'Existing',
          role: 'USER',
        })
      ).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('harus berhasil login jika kredensial benar', async () => {
      const mockUser = {
        id: 'user-uuid-1',
        email: 'test@example.com',
        password: 'hashedPassword123',
        name: 'Test User',
        role: 'USER',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockAuthRepo.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(true);
      mockAuthRepo.createRefreshToken.mockResolvedValue({});

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.tokens.accessToken).toBeDefined();
    });

    it('harus melempar error jika password salah', async () => {
      mockAuthRepo.findUserByEmail.mockResolvedValue({
        password: 'hashedPassword123',
      });
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(AppError);
    });
  });
});
