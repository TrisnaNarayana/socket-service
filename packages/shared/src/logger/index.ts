import pino from 'pino';

export const createLogger = (name: string) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';

  return pino({
    name,
    level: process.env.LOG_LEVEL || 'info',
    transport: isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
  });
};

export const logger = createLogger('vms-app');
