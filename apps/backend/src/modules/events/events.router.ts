import { Router, Request, Response, NextFunction } from 'express';
import { EventsController } from './events.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { publishEventSchema } from '@vms/shared';
import { config } from '../../config/env.js';
import { AppError } from '../../middlewares/error.middleware.js';

import { ApplicationService } from '../application/application.service.js';

const router = Router();
const eventsController = new EventsController();
const appService = new ApplicationService();

const verifyApiKeyOrAppToken = async (req: Request, _res: Response, next: NextFunction) => {
  const appToken = req.headers['x-app-token'] as string;
  const serviceApiKey = req.headers['x-service-api-key'] as string;

  if (appToken) {
    const validApp = await appService.validateAppToken(appToken);
    if (validApp) {
      (req as any).appContext = validApp;
      return next();
    }
  }

  if (serviceApiKey && serviceApiKey === config.serviceApiKey) {
    return next();
  }

  return next(new AppError(401, 'Unauthorized: Invalid Static App Token (x-app-token) or Service API Key'));
};

router.post('/publish', verifyApiKeyOrAppToken, validate(publishEventSchema), eventsController.publishEvent);

export const eventsRouter = router;
