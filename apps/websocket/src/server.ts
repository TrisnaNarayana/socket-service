import { createWSServer } from './app.js';
import { config } from './config/env.js';
import { logger } from '@vms/shared';

const { wss } = createWSServer(config.wsPort);

logger.info(`🔌 Dedicated WebSocket service listening on ws://localhost:${config.wsPort} [${config.nodeEnv}]`);
