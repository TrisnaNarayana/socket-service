import { describe, it, expect, vi, beforeEach } from 'vitest';
import { verifyWSToken } from '../src/handlers/auth.handler.js';
import { ConnectionManager } from '../src/managers/connection.manager.js';
import { config } from '../src/config/env.js';
import jwt from 'jsonwebtoken';

vi.mock('@vms/database', () => ({
  prisma: {
    wSSession: {
      upsert: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
    },
  },
}));

describe('WebSocket Service Unit Tests', () => {
  describe('verifyWSToken', () => {
    it('harus mengembalikan decoded payload jika token valid', () => {
      const mockPayload = { userId: 'user-123', email: 'test@example.com', role: 'USER' };
      const token = jwt.sign(mockPayload, config.jwtSecret);

      const result = verifyWSToken(token);
      expect(result).toBeDefined();
      expect(result?.userId).toBe('user-123');
    });

    it('harus mengembalikan null jika token tidak valid', () => {
      const result = verifyWSToken('invalid-token');
      expect(result).toBeNull();
    });
  });

  describe('ConnectionManager', () => {
    let connectionManager: ConnectionManager;
    let mockSocket: any;

    beforeEach(() => {
      connectionManager = new ConnectionManager();
      mockSocket = {
        send: vi.fn(),
        readyState: 1, // OPEN
      };
    });

    it('harus menambah koneksi aktif', async () => {
      const user = { userId: 'u1', email: 'a@b.com', role: 'USER' };
      await connectionManager.addConnection('soc-1', user, mockSocket);

      expect(connectionManager.getActiveConnections().length).toBe(1);
      expect(connectionManager.getSocket('soc-1')?.user.userId).toBe('u1');
    });

    it('harus menghapus koneksi saat disconnect', async () => {
      const user = { userId: 'u1', email: 'a@b.com', role: 'USER' };
      await connectionManager.addConnection('soc-1', user, mockSocket);
      await connectionManager.removeConnection('soc-1');

      expect(connectionManager.getActiveConnections().length).toBe(0);
    });

    it('harus melakukan broadcast pesan ke koneksi terdaftar', async () => {
      const user1 = { userId: 'u1', email: 'a@b.com', role: 'USER' };
      const user2 = { userId: 'u2', email: 'c@d.com', role: 'USER' };
      const mockSocket2 = { send: vi.fn(), readyState: 1 } as any;

      await connectionManager.addConnection('soc-1', user1, mockSocket);
      await connectionManager.addConnection('soc-2', user2, mockSocket2);

      const msg = { event: 'notification', payload: { hello: 'world' }, timestamp: '2026-07-24' };
      connectionManager.broadcast(msg, 'soc-1');

      expect(mockSocket.send).not.toHaveBeenCalled();
      expect(mockSocket2.send).toHaveBeenCalledWith(JSON.stringify(msg));
    });

    it('harus mengisolasi pesan antar client/tenant pada nama room yang sama', async () => {
      const user1 = { userId: 'u1', email: 'clientA@app.com', role: 'CLIENT' };
      const user2 = { userId: 'u2', email: 'clientB@app.com', role: 'CLIENT' };
      const mockSocket2 = { send: vi.fn(), readyState: 1 } as any;

      // Client 1 (App A) and Client 2 (App B) both subscribe to room "orders"
      await connectionManager.addConnection('soc-1', user1, mockSocket, '127.0.0.1', 'app_token_A');
      await connectionManager.addConnection('soc-2', user2, mockSocket2, '127.0.0.1', 'app_token_B');

      connectionManager.joinRoom('soc-1', 'orders');
      connectionManager.joinRoom('soc-2', 'orders');

      // Publish event intended specifically for App A's room "orders"
      connectionManager.publishCustomEvent({
        projectId: 'project-demo',
        appId: 'app_token_A',
        eventName: 'ORDER_CREATED',
        target: { type: 'ROOM', room: 'orders' },
        data: { id: 101 },
      });

      // Verification: mockSocket (App A) should receive event, mockSocket2 (App B) MUST NOT receive event!
      expect(mockSocket.send).toHaveBeenCalled();
      expect(mockSocket2.send).not.toHaveBeenCalled();
    });
  });
});
