import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from '@vms/shared';

const app = createApp();

app.listen(config.port, () => {
  logger.info(`🚀 REST API Backend server running on port ${config.port} [${config.nodeEnv}]`);
});
