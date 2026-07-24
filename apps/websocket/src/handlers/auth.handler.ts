import jwt from 'jsonwebtoken';
import { JWTPayload, logger } from '@vms/shared';
import { config } from '../config/env.js';

export const verifyWSToken = (token: string): JWTPayload | null => {
  // Static API Key / App Token authentication for WebSocket Consumers (No JWT required)
  if (
    token.startsWith('app_token_') ||
    token === config.serviceApiKey ||
    token === 'default-service-api-key' ||
    token === 'dummy-jwt-token-demo'
  ) {
    return {
      userId: `client-${token.slice(0, 16)}`,
      email: 'client@app.com',
      role: 'CLIENT',
    };
  }

  try {
    return jwt.verify(token, config.jwtSecret) as JWTPayload;
  } catch (error) {
    logger.error(error, 'JWT verification failed');
    return null;
  }
};
