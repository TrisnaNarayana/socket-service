import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AuthRepository } from './auth.repository.js';
import { RegisterInput, LoginInput, UserDTO, JWTPayload } from '@vms/shared';
import { AuthResponse, TokenPair } from './auth.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { config } from '../../config/env.js';

export class AuthService {
  constructor(private authRepo: AuthRepository = new AuthRepository()) {}

  async register(input: RegisterInput): Promise<AuthResponse> {
    const existingUser = await this.authRepo.findUserByEmail(input.email);
    if (existingUser) {
      throw new AppError(400, 'Email sudah terdaftar');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    const user = await this.authRepo.createUser({
      ...input,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.mapToUserDTO(user),
      tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResponse> {
    const user = await this.authRepo.findUserByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'Email atau password salah');
    }

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) {
      throw new AppError(401, 'Email atau password salah');
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: this.mapToUserDTO(user),
      tokens,
    };
  }

  async refreshToken(refreshTokenStr: string): Promise<TokenPair> {
    const storedToken = await this.authRepo.findRefreshToken(refreshTokenStr);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError(401, 'Refresh token tidak valid atau kadaluarsa');
    }

    let payload: JWTPayload;
    try {
      payload = jwt.verify(refreshTokenStr, config.jwtRefreshSecret as Secret) as JWTPayload;
    } catch {
      throw new AppError(401, 'Refresh token tidak valid');
    }

    const user = await this.authRepo.findUserById(payload.userId);
    if (!user) {
      throw new AppError(401, 'Pengguna tidak ditemukan');
    }

    await this.authRepo.deleteRefreshToken(refreshTokenStr);
    return this.generateTokens(user.id, user.email, user.role);
  }

  async logout(refreshTokenStr: string): Promise<void> {
    await this.authRepo.deleteRefreshToken(refreshTokenStr);
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<TokenPair> {
    const payload: JWTPayload = { userId, email, role };

    const accessToken = jwt.sign(payload, config.jwtSecret as Secret, {
      expiresIn: config.jwtExpiresIn,
    } as SignOptions);

    const refreshToken = jwt.sign(payload, config.jwtRefreshSecret as Secret, {
      expiresIn: config.jwtRefreshExpiresIn,
    } as SignOptions);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.authRepo.createRefreshToken({
      token: refreshToken,
      userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
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
