import { Router } from 'express';
import { ApplicationController } from './application.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createClientSchema, createAppSchema } from '@vms/shared';

const router = Router();
const appController = new ApplicationController();

// Client Endpoints
router.post('/clients', validate(createClientSchema), appController.createClient);
router.get('/clients', appController.getClients);

// Application Endpoints
router.post('/', validate(createAppSchema), appController.createApplication);
router.get('/', appController.getApplications);
router.post('/:id/regenerate-token', appController.regenerateToken);

export const applicationRouter = router;
