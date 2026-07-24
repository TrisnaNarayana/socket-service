import { Request, Response, NextFunction } from 'express';
import { ApplicationService } from './application.service.js';
import { ApiResponse } from '@vms/shared';

export class ApplicationController {
  constructor(private appService: ApplicationService = new ApplicationService()) {}

  createClient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const client = await this.appService.createClient(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Client terdaftar berhasil',
        data: client,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getClients = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const clients = await this.appService.getAllClients();
      res.status(200).json({ success: true, data: clients });
    } catch (error) {
      next(error);
    }
  };

  createApplication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const app = await this.appService.createApplication(req.body);
      const response: ApiResponse = {
        success: true,
        message: 'Aplikasi berhasil dibuat',
        data: app,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  };

  getApplications = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const apps = await this.appService.getAllApplications();
      res.status(200).json({ success: true, data: apps });
    } catch (error) {
      next(error);
    }
  };

  regenerateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const updatedApp = await this.appService.regenerateAppToken(id);
      res.status(200).json({ success: true, message: 'Static API Token berhasil diperbarui', data: updatedApp });
    } catch (error) {
      next(error);
    }
  };
}
