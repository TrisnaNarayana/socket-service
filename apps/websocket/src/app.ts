import { WebSocketServer, WebSocket } from 'ws';
import http, { IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import crypto from 'crypto';
import { ConnectionManager } from './managers/connection.manager.js';
import { MessageHandler } from './handlers/message.handler.js';
import { verifyWSToken } from './handlers/auth.handler.js';
import { logger, WSEventType } from '@vms/shared';

export const createWSServer = (port: number): { wss: WebSocketServer; connectionManager: ConnectionManager } => {
  const connectionManager = new ConnectionManager();
  const messageHandler = new MessageHandler(connectionManager);

  const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
    if (req.method === 'POST' && req.url === '/internal/publish') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const publishInput = JSON.parse(body);
          connectionManager.publishCustomEvent(publishInput);
          logger.info({ projectId: publishInput.projectId, eventName: publishInput.eventName }, 'Custom event dispatched to WS clients');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Custom event dispatched to WebSocket clients' }));
        } catch (err: any) {
          logger.error({ err }, 'Error dispatching internal publish event');
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Invalid payload' }));
        }
      });
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  const wss = new WebSocketServer({ server });

  wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
    const reqUrl = new URL(req.url || '/', `http://${req.headers.host}`);
    const token = reqUrl.searchParams.get('token') || req.headers['sec-websocket-protocol'];

    if (!token) {
      logger.warn('WS Connection rejected: Missing token');
      ws.close(4001, 'Unauthorized: Token required');
      return;
    }

    const user = verifyWSToken(token);
    if (!user) {
      logger.warn('WS Connection rejected: Invalid JWT token');
      ws.close(4002, 'Unauthorized: Invalid token');
      return;
    }

    const socketId = crypto.randomUUID();
    const ipAddress = req.socket.remoteAddress;
    const appId = (user as any).appId || (token.startsWith('app_token_') ? token : undefined);

    const client = await connectionManager.addConnection(socketId, user, ws, ipAddress, appId);

    // Send connection acknowledgment
    ws.send(
      JSON.stringify({
        event: WSEventType.CONNECT,
        payload: { socketId, userId: user.userId, message: 'Connected successfully' },
        timestamp: new Date().toISOString(),
      })
    );

    ws.on('message', (data) => {
      messageHandler.handleMessage(client, data);
    });

    ws.on('close', async () => {
      await connectionManager.removeConnection(socketId);
    });

    ws.on('error', (error) => {
      logger.error({ socketId, error }, 'WebSocket error');
    });
  });

  server.listen(port, () => {
    logger.info({ port }, 'WebSocket & Internal HTTP Server listening');
  });

  return { wss, connectionManager };
};
