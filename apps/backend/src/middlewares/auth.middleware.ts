import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { JWTPayload } from '@vms/shared';
import { AppError } from './error.middleware.js';

export interface AuthenticatedRequest extends Request {
  user?: JWTPayload;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'Akses ditolak. Token tidak ditemukan.'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError(401, 'Token tidak valid atau telah kadaluarsa.'));
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError(401, 'Pengguna belum terautentikasi.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Akses ditolak. Anda tidak memiliki izin.'));
    }

    next();
  };
};
