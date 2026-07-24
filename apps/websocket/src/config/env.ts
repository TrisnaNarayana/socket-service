import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../../../.env') });

export const config = {
  wsPort: parseInt(process.env.WS_PORT || '4001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-change-it',
  serviceApiKey: process.env.SERVICE_API_KEY || 'default-service-api-key',
};
