import { RawData, WebSocket } from 'ws';
import { ConnectionManager, AuthenticatedSocket } from '../managers/connection.manager.js';
import { logger, wsMessageSchema, WSEventType, WSEventMessage } from '@vms/shared';

export class MessageHandler {
  constructor(private connectionManager: ConnectionManager) {}

  handleMessage(client: AuthenticatedSocket, rawData: RawData): void {
    let payloadObj: any;
    try {
      payloadObj = JSON.parse(rawData.toString());
    } catch {
      this.sendError(client.socket, 'Invalid JSON payload format');
      return;
    }

    const validation = wsMessageSchema.safeParse(payloadObj);
    if (!validation.success) {
      this.sendError(client.socket, 'Validation Error', validation.error.format());
      return;
    }

    const { event, payload } = validation.data;
    logger.debug({ socketId: client.id, event }, 'Received WebSocket event');

    switch (event) {
      case WSEventType.PING:
        this.sendResponse(client.socket, WSEventType.PONG, { time: new Date().toISOString() });
        break;

      case WSEventType.BROADCAST:
        const broadcastMsg: WSEventMessage = {
          event: WSEventType.NOTIFICATION,
          payload,
          timestamp: new Date().toISOString(),
          senderId: client.user.userId,
        };
        this.connectionManager.broadcast(broadcastMsg, client.id);
        this.sendResponse(client.socket, 'broadcast_ack', { status: 'sent' });
        break;

      case WSEventType.SUBSCRIBE:
        if (payload?.room) {
          this.connectionManager.joinRoom(client.id, payload.room);
          this.sendResponse(client.socket, 'subscribe_ack', { room: payload.room, status: 'subscribed' });
        } else {
          this.sendError(client.socket, 'Subscribe payload requires a "room" property');
        }
        break;

      case WSEventType.UNSUBSCRIBE:
        if (payload?.room) {
          this.connectionManager.leaveRoom(client.id, payload.room);
          this.sendResponse(client.socket, 'unsubscribe_ack', { room: payload.room, status: 'unsubscribed' });
        } else {
          this.sendError(client.socket, 'Unsubscribe payload requires a "room" property');
        }
        break;

      case WSEventType.CUSTOM_EVENT:
        if (payload?.projectId && payload?.eventName && payload?.target) {
          this.connectionManager.publishCustomEvent({
            projectId: payload.projectId,
            eventName: payload.eventName,
            target: payload.target,
            data: payload.data,
          });
          this.sendResponse(client.socket, 'custom_event_ack', { status: 'published' });
        } else {
          this.sendError(client.socket, 'Custom event payload requires projectId, eventName, and target');
        }
        break;

      default:
        this.sendError(client.socket, `Unknown event type: ${event}`);
        break;
    }
  }

  private sendResponse(socket: WebSocket, event: string, payload: any): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString(),
        })
      );
    }
  }

  private sendError(socket: WebSocket, message: string, details?: any): void {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          event: WSEventType.ERROR,
          payload: { message, details },
          timestamp: new Date().toISOString(),
        })
      );
    }
  }
}
