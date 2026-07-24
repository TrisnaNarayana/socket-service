import { useState, useEffect, useRef, useCallback } from 'react';

export type ConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export interface WSLog {
  id: string;
  type: 'in' | 'out' | 'system';
  message: string;
  timestamp: string;
}

export const useWebSocket = (url: string, token: string | null) => {
  const [status, setStatus] = useState<ConnectionStatus>('DISCONNECTED');
  const [logs, setLogs] = useState<WSLog[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addLog = useCallback((type: 'in' | 'out' | 'system', message: string) => {
    const newLog: WSLog = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  }, []);

  const connect = useCallback(() => {
    if (!token) return;

    setStatus('CONNECTING');
    addLog('system', 'Attempting WebSocket connection...');

    const wsUrl = `${url}?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('CONNECTED');
      addLog('system', 'Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
      addLog('in', event.data);
    };

    ws.onerror = () => {
      addLog('system', 'WebSocket Connection Error');
    };

    ws.onclose = (event) => {
      setStatus('DISCONNECTED');
      addLog('system', `Disconnected (Code: ${event.code})`);

      // Auto-reconnect after 3 seconds
      if (token) {
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      }
    };
  }, [url, token, addLog]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  const sendMessage = (event: string, payload: any) => {
    if (wsRef.current && status === 'CONNECTED') {
      const data = JSON.stringify({ event, payload });
      wsRef.current.send(data);
      addLog('out', data);
    } else {
      addLog('system', 'Cannot send: WebSocket is not connected');
    }
  };

  return {
    status,
    logs,
    sendMessage,
    reconnect: connect,
  };
};
