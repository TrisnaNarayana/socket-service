import crypto from 'crypto';
import { ApplicationRepository } from './application.repository.js';
import { CreateClientInput, CreateAppInput } from '@vms/shared';
import { AppError } from '../../middlewares/error.middleware.js';

export class ApplicationService {
  constructor(private appRepo: ApplicationRepository = new ApplicationRepository()) {}

  async createClient(input: CreateClientInput) {
    const existing = await this.appRepo.findClientByEmail(input.email);
    if (existing) {
      throw new AppError(400, 'Client dengan email ini sudah terdaftar');
    }
    return this.appRepo.createClient(input);
  }

  async getAllClients() {
    return this.appRepo.findAllClients();
  }

  async createApplication(input: CreateAppInput) {
    const appSlug = input.appName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const apiToken = this.generateStaticApiToken();

    return this.appRepo.createApplication({
      ...input,
      appSlug,
      apiToken,
    });
  }

  async getAllApplications() {
    return this.appRepo.findAllApplications();
  }

  async regenerateAppToken(appId: string) {
    const newToken = this.generateStaticApiToken();
    return this.appRepo.updateAppApiToken(appId, newToken);
  }

  async validateAppToken(apiToken: string) {
    const app = await this.appRepo.findAppByApiToken(apiToken);
    if (!app || app.status !== 'active') {
      return null;
    }
    return app;
  }

  private generateStaticApiToken(): string {
    const randomBytes = crypto.randomBytes(16).toString('hex');
    return `app_token_live_${randomBytes}`;
  }
}
