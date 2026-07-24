import { Request, Response, NextFunction } from 'express';
import { PublishEventInput, ApiResponse, logger } from '@vms/shared';

export class EventsController {
  publishEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const publishInput: PublishEventInput = req.body;
      logger.info(
        { projectId: publishInput.projectId, eventName: publishInput.eventName, target: publishInput.target },
        'Event publish request received via REST API'
      );

      const appContext = (req as any).appContext;
      const appId = appContext?.apiToken || (req.headers['x-app-token'] as string) || publishInput.projectId;

      // Forward publish request to WebSocket server internal endpoint with appId
      try {
        await fetch('http://localhost:4001/internal/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...publishInput, appId }),
        });
      } catch (wsErr) {
        logger.error({ wsErr }, 'Failed to forward publish event to WebSocket service');
      }

      const response: ApiResponse = {
        success: true,
        message: 'Event published successfully',
        data: {
          projectId: publishInput.projectId,
          eventName: publishInput.eventName,
          target: publishInput.target,
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}
