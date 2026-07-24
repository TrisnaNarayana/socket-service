import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { logger } from '@vms/shared';
import { errorHandler } from './middlewares/error.middleware.js';
import { authRouter } from './modules/auth/auth.router.js';
import { userRouter } from './modules/user/user.router.js';
import { eventsRouter } from './modules/events/events.router.js';
import { applicationRouter } from './modules/application/application.router.js';

export const createApp = (): Express => {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'backend-api' });
  });

  // Mount API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/applications', applicationRouter);

  // Global Error Handler
  app.use(errorHandler);

  return app;
};
