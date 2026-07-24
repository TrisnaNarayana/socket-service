import { prisma } from '@vms/database';
import { CreateClientInput, CreateAppInput } from '@vms/shared';

export class ApplicationRepository {
  async createClient(input: CreateClientInput) {
    return prisma.client.create({
      data: {
        name: input.name,
        email: input.email,
      },
    });
  }

  async findClientByEmail(email: string) {
    return prisma.client.findUnique({
      where: { email },
    });
  }

  async findAllClients() {
    return prisma.client.findMany({
      include: { applications: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createApplication(input: CreateAppInput & { appSlug: string; apiToken: string }) {
    return prisma.application.create({
      data: {
        clientId: input.clientId,
        appName: input.appName,
        appSlug: input.appSlug,
        apiToken: input.apiToken,
      },
      include: { client: true },
    });
  }

  async findAllApplications() {
    return prisma.application.findMany({
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAppByApiToken(apiToken: string) {
    return prisma.application.findUnique({
      where: { apiToken },
      include: { client: true },
    });
  }

  async updateAppApiToken(id: string, apiToken: string) {
    return prisma.application.update({
      where: { id },
      data: { apiToken, updatedAt: new Date() },
    });
  }
}
