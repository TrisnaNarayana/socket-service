import { WebSocket } from 'ws';
import { JWTPayload, logger, WSEventMessage, WSEventType, buildScopedRoomName } from '@vms/shared';
import { prisma } from '@vms/database';

export interface AuthenticatedSocket {
  id: string;
  user: JWTPayload & { appId?: string };
  socket: WebSocket;
  ipAddress?: string;
  connectedAt: Date;
  rooms: Set<string>;
  appId?: string;
}

export class ConnectionManager {
  private activeSockets: Map<string, AuthenticatedSocket> = new Map();

  async addConnection(
    socketId: string,
    user: JWTPayload & { appId?: string },
    socket: WebSocket,
    ipAddress?: string,
    appId?: string
  ): Promise<AuthenticatedSocket> {
    const effectiveAppId = appId || user.appId;
    const authSocket: AuthenticatedSocket = {
      id: socketId,
      user,
      socket,
      ipAddress,
      connectedAt: new Date(),
      rooms: new Set<string>(),
      appId: effectiveAppId,
    };

    this.activeSockets.set(socketId, authSocket);

    // Sync session state to Database asynchronously
    try {
      await prisma.wSSession.upsert({
        where: { socketId },
        update: { status: 'connected', updatedAt: new Date() },
        create: {
          socketId,
          userId: user.userId,
          ipAddress,
          status: 'connected',
        },
      });
    } catch (err) {
      logger.error({ err, socketId }, 'Failed to record WS session in DB');
    }

    logger.info({ socketId, userId: user.userId, appId: effectiveAppId }, 'New WebSocket client connected');
    return authSocket;
  }

  async removeConnection(socketId: string): Promise<void> {
    const conn = this.activeSockets.get(socketId);
    if (conn) {
      this.activeSockets.delete(socketId);
      logger.info({ socketId, userId: conn.user.userId }, 'WebSocket client disconnected');

      try {
        await prisma.wSSession.update({
          where: { socketId },
          data: { status: 'disconnected' },
        });
      } catch (err) {
        logger.error({ err, socketId }, 'Failed to update WS disconnection in DB');
      }
    }
  }

  getSocket(socketId: string): AuthenticatedSocket | undefined {
    return this.activeSockets.get(socketId);
  }

  getActiveConnections(): AuthenticatedSocket[] {
    return Array.from(this.activeSockets.values());
  }

  joinRoom(socketId: string, rawRoom: string): boolean {
    const conn = this.activeSockets.get(socketId);
    if (conn) {
      const scopedRoom = buildScopedRoomName(conn.appId || conn.user.appId, rawRoom);
      conn.rooms.add(scopedRoom);
      logger.info({ socketId, rawRoom, scopedRoom, appId: conn.appId }, 'Socket joined room');
      return true;
    }
    return false;
  }

  leaveRoom(socketId: string, rawRoom: string): boolean {
    const conn = this.activeSockets.get(socketId);
    if (conn) {
      const scopedRoom = buildScopedRoomName(conn.appId || conn.user.appId, rawRoom);
      conn.rooms.delete(scopedRoom);
      logger.info({ socketId, rawRoom, scopedRoom }, 'Socket left room');
      return true;
    }
    return false;
  }

  sendToRoom(room: string, message: WSEventMessage, appId?: string): void {
    const scopedRoom = buildScopedRoomName(appId, room);
    const data = JSON.stringify(message);

    this.activeSockets.forEach((conn) => {
      if ((conn.rooms.has(scopedRoom) || conn.rooms.has(room)) && conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(data);
      }
    });
  }

  broadcast(message: WSEventMessage, excludeSocketId?: string): void {
    const data = JSON.stringify(message);
    this.activeSockets.forEach((conn, id) => {
      if (id !== excludeSocketId && conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(data);
      }
    });
  }

  sendToUser(userId: string, message: WSEventMessage): void {
    const data = JSON.stringify(message);
    this.activeSockets.forEach((conn) => {
      if (conn.user.userId === userId && conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(data);
      }
    });
  }

  publishCustomEvent(publishInput: {
    projectId: string;
    appId?: string;
    eventName: string;
    target: { type: 'GLOBAL' | 'ROOM' | 'USER'; recipientId?: string; room?: string };
    data: any;
  }): void {
    const effectiveAppId = publishInput.appId || publishInput.projectId;
    const message: WSEventMessage = {
      event: WSEventType.CUSTOM_EVENT,
      payload: {
        projectId: publishInput.projectId,
        appId: effectiveAppId,
        eventName: publishInput.eventName,
        target: publishInput.target,
        data: publishInput.data,
      },
      timestamp: new Date().toISOString(),
    };

    const { type, recipientId, room } = publishInput.target;
    const scopedRoom = room ? buildScopedRoomName(effectiveAppId, room) : '';
    const formattedRoom = room && !room.startsWith('room:') ? `room:${room}` : room;
    const scopedFormattedRoom = formattedRoom ? buildScopedRoomName(effectiveAppId, formattedRoom) : '';
    const data = JSON.stringify(message);

    this.activeSockets.forEach((conn) => {
      const isGlobal = (type === 'GLOBAL');
      const isTargetRoom = room ? (
        conn.rooms.has(room) ||
        conn.rooms.has(scopedRoom) ||
        (formattedRoom && conn.rooms.has(formattedRoom)) ||
        (scopedFormattedRoom && conn.rooms.has(scopedFormattedRoom))
      ) : false;
      const isTargetUser = (type === 'USER' && recipientId && conn.user.userId === recipientId);
      const isAdminMonitor = conn.user.role === 'ADMIN' || conn.rooms.has('*') || conn.rooms.has('global-log');

      if ((isGlobal || isTargetRoom || isTargetUser || isAdminMonitor) && conn.socket.readyState === WebSocket.OPEN) {
        conn.socket.send(data);
      }
    });
  }
}
